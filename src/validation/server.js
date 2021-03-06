const http = require('http');
const https = require('https');
const schemas = require('./schemas');
const URL = require('url').URL; // https://stackoverflow.com/questions/52566578/url-is-not-defined-in-node-js/52566656

// This basically serves our own schemas or proxies calls to https://kubernetesjsonschema.dev/
// We have to do this cos github.com/instrumenta/kubernetes-json-schema is 4.2GB!

const schemaSite = 'https://kubernetesjsonschema.dev';

const sendError = res => err => {
  console.warn(err);
  res.writeHead(500);
  res.end(JSON.stringify(err));
};

const cache = {};

const requestSchema = (reqPath, res) => {
  const url = new URL(schemaSite + reqPath);
  const client = https.request(url, msg => {
    res.writeHead(msg.statusCode, msg.headers);
    let data = '';
    msg.on('data', curData => {
      data += curData;
    });
    msg.on('end', () => {
      addToCache(data, msg);
      res.end(data);
    });
  });
  client.on('error', sendError(res));
  client.end();
  const addToCache = (data, msg) => {
    const roundedStatusCode = Math.round(msg.statusCode / 100) * 100;
    if (roundedStatusCode != 200) {
      console.warn(msg.statusCode + '\t' + url.toString());
      // cache[reqPath] = { code: roundedStatusCode };
      return;
    }
    if (msg.headers['content-type'] != 'application/json') {
      console.warn('Cant cache ' + msg.headers['content-type']);
      return;
    }
    let json;
    try {
      json = data.toString('utf8');
      const obj = JSON.parse(json);
      cache[reqPath] = {code: roundedStatusCode, data: obj};
    } catch (err) {
      console.warn('Error caching', json, err);
    }
  };
};

const schemaCache = next => (reqPath, res) => {
  const cached = cache[reqPath];
  if (cached && cached.code !== 200) {
    res.writeHead(cached.code);
    res.end(cached.data);
    return;
  }
  if (cached) {
    res.writeHead(cached.code, 'application/json');
    res.end(JSON.stringify(cached.data));
    return;
  }
  next(reqPath, res);
};

const codeSchema = next => (reqPath, res) => {
  const rx = /^\/?[^\/]+/;
  const key = reqPath.toLowerCase();
  const schema = schemas[key] || schemas[key.replace(rx, '')];
  if (!schema) {
    next(reqPath, res);
    return;
  }
  res.writeHead(200, 'application/json');
  res.end(JSON.stringify(schema));
};

const getSchema = codeSchema(schemaCache(requestSchema));

function start(port) {
  return new Promise((started, rej) => {
    let server;
    const promise = new Promise((res, rej) => {
      server = http.createServer(
        function (req, res) {
          try {
            getSchema(req.url, res);
          } catch (err) {
            rej(err);
          }
        }
      );
      server.listen(port);
      started(
        () =>
          new Promise(res => {
            promise.finally(res);
            server.close();
            setTimeout(res, 1000);
          })
      );
    });
  });
}

module.exports = {
  start
};
