require('./sourcemap-register.js');module.exports =
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 7351:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const os = __importStar(__webpack_require__(2087));
const utils_1 = __webpack_require__(5278);
/**
 * Commands
 *
 * Command Format:
 *   ::name key=value,key=value::message
 *
 * Examples:
 *   ::warning::This is the message
 *   ::set-env name=MY_VAR::some value
 */
function issueCommand(command, properties, message) {
    const cmd = new Command(command, properties, message);
    process.stdout.write(cmd.toString() + os.EOL);
}
exports.issueCommand = issueCommand;
function issue(name, message = '') {
    issueCommand(name, {}, message);
}
exports.issue = issue;
const CMD_STRING = '::';
class Command {
    constructor(command, properties, message) {
        if (!command) {
            command = 'missing.command';
        }
        this.command = command;
        this.properties = properties;
        this.message = message;
    }
    toString() {
        let cmdStr = CMD_STRING + this.command;
        if (this.properties && Object.keys(this.properties).length > 0) {
            cmdStr += ' ';
            let first = true;
            for (const key in this.properties) {
                if (this.properties.hasOwnProperty(key)) {
                    const val = this.properties[key];
                    if (val) {
                        if (first) {
                            first = false;
                        }
                        else {
                            cmdStr += ',';
                        }
                        cmdStr += `${key}=${escapeProperty(val)}`;
                    }
                }
            }
        }
        cmdStr += `${CMD_STRING}${escapeData(this.message)}`;
        return cmdStr;
    }
}
function escapeData(s) {
    return utils_1.toCommandValue(s)
        .replace(/%/g, '%25')
        .replace(/\r/g, '%0D')
        .replace(/\n/g, '%0A');
}
function escapeProperty(s) {
    return utils_1.toCommandValue(s)
        .replace(/%/g, '%25')
        .replace(/\r/g, '%0D')
        .replace(/\n/g, '%0A')
        .replace(/:/g, '%3A')
        .replace(/,/g, '%2C');
}
//# sourceMappingURL=command.js.map

/***/ }),

/***/ 2186:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const command_1 = __webpack_require__(7351);
const file_command_1 = __webpack_require__(717);
const utils_1 = __webpack_require__(5278);
const os = __importStar(__webpack_require__(2087));
const path = __importStar(__webpack_require__(5622));
/**
 * The code to exit an action
 */
var ExitCode;
(function (ExitCode) {
    /**
     * A code indicating that the action was successful
     */
    ExitCode[ExitCode["Success"] = 0] = "Success";
    /**
     * A code indicating that the action was a failure
     */
    ExitCode[ExitCode["Failure"] = 1] = "Failure";
})(ExitCode = exports.ExitCode || (exports.ExitCode = {}));
//-----------------------------------------------------------------------
// Variables
//-----------------------------------------------------------------------
/**
 * Sets env variable for this action and future actions in the job
 * @param name the name of the variable to set
 * @param val the value of the variable. Non-string values will be converted to a string via JSON.stringify
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function exportVariable(name, val) {
    const convertedVal = utils_1.toCommandValue(val);
    process.env[name] = convertedVal;
    const filePath = process.env['GITHUB_ENV'] || '';
    if (filePath) {
        const delimiter = '_GitHubActionsFileCommandDelimeter_';
        const commandValue = `${name}<<${delimiter}${os.EOL}${convertedVal}${os.EOL}${delimiter}`;
        file_command_1.issueCommand('ENV', commandValue);
    }
    else {
        command_1.issueCommand('set-env', { name }, convertedVal);
    }
}
exports.exportVariable = exportVariable;
/**
 * Registers a secret which will get masked from logs
 * @param secret value of the secret
 */
function setSecret(secret) {
    command_1.issueCommand('add-mask', {}, secret);
}
exports.setSecret = setSecret;
/**
 * Prepends inputPath to the PATH (for this action and future actions)
 * @param inputPath
 */
function addPath(inputPath) {
    const filePath = process.env['GITHUB_PATH'] || '';
    if (filePath) {
        file_command_1.issueCommand('PATH', inputPath);
    }
    else {
        command_1.issueCommand('add-path', {}, inputPath);
    }
    process.env['PATH'] = `${inputPath}${path.delimiter}${process.env['PATH']}`;
}
exports.addPath = addPath;
/**
 * Gets the value of an input.  The value is also trimmed.
 *
 * @param     name     name of the input to get
 * @param     options  optional. See InputOptions.
 * @returns   string
 */
function getInput(name, options) {
    const val = process.env[`INPUT_${name.replace(/ /g, '_').toUpperCase()}`] || '';
    if (options && options.required && !val) {
        throw new Error(`Input required and not supplied: ${name}`);
    }
    return val.trim();
}
exports.getInput = getInput;
/**
 * Sets the value of an output.
 *
 * @param     name     name of the output to set
 * @param     value    value to store. Non-string values will be converted to a string via JSON.stringify
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function setOutput(name, value) {
    command_1.issueCommand('set-output', { name }, value);
}
exports.setOutput = setOutput;
/**
 * Enables or disables the echoing of commands into stdout for the rest of the step.
 * Echoing is disabled by default if ACTIONS_STEP_DEBUG is not set.
 *
 */
function setCommandEcho(enabled) {
    command_1.issue('echo', enabled ? 'on' : 'off');
}
exports.setCommandEcho = setCommandEcho;
//-----------------------------------------------------------------------
// Results
//-----------------------------------------------------------------------
/**
 * Sets the action status to failed.
 * When the action exits it will be with an exit code of 1
 * @param message add error issue message
 */
function setFailed(message) {
    process.exitCode = ExitCode.Failure;
    error(message);
}
exports.setFailed = setFailed;
//-----------------------------------------------------------------------
// Logging Commands
//-----------------------------------------------------------------------
/**
 * Gets whether Actions Step Debug is on or not
 */
function isDebug() {
    return process.env['RUNNER_DEBUG'] === '1';
}
exports.isDebug = isDebug;
/**
 * Writes debug message to user log
 * @param message debug message
 */
function debug(message) {
    command_1.issueCommand('debug', {}, message);
}
exports.debug = debug;
/**
 * Adds an error issue
 * @param message error issue message. Errors will be converted to string via toString()
 */
function error(message) {
    command_1.issue('error', message instanceof Error ? message.toString() : message);
}
exports.error = error;
/**
 * Adds an warning issue
 * @param message warning issue message. Errors will be converted to string via toString()
 */
function warning(message) {
    command_1.issue('warning', message instanceof Error ? message.toString() : message);
}
exports.warning = warning;
/**
 * Writes info to log with console.log.
 * @param message info message
 */
function info(message) {
    process.stdout.write(message + os.EOL);
}
exports.info = info;
/**
 * Begin an output group.
 *
 * Output until the next `groupEnd` will be foldable in this group
 *
 * @param name The name of the output group
 */
function startGroup(name) {
    command_1.issue('group', name);
}
exports.startGroup = startGroup;
/**
 * End an output group.
 */
function endGroup() {
    command_1.issue('endgroup');
}
exports.endGroup = endGroup;
/**
 * Wrap an asynchronous function call in a group.
 *
 * Returns the same type as the function itself.
 *
 * @param name The name of the group
 * @param fn The function to wrap in the group
 */
function group(name, fn) {
    return __awaiter(this, void 0, void 0, function* () {
        startGroup(name);
        let result;
        try {
            result = yield fn();
        }
        finally {
            endGroup();
        }
        return result;
    });
}
exports.group = group;
//-----------------------------------------------------------------------
// Wrapper action state
//-----------------------------------------------------------------------
/**
 * Saves state for current action, the state can only be retrieved by this action's post job execution.
 *
 * @param     name     name of the state to store
 * @param     value    value to store. Non-string values will be converted to a string via JSON.stringify
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function saveState(name, value) {
    command_1.issueCommand('save-state', { name }, value);
}
exports.saveState = saveState;
/**
 * Gets the value of an state set by this action's main execution.
 *
 * @param     name     name of the state to get
 * @returns   string
 */
function getState(name) {
    return process.env[`STATE_${name}`] || '';
}
exports.getState = getState;
//# sourceMappingURL=core.js.map

/***/ }),

/***/ 717:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

// For internal use, subject to change.
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
// We use any as a valid input type
/* eslint-disable @typescript-eslint/no-explicit-any */
const fs = __importStar(__webpack_require__(5747));
const os = __importStar(__webpack_require__(2087));
const utils_1 = __webpack_require__(5278);
function issueCommand(command, message) {
    const filePath = process.env[`GITHUB_${command}`];
    if (!filePath) {
        throw new Error(`Unable to find environment variable for file command ${command}`);
    }
    if (!fs.existsSync(filePath)) {
        throw new Error(`Missing file at path: ${filePath}`);
    }
    fs.appendFileSync(filePath, `${utils_1.toCommandValue(message)}${os.EOL}`, {
        encoding: 'utf8'
    });
}
exports.issueCommand = issueCommand;
//# sourceMappingURL=file-command.js.map

/***/ }),

/***/ 5278:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

// We use any as a valid input type
/* eslint-disable @typescript-eslint/no-explicit-any */
Object.defineProperty(exports, "__esModule", ({ value: true }));
/**
 * Sanitizes an input into a string so it can be passed into issueCommand safely
 * @param input input to sanitize into a string
 */
function toCommandValue(input) {
    if (input === null || input === undefined) {
        return '';
    }
    else if (typeof input === 'string' || input instanceof String) {
        return input;
    }
    return JSON.stringify(input);
}
exports.toCommandValue = toCommandValue;
//# sourceMappingURL=utils.js.map

/***/ }),

/***/ 9417:
/***/ ((module) => {

"use strict";

module.exports = balanced;
function balanced(a, b, str) {
  if (a instanceof RegExp) a = maybeMatch(a, str);
  if (b instanceof RegExp) b = maybeMatch(b, str);

  var r = range(a, b, str);

  return r && {
    start: r[0],
    end: r[1],
    pre: str.slice(0, r[0]),
    body: str.slice(r[0] + a.length, r[1]),
    post: str.slice(r[1] + b.length)
  };
}

function maybeMatch(reg, str) {
  var m = str.match(reg);
  return m ? m[0] : null;
}

balanced.range = range;
function range(a, b, str) {
  var begs, beg, left, right, result;
  var ai = str.indexOf(a);
  var bi = str.indexOf(b, ai + 1);
  var i = ai;

  if (ai >= 0 && bi > 0) {
    begs = [];
    left = str.length;

    while (i >= 0 && !result) {
      if (i == ai) {
        begs.push(i);
        ai = str.indexOf(a, i + 1);
      } else if (begs.length == 1) {
        result = [ begs.pop(), bi ];
      } else {
        beg = begs.pop();
        if (beg < left) {
          left = beg;
          right = bi;
        }

        bi = str.indexOf(b, i + 1);
      }

      i = ai < bi && ai >= 0 ? ai : bi;
    }

    if (begs.length) {
      result = [ left, right ];
    }
  }

  return result;
}


/***/ }),

/***/ 3717:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var concatMap = __webpack_require__(6891);
var balanced = __webpack_require__(9417);

module.exports = expandTop;

var escSlash = '\0SLASH'+Math.random()+'\0';
var escOpen = '\0OPEN'+Math.random()+'\0';
var escClose = '\0CLOSE'+Math.random()+'\0';
var escComma = '\0COMMA'+Math.random()+'\0';
var escPeriod = '\0PERIOD'+Math.random()+'\0';

function numeric(str) {
  return parseInt(str, 10) == str
    ? parseInt(str, 10)
    : str.charCodeAt(0);
}

function escapeBraces(str) {
  return str.split('\\\\').join(escSlash)
            .split('\\{').join(escOpen)
            .split('\\}').join(escClose)
            .split('\\,').join(escComma)
            .split('\\.').join(escPeriod);
}

function unescapeBraces(str) {
  return str.split(escSlash).join('\\')
            .split(escOpen).join('{')
            .split(escClose).join('}')
            .split(escComma).join(',')
            .split(escPeriod).join('.');
}


// Basically just str.split(","), but handling cases
// where we have nested braced sections, which should be
// treated as individual members, like {a,{b,c},d}
function parseCommaParts(str) {
  if (!str)
    return [''];

  var parts = [];
  var m = balanced('{', '}', str);

  if (!m)
    return str.split(',');

  var pre = m.pre;
  var body = m.body;
  var post = m.post;
  var p = pre.split(',');

  p[p.length-1] += '{' + body + '}';
  var postParts = parseCommaParts(post);
  if (post.length) {
    p[p.length-1] += postParts.shift();
    p.push.apply(p, postParts);
  }

  parts.push.apply(parts, p);

  return parts;
}

function expandTop(str) {
  if (!str)
    return [];

  // I don't know why Bash 4.3 does this, but it does.
  // Anything starting with {} will have the first two bytes preserved
  // but *only* at the top level, so {},a}b will not expand to anything,
  // but a{},b}c will be expanded to [a}c,abc].
  // One could argue that this is a bug in Bash, but since the goal of
  // this module is to match Bash's rules, we escape a leading {}
  if (str.substr(0, 2) === '{}') {
    str = '\\{\\}' + str.substr(2);
  }

  return expand(escapeBraces(str), true).map(unescapeBraces);
}

function identity(e) {
  return e;
}

function embrace(str) {
  return '{' + str + '}';
}
function isPadded(el) {
  return /^-?0\d/.test(el);
}

function lte(i, y) {
  return i <= y;
}
function gte(i, y) {
  return i >= y;
}

function expand(str, isTop) {
  var expansions = [];

  var m = balanced('{', '}', str);
  if (!m || /\$$/.test(m.pre)) return [str];

  var isNumericSequence = /^-?\d+\.\.-?\d+(?:\.\.-?\d+)?$/.test(m.body);
  var isAlphaSequence = /^[a-zA-Z]\.\.[a-zA-Z](?:\.\.-?\d+)?$/.test(m.body);
  var isSequence = isNumericSequence || isAlphaSequence;
  var isOptions = m.body.indexOf(',') >= 0;
  if (!isSequence && !isOptions) {
    // {a},b}
    if (m.post.match(/,.*\}/)) {
      str = m.pre + '{' + m.body + escClose + m.post;
      return expand(str);
    }
    return [str];
  }

  var n;
  if (isSequence) {
    n = m.body.split(/\.\./);
  } else {
    n = parseCommaParts(m.body);
    if (n.length === 1) {
      // x{{a,b}}y ==> x{a}y x{b}y
      n = expand(n[0], false).map(embrace);
      if (n.length === 1) {
        var post = m.post.length
          ? expand(m.post, false)
          : [''];
        return post.map(function(p) {
          return m.pre + n[0] + p;
        });
      }
    }
  }

  // at this point, n is the parts, and we know it's not a comma set
  // with a single entry.

  // no need to expand pre, since it is guaranteed to be free of brace-sets
  var pre = m.pre;
  var post = m.post.length
    ? expand(m.post, false)
    : [''];

  var N;

  if (isSequence) {
    var x = numeric(n[0]);
    var y = numeric(n[1]);
    var width = Math.max(n[0].length, n[1].length)
    var incr = n.length == 3
      ? Math.abs(numeric(n[2]))
      : 1;
    var test = lte;
    var reverse = y < x;
    if (reverse) {
      incr *= -1;
      test = gte;
    }
    var pad = n.some(isPadded);

    N = [];

    for (var i = x; test(i, y); i += incr) {
      var c;
      if (isAlphaSequence) {
        c = String.fromCharCode(i);
        if (c === '\\')
          c = '';
      } else {
        c = String(i);
        if (pad) {
          var need = width - c.length;
          if (need > 0) {
            var z = new Array(need + 1).join('0');
            if (i < 0)
              c = '-' + z + c.slice(1);
            else
              c = z + c;
          }
        }
      }
      N.push(c);
    }
  } else {
    N = concatMap(n, function(el) { return expand(el, false) });
  }

  for (var j = 0; j < N.length; j++) {
    for (var k = 0; k < post.length; k++) {
      var expansion = pre + N[j] + post[k];
      if (!isTop || isSequence || expansion)
        expansions.push(expansion);
    }
  }

  return expansions;
}



/***/ }),

/***/ 6891:
/***/ ((module) => {

module.exports = function (xs, fn) {
    var res = [];
    for (var i = 0; i < xs.length; i++) {
        var x = fn(xs[i], i);
        if (isArray(x)) res.push.apply(res, x);
        else res.push(x);
    }
    return res;
};

var isArray = Array.isArray || function (xs) {
    return Object.prototype.toString.call(xs) === '[object Array]';
};


/***/ }),

/***/ 2437:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/* @flow */
/*::

type DotenvParseOptions = {
  debug?: boolean
}

// keys and values from src
type DotenvParseOutput = { [string]: string }

type DotenvConfigOptions = {
  path?: string, // path to .env file
  encoding?: string, // encoding of .env file
  debug?: string // turn on logging for debugging purposes
}

type DotenvConfigOutput = {
  parsed?: DotenvParseOutput,
  error?: Error
}

*/

const fs = __webpack_require__(5747)
const path = __webpack_require__(5622)

function log (message /*: string */) {
  console.log(`[dotenv][DEBUG] ${message}`)
}

const NEWLINE = '\n'
const RE_INI_KEY_VAL = /^\s*([\w.-]+)\s*=\s*(.*)?\s*$/
const RE_NEWLINES = /\\n/g
const NEWLINES_MATCH = /\n|\r|\r\n/

// Parses src into an Object
function parse (src /*: string | Buffer */, options /*: ?DotenvParseOptions */) /*: DotenvParseOutput */ {
  const debug = Boolean(options && options.debug)
  const obj = {}

  // convert Buffers before splitting into lines and processing
  src.toString().split(NEWLINES_MATCH).forEach(function (line, idx) {
    // matching "KEY' and 'VAL' in 'KEY=VAL'
    const keyValueArr = line.match(RE_INI_KEY_VAL)
    // matched?
    if (keyValueArr != null) {
      const key = keyValueArr[1]
      // default undefined or missing values to empty string
      let val = (keyValueArr[2] || '')
      const end = val.length - 1
      const isDoubleQuoted = val[0] === '"' && val[end] === '"'
      const isSingleQuoted = val[0] === "'" && val[end] === "'"

      // if single or double quoted, remove quotes
      if (isSingleQuoted || isDoubleQuoted) {
        val = val.substring(1, end)

        // if double quoted, expand newlines
        if (isDoubleQuoted) {
          val = val.replace(RE_NEWLINES, NEWLINE)
        }
      } else {
        // remove surrounding whitespace
        val = val.trim()
      }

      obj[key] = val
    } else if (debug) {
      log(`did not match key and value when parsing line ${idx + 1}: ${line}`)
    }
  })

  return obj
}

// Populates process.env from .env file
function config (options /*: ?DotenvConfigOptions */) /*: DotenvConfigOutput */ {
  let dotenvPath = path.resolve(process.cwd(), '.env')
  let encoding /*: string */ = 'utf8'
  let debug = false

  if (options) {
    if (options.path != null) {
      dotenvPath = options.path
    }
    if (options.encoding != null) {
      encoding = options.encoding
    }
    if (options.debug != null) {
      debug = true
    }
  }

  try {
    // specifying an encoding returns a string instead of a buffer
    const parsed = parse(fs.readFileSync(dotenvPath, { encoding }), { debug })

    Object.keys(parsed).forEach(function (key) {
      if (!Object.prototype.hasOwnProperty.call(process.env, key)) {
        process.env[key] = parsed[key]
      } else if (debug) {
        log(`"${key}" is already defined in \`process.env\` and will not be overwritten`)
      }
    })

    return { parsed }
  } catch (e) {
    return { error: e }
  }
}

module.exports.config = config
module.exports.parse = parse


/***/ }),

/***/ 6863:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = realpath
realpath.realpath = realpath
realpath.sync = realpathSync
realpath.realpathSync = realpathSync
realpath.monkeypatch = monkeypatch
realpath.unmonkeypatch = unmonkeypatch

var fs = __webpack_require__(5747)
var origRealpath = fs.realpath
var origRealpathSync = fs.realpathSync

var version = process.version
var ok = /^v[0-5]\./.test(version)
var old = __webpack_require__(1734)

function newError (er) {
  return er && er.syscall === 'realpath' && (
    er.code === 'ELOOP' ||
    er.code === 'ENOMEM' ||
    er.code === 'ENAMETOOLONG'
  )
}

function realpath (p, cache, cb) {
  if (ok) {
    return origRealpath(p, cache, cb)
  }

  if (typeof cache === 'function') {
    cb = cache
    cache = null
  }
  origRealpath(p, cache, function (er, result) {
    if (newError(er)) {
      old.realpath(p, cache, cb)
    } else {
      cb(er, result)
    }
  })
}

function realpathSync (p, cache) {
  if (ok) {
    return origRealpathSync(p, cache)
  }

  try {
    return origRealpathSync(p, cache)
  } catch (er) {
    if (newError(er)) {
      return old.realpathSync(p, cache)
    } else {
      throw er
    }
  }
}

function monkeypatch () {
  fs.realpath = realpath
  fs.realpathSync = realpathSync
}

function unmonkeypatch () {
  fs.realpath = origRealpath
  fs.realpathSync = origRealpathSync
}


/***/ }),

/***/ 1734:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

var pathModule = __webpack_require__(5622);
var isWindows = process.platform === 'win32';
var fs = __webpack_require__(5747);

// JavaScript implementation of realpath, ported from node pre-v6

var DEBUG = process.env.NODE_DEBUG && /fs/.test(process.env.NODE_DEBUG);

function rethrow() {
  // Only enable in debug mode. A backtrace uses ~1000 bytes of heap space and
  // is fairly slow to generate.
  var callback;
  if (DEBUG) {
    var backtrace = new Error;
    callback = debugCallback;
  } else
    callback = missingCallback;

  return callback;

  function debugCallback(err) {
    if (err) {
      backtrace.message = err.message;
      err = backtrace;
      missingCallback(err);
    }
  }

  function missingCallback(err) {
    if (err) {
      if (process.throwDeprecation)
        throw err;  // Forgot a callback but don't know where? Use NODE_DEBUG=fs
      else if (!process.noDeprecation) {
        var msg = 'fs: missing callback ' + (err.stack || err.message);
        if (process.traceDeprecation)
          console.trace(msg);
        else
          console.error(msg);
      }
    }
  }
}

function maybeCallback(cb) {
  return typeof cb === 'function' ? cb : rethrow();
}

var normalize = pathModule.normalize;

// Regexp that finds the next partion of a (partial) path
// result is [base_with_slash, base], e.g. ['somedir/', 'somedir']
if (isWindows) {
  var nextPartRe = /(.*?)(?:[\/\\]+|$)/g;
} else {
  var nextPartRe = /(.*?)(?:[\/]+|$)/g;
}

// Regex to find the device root, including trailing slash. E.g. 'c:\\'.
if (isWindows) {
  var splitRootRe = /^(?:[a-zA-Z]:|[\\\/]{2}[^\\\/]+[\\\/][^\\\/]+)?[\\\/]*/;
} else {
  var splitRootRe = /^[\/]*/;
}

exports.realpathSync = function realpathSync(p, cache) {
  // make p is absolute
  p = pathModule.resolve(p);

  if (cache && Object.prototype.hasOwnProperty.call(cache, p)) {
    return cache[p];
  }

  var original = p,
      seenLinks = {},
      knownHard = {};

  // current character position in p
  var pos;
  // the partial path so far, including a trailing slash if any
  var current;
  // the partial path without a trailing slash (except when pointing at a root)
  var base;
  // the partial path scanned in the previous round, with slash
  var previous;

  start();

  function start() {
    // Skip over roots
    var m = splitRootRe.exec(p);
    pos = m[0].length;
    current = m[0];
    base = m[0];
    previous = '';

    // On windows, check that the root exists. On unix there is no need.
    if (isWindows && !knownHard[base]) {
      fs.lstatSync(base);
      knownHard[base] = true;
    }
  }

  // walk down the path, swapping out linked pathparts for their real
  // values
  // NB: p.length changes.
  while (pos < p.length) {
    // find the next part
    nextPartRe.lastIndex = pos;
    var result = nextPartRe.exec(p);
    previous = current;
    current += result[0];
    base = previous + result[1];
    pos = nextPartRe.lastIndex;

    // continue if not a symlink
    if (knownHard[base] || (cache && cache[base] === base)) {
      continue;
    }

    var resolvedLink;
    if (cache && Object.prototype.hasOwnProperty.call(cache, base)) {
      // some known symbolic link.  no need to stat again.
      resolvedLink = cache[base];
    } else {
      var stat = fs.lstatSync(base);
      if (!stat.isSymbolicLink()) {
        knownHard[base] = true;
        if (cache) cache[base] = base;
        continue;
      }

      // read the link if it wasn't read before
      // dev/ino always return 0 on windows, so skip the check.
      var linkTarget = null;
      if (!isWindows) {
        var id = stat.dev.toString(32) + ':' + stat.ino.toString(32);
        if (seenLinks.hasOwnProperty(id)) {
          linkTarget = seenLinks[id];
        }
      }
      if (linkTarget === null) {
        fs.statSync(base);
        linkTarget = fs.readlinkSync(base);
      }
      resolvedLink = pathModule.resolve(previous, linkTarget);
      // track this, if given a cache.
      if (cache) cache[base] = resolvedLink;
      if (!isWindows) seenLinks[id] = linkTarget;
    }

    // resolve the link, then start over
    p = pathModule.resolve(resolvedLink, p.slice(pos));
    start();
  }

  if (cache) cache[original] = p;

  return p;
};


exports.realpath = function realpath(p, cache, cb) {
  if (typeof cb !== 'function') {
    cb = maybeCallback(cache);
    cache = null;
  }

  // make p is absolute
  p = pathModule.resolve(p);

  if (cache && Object.prototype.hasOwnProperty.call(cache, p)) {
    return process.nextTick(cb.bind(null, null, cache[p]));
  }

  var original = p,
      seenLinks = {},
      knownHard = {};

  // current character position in p
  var pos;
  // the partial path so far, including a trailing slash if any
  var current;
  // the partial path without a trailing slash (except when pointing at a root)
  var base;
  // the partial path scanned in the previous round, with slash
  var previous;

  start();

  function start() {
    // Skip over roots
    var m = splitRootRe.exec(p);
    pos = m[0].length;
    current = m[0];
    base = m[0];
    previous = '';

    // On windows, check that the root exists. On unix there is no need.
    if (isWindows && !knownHard[base]) {
      fs.lstat(base, function(err) {
        if (err) return cb(err);
        knownHard[base] = true;
        LOOP();
      });
    } else {
      process.nextTick(LOOP);
    }
  }

  // walk down the path, swapping out linked pathparts for their real
  // values
  function LOOP() {
    // stop if scanned past end of path
    if (pos >= p.length) {
      if (cache) cache[original] = p;
      return cb(null, p);
    }

    // find the next part
    nextPartRe.lastIndex = pos;
    var result = nextPartRe.exec(p);
    previous = current;
    current += result[0];
    base = previous + result[1];
    pos = nextPartRe.lastIndex;

    // continue if not a symlink
    if (knownHard[base] || (cache && cache[base] === base)) {
      return process.nextTick(LOOP);
    }

    if (cache && Object.prototype.hasOwnProperty.call(cache, base)) {
      // known symbolic link.  no need to stat again.
      return gotResolvedLink(cache[base]);
    }

    return fs.lstat(base, gotStat);
  }

  function gotStat(err, stat) {
    if (err) return cb(err);

    // if not a symlink, skip to the next path part
    if (!stat.isSymbolicLink()) {
      knownHard[base] = true;
      if (cache) cache[base] = base;
      return process.nextTick(LOOP);
    }

    // stat & read the link if not read before
    // call gotTarget as soon as the link target is known
    // dev/ino always return 0 on windows, so skip the check.
    if (!isWindows) {
      var id = stat.dev.toString(32) + ':' + stat.ino.toString(32);
      if (seenLinks.hasOwnProperty(id)) {
        return gotTarget(null, seenLinks[id], base);
      }
    }
    fs.stat(base, function(err) {
      if (err) return cb(err);

      fs.readlink(base, function(err, target) {
        if (!isWindows) seenLinks[id] = target;
        gotTarget(err, target);
      });
    });
  }

  function gotTarget(err, target, base) {
    if (err) return cb(err);

    var resolvedLink = pathModule.resolve(previous, target);
    if (cache) cache[base] = resolvedLink;
    gotResolvedLink(resolvedLink);
  }

  function gotResolvedLink(resolvedLink) {
    // resolve the link, then start over
    p = pathModule.resolve(resolvedLink, p.slice(pos));
    start();
  }
};


/***/ }),

/***/ 7625:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

exports.alphasort = alphasort
exports.alphasorti = alphasorti
exports.setopts = setopts
exports.ownProp = ownProp
exports.makeAbs = makeAbs
exports.finish = finish
exports.mark = mark
exports.isIgnored = isIgnored
exports.childrenIgnored = childrenIgnored

function ownProp (obj, field) {
  return Object.prototype.hasOwnProperty.call(obj, field)
}

var path = __webpack_require__(5622)
var minimatch = __webpack_require__(3973)
var isAbsolute = __webpack_require__(8714)
var Minimatch = minimatch.Minimatch

function alphasorti (a, b) {
  return a.toLowerCase().localeCompare(b.toLowerCase())
}

function alphasort (a, b) {
  return a.localeCompare(b)
}

function setupIgnores (self, options) {
  self.ignore = options.ignore || []

  if (!Array.isArray(self.ignore))
    self.ignore = [self.ignore]

  if (self.ignore.length) {
    self.ignore = self.ignore.map(ignoreMap)
  }
}

// ignore patterns are always in dot:true mode.
function ignoreMap (pattern) {
  var gmatcher = null
  if (pattern.slice(-3) === '/**') {
    var gpattern = pattern.replace(/(\/\*\*)+$/, '')
    gmatcher = new Minimatch(gpattern, { dot: true })
  }

  return {
    matcher: new Minimatch(pattern, { dot: true }),
    gmatcher: gmatcher
  }
}

function setopts (self, pattern, options) {
  if (!options)
    options = {}

  // base-matching: just use globstar for that.
  if (options.matchBase && -1 === pattern.indexOf("/")) {
    if (options.noglobstar) {
      throw new Error("base matching requires globstar")
    }
    pattern = "**/" + pattern
  }

  self.silent = !!options.silent
  self.pattern = pattern
  self.strict = options.strict !== false
  self.realpath = !!options.realpath
  self.realpathCache = options.realpathCache || Object.create(null)
  self.follow = !!options.follow
  self.dot = !!options.dot
  self.mark = !!options.mark
  self.nodir = !!options.nodir
  if (self.nodir)
    self.mark = true
  self.sync = !!options.sync
  self.nounique = !!options.nounique
  self.nonull = !!options.nonull
  self.nosort = !!options.nosort
  self.nocase = !!options.nocase
  self.stat = !!options.stat
  self.noprocess = !!options.noprocess
  self.absolute = !!options.absolute

  self.maxLength = options.maxLength || Infinity
  self.cache = options.cache || Object.create(null)
  self.statCache = options.statCache || Object.create(null)
  self.symlinks = options.symlinks || Object.create(null)

  setupIgnores(self, options)

  self.changedCwd = false
  var cwd = process.cwd()
  if (!ownProp(options, "cwd"))
    self.cwd = cwd
  else {
    self.cwd = path.resolve(options.cwd)
    self.changedCwd = self.cwd !== cwd
  }

  self.root = options.root || path.resolve(self.cwd, "/")
  self.root = path.resolve(self.root)
  if (process.platform === "win32")
    self.root = self.root.replace(/\\/g, "/")

  // TODO: is an absolute `cwd` supposed to be resolved against `root`?
  // e.g. { cwd: '/test', root: __dirname } === path.join(__dirname, '/test')
  self.cwdAbs = isAbsolute(self.cwd) ? self.cwd : makeAbs(self, self.cwd)
  if (process.platform === "win32")
    self.cwdAbs = self.cwdAbs.replace(/\\/g, "/")
  self.nomount = !!options.nomount

  // disable comments and negation in Minimatch.
  // Note that they are not supported in Glob itself anyway.
  options.nonegate = true
  options.nocomment = true

  self.minimatch = new Minimatch(pattern, options)
  self.options = self.minimatch.options
}

function finish (self) {
  var nou = self.nounique
  var all = nou ? [] : Object.create(null)

  for (var i = 0, l = self.matches.length; i < l; i ++) {
    var matches = self.matches[i]
    if (!matches || Object.keys(matches).length === 0) {
      if (self.nonull) {
        // do like the shell, and spit out the literal glob
        var literal = self.minimatch.globSet[i]
        if (nou)
          all.push(literal)
        else
          all[literal] = true
      }
    } else {
      // had matches
      var m = Object.keys(matches)
      if (nou)
        all.push.apply(all, m)
      else
        m.forEach(function (m) {
          all[m] = true
        })
    }
  }

  if (!nou)
    all = Object.keys(all)

  if (!self.nosort)
    all = all.sort(self.nocase ? alphasorti : alphasort)

  // at *some* point we statted all of these
  if (self.mark) {
    for (var i = 0; i < all.length; i++) {
      all[i] = self._mark(all[i])
    }
    if (self.nodir) {
      all = all.filter(function (e) {
        var notDir = !(/\/$/.test(e))
        var c = self.cache[e] || self.cache[makeAbs(self, e)]
        if (notDir && c)
          notDir = c !== 'DIR' && !Array.isArray(c)
        return notDir
      })
    }
  }

  if (self.ignore.length)
    all = all.filter(function(m) {
      return !isIgnored(self, m)
    })

  self.found = all
}

function mark (self, p) {
  var abs = makeAbs(self, p)
  var c = self.cache[abs]
  var m = p
  if (c) {
    var isDir = c === 'DIR' || Array.isArray(c)
    var slash = p.slice(-1) === '/'

    if (isDir && !slash)
      m += '/'
    else if (!isDir && slash)
      m = m.slice(0, -1)

    if (m !== p) {
      var mabs = makeAbs(self, m)
      self.statCache[mabs] = self.statCache[abs]
      self.cache[mabs] = self.cache[abs]
    }
  }

  return m
}

// lotta situps...
function makeAbs (self, f) {
  var abs = f
  if (f.charAt(0) === '/') {
    abs = path.join(self.root, f)
  } else if (isAbsolute(f) || f === '') {
    abs = f
  } else if (self.changedCwd) {
    abs = path.resolve(self.cwd, f)
  } else {
    abs = path.resolve(f)
  }

  if (process.platform === 'win32')
    abs = abs.replace(/\\/g, '/')

  return abs
}


// Return true, if pattern ends with globstar '**', for the accompanying parent directory.
// Ex:- If node_modules/** is the pattern, add 'node_modules' to ignore list along with it's contents
function isIgnored (self, path) {
  if (!self.ignore.length)
    return false

  return self.ignore.some(function(item) {
    return item.matcher.match(path) || !!(item.gmatcher && item.gmatcher.match(path))
  })
}

function childrenIgnored (self, path) {
  if (!self.ignore.length)
    return false

  return self.ignore.some(function(item) {
    return !!(item.gmatcher && item.gmatcher.match(path))
  })
}


/***/ }),

/***/ 1957:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

// Approach:
//
// 1. Get the minimatch set
// 2. For each pattern in the set, PROCESS(pattern, false)
// 3. Store matches per-set, then uniq them
//
// PROCESS(pattern, inGlobStar)
// Get the first [n] items from pattern that are all strings
// Join these together.  This is PREFIX.
//   If there is no more remaining, then stat(PREFIX) and
//   add to matches if it succeeds.  END.
//
// If inGlobStar and PREFIX is symlink and points to dir
//   set ENTRIES = []
// else readdir(PREFIX) as ENTRIES
//   If fail, END
//
// with ENTRIES
//   If pattern[n] is GLOBSTAR
//     // handle the case where the globstar match is empty
//     // by pruning it out, and testing the resulting pattern
//     PROCESS(pattern[0..n] + pattern[n+1 .. $], false)
//     // handle other cases.
//     for ENTRY in ENTRIES (not dotfiles)
//       // attach globstar + tail onto the entry
//       // Mark that this entry is a globstar match
//       PROCESS(pattern[0..n] + ENTRY + pattern[n .. $], true)
//
//   else // not globstar
//     for ENTRY in ENTRIES (not dotfiles, unless pattern[n] is dot)
//       Test ENTRY against pattern[n]
//       If fails, continue
//       If passes, PROCESS(pattern[0..n] + item + pattern[n+1 .. $])
//
// Caveat:
//   Cache all stats and readdirs results to minimize syscall.  Since all
//   we ever care about is existence and directory-ness, we can just keep
//   `true` for files, and [children,...] for directories, or `false` for
//   things that don't exist.

module.exports = glob

var fs = __webpack_require__(5747)
var rp = __webpack_require__(6863)
var minimatch = __webpack_require__(3973)
var Minimatch = minimatch.Minimatch
var inherits = __webpack_require__(4124)
var EE = __webpack_require__(8614).EventEmitter
var path = __webpack_require__(5622)
var assert = __webpack_require__(2357)
var isAbsolute = __webpack_require__(8714)
var globSync = __webpack_require__(9010)
var common = __webpack_require__(7625)
var alphasort = common.alphasort
var alphasorti = common.alphasorti
var setopts = common.setopts
var ownProp = common.ownProp
var inflight = __webpack_require__(2492)
var util = __webpack_require__(1669)
var childrenIgnored = common.childrenIgnored
var isIgnored = common.isIgnored

var once = __webpack_require__(1223)

function glob (pattern, options, cb) {
  if (typeof options === 'function') cb = options, options = {}
  if (!options) options = {}

  if (options.sync) {
    if (cb)
      throw new TypeError('callback provided to sync glob')
    return globSync(pattern, options)
  }

  return new Glob(pattern, options, cb)
}

glob.sync = globSync
var GlobSync = glob.GlobSync = globSync.GlobSync

// old api surface
glob.glob = glob

function extend (origin, add) {
  if (add === null || typeof add !== 'object') {
    return origin
  }

  var keys = Object.keys(add)
  var i = keys.length
  while (i--) {
    origin[keys[i]] = add[keys[i]]
  }
  return origin
}

glob.hasMagic = function (pattern, options_) {
  var options = extend({}, options_)
  options.noprocess = true

  var g = new Glob(pattern, options)
  var set = g.minimatch.set

  if (!pattern)
    return false

  if (set.length > 1)
    return true

  for (var j = 0; j < set[0].length; j++) {
    if (typeof set[0][j] !== 'string')
      return true
  }

  return false
}

glob.Glob = Glob
inherits(Glob, EE)
function Glob (pattern, options, cb) {
  if (typeof options === 'function') {
    cb = options
    options = null
  }

  if (options && options.sync) {
    if (cb)
      throw new TypeError('callback provided to sync glob')
    return new GlobSync(pattern, options)
  }

  if (!(this instanceof Glob))
    return new Glob(pattern, options, cb)

  setopts(this, pattern, options)
  this._didRealPath = false

  // process each pattern in the minimatch set
  var n = this.minimatch.set.length

  // The matches are stored as {<filename>: true,...} so that
  // duplicates are automagically pruned.
  // Later, we do an Object.keys() on these.
  // Keep them as a list so we can fill in when nonull is set.
  this.matches = new Array(n)

  if (typeof cb === 'function') {
    cb = once(cb)
    this.on('error', cb)
    this.on('end', function (matches) {
      cb(null, matches)
    })
  }

  var self = this
  this._processing = 0

  this._emitQueue = []
  this._processQueue = []
  this.paused = false

  if (this.noprocess)
    return this

  if (n === 0)
    return done()

  var sync = true
  for (var i = 0; i < n; i ++) {
    this._process(this.minimatch.set[i], i, false, done)
  }
  sync = false

  function done () {
    --self._processing
    if (self._processing <= 0) {
      if (sync) {
        process.nextTick(function () {
          self._finish()
        })
      } else {
        self._finish()
      }
    }
  }
}

Glob.prototype._finish = function () {
  assert(this instanceof Glob)
  if (this.aborted)
    return

  if (this.realpath && !this._didRealpath)
    return this._realpath()

  common.finish(this)
  this.emit('end', this.found)
}

Glob.prototype._realpath = function () {
  if (this._didRealpath)
    return

  this._didRealpath = true

  var n = this.matches.length
  if (n === 0)
    return this._finish()

  var self = this
  for (var i = 0; i < this.matches.length; i++)
    this._realpathSet(i, next)

  function next () {
    if (--n === 0)
      self._finish()
  }
}

Glob.prototype._realpathSet = function (index, cb) {
  var matchset = this.matches[index]
  if (!matchset)
    return cb()

  var found = Object.keys(matchset)
  var self = this
  var n = found.length

  if (n === 0)
    return cb()

  var set = this.matches[index] = Object.create(null)
  found.forEach(function (p, i) {
    // If there's a problem with the stat, then it means that
    // one or more of the links in the realpath couldn't be
    // resolved.  just return the abs value in that case.
    p = self._makeAbs(p)
    rp.realpath(p, self.realpathCache, function (er, real) {
      if (!er)
        set[real] = true
      else if (er.syscall === 'stat')
        set[p] = true
      else
        self.emit('error', er) // srsly wtf right here

      if (--n === 0) {
        self.matches[index] = set
        cb()
      }
    })
  })
}

Glob.prototype._mark = function (p) {
  return common.mark(this, p)
}

Glob.prototype._makeAbs = function (f) {
  return common.makeAbs(this, f)
}

Glob.prototype.abort = function () {
  this.aborted = true
  this.emit('abort')
}

Glob.prototype.pause = function () {
  if (!this.paused) {
    this.paused = true
    this.emit('pause')
  }
}

Glob.prototype.resume = function () {
  if (this.paused) {
    this.emit('resume')
    this.paused = false
    if (this._emitQueue.length) {
      var eq = this._emitQueue.slice(0)
      this._emitQueue.length = 0
      for (var i = 0; i < eq.length; i ++) {
        var e = eq[i]
        this._emitMatch(e[0], e[1])
      }
    }
    if (this._processQueue.length) {
      var pq = this._processQueue.slice(0)
      this._processQueue.length = 0
      for (var i = 0; i < pq.length; i ++) {
        var p = pq[i]
        this._processing--
        this._process(p[0], p[1], p[2], p[3])
      }
    }
  }
}

Glob.prototype._process = function (pattern, index, inGlobStar, cb) {
  assert(this instanceof Glob)
  assert(typeof cb === 'function')

  if (this.aborted)
    return

  this._processing++
  if (this.paused) {
    this._processQueue.push([pattern, index, inGlobStar, cb])
    return
  }

  //console.error('PROCESS %d', this._processing, pattern)

  // Get the first [n] parts of pattern that are all strings.
  var n = 0
  while (typeof pattern[n] === 'string') {
    n ++
  }
  // now n is the index of the first one that is *not* a string.

  // see if there's anything else
  var prefix
  switch (n) {
    // if not, then this is rather simple
    case pattern.length:
      this._processSimple(pattern.join('/'), index, cb)
      return

    case 0:
      // pattern *starts* with some non-trivial item.
      // going to readdir(cwd), but not include the prefix in matches.
      prefix = null
      break

    default:
      // pattern has some string bits in the front.
      // whatever it starts with, whether that's 'absolute' like /foo/bar,
      // or 'relative' like '../baz'
      prefix = pattern.slice(0, n).join('/')
      break
  }

  var remain = pattern.slice(n)

  // get the list of entries.
  var read
  if (prefix === null)
    read = '.'
  else if (isAbsolute(prefix) || isAbsolute(pattern.join('/'))) {
    if (!prefix || !isAbsolute(prefix))
      prefix = '/' + prefix
    read = prefix
  } else
    read = prefix

  var abs = this._makeAbs(read)

  //if ignored, skip _processing
  if (childrenIgnored(this, read))
    return cb()

  var isGlobStar = remain[0] === minimatch.GLOBSTAR
  if (isGlobStar)
    this._processGlobStar(prefix, read, abs, remain, index, inGlobStar, cb)
  else
    this._processReaddir(prefix, read, abs, remain, index, inGlobStar, cb)
}

Glob.prototype._processReaddir = function (prefix, read, abs, remain, index, inGlobStar, cb) {
  var self = this
  this._readdir(abs, inGlobStar, function (er, entries) {
    return self._processReaddir2(prefix, read, abs, remain, index, inGlobStar, entries, cb)
  })
}

Glob.prototype._processReaddir2 = function (prefix, read, abs, remain, index, inGlobStar, entries, cb) {

  // if the abs isn't a dir, then nothing can match!
  if (!entries)
    return cb()

  // It will only match dot entries if it starts with a dot, or if
  // dot is set.  Stuff like @(.foo|.bar) isn't allowed.
  var pn = remain[0]
  var negate = !!this.minimatch.negate
  var rawGlob = pn._glob
  var dotOk = this.dot || rawGlob.charAt(0) === '.'

  var matchedEntries = []
  for (var i = 0; i < entries.length; i++) {
    var e = entries[i]
    if (e.charAt(0) !== '.' || dotOk) {
      var m
      if (negate && !prefix) {
        m = !e.match(pn)
      } else {
        m = e.match(pn)
      }
      if (m)
        matchedEntries.push(e)
    }
  }

  //console.error('prd2', prefix, entries, remain[0]._glob, matchedEntries)

  var len = matchedEntries.length
  // If there are no matched entries, then nothing matches.
  if (len === 0)
    return cb()

  // if this is the last remaining pattern bit, then no need for
  // an additional stat *unless* the user has specified mark or
  // stat explicitly.  We know they exist, since readdir returned
  // them.

  if (remain.length === 1 && !this.mark && !this.stat) {
    if (!this.matches[index])
      this.matches[index] = Object.create(null)

    for (var i = 0; i < len; i ++) {
      var e = matchedEntries[i]
      if (prefix) {
        if (prefix !== '/')
          e = prefix + '/' + e
        else
          e = prefix + e
      }

      if (e.charAt(0) === '/' && !this.nomount) {
        e = path.join(this.root, e)
      }
      this._emitMatch(index, e)
    }
    // This was the last one, and no stats were needed
    return cb()
  }

  // now test all matched entries as stand-ins for that part
  // of the pattern.
  remain.shift()
  for (var i = 0; i < len; i ++) {
    var e = matchedEntries[i]
    var newPattern
    if (prefix) {
      if (prefix !== '/')
        e = prefix + '/' + e
      else
        e = prefix + e
    }
    this._process([e].concat(remain), index, inGlobStar, cb)
  }
  cb()
}

Glob.prototype._emitMatch = function (index, e) {
  if (this.aborted)
    return

  if (isIgnored(this, e))
    return

  if (this.paused) {
    this._emitQueue.push([index, e])
    return
  }

  var abs = isAbsolute(e) ? e : this._makeAbs(e)

  if (this.mark)
    e = this._mark(e)

  if (this.absolute)
    e = abs

  if (this.matches[index][e])
    return

  if (this.nodir) {
    var c = this.cache[abs]
    if (c === 'DIR' || Array.isArray(c))
      return
  }

  this.matches[index][e] = true

  var st = this.statCache[abs]
  if (st)
    this.emit('stat', e, st)

  this.emit('match', e)
}

Glob.prototype._readdirInGlobStar = function (abs, cb) {
  if (this.aborted)
    return

  // follow all symlinked directories forever
  // just proceed as if this is a non-globstar situation
  if (this.follow)
    return this._readdir(abs, false, cb)

  var lstatkey = 'lstat\0' + abs
  var self = this
  var lstatcb = inflight(lstatkey, lstatcb_)

  if (lstatcb)
    fs.lstat(abs, lstatcb)

  function lstatcb_ (er, lstat) {
    if (er && er.code === 'ENOENT')
      return cb()

    var isSym = lstat && lstat.isSymbolicLink()
    self.symlinks[abs] = isSym

    // If it's not a symlink or a dir, then it's definitely a regular file.
    // don't bother doing a readdir in that case.
    if (!isSym && lstat && !lstat.isDirectory()) {
      self.cache[abs] = 'FILE'
      cb()
    } else
      self._readdir(abs, false, cb)
  }
}

Glob.prototype._readdir = function (abs, inGlobStar, cb) {
  if (this.aborted)
    return

  cb = inflight('readdir\0'+abs+'\0'+inGlobStar, cb)
  if (!cb)
    return

  //console.error('RD %j %j', +inGlobStar, abs)
  if (inGlobStar && !ownProp(this.symlinks, abs))
    return this._readdirInGlobStar(abs, cb)

  if (ownProp(this.cache, abs)) {
    var c = this.cache[abs]
    if (!c || c === 'FILE')
      return cb()

    if (Array.isArray(c))
      return cb(null, c)
  }

  var self = this
  fs.readdir(abs, readdirCb(this, abs, cb))
}

function readdirCb (self, abs, cb) {
  return function (er, entries) {
    if (er)
      self._readdirError(abs, er, cb)
    else
      self._readdirEntries(abs, entries, cb)
  }
}

Glob.prototype._readdirEntries = function (abs, entries, cb) {
  if (this.aborted)
    return

  // if we haven't asked to stat everything, then just
  // assume that everything in there exists, so we can avoid
  // having to stat it a second time.
  if (!this.mark && !this.stat) {
    for (var i = 0; i < entries.length; i ++) {
      var e = entries[i]
      if (abs === '/')
        e = abs + e
      else
        e = abs + '/' + e
      this.cache[e] = true
    }
  }

  this.cache[abs] = entries
  return cb(null, entries)
}

Glob.prototype._readdirError = function (f, er, cb) {
  if (this.aborted)
    return

  // handle errors, and cache the information
  switch (er.code) {
    case 'ENOTSUP': // https://github.com/isaacs/node-glob/issues/205
    case 'ENOTDIR': // totally normal. means it *does* exist.
      var abs = this._makeAbs(f)
      this.cache[abs] = 'FILE'
      if (abs === this.cwdAbs) {
        var error = new Error(er.code + ' invalid cwd ' + this.cwd)
        error.path = this.cwd
        error.code = er.code
        this.emit('error', error)
        this.abort()
      }
      break

    case 'ENOENT': // not terribly unusual
    case 'ELOOP':
    case 'ENAMETOOLONG':
    case 'UNKNOWN':
      this.cache[this._makeAbs(f)] = false
      break

    default: // some unusual error.  Treat as failure.
      this.cache[this._makeAbs(f)] = false
      if (this.strict) {
        this.emit('error', er)
        // If the error is handled, then we abort
        // if not, we threw out of here
        this.abort()
      }
      if (!this.silent)
        console.error('glob error', er)
      break
  }

  return cb()
}

Glob.prototype._processGlobStar = function (prefix, read, abs, remain, index, inGlobStar, cb) {
  var self = this
  this._readdir(abs, inGlobStar, function (er, entries) {
    self._processGlobStar2(prefix, read, abs, remain, index, inGlobStar, entries, cb)
  })
}


Glob.prototype._processGlobStar2 = function (prefix, read, abs, remain, index, inGlobStar, entries, cb) {
  //console.error('pgs2', prefix, remain[0], entries)

  // no entries means not a dir, so it can never have matches
  // foo.txt/** doesn't match foo.txt
  if (!entries)
    return cb()

  // test without the globstar, and with every child both below
  // and replacing the globstar.
  var remainWithoutGlobStar = remain.slice(1)
  var gspref = prefix ? [ prefix ] : []
  var noGlobStar = gspref.concat(remainWithoutGlobStar)

  // the noGlobStar pattern exits the inGlobStar state
  this._process(noGlobStar, index, false, cb)

  var isSym = this.symlinks[abs]
  var len = entries.length

  // If it's a symlink, and we're in a globstar, then stop
  if (isSym && inGlobStar)
    return cb()

  for (var i = 0; i < len; i++) {
    var e = entries[i]
    if (e.charAt(0) === '.' && !this.dot)
      continue

    // these two cases enter the inGlobStar state
    var instead = gspref.concat(entries[i], remainWithoutGlobStar)
    this._process(instead, index, true, cb)

    var below = gspref.concat(entries[i], remain)
    this._process(below, index, true, cb)
  }

  cb()
}

Glob.prototype._processSimple = function (prefix, index, cb) {
  // XXX review this.  Shouldn't it be doing the mounting etc
  // before doing stat?  kinda weird?
  var self = this
  this._stat(prefix, function (er, exists) {
    self._processSimple2(prefix, index, er, exists, cb)
  })
}
Glob.prototype._processSimple2 = function (prefix, index, er, exists, cb) {

  //console.error('ps2', prefix, exists)

  if (!this.matches[index])
    this.matches[index] = Object.create(null)

  // If it doesn't exist, then just mark the lack of results
  if (!exists)
    return cb()

  if (prefix && isAbsolute(prefix) && !this.nomount) {
    var trail = /[\/\\]$/.test(prefix)
    if (prefix.charAt(0) === '/') {
      prefix = path.join(this.root, prefix)
    } else {
      prefix = path.resolve(this.root, prefix)
      if (trail)
        prefix += '/'
    }
  }

  if (process.platform === 'win32')
    prefix = prefix.replace(/\\/g, '/')

  // Mark this as a match
  this._emitMatch(index, prefix)
  cb()
}

// Returns either 'DIR', 'FILE', or false
Glob.prototype._stat = function (f, cb) {
  var abs = this._makeAbs(f)
  var needDir = f.slice(-1) === '/'

  if (f.length > this.maxLength)
    return cb()

  if (!this.stat && ownProp(this.cache, abs)) {
    var c = this.cache[abs]

    if (Array.isArray(c))
      c = 'DIR'

    // It exists, but maybe not how we need it
    if (!needDir || c === 'DIR')
      return cb(null, c)

    if (needDir && c === 'FILE')
      return cb()

    // otherwise we have to stat, because maybe c=true
    // if we know it exists, but not what it is.
  }

  var exists
  var stat = this.statCache[abs]
  if (stat !== undefined) {
    if (stat === false)
      return cb(null, stat)
    else {
      var type = stat.isDirectory() ? 'DIR' : 'FILE'
      if (needDir && type === 'FILE')
        return cb()
      else
        return cb(null, type, stat)
    }
  }

  var self = this
  var statcb = inflight('stat\0' + abs, lstatcb_)
  if (statcb)
    fs.lstat(abs, statcb)

  function lstatcb_ (er, lstat) {
    if (lstat && lstat.isSymbolicLink()) {
      // If it's a symlink, then treat it as the target, unless
      // the target does not exist, then treat it as a file.
      return fs.stat(abs, function (er, stat) {
        if (er)
          self._stat2(f, abs, null, lstat, cb)
        else
          self._stat2(f, abs, er, stat, cb)
      })
    } else {
      self._stat2(f, abs, er, lstat, cb)
    }
  }
}

Glob.prototype._stat2 = function (f, abs, er, stat, cb) {
  if (er && (er.code === 'ENOENT' || er.code === 'ENOTDIR')) {
    this.statCache[abs] = false
    return cb()
  }

  var needDir = f.slice(-1) === '/'
  this.statCache[abs] = stat

  if (abs.slice(-1) === '/' && stat && !stat.isDirectory())
    return cb(null, false, stat)

  var c = true
  if (stat)
    c = stat.isDirectory() ? 'DIR' : 'FILE'
  this.cache[abs] = this.cache[abs] || c

  if (needDir && c === 'FILE')
    return cb()

  return cb(null, c, stat)
}


/***/ }),

/***/ 9010:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = globSync
globSync.GlobSync = GlobSync

var fs = __webpack_require__(5747)
var rp = __webpack_require__(6863)
var minimatch = __webpack_require__(3973)
var Minimatch = minimatch.Minimatch
var Glob = __webpack_require__(1957).Glob
var util = __webpack_require__(1669)
var path = __webpack_require__(5622)
var assert = __webpack_require__(2357)
var isAbsolute = __webpack_require__(8714)
var common = __webpack_require__(7625)
var alphasort = common.alphasort
var alphasorti = common.alphasorti
var setopts = common.setopts
var ownProp = common.ownProp
var childrenIgnored = common.childrenIgnored
var isIgnored = common.isIgnored

function globSync (pattern, options) {
  if (typeof options === 'function' || arguments.length === 3)
    throw new TypeError('callback provided to sync glob\n'+
                        'See: https://github.com/isaacs/node-glob/issues/167')

  return new GlobSync(pattern, options).found
}

function GlobSync (pattern, options) {
  if (!pattern)
    throw new Error('must provide pattern')

  if (typeof options === 'function' || arguments.length === 3)
    throw new TypeError('callback provided to sync glob\n'+
                        'See: https://github.com/isaacs/node-glob/issues/167')

  if (!(this instanceof GlobSync))
    return new GlobSync(pattern, options)

  setopts(this, pattern, options)

  if (this.noprocess)
    return this

  var n = this.minimatch.set.length
  this.matches = new Array(n)
  for (var i = 0; i < n; i ++) {
    this._process(this.minimatch.set[i], i, false)
  }
  this._finish()
}

GlobSync.prototype._finish = function () {
  assert(this instanceof GlobSync)
  if (this.realpath) {
    var self = this
    this.matches.forEach(function (matchset, index) {
      var set = self.matches[index] = Object.create(null)
      for (var p in matchset) {
        try {
          p = self._makeAbs(p)
          var real = rp.realpathSync(p, self.realpathCache)
          set[real] = true
        } catch (er) {
          if (er.syscall === 'stat')
            set[self._makeAbs(p)] = true
          else
            throw er
        }
      }
    })
  }
  common.finish(this)
}


GlobSync.prototype._process = function (pattern, index, inGlobStar) {
  assert(this instanceof GlobSync)

  // Get the first [n] parts of pattern that are all strings.
  var n = 0
  while (typeof pattern[n] === 'string') {
    n ++
  }
  // now n is the index of the first one that is *not* a string.

  // See if there's anything else
  var prefix
  switch (n) {
    // if not, then this is rather simple
    case pattern.length:
      this._processSimple(pattern.join('/'), index)
      return

    case 0:
      // pattern *starts* with some non-trivial item.
      // going to readdir(cwd), but not include the prefix in matches.
      prefix = null
      break

    default:
      // pattern has some string bits in the front.
      // whatever it starts with, whether that's 'absolute' like /foo/bar,
      // or 'relative' like '../baz'
      prefix = pattern.slice(0, n).join('/')
      break
  }

  var remain = pattern.slice(n)

  // get the list of entries.
  var read
  if (prefix === null)
    read = '.'
  else if (isAbsolute(prefix) || isAbsolute(pattern.join('/'))) {
    if (!prefix || !isAbsolute(prefix))
      prefix = '/' + prefix
    read = prefix
  } else
    read = prefix

  var abs = this._makeAbs(read)

  //if ignored, skip processing
  if (childrenIgnored(this, read))
    return

  var isGlobStar = remain[0] === minimatch.GLOBSTAR
  if (isGlobStar)
    this._processGlobStar(prefix, read, abs, remain, index, inGlobStar)
  else
    this._processReaddir(prefix, read, abs, remain, index, inGlobStar)
}


GlobSync.prototype._processReaddir = function (prefix, read, abs, remain, index, inGlobStar) {
  var entries = this._readdir(abs, inGlobStar)

  // if the abs isn't a dir, then nothing can match!
  if (!entries)
    return

  // It will only match dot entries if it starts with a dot, or if
  // dot is set.  Stuff like @(.foo|.bar) isn't allowed.
  var pn = remain[0]
  var negate = !!this.minimatch.negate
  var rawGlob = pn._glob
  var dotOk = this.dot || rawGlob.charAt(0) === '.'

  var matchedEntries = []
  for (var i = 0; i < entries.length; i++) {
    var e = entries[i]
    if (e.charAt(0) !== '.' || dotOk) {
      var m
      if (negate && !prefix) {
        m = !e.match(pn)
      } else {
        m = e.match(pn)
      }
      if (m)
        matchedEntries.push(e)
    }
  }

  var len = matchedEntries.length
  // If there are no matched entries, then nothing matches.
  if (len === 0)
    return

  // if this is the last remaining pattern bit, then no need for
  // an additional stat *unless* the user has specified mark or
  // stat explicitly.  We know they exist, since readdir returned
  // them.

  if (remain.length === 1 && !this.mark && !this.stat) {
    if (!this.matches[index])
      this.matches[index] = Object.create(null)

    for (var i = 0; i < len; i ++) {
      var e = matchedEntries[i]
      if (prefix) {
        if (prefix.slice(-1) !== '/')
          e = prefix + '/' + e
        else
          e = prefix + e
      }

      if (e.charAt(0) === '/' && !this.nomount) {
        e = path.join(this.root, e)
      }
      this._emitMatch(index, e)
    }
    // This was the last one, and no stats were needed
    return
  }

  // now test all matched entries as stand-ins for that part
  // of the pattern.
  remain.shift()
  for (var i = 0; i < len; i ++) {
    var e = matchedEntries[i]
    var newPattern
    if (prefix)
      newPattern = [prefix, e]
    else
      newPattern = [e]
    this._process(newPattern.concat(remain), index, inGlobStar)
  }
}


GlobSync.prototype._emitMatch = function (index, e) {
  if (isIgnored(this, e))
    return

  var abs = this._makeAbs(e)

  if (this.mark)
    e = this._mark(e)

  if (this.absolute) {
    e = abs
  }

  if (this.matches[index][e])
    return

  if (this.nodir) {
    var c = this.cache[abs]
    if (c === 'DIR' || Array.isArray(c))
      return
  }

  this.matches[index][e] = true

  if (this.stat)
    this._stat(e)
}


GlobSync.prototype._readdirInGlobStar = function (abs) {
  // follow all symlinked directories forever
  // just proceed as if this is a non-globstar situation
  if (this.follow)
    return this._readdir(abs, false)

  var entries
  var lstat
  var stat
  try {
    lstat = fs.lstatSync(abs)
  } catch (er) {
    if (er.code === 'ENOENT') {
      // lstat failed, doesn't exist
      return null
    }
  }

  var isSym = lstat && lstat.isSymbolicLink()
  this.symlinks[abs] = isSym

  // If it's not a symlink or a dir, then it's definitely a regular file.
  // don't bother doing a readdir in that case.
  if (!isSym && lstat && !lstat.isDirectory())
    this.cache[abs] = 'FILE'
  else
    entries = this._readdir(abs, false)

  return entries
}

GlobSync.prototype._readdir = function (abs, inGlobStar) {
  var entries

  if (inGlobStar && !ownProp(this.symlinks, abs))
    return this._readdirInGlobStar(abs)

  if (ownProp(this.cache, abs)) {
    var c = this.cache[abs]
    if (!c || c === 'FILE')
      return null

    if (Array.isArray(c))
      return c
  }

  try {
    return this._readdirEntries(abs, fs.readdirSync(abs))
  } catch (er) {
    this._readdirError(abs, er)
    return null
  }
}

GlobSync.prototype._readdirEntries = function (abs, entries) {
  // if we haven't asked to stat everything, then just
  // assume that everything in there exists, so we can avoid
  // having to stat it a second time.
  if (!this.mark && !this.stat) {
    for (var i = 0; i < entries.length; i ++) {
      var e = entries[i]
      if (abs === '/')
        e = abs + e
      else
        e = abs + '/' + e
      this.cache[e] = true
    }
  }

  this.cache[abs] = entries

  // mark and cache dir-ness
  return entries
}

GlobSync.prototype._readdirError = function (f, er) {
  // handle errors, and cache the information
  switch (er.code) {
    case 'ENOTSUP': // https://github.com/isaacs/node-glob/issues/205
    case 'ENOTDIR': // totally normal. means it *does* exist.
      var abs = this._makeAbs(f)
      this.cache[abs] = 'FILE'
      if (abs === this.cwdAbs) {
        var error = new Error(er.code + ' invalid cwd ' + this.cwd)
        error.path = this.cwd
        error.code = er.code
        throw error
      }
      break

    case 'ENOENT': // not terribly unusual
    case 'ELOOP':
    case 'ENAMETOOLONG':
    case 'UNKNOWN':
      this.cache[this._makeAbs(f)] = false
      break

    default: // some unusual error.  Treat as failure.
      this.cache[this._makeAbs(f)] = false
      if (this.strict)
        throw er
      if (!this.silent)
        console.error('glob error', er)
      break
  }
}

GlobSync.prototype._processGlobStar = function (prefix, read, abs, remain, index, inGlobStar) {

  var entries = this._readdir(abs, inGlobStar)

  // no entries means not a dir, so it can never have matches
  // foo.txt/** doesn't match foo.txt
  if (!entries)
    return

  // test without the globstar, and with every child both below
  // and replacing the globstar.
  var remainWithoutGlobStar = remain.slice(1)
  var gspref = prefix ? [ prefix ] : []
  var noGlobStar = gspref.concat(remainWithoutGlobStar)

  // the noGlobStar pattern exits the inGlobStar state
  this._process(noGlobStar, index, false)

  var len = entries.length
  var isSym = this.symlinks[abs]

  // If it's a symlink, and we're in a globstar, then stop
  if (isSym && inGlobStar)
    return

  for (var i = 0; i < len; i++) {
    var e = entries[i]
    if (e.charAt(0) === '.' && !this.dot)
      continue

    // these two cases enter the inGlobStar state
    var instead = gspref.concat(entries[i], remainWithoutGlobStar)
    this._process(instead, index, true)

    var below = gspref.concat(entries[i], remain)
    this._process(below, index, true)
  }
}

GlobSync.prototype._processSimple = function (prefix, index) {
  // XXX review this.  Shouldn't it be doing the mounting etc
  // before doing stat?  kinda weird?
  var exists = this._stat(prefix)

  if (!this.matches[index])
    this.matches[index] = Object.create(null)

  // If it doesn't exist, then just mark the lack of results
  if (!exists)
    return

  if (prefix && isAbsolute(prefix) && !this.nomount) {
    var trail = /[\/\\]$/.test(prefix)
    if (prefix.charAt(0) === '/') {
      prefix = path.join(this.root, prefix)
    } else {
      prefix = path.resolve(this.root, prefix)
      if (trail)
        prefix += '/'
    }
  }

  if (process.platform === 'win32')
    prefix = prefix.replace(/\\/g, '/')

  // Mark this as a match
  this._emitMatch(index, prefix)
}

// Returns either 'DIR', 'FILE', or false
GlobSync.prototype._stat = function (f) {
  var abs = this._makeAbs(f)
  var needDir = f.slice(-1) === '/'

  if (f.length > this.maxLength)
    return false

  if (!this.stat && ownProp(this.cache, abs)) {
    var c = this.cache[abs]

    if (Array.isArray(c))
      c = 'DIR'

    // It exists, but maybe not how we need it
    if (!needDir || c === 'DIR')
      return c

    if (needDir && c === 'FILE')
      return false

    // otherwise we have to stat, because maybe c=true
    // if we know it exists, but not what it is.
  }

  var exists
  var stat = this.statCache[abs]
  if (!stat) {
    var lstat
    try {
      lstat = fs.lstatSync(abs)
    } catch (er) {
      if (er && (er.code === 'ENOENT' || er.code === 'ENOTDIR')) {
        this.statCache[abs] = false
        return false
      }
    }

    if (lstat && lstat.isSymbolicLink()) {
      try {
        stat = fs.statSync(abs)
      } catch (er) {
        stat = lstat
      }
    } else {
      stat = lstat
    }
  }

  this.statCache[abs] = stat

  var c = true
  if (stat)
    c = stat.isDirectory() ? 'DIR' : 'FILE'

  this.cache[abs] = this.cache[abs] || c

  if (needDir && c === 'FILE')
    return false

  return c
}

GlobSync.prototype._mark = function (p) {
  return common.mark(this, p)
}

GlobSync.prototype._makeAbs = function (f) {
  return common.makeAbs(this, f)
}


/***/ }),

/***/ 2492:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var wrappy = __webpack_require__(2940)
var reqs = Object.create(null)
var once = __webpack_require__(1223)

module.exports = wrappy(inflight)

function inflight (key, cb) {
  if (reqs[key]) {
    reqs[key].push(cb)
    return null
  } else {
    reqs[key] = [cb]
    return makeres(key)
  }
}

function makeres (key) {
  return once(function RES () {
    var cbs = reqs[key]
    var len = cbs.length
    var args = slice(arguments)

    // XXX It's somewhat ambiguous whether a new callback added in this
    // pass should be queued for later execution if something in the
    // list of callbacks throws, or if it should just be discarded.
    // However, it's such an edge case that it hardly matters, and either
    // choice is likely as surprising as the other.
    // As it happens, we do go ahead and schedule it for later execution.
    try {
      for (var i = 0; i < len; i++) {
        cbs[i].apply(null, args)
      }
    } finally {
      if (cbs.length > len) {
        // added more in the interim.
        // de-zalgo, just in case, but don't call again.
        cbs.splice(0, len)
        process.nextTick(function () {
          RES.apply(null, args)
        })
      } else {
        delete reqs[key]
      }
    }
  })
}

function slice (args) {
  var length = args.length
  var array = []

  for (var i = 0; i < length; i++) array[i] = args[i]
  return array
}


/***/ }),

/***/ 4124:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

try {
  var util = __webpack_require__(1669);
  /* istanbul ignore next */
  if (typeof util.inherits !== 'function') throw '';
  module.exports = util.inherits;
} catch (e) {
  /* istanbul ignore next */
  module.exports = __webpack_require__(8544);
}


/***/ }),

/***/ 8544:
/***/ ((module) => {

if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    if (superCtor) {
      ctor.super_ = superCtor
      ctor.prototype = Object.create(superCtor.prototype, {
        constructor: {
          value: ctor,
          enumerable: false,
          writable: true,
          configurable: true
        }
      })
    }
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    if (superCtor) {
      ctor.super_ = superCtor
      var TempCtor = function () {}
      TempCtor.prototype = superCtor.prototype
      ctor.prototype = new TempCtor()
      ctor.prototype.constructor = ctor
    }
  }
}


/***/ }),

/***/ 3973:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = minimatch
minimatch.Minimatch = Minimatch

var path = { sep: '/' }
try {
  path = __webpack_require__(5622)
} catch (er) {}

var GLOBSTAR = minimatch.GLOBSTAR = Minimatch.GLOBSTAR = {}
var expand = __webpack_require__(3717)

var plTypes = {
  '!': { open: '(?:(?!(?:', close: '))[^/]*?)'},
  '?': { open: '(?:', close: ')?' },
  '+': { open: '(?:', close: ')+' },
  '*': { open: '(?:', close: ')*' },
  '@': { open: '(?:', close: ')' }
}

// any single thing other than /
// don't need to escape / when using new RegExp()
var qmark = '[^/]'

// * => any number of characters
var star = qmark + '*?'

// ** when dots are allowed.  Anything goes, except .. and .
// not (^ or / followed by one or two dots followed by $ or /),
// followed by anything, any number of times.
var twoStarDot = '(?:(?!(?:\\\/|^)(?:\\.{1,2})($|\\\/)).)*?'

// not a ^ or / followed by a dot,
// followed by anything, any number of times.
var twoStarNoDot = '(?:(?!(?:\\\/|^)\\.).)*?'

// characters that need to be escaped in RegExp.
var reSpecials = charSet('().*{}+?[]^$\\!')

// "abc" -> { a:true, b:true, c:true }
function charSet (s) {
  return s.split('').reduce(function (set, c) {
    set[c] = true
    return set
  }, {})
}

// normalizes slashes.
var slashSplit = /\/+/

minimatch.filter = filter
function filter (pattern, options) {
  options = options || {}
  return function (p, i, list) {
    return minimatch(p, pattern, options)
  }
}

function ext (a, b) {
  a = a || {}
  b = b || {}
  var t = {}
  Object.keys(b).forEach(function (k) {
    t[k] = b[k]
  })
  Object.keys(a).forEach(function (k) {
    t[k] = a[k]
  })
  return t
}

minimatch.defaults = function (def) {
  if (!def || !Object.keys(def).length) return minimatch

  var orig = minimatch

  var m = function minimatch (p, pattern, options) {
    return orig.minimatch(p, pattern, ext(def, options))
  }

  m.Minimatch = function Minimatch (pattern, options) {
    return new orig.Minimatch(pattern, ext(def, options))
  }

  return m
}

Minimatch.defaults = function (def) {
  if (!def || !Object.keys(def).length) return Minimatch
  return minimatch.defaults(def).Minimatch
}

function minimatch (p, pattern, options) {
  if (typeof pattern !== 'string') {
    throw new TypeError('glob pattern string required')
  }

  if (!options) options = {}

  // shortcut: comments match nothing.
  if (!options.nocomment && pattern.charAt(0) === '#') {
    return false
  }

  // "" only matches ""
  if (pattern.trim() === '') return p === ''

  return new Minimatch(pattern, options).match(p)
}

function Minimatch (pattern, options) {
  if (!(this instanceof Minimatch)) {
    return new Minimatch(pattern, options)
  }

  if (typeof pattern !== 'string') {
    throw new TypeError('glob pattern string required')
  }

  if (!options) options = {}
  pattern = pattern.trim()

  // windows support: need to use /, not \
  if (path.sep !== '/') {
    pattern = pattern.split(path.sep).join('/')
  }

  this.options = options
  this.set = []
  this.pattern = pattern
  this.regexp = null
  this.negate = false
  this.comment = false
  this.empty = false

  // make the set of regexps etc.
  this.make()
}

Minimatch.prototype.debug = function () {}

Minimatch.prototype.make = make
function make () {
  // don't do it more than once.
  if (this._made) return

  var pattern = this.pattern
  var options = this.options

  // empty patterns and comments match nothing.
  if (!options.nocomment && pattern.charAt(0) === '#') {
    this.comment = true
    return
  }
  if (!pattern) {
    this.empty = true
    return
  }

  // step 1: figure out negation, etc.
  this.parseNegate()

  // step 2: expand braces
  var set = this.globSet = this.braceExpand()

  if (options.debug) this.debug = console.error

  this.debug(this.pattern, set)

  // step 3: now we have a set, so turn each one into a series of path-portion
  // matching patterns.
  // These will be regexps, except in the case of "**", which is
  // set to the GLOBSTAR object for globstar behavior,
  // and will not contain any / characters
  set = this.globParts = set.map(function (s) {
    return s.split(slashSplit)
  })

  this.debug(this.pattern, set)

  // glob --> regexps
  set = set.map(function (s, si, set) {
    return s.map(this.parse, this)
  }, this)

  this.debug(this.pattern, set)

  // filter out everything that didn't compile properly.
  set = set.filter(function (s) {
    return s.indexOf(false) === -1
  })

  this.debug(this.pattern, set)

  this.set = set
}

Minimatch.prototype.parseNegate = parseNegate
function parseNegate () {
  var pattern = this.pattern
  var negate = false
  var options = this.options
  var negateOffset = 0

  if (options.nonegate) return

  for (var i = 0, l = pattern.length
    ; i < l && pattern.charAt(i) === '!'
    ; i++) {
    negate = !negate
    negateOffset++
  }

  if (negateOffset) this.pattern = pattern.substr(negateOffset)
  this.negate = negate
}

// Brace expansion:
// a{b,c}d -> abd acd
// a{b,}c -> abc ac
// a{0..3}d -> a0d a1d a2d a3d
// a{b,c{d,e}f}g -> abg acdfg acefg
// a{b,c}d{e,f}g -> abdeg acdeg abdeg abdfg
//
// Invalid sets are not expanded.
// a{2..}b -> a{2..}b
// a{b}c -> a{b}c
minimatch.braceExpand = function (pattern, options) {
  return braceExpand(pattern, options)
}

Minimatch.prototype.braceExpand = braceExpand

function braceExpand (pattern, options) {
  if (!options) {
    if (this instanceof Minimatch) {
      options = this.options
    } else {
      options = {}
    }
  }

  pattern = typeof pattern === 'undefined'
    ? this.pattern : pattern

  if (typeof pattern === 'undefined') {
    throw new TypeError('undefined pattern')
  }

  if (options.nobrace ||
    !pattern.match(/\{.*\}/)) {
    // shortcut. no need to expand.
    return [pattern]
  }

  return expand(pattern)
}

// parse a component of the expanded set.
// At this point, no pattern may contain "/" in it
// so we're going to return a 2d array, where each entry is the full
// pattern, split on '/', and then turned into a regular expression.
// A regexp is made at the end which joins each array with an
// escaped /, and another full one which joins each regexp with |.
//
// Following the lead of Bash 4.1, note that "**" only has special meaning
// when it is the *only* thing in a path portion.  Otherwise, any series
// of * is equivalent to a single *.  Globstar behavior is enabled by
// default, and can be disabled by setting options.noglobstar.
Minimatch.prototype.parse = parse
var SUBPARSE = {}
function parse (pattern, isSub) {
  if (pattern.length > 1024 * 64) {
    throw new TypeError('pattern is too long')
  }

  var options = this.options

  // shortcuts
  if (!options.noglobstar && pattern === '**') return GLOBSTAR
  if (pattern === '') return ''

  var re = ''
  var hasMagic = !!options.nocase
  var escaping = false
  // ? => one single character
  var patternListStack = []
  var negativeLists = []
  var stateChar
  var inClass = false
  var reClassStart = -1
  var classStart = -1
  // . and .. never match anything that doesn't start with .,
  // even when options.dot is set.
  var patternStart = pattern.charAt(0) === '.' ? '' // anything
  // not (start or / followed by . or .. followed by / or end)
  : options.dot ? '(?!(?:^|\\\/)\\.{1,2}(?:$|\\\/))'
  : '(?!\\.)'
  var self = this

  function clearStateChar () {
    if (stateChar) {
      // we had some state-tracking character
      // that wasn't consumed by this pass.
      switch (stateChar) {
        case '*':
          re += star
          hasMagic = true
        break
        case '?':
          re += qmark
          hasMagic = true
        break
        default:
          re += '\\' + stateChar
        break
      }
      self.debug('clearStateChar %j %j', stateChar, re)
      stateChar = false
    }
  }

  for (var i = 0, len = pattern.length, c
    ; (i < len) && (c = pattern.charAt(i))
    ; i++) {
    this.debug('%s\t%s %s %j', pattern, i, re, c)

    // skip over any that are escaped.
    if (escaping && reSpecials[c]) {
      re += '\\' + c
      escaping = false
      continue
    }

    switch (c) {
      case '/':
        // completely not allowed, even escaped.
        // Should already be path-split by now.
        return false

      case '\\':
        clearStateChar()
        escaping = true
      continue

      // the various stateChar values
      // for the "extglob" stuff.
      case '?':
      case '*':
      case '+':
      case '@':
      case '!':
        this.debug('%s\t%s %s %j <-- stateChar', pattern, i, re, c)

        // all of those are literals inside a class, except that
        // the glob [!a] means [^a] in regexp
        if (inClass) {
          this.debug('  in class')
          if (c === '!' && i === classStart + 1) c = '^'
          re += c
          continue
        }

        // if we already have a stateChar, then it means
        // that there was something like ** or +? in there.
        // Handle the stateChar, then proceed with this one.
        self.debug('call clearStateChar %j', stateChar)
        clearStateChar()
        stateChar = c
        // if extglob is disabled, then +(asdf|foo) isn't a thing.
        // just clear the statechar *now*, rather than even diving into
        // the patternList stuff.
        if (options.noext) clearStateChar()
      continue

      case '(':
        if (inClass) {
          re += '('
          continue
        }

        if (!stateChar) {
          re += '\\('
          continue
        }

        patternListStack.push({
          type: stateChar,
          start: i - 1,
          reStart: re.length,
          open: plTypes[stateChar].open,
          close: plTypes[stateChar].close
        })
        // negation is (?:(?!js)[^/]*)
        re += stateChar === '!' ? '(?:(?!(?:' : '(?:'
        this.debug('plType %j %j', stateChar, re)
        stateChar = false
      continue

      case ')':
        if (inClass || !patternListStack.length) {
          re += '\\)'
          continue
        }

        clearStateChar()
        hasMagic = true
        var pl = patternListStack.pop()
        // negation is (?:(?!js)[^/]*)
        // The others are (?:<pattern>)<type>
        re += pl.close
        if (pl.type === '!') {
          negativeLists.push(pl)
        }
        pl.reEnd = re.length
      continue

      case '|':
        if (inClass || !patternListStack.length || escaping) {
          re += '\\|'
          escaping = false
          continue
        }

        clearStateChar()
        re += '|'
      continue

      // these are mostly the same in regexp and glob
      case '[':
        // swallow any state-tracking char before the [
        clearStateChar()

        if (inClass) {
          re += '\\' + c
          continue
        }

        inClass = true
        classStart = i
        reClassStart = re.length
        re += c
      continue

      case ']':
        //  a right bracket shall lose its special
        //  meaning and represent itself in
        //  a bracket expression if it occurs
        //  first in the list.  -- POSIX.2 2.8.3.2
        if (i === classStart + 1 || !inClass) {
          re += '\\' + c
          escaping = false
          continue
        }

        // handle the case where we left a class open.
        // "[z-a]" is valid, equivalent to "\[z-a\]"
        if (inClass) {
          // split where the last [ was, make sure we don't have
          // an invalid re. if so, re-walk the contents of the
          // would-be class to re-translate any characters that
          // were passed through as-is
          // TODO: It would probably be faster to determine this
          // without a try/catch and a new RegExp, but it's tricky
          // to do safely.  For now, this is safe and works.
          var cs = pattern.substring(classStart + 1, i)
          try {
            RegExp('[' + cs + ']')
          } catch (er) {
            // not a valid class!
            var sp = this.parse(cs, SUBPARSE)
            re = re.substr(0, reClassStart) + '\\[' + sp[0] + '\\]'
            hasMagic = hasMagic || sp[1]
            inClass = false
            continue
          }
        }

        // finish up the class.
        hasMagic = true
        inClass = false
        re += c
      continue

      default:
        // swallow any state char that wasn't consumed
        clearStateChar()

        if (escaping) {
          // no need
          escaping = false
        } else if (reSpecials[c]
          && !(c === '^' && inClass)) {
          re += '\\'
        }

        re += c

    } // switch
  } // for

  // handle the case where we left a class open.
  // "[abc" is valid, equivalent to "\[abc"
  if (inClass) {
    // split where the last [ was, and escape it
    // this is a huge pita.  We now have to re-walk
    // the contents of the would-be class to re-translate
    // any characters that were passed through as-is
    cs = pattern.substr(classStart + 1)
    sp = this.parse(cs, SUBPARSE)
    re = re.substr(0, reClassStart) + '\\[' + sp[0]
    hasMagic = hasMagic || sp[1]
  }

  // handle the case where we had a +( thing at the *end*
  // of the pattern.
  // each pattern list stack adds 3 chars, and we need to go through
  // and escape any | chars that were passed through as-is for the regexp.
  // Go through and escape them, taking care not to double-escape any
  // | chars that were already escaped.
  for (pl = patternListStack.pop(); pl; pl = patternListStack.pop()) {
    var tail = re.slice(pl.reStart + pl.open.length)
    this.debug('setting tail', re, pl)
    // maybe some even number of \, then maybe 1 \, followed by a |
    tail = tail.replace(/((?:\\{2}){0,64})(\\?)\|/g, function (_, $1, $2) {
      if (!$2) {
        // the | isn't already escaped, so escape it.
        $2 = '\\'
      }

      // need to escape all those slashes *again*, without escaping the
      // one that we need for escaping the | character.  As it works out,
      // escaping an even number of slashes can be done by simply repeating
      // it exactly after itself.  That's why this trick works.
      //
      // I am sorry that you have to see this.
      return $1 + $1 + $2 + '|'
    })

    this.debug('tail=%j\n   %s', tail, tail, pl, re)
    var t = pl.type === '*' ? star
      : pl.type === '?' ? qmark
      : '\\' + pl.type

    hasMagic = true
    re = re.slice(0, pl.reStart) + t + '\\(' + tail
  }

  // handle trailing things that only matter at the very end.
  clearStateChar()
  if (escaping) {
    // trailing \\
    re += '\\\\'
  }

  // only need to apply the nodot start if the re starts with
  // something that could conceivably capture a dot
  var addPatternStart = false
  switch (re.charAt(0)) {
    case '.':
    case '[':
    case '(': addPatternStart = true
  }

  // Hack to work around lack of negative lookbehind in JS
  // A pattern like: *.!(x).!(y|z) needs to ensure that a name
  // like 'a.xyz.yz' doesn't match.  So, the first negative
  // lookahead, has to look ALL the way ahead, to the end of
  // the pattern.
  for (var n = negativeLists.length - 1; n > -1; n--) {
    var nl = negativeLists[n]

    var nlBefore = re.slice(0, nl.reStart)
    var nlFirst = re.slice(nl.reStart, nl.reEnd - 8)
    var nlLast = re.slice(nl.reEnd - 8, nl.reEnd)
    var nlAfter = re.slice(nl.reEnd)

    nlLast += nlAfter

    // Handle nested stuff like *(*.js|!(*.json)), where open parens
    // mean that we should *not* include the ) in the bit that is considered
    // "after" the negated section.
    var openParensBefore = nlBefore.split('(').length - 1
    var cleanAfter = nlAfter
    for (i = 0; i < openParensBefore; i++) {
      cleanAfter = cleanAfter.replace(/\)[+*?]?/, '')
    }
    nlAfter = cleanAfter

    var dollar = ''
    if (nlAfter === '' && isSub !== SUBPARSE) {
      dollar = '$'
    }
    var newRe = nlBefore + nlFirst + nlAfter + dollar + nlLast
    re = newRe
  }

  // if the re is not "" at this point, then we need to make sure
  // it doesn't match against an empty path part.
  // Otherwise a/* will match a/, which it should not.
  if (re !== '' && hasMagic) {
    re = '(?=.)' + re
  }

  if (addPatternStart) {
    re = patternStart + re
  }

  // parsing just a piece of a larger pattern.
  if (isSub === SUBPARSE) {
    return [re, hasMagic]
  }

  // skip the regexp for non-magical patterns
  // unescape anything in it, though, so that it'll be
  // an exact match against a file etc.
  if (!hasMagic) {
    return globUnescape(pattern)
  }

  var flags = options.nocase ? 'i' : ''
  try {
    var regExp = new RegExp('^' + re + '$', flags)
  } catch (er) {
    // If it was an invalid regular expression, then it can't match
    // anything.  This trick looks for a character after the end of
    // the string, which is of course impossible, except in multi-line
    // mode, but it's not a /m regex.
    return new RegExp('$.')
  }

  regExp._glob = pattern
  regExp._src = re

  return regExp
}

minimatch.makeRe = function (pattern, options) {
  return new Minimatch(pattern, options || {}).makeRe()
}

Minimatch.prototype.makeRe = makeRe
function makeRe () {
  if (this.regexp || this.regexp === false) return this.regexp

  // at this point, this.set is a 2d array of partial
  // pattern strings, or "**".
  //
  // It's better to use .match().  This function shouldn't
  // be used, really, but it's pretty convenient sometimes,
  // when you just want to work with a regex.
  var set = this.set

  if (!set.length) {
    this.regexp = false
    return this.regexp
  }
  var options = this.options

  var twoStar = options.noglobstar ? star
    : options.dot ? twoStarDot
    : twoStarNoDot
  var flags = options.nocase ? 'i' : ''

  var re = set.map(function (pattern) {
    return pattern.map(function (p) {
      return (p === GLOBSTAR) ? twoStar
      : (typeof p === 'string') ? regExpEscape(p)
      : p._src
    }).join('\\\/')
  }).join('|')

  // must match entire pattern
  // ending in a * or ** will make it less strict.
  re = '^(?:' + re + ')$'

  // can match anything, as long as it's not this.
  if (this.negate) re = '^(?!' + re + ').*$'

  try {
    this.regexp = new RegExp(re, flags)
  } catch (ex) {
    this.regexp = false
  }
  return this.regexp
}

minimatch.match = function (list, pattern, options) {
  options = options || {}
  var mm = new Minimatch(pattern, options)
  list = list.filter(function (f) {
    return mm.match(f)
  })
  if (mm.options.nonull && !list.length) {
    list.push(pattern)
  }
  return list
}

Minimatch.prototype.match = match
function match (f, partial) {
  this.debug('match', f, this.pattern)
  // short-circuit in the case of busted things.
  // comments, etc.
  if (this.comment) return false
  if (this.empty) return f === ''

  if (f === '/' && partial) return true

  var options = this.options

  // windows: need to use /, not \
  if (path.sep !== '/') {
    f = f.split(path.sep).join('/')
  }

  // treat the test path as a set of pathparts.
  f = f.split(slashSplit)
  this.debug(this.pattern, 'split', f)

  // just ONE of the pattern sets in this.set needs to match
  // in order for it to be valid.  If negating, then just one
  // match means that we have failed.
  // Either way, return on the first hit.

  var set = this.set
  this.debug(this.pattern, 'set', set)

  // Find the basename of the path by looking for the last non-empty segment
  var filename
  var i
  for (i = f.length - 1; i >= 0; i--) {
    filename = f[i]
    if (filename) break
  }

  for (i = 0; i < set.length; i++) {
    var pattern = set[i]
    var file = f
    if (options.matchBase && pattern.length === 1) {
      file = [filename]
    }
    var hit = this.matchOne(file, pattern, partial)
    if (hit) {
      if (options.flipNegate) return true
      return !this.negate
    }
  }

  // didn't get any hits.  this is success if it's a negative
  // pattern, failure otherwise.
  if (options.flipNegate) return false
  return this.negate
}

// set partial to true to test if, for example,
// "/a/b" matches the start of "/*/b/*/d"
// Partial means, if you run out of file before you run
// out of pattern, then that's fine, as long as all
// the parts match.
Minimatch.prototype.matchOne = function (file, pattern, partial) {
  var options = this.options

  this.debug('matchOne',
    { 'this': this, file: file, pattern: pattern })

  this.debug('matchOne', file.length, pattern.length)

  for (var fi = 0,
      pi = 0,
      fl = file.length,
      pl = pattern.length
      ; (fi < fl) && (pi < pl)
      ; fi++, pi++) {
    this.debug('matchOne loop')
    var p = pattern[pi]
    var f = file[fi]

    this.debug(pattern, p, f)

    // should be impossible.
    // some invalid regexp stuff in the set.
    if (p === false) return false

    if (p === GLOBSTAR) {
      this.debug('GLOBSTAR', [pattern, p, f])

      // "**"
      // a/**/b/**/c would match the following:
      // a/b/x/y/z/c
      // a/x/y/z/b/c
      // a/b/x/b/x/c
      // a/b/c
      // To do this, take the rest of the pattern after
      // the **, and see if it would match the file remainder.
      // If so, return success.
      // If not, the ** "swallows" a segment, and try again.
      // This is recursively awful.
      //
      // a/**/b/**/c matching a/b/x/y/z/c
      // - a matches a
      // - doublestar
      //   - matchOne(b/x/y/z/c, b/**/c)
      //     - b matches b
      //     - doublestar
      //       - matchOne(x/y/z/c, c) -> no
      //       - matchOne(y/z/c, c) -> no
      //       - matchOne(z/c, c) -> no
      //       - matchOne(c, c) yes, hit
      var fr = fi
      var pr = pi + 1
      if (pr === pl) {
        this.debug('** at the end')
        // a ** at the end will just swallow the rest.
        // We have found a match.
        // however, it will not swallow /.x, unless
        // options.dot is set.
        // . and .. are *never* matched by **, for explosively
        // exponential reasons.
        for (; fi < fl; fi++) {
          if (file[fi] === '.' || file[fi] === '..' ||
            (!options.dot && file[fi].charAt(0) === '.')) return false
        }
        return true
      }

      // ok, let's see if we can swallow whatever we can.
      while (fr < fl) {
        var swallowee = file[fr]

        this.debug('\nglobstar while', file, fr, pattern, pr, swallowee)

        // XXX remove this slice.  Just pass the start index.
        if (this.matchOne(file.slice(fr), pattern.slice(pr), partial)) {
          this.debug('globstar found match!', fr, fl, swallowee)
          // found a match.
          return true
        } else {
          // can't swallow "." or ".." ever.
          // can only swallow ".foo" when explicitly asked.
          if (swallowee === '.' || swallowee === '..' ||
            (!options.dot && swallowee.charAt(0) === '.')) {
            this.debug('dot detected!', file, fr, pattern, pr)
            break
          }

          // ** swallows a segment, and continue.
          this.debug('globstar swallow a segment, and continue')
          fr++
        }
      }

      // no match was found.
      // However, in partial mode, we can't say this is necessarily over.
      // If there's more *pattern* left, then
      if (partial) {
        // ran out of file
        this.debug('\n>>> no match, partial?', file, fr, pattern, pr)
        if (fr === fl) return true
      }
      return false
    }

    // something other than **
    // non-magic patterns just have to match exactly
    // patterns with magic have been turned into regexps.
    var hit
    if (typeof p === 'string') {
      if (options.nocase) {
        hit = f.toLowerCase() === p.toLowerCase()
      } else {
        hit = f === p
      }
      this.debug('string match', p, f, hit)
    } else {
      hit = f.match(p)
      this.debug('pattern match', p, f, hit)
    }

    if (!hit) return false
  }

  // Note: ending in / means that we'll get a final ""
  // at the end of the pattern.  This can only match a
  // corresponding "" at the end of the file.
  // If the file ends in /, then it can only match a
  // a pattern that ends in /, unless the pattern just
  // doesn't have any more for it. But, a/b/ should *not*
  // match "a/b/*", even though "" matches against the
  // [^/]*? pattern, except in partial mode, where it might
  // simply not be reached yet.
  // However, a/b/ should still satisfy a/*

  // now either we fell off the end of the pattern, or we're done.
  if (fi === fl && pi === pl) {
    // ran out of pattern and filename at the same time.
    // an exact hit!
    return true
  } else if (fi === fl) {
    // ran out of file, but still had pattern left.
    // this is ok if we're doing the match as part of
    // a glob fs traversal.
    return partial
  } else if (pi === pl) {
    // ran out of pattern, still have file left.
    // this is only acceptable if we're on the very last
    // empty segment of a file with a trailing slash.
    // a/* should match a/b/
    var emptyFileEnd = (fi === fl - 1) && (file[fi] === '')
    return emptyFileEnd
  }

  // should be unreachable.
  throw new Error('wtf?')
}

// replace stuff like \* with *
function globUnescape (s) {
  return s.replace(/\\(.)/g, '$1')
}

function regExpEscape (s) {
  return s.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')
}


/***/ }),

/***/ 1223:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var wrappy = __webpack_require__(2940)
module.exports = wrappy(once)
module.exports.strict = wrappy(onceStrict)

once.proto = once(function () {
  Object.defineProperty(Function.prototype, 'once', {
    value: function () {
      return once(this)
    },
    configurable: true
  })

  Object.defineProperty(Function.prototype, 'onceStrict', {
    value: function () {
      return onceStrict(this)
    },
    configurable: true
  })
})

function once (fn) {
  var f = function () {
    if (f.called) return f.value
    f.called = true
    return f.value = fn.apply(this, arguments)
  }
  f.called = false
  return f
}

function onceStrict (fn) {
  var f = function () {
    if (f.called)
      throw new Error(f.onceError)
    f.called = true
    return f.value = fn.apply(this, arguments)
  }
  var name = fn.name || 'Function wrapped with `once`'
  f.onceError = name + " shouldn't be called more than once"
  f.called = false
  return f
}


/***/ }),

/***/ 8714:
/***/ ((module) => {

"use strict";


function posix(path) {
	return path.charAt(0) === '/';
}

function win32(path) {
	// https://github.com/nodejs/node/blob/b3fcc245fb25539909ef1d5eaa01dbf92e168633/lib/path.js#L56
	var splitDeviceRe = /^([a-zA-Z]:|[\\\/]{2}[^\\\/]+[\\\/]+[^\\\/]+)?([\\\/])?([\s\S]*?)$/;
	var result = splitDeviceRe.exec(path);
	var device = result[1] || '';
	var isUnc = Boolean(device && device.charAt(1) !== ':');

	// UNC paths are always absolute
	return Boolean(result[2] || isUnc);
}

module.exports = process.platform === 'win32' ? win32 : posix;
module.exports.posix = posix;
module.exports.win32 = win32;


/***/ }),

/***/ 8517:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/*!
 * Tmp
 *
 * Copyright (c) 2011-2017 KARASZI Istvan <github@spam.raszi.hu>
 *
 * MIT Licensed
 */

/*
 * Module dependencies.
 */
const fs = __webpack_require__(5747);
const os = __webpack_require__(2087);
const path = __webpack_require__(5622);
const crypto = __webpack_require__(6417);
const _c = { fs: fs.constants, os: os.constants };
const rimraf = __webpack_require__(2371);

/*
 * The working inner variables.
 */
const
  // the random characters to choose from
  RANDOM_CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',

  TEMPLATE_PATTERN = /XXXXXX/,

  DEFAULT_TRIES = 3,

  CREATE_FLAGS = (_c.O_CREAT || _c.fs.O_CREAT) | (_c.O_EXCL || _c.fs.O_EXCL) | (_c.O_RDWR || _c.fs.O_RDWR),

  // constants are off on the windows platform and will not match the actual errno codes
  IS_WIN32 = os.platform() === 'win32',
  EBADF = _c.EBADF || _c.os.errno.EBADF,
  ENOENT = _c.ENOENT || _c.os.errno.ENOENT,

  DIR_MODE = 0o700 /* 448 */,
  FILE_MODE = 0o600 /* 384 */,

  EXIT = 'exit',

  // this will hold the objects need to be removed on exit
  _removeObjects = [],

  // API change in fs.rmdirSync leads to error when passing in a second parameter, e.g. the callback
  FN_RMDIR_SYNC = fs.rmdirSync.bind(fs),
  FN_RIMRAF_SYNC = rimraf.sync;

let
  _gracefulCleanup = false;

/**
 * Gets a temporary file name.
 *
 * @param {(Options|tmpNameCallback)} options options or callback
 * @param {?tmpNameCallback} callback the callback function
 */
function tmpName(options, callback) {
  const
    args = _parseArguments(options, callback),
    opts = args[0],
    cb = args[1];

  try {
    _assertAndSanitizeOptions(opts);
  } catch (err) {
    return cb(err);
  }

  let tries = opts.tries;
  (function _getUniqueName() {
    try {
      const name = _generateTmpName(opts);

      // check whether the path exists then retry if needed
      fs.stat(name, function (err) {
        /* istanbul ignore else */
        if (!err) {
          /* istanbul ignore else */
          if (tries-- > 0) return _getUniqueName();

          return cb(new Error('Could not get a unique tmp filename, max tries reached ' + name));
        }

        cb(null, name);
      });
    } catch (err) {
      cb(err);
    }
  }());
}

/**
 * Synchronous version of tmpName.
 *
 * @param {Object} options
 * @returns {string} the generated random name
 * @throws {Error} if the options are invalid or could not generate a filename
 */
function tmpNameSync(options) {
  const
    args = _parseArguments(options),
    opts = args[0];

  _assertAndSanitizeOptions(opts);

  let tries = opts.tries;
  do {
    const name = _generateTmpName(opts);
    try {
      fs.statSync(name);
    } catch (e) {
      return name;
    }
  } while (tries-- > 0);

  throw new Error('Could not get a unique tmp filename, max tries reached');
}

/**
 * Creates and opens a temporary file.
 *
 * @param {(Options|null|undefined|fileCallback)} options the config options or the callback function or null or undefined
 * @param {?fileCallback} callback
 */
function file(options, callback) {
  const
    args = _parseArguments(options, callback),
    opts = args[0],
    cb = args[1];

  // gets a temporary filename
  tmpName(opts, function _tmpNameCreated(err, name) {
    /* istanbul ignore else */
    if (err) return cb(err);

    // create and open the file
    fs.open(name, CREATE_FLAGS, opts.mode || FILE_MODE, function _fileCreated(err, fd) {
      /* istanbu ignore else */
      if (err) return cb(err);

      if (opts.discardDescriptor) {
        return fs.close(fd, function _discardCallback(possibleErr) {
          // the chance of getting an error on close here is rather low and might occur in the most edgiest cases only
          return cb(possibleErr, name, undefined, _prepareTmpFileRemoveCallback(name, -1, opts, false));
        });
      } else {
        // detachDescriptor passes the descriptor whereas discardDescriptor closes it, either way, we no longer care
        // about the descriptor
        const discardOrDetachDescriptor = opts.discardDescriptor || opts.detachDescriptor;
        cb(null, name, fd, _prepareTmpFileRemoveCallback(name, discardOrDetachDescriptor ? -1 : fd, opts, false));
      }
    });
  });
}

/**
 * Synchronous version of file.
 *
 * @param {Options} options
 * @returns {FileSyncObject} object consists of name, fd and removeCallback
 * @throws {Error} if cannot create a file
 */
function fileSync(options) {
  const
    args = _parseArguments(options),
    opts = args[0];

  const discardOrDetachDescriptor = opts.discardDescriptor || opts.detachDescriptor;
  const name = tmpNameSync(opts);
  var fd = fs.openSync(name, CREATE_FLAGS, opts.mode || FILE_MODE);
  /* istanbul ignore else */
  if (opts.discardDescriptor) {
    fs.closeSync(fd);
    fd = undefined;
  }

  return {
    name: name,
    fd: fd,
    removeCallback: _prepareTmpFileRemoveCallback(name, discardOrDetachDescriptor ? -1 : fd, opts, true)
  };
}

/**
 * Creates a temporary directory.
 *
 * @param {(Options|dirCallback)} options the options or the callback function
 * @param {?dirCallback} callback
 */
function dir(options, callback) {
  const
    args = _parseArguments(options, callback),
    opts = args[0],
    cb = args[1];

  // gets a temporary filename
  tmpName(opts, function _tmpNameCreated(err, name) {
    /* istanbul ignore else */
    if (err) return cb(err);

    // create the directory
    fs.mkdir(name, opts.mode || DIR_MODE, function _dirCreated(err) {
      /* istanbul ignore else */
      if (err) return cb(err);

      cb(null, name, _prepareTmpDirRemoveCallback(name, opts, false));
    });
  });
}

/**
 * Synchronous version of dir.
 *
 * @param {Options} options
 * @returns {DirSyncObject} object consists of name and removeCallback
 * @throws {Error} if it cannot create a directory
 */
function dirSync(options) {
  const
    args = _parseArguments(options),
    opts = args[0];

  const name = tmpNameSync(opts);
  fs.mkdirSync(name, opts.mode || DIR_MODE);

  return {
    name: name,
    removeCallback: _prepareTmpDirRemoveCallback(name, opts, true)
  };
}

/**
 * Removes files asynchronously.
 *
 * @param {Object} fdPath
 * @param {Function} next
 * @private
 */
function _removeFileAsync(fdPath, next) {
  const _handler = function (err) {
    if (err && !_isENOENT(err)) {
      // reraise any unanticipated error
      return next(err);
    }
    next();
  };

  if (0 <= fdPath[0])
    fs.close(fdPath[0], function () {
      fs.unlink(fdPath[1], _handler);
    });
  else fs.unlink(fdPath[1], _handler);
}

/**
 * Removes files synchronously.
 *
 * @param {Object} fdPath
 * @private
 */
function _removeFileSync(fdPath) {
  let rethrownException = null;
  try {
    if (0 <= fdPath[0]) fs.closeSync(fdPath[0]);
  } catch (e) {
    // reraise any unanticipated error
    if (!_isEBADF(e) && !_isENOENT(e)) throw e;
  } finally {
    try {
      fs.unlinkSync(fdPath[1]);
    }
    catch (e) {
      // reraise any unanticipated error
      if (!_isENOENT(e)) rethrownException = e;
    }
  }
  if (rethrownException !== null) {
    throw rethrownException;
  }
}

/**
 * Prepares the callback for removal of the temporary file.
 *
 * Returns either a sync callback or a async callback depending on whether
 * fileSync or file was called, which is expressed by the sync parameter.
 *
 * @param {string} name the path of the file
 * @param {number} fd file descriptor
 * @param {Object} opts
 * @param {boolean} sync
 * @returns {fileCallback | fileCallbackSync}
 * @private
 */
function _prepareTmpFileRemoveCallback(name, fd, opts, sync) {
  const removeCallbackSync = _prepareRemoveCallback(_removeFileSync, [fd, name], sync);
  const removeCallback = _prepareRemoveCallback(_removeFileAsync, [fd, name], sync, removeCallbackSync);

  if (!opts.keep) _removeObjects.unshift(removeCallbackSync);

  return sync ? removeCallbackSync : removeCallback;
}

/**
 * Prepares the callback for removal of the temporary directory.
 *
 * Returns either a sync callback or a async callback depending on whether
 * tmpFileSync or tmpFile was called, which is expressed by the sync parameter.
 *
 * @param {string} name
 * @param {Object} opts
 * @param {boolean} sync
 * @returns {Function} the callback
 * @private
 */
function _prepareTmpDirRemoveCallback(name, opts, sync) {
  const removeFunction = opts.unsafeCleanup ? rimraf : fs.rmdir.bind(fs);
  const removeFunctionSync = opts.unsafeCleanup ? FN_RIMRAF_SYNC : FN_RMDIR_SYNC;
  const removeCallbackSync = _prepareRemoveCallback(removeFunctionSync, name, sync);
  const removeCallback = _prepareRemoveCallback(removeFunction, name, sync, removeCallbackSync);
  if (!opts.keep) _removeObjects.unshift(removeCallbackSync);

  return sync ? removeCallbackSync : removeCallback;
}

/**
 * Creates a guarded function wrapping the removeFunction call.
 *
 * The cleanup callback is save to be called multiple times.
 * Subsequent invocations will be ignored.
 *
 * @param {Function} removeFunction
 * @param {string} fileOrDirName
 * @param {boolean} sync
 * @param {cleanupCallbackSync?} cleanupCallbackSync
 * @returns {cleanupCallback | cleanupCallbackSync}
 * @private
 */
function _prepareRemoveCallback(removeFunction, fileOrDirName, sync, cleanupCallbackSync) {
  let called = false;

  // if sync is true, the next parameter will be ignored
  return function _cleanupCallback(next) {

    /* istanbul ignore else */
    if (!called) {
      // remove cleanupCallback from cache
      const toRemove = cleanupCallbackSync || _cleanupCallback;
      const index = _removeObjects.indexOf(toRemove);
      /* istanbul ignore else */
      if (index >= 0) _removeObjects.splice(index, 1);

      called = true;
      if (sync || removeFunction === FN_RMDIR_SYNC || removeFunction === FN_RIMRAF_SYNC) {
        return removeFunction(fileOrDirName);
      } else {
        return removeFunction(fileOrDirName, next || function() {});
      }
    }
  };
}

/**
 * The garbage collector.
 *
 * @private
 */
function _garbageCollector() {
  /* istanbul ignore else */
  if (!_gracefulCleanup) return;

  // the function being called removes itself from _removeObjects,
  // loop until _removeObjects is empty
  while (_removeObjects.length) {
    try {
      _removeObjects[0]();
    } catch (e) {
      // already removed?
    }
  }
}

/**
 * Random name generator based on crypto.
 * Adapted from http://blog.tompawlak.org/how-to-generate-random-values-nodejs-javascript
 *
 * @param {number} howMany
 * @returns {string} the generated random name
 * @private
 */
function _randomChars(howMany) {
  let
    value = [],
    rnd = null;

  // make sure that we do not fail because we ran out of entropy
  try {
    rnd = crypto.randomBytes(howMany);
  } catch (e) {
    rnd = crypto.pseudoRandomBytes(howMany);
  }

  for (var i = 0; i < howMany; i++) {
    value.push(RANDOM_CHARS[rnd[i] % RANDOM_CHARS.length]);
  }

  return value.join('');
}

/**
 * Helper which determines whether a string s is blank, that is undefined, or empty or null.
 *
 * @private
 * @param {string} s
 * @returns {Boolean} true whether the string s is blank, false otherwise
 */
function _isBlank(s) {
  return s === null || _isUndefined(s) || !s.trim();
}

/**
 * Checks whether the `obj` parameter is defined or not.
 *
 * @param {Object} obj
 * @returns {boolean} true if the object is undefined
 * @private
 */
function _isUndefined(obj) {
  return typeof obj === 'undefined';
}

/**
 * Parses the function arguments.
 *
 * This function helps to have optional arguments.
 *
 * @param {(Options|null|undefined|Function)} options
 * @param {?Function} callback
 * @returns {Array} parsed arguments
 * @private
 */
function _parseArguments(options, callback) {
  /* istanbul ignore else */
  if (typeof options === 'function') {
    return [{}, options];
  }

  /* istanbul ignore else */
  if (_isUndefined(options)) {
    return [{}, callback];
  }

  // copy options so we do not leak the changes we make internally
  const actualOptions = {};
  for (const key of Object.getOwnPropertyNames(options)) {
    actualOptions[key] = options[key];
  }

  return [actualOptions, callback];
}

/**
 * Generates a new temporary name.
 *
 * @param {Object} opts
 * @returns {string} the new random name according to opts
 * @private
 */
function _generateTmpName(opts) {

  const tmpDir = opts.tmpdir;

  /* istanbul ignore else */
  if (!_isUndefined(opts.name))
    return path.join(tmpDir, opts.dir, opts.name);

  /* istanbul ignore else */
  if (!_isUndefined(opts.template))
    return path.join(tmpDir, opts.dir, opts.template).replace(TEMPLATE_PATTERN, _randomChars(6));

  // prefix and postfix
  const name = [
    opts.prefix ? opts.prefix : 'tmp',
    '-',
    process.pid,
    '-',
    _randomChars(12),
    opts.postfix ? '-' + opts.postfix : ''
  ].join('');

  return path.join(tmpDir, opts.dir, name);
}

/**
 * Asserts whether the specified options are valid, also sanitizes options and provides sane defaults for missing
 * options.
 *
 * @param {Options} options
 * @private
 */
function _assertAndSanitizeOptions(options) {

  options.tmpdir = _getTmpDir(options);

  const tmpDir = options.tmpdir;

  /* istanbul ignore else */
  if (!_isUndefined(options.name))
    _assertIsRelative(options.name, 'name', tmpDir);
  /* istanbul ignore else */
  if (!_isUndefined(options.dir))
    _assertIsRelative(options.dir, 'dir', tmpDir);
  /* istanbul ignore else */
  if (!_isUndefined(options.template)) {
    _assertIsRelative(options.template, 'template', tmpDir);
    if (!options.template.match(TEMPLATE_PATTERN))
      throw new Error(`Invalid template, found "${options.template}".`);
  }
  /* istanbul ignore else */
  if (!_isUndefined(options.tries) && isNaN(options.tries) || options.tries < 0)
    throw new Error(`Invalid tries, found "${options.tries}".`);

  // if a name was specified we will try once
  options.tries = _isUndefined(options.name) ? options.tries || DEFAULT_TRIES : 1;
  options.keep = !!options.keep;
  options.detachDescriptor = !!options.detachDescriptor;
  options.discardDescriptor = !!options.discardDescriptor;
  options.unsafeCleanup = !!options.unsafeCleanup;

  // sanitize dir, also keep (multiple) blanks if the user, purportedly sane, requests us to
  options.dir = _isUndefined(options.dir) ? '' : path.relative(tmpDir, _resolvePath(options.dir, tmpDir));
  options.template = _isUndefined(options.template) ? undefined : path.relative(tmpDir, _resolvePath(options.template, tmpDir));
  // sanitize further if template is relative to options.dir
  options.template = _isBlank(options.template) ? undefined : path.relative(options.dir, options.template);

  // for completeness' sake only, also keep (multiple) blanks if the user, purportedly sane, requests us to
  options.name = _isUndefined(options.name) ? undefined : _sanitizeName(options.name);
  options.prefix = _isUndefined(options.prefix) ? '' : options.prefix;
  options.postfix = _isUndefined(options.postfix) ? '' : options.postfix;
}

/**
 * Resolve the specified path name in respect to tmpDir.
 *
 * The specified name might include relative path components, e.g. ../
 * so we need to resolve in order to be sure that is is located inside tmpDir
 *
 * @param name
 * @param tmpDir
 * @returns {string}
 * @private
 */
function _resolvePath(name, tmpDir) {
  const sanitizedName = _sanitizeName(name);
  if (sanitizedName.startsWith(tmpDir)) {
    return path.resolve(sanitizedName);
  } else {
    return path.resolve(path.join(tmpDir, sanitizedName));
  }
}

/**
 * Sanitize the specified path name by removing all quote characters.
 *
 * @param name
 * @returns {string}
 * @private
 */
function _sanitizeName(name) {
  if (_isBlank(name)) {
    return name;
  }
  return name.replace(/["']/g, '');
}

/**
 * Asserts whether specified name is relative to the specified tmpDir.
 *
 * @param {string} name
 * @param {string} option
 * @param {string} tmpDir
 * @throws {Error}
 * @private
 */
function _assertIsRelative(name, option, tmpDir) {
  if (option === 'name') {
    // assert that name is not absolute and does not contain a path
    if (path.isAbsolute(name))
      throw new Error(`${option} option must not contain an absolute path, found "${name}".`);
    // must not fail on valid .<name> or ..<name> or similar such constructs
    let basename = path.basename(name);
    if (basename === '..' || basename === '.' || basename !== name)
      throw new Error(`${option} option must not contain a path, found "${name}".`);
  }
  else { // if (option === 'dir' || option === 'template') {
    // assert that dir or template are relative to tmpDir
    if (path.isAbsolute(name) && !name.startsWith(tmpDir)) {
      throw new Error(`${option} option must be relative to "${tmpDir}", found "${name}".`);
    }
    let resolvedPath = _resolvePath(name, tmpDir);
    if (!resolvedPath.startsWith(tmpDir))
      throw new Error(`${option} option must be relative to "${tmpDir}", found "${resolvedPath}".`);
  }
}

/**
 * Helper for testing against EBADF to compensate changes made to Node 7.x under Windows.
 *
 * @private
 */
function _isEBADF(error) {
  return _isExpectedError(error, -EBADF, 'EBADF');
}

/**
 * Helper for testing against ENOENT to compensate changes made to Node 7.x under Windows.
 *
 * @private
 */
function _isENOENT(error) {
  return _isExpectedError(error, -ENOENT, 'ENOENT');
}

/**
 * Helper to determine whether the expected error code matches the actual code and errno,
 * which will differ between the supported node versions.
 *
 * - Node >= 7.0:
 *   error.code {string}
 *   error.errno {number} any numerical value will be negated
 *
 * CAVEAT
 *
 * On windows, the errno for EBADF is -4083 but os.constants.errno.EBADF is different and we must assume that ENOENT
 * is no different here.
 *
 * @param {SystemError} error
 * @param {number} errno
 * @param {string} code
 * @private
 */
function _isExpectedError(error, errno, code) {
  return IS_WIN32 ? error.code === code : error.code === code && error.errno === errno;
}

/**
 * Sets the graceful cleanup.
 *
 * If graceful cleanup is set, tmp will remove all controlled temporary objects on process exit, otherwise the
 * temporary objects will remain in place, waiting to be cleaned up on system restart or otherwise scheduled temporary
 * object removals.
 */
function setGracefulCleanup() {
  _gracefulCleanup = true;
}

/**
 * Returns the currently configured tmp dir from os.tmpdir().
 *
 * @private
 * @param {?Options} options
 * @returns {string} the currently configured tmp dir
 */
function _getTmpDir(options) {
  return path.resolve(_sanitizeName(options && options.tmpdir || os.tmpdir()));
}

// Install process exit listener
process.addListener(EXIT, _garbageCollector);

/**
 * Configuration options.
 *
 * @typedef {Object} Options
 * @property {?boolean} keep the temporary object (file or dir) will not be garbage collected
 * @property {?number} tries the number of tries before give up the name generation
 * @property (?int) mode the access mode, defaults are 0o700 for directories and 0o600 for files
 * @property {?string} template the "mkstemp" like filename template
 * @property {?string} name fixed name relative to tmpdir or the specified dir option
 * @property {?string} dir tmp directory relative to the root tmp directory in use
 * @property {?string} prefix prefix for the generated name
 * @property {?string} postfix postfix for the generated name
 * @property {?string} tmpdir the root tmp directory which overrides the os tmpdir
 * @property {?boolean} unsafeCleanup recursively removes the created temporary directory, even when it's not empty
 * @property {?boolean} detachDescriptor detaches the file descriptor, caller is responsible for closing the file, tmp will no longer try closing the file during garbage collection
 * @property {?boolean} discardDescriptor discards the file descriptor (closes file, fd is -1), tmp will no longer try closing the file during garbage collection
 */

/**
 * @typedef {Object} FileSyncObject
 * @property {string} name the name of the file
 * @property {string} fd the file descriptor or -1 if the fd has been discarded
 * @property {fileCallback} removeCallback the callback function to remove the file
 */

/**
 * @typedef {Object} DirSyncObject
 * @property {string} name the name of the directory
 * @property {fileCallback} removeCallback the callback function to remove the directory
 */

/**
 * @callback tmpNameCallback
 * @param {?Error} err the error object if anything goes wrong
 * @param {string} name the temporary file name
 */

/**
 * @callback fileCallback
 * @param {?Error} err the error object if anything goes wrong
 * @param {string} name the temporary file name
 * @param {number} fd the file descriptor or -1 if the fd had been discarded
 * @param {cleanupCallback} fn the cleanup callback function
 */

/**
 * @callback fileCallbackSync
 * @param {?Error} err the error object if anything goes wrong
 * @param {string} name the temporary file name
 * @param {number} fd the file descriptor or -1 if the fd had been discarded
 * @param {cleanupCallbackSync} fn the cleanup callback function
 */

/**
 * @callback dirCallback
 * @param {?Error} err the error object if anything goes wrong
 * @param {string} name the temporary file name
 * @param {cleanupCallback} fn the cleanup callback function
 */

/**
 * @callback dirCallbackSync
 * @param {?Error} err the error object if anything goes wrong
 * @param {string} name the temporary file name
 * @param {cleanupCallbackSync} fn the cleanup callback function
 */

/**
 * Removes the temporary created file or directory.
 *
 * @callback cleanupCallback
 * @param {simpleCallback} [next] function to call whenever the tmp object needs to be removed
 */

/**
 * Removes the temporary created file or directory.
 *
 * @callback cleanupCallbackSync
 */

/**
 * Callback function for function composition.
 * @see {@link https://github.com/raszi/node-tmp/issues/57|raszi/node-tmp#57}
 *
 * @callback simpleCallback
 */

// exporting all the needed methods

// evaluate _getTmpDir() lazily, mainly for simplifying testing but it also will
// allow users to reconfigure the temporary directory
Object.defineProperty(module.exports, "tmpdir", ({
  enumerable: true,
  configurable: false,
  get: function () {
    return _getTmpDir();
  }
}));

module.exports.dir = dir;
module.exports.dirSync = dirSync;

module.exports.file = file;
module.exports.fileSync = fileSync;

module.exports.tmpName = tmpName;
module.exports.tmpNameSync = tmpNameSync;

module.exports.setGracefulCleanup = setGracefulCleanup;


/***/ }),

/***/ 2371:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const assert = __webpack_require__(2357)
const path = __webpack_require__(5622)
const fs = __webpack_require__(5747)
let glob = undefined
try {
  glob = __webpack_require__(1957)
} catch (_err) {
  // treat glob as optional.
}

const defaultGlobOpts = {
  nosort: true,
  silent: true
}

// for EMFILE handling
let timeout = 0

const isWindows = (process.platform === "win32")

const defaults = options => {
  const methods = [
    'unlink',
    'chmod',
    'stat',
    'lstat',
    'rmdir',
    'readdir'
  ]
  methods.forEach(m => {
    options[m] = options[m] || fs[m]
    m = m + 'Sync'
    options[m] = options[m] || fs[m]
  })

  options.maxBusyTries = options.maxBusyTries || 3
  options.emfileWait = options.emfileWait || 1000
  if (options.glob === false) {
    options.disableGlob = true
  }
  if (options.disableGlob !== true && glob === undefined) {
    throw Error('glob dependency not found, set `options.disableGlob = true` if intentional')
  }
  options.disableGlob = options.disableGlob || false
  options.glob = options.glob || defaultGlobOpts
}

const rimraf = (p, options, cb) => {
  if (typeof options === 'function') {
    cb = options
    options = {}
  }

  assert(p, 'rimraf: missing path')
  assert.equal(typeof p, 'string', 'rimraf: path should be a string')
  assert.equal(typeof cb, 'function', 'rimraf: callback function required')
  assert(options, 'rimraf: invalid options argument provided')
  assert.equal(typeof options, 'object', 'rimraf: options should be object')

  defaults(options)

  let busyTries = 0
  let errState = null
  let n = 0

  const next = (er) => {
    errState = errState || er
    if (--n === 0)
      cb(errState)
  }

  const afterGlob = (er, results) => {
    if (er)
      return cb(er)

    n = results.length
    if (n === 0)
      return cb()

    results.forEach(p => {
      const CB = (er) => {
        if (er) {
          if ((er.code === "EBUSY" || er.code === "ENOTEMPTY" || er.code === "EPERM") &&
              busyTries < options.maxBusyTries) {
            busyTries ++
            // try again, with the same exact callback as this one.
            return setTimeout(() => rimraf_(p, options, CB), busyTries * 100)
          }

          // this one won't happen if graceful-fs is used.
          if (er.code === "EMFILE" && timeout < options.emfileWait) {
            return setTimeout(() => rimraf_(p, options, CB), timeout ++)
          }

          // already gone
          if (er.code === "ENOENT") er = null
        }

        timeout = 0
        next(er)
      }
      rimraf_(p, options, CB)
    })
  }

  if (options.disableGlob || !glob.hasMagic(p))
    return afterGlob(null, [p])

  options.lstat(p, (er, stat) => {
    if (!er)
      return afterGlob(null, [p])

    glob(p, options.glob, afterGlob)
  })

}

// Two possible strategies.
// 1. Assume it's a file.  unlink it, then do the dir stuff on EPERM or EISDIR
// 2. Assume it's a directory.  readdir, then do the file stuff on ENOTDIR
//
// Both result in an extra syscall when you guess wrong.  However, there
// are likely far more normal files in the world than directories.  This
// is based on the assumption that a the average number of files per
// directory is >= 1.
//
// If anyone ever complains about this, then I guess the strategy could
// be made configurable somehow.  But until then, YAGNI.
const rimraf_ = (p, options, cb) => {
  assert(p)
  assert(options)
  assert(typeof cb === 'function')

  // sunos lets the root user unlink directories, which is... weird.
  // so we have to lstat here and make sure it's not a dir.
  options.lstat(p, (er, st) => {
    if (er && er.code === "ENOENT")
      return cb(null)

    // Windows can EPERM on stat.  Life is suffering.
    if (er && er.code === "EPERM" && isWindows)
      fixWinEPERM(p, options, er, cb)

    if (st && st.isDirectory())
      return rmdir(p, options, er, cb)

    options.unlink(p, er => {
      if (er) {
        if (er.code === "ENOENT")
          return cb(null)
        if (er.code === "EPERM")
          return (isWindows)
            ? fixWinEPERM(p, options, er, cb)
            : rmdir(p, options, er, cb)
        if (er.code === "EISDIR")
          return rmdir(p, options, er, cb)
      }
      return cb(er)
    })
  })
}

const fixWinEPERM = (p, options, er, cb) => {
  assert(p)
  assert(options)
  assert(typeof cb === 'function')

  options.chmod(p, 0o666, er2 => {
    if (er2)
      cb(er2.code === "ENOENT" ? null : er)
    else
      options.stat(p, (er3, stats) => {
        if (er3)
          cb(er3.code === "ENOENT" ? null : er)
        else if (stats.isDirectory())
          rmdir(p, options, er, cb)
        else
          options.unlink(p, cb)
      })
  })
}

const fixWinEPERMSync = (p, options, er) => {
  assert(p)
  assert(options)

  try {
    options.chmodSync(p, 0o666)
  } catch (er2) {
    if (er2.code === "ENOENT")
      return
    else
      throw er
  }

  let stats
  try {
    stats = options.statSync(p)
  } catch (er3) {
    if (er3.code === "ENOENT")
      return
    else
      throw er
  }

  if (stats.isDirectory())
    rmdirSync(p, options, er)
  else
    options.unlinkSync(p)
}

const rmdir = (p, options, originalEr, cb) => {
  assert(p)
  assert(options)
  assert(typeof cb === 'function')

  // try to rmdir first, and only readdir on ENOTEMPTY or EEXIST (SunOS)
  // if we guessed wrong, and it's not a directory, then
  // raise the original error.
  options.rmdir(p, er => {
    if (er && (er.code === "ENOTEMPTY" || er.code === "EEXIST" || er.code === "EPERM"))
      rmkids(p, options, cb)
    else if (er && er.code === "ENOTDIR")
      cb(originalEr)
    else
      cb(er)
  })
}

const rmkids = (p, options, cb) => {
  assert(p)
  assert(options)
  assert(typeof cb === 'function')

  options.readdir(p, (er, files) => {
    if (er)
      return cb(er)
    let n = files.length
    if (n === 0)
      return options.rmdir(p, cb)
    let errState
    files.forEach(f => {
      rimraf(path.join(p, f), options, er => {
        if (errState)
          return
        if (er)
          return cb(errState = er)
        if (--n === 0)
          options.rmdir(p, cb)
      })
    })
  })
}

// this looks simpler, and is strictly *faster*, but will
// tie up the JavaScript thread and fail on excessively
// deep directory trees.
const rimrafSync = (p, options) => {
  options = options || {}
  defaults(options)

  assert(p, 'rimraf: missing path')
  assert.equal(typeof p, 'string', 'rimraf: path should be a string')
  assert(options, 'rimraf: missing options')
  assert.equal(typeof options, 'object', 'rimraf: options should be object')

  let results

  if (options.disableGlob || !glob.hasMagic(p)) {
    results = [p]
  } else {
    try {
      options.lstatSync(p)
      results = [p]
    } catch (er) {
      results = glob.sync(p, options.glob)
    }
  }

  if (!results.length)
    return

  for (let i = 0; i < results.length; i++) {
    const p = results[i]

    let st
    try {
      st = options.lstatSync(p)
    } catch (er) {
      if (er.code === "ENOENT")
        return

      // Windows can EPERM on stat.  Life is suffering.
      if (er.code === "EPERM" && isWindows)
        fixWinEPERMSync(p, options, er)
    }

    try {
      // sunos lets the root user unlink directories, which is... weird.
      if (st && st.isDirectory())
        rmdirSync(p, options, null)
      else
        options.unlinkSync(p)
    } catch (er) {
      if (er.code === "ENOENT")
        return
      if (er.code === "EPERM")
        return isWindows ? fixWinEPERMSync(p, options, er) : rmdirSync(p, options, er)
      if (er.code !== "EISDIR")
        throw er

      rmdirSync(p, options, er)
    }
  }
}

const rmdirSync = (p, options, originalEr) => {
  assert(p)
  assert(options)

  try {
    options.rmdirSync(p)
  } catch (er) {
    if (er.code === "ENOENT")
      return
    if (er.code === "ENOTDIR")
      throw originalEr
    if (er.code === "ENOTEMPTY" || er.code === "EEXIST" || er.code === "EPERM")
      rmkidsSync(p, options)
  }
}

const rmkidsSync = (p, options) => {
  assert(p)
  assert(options)
  options.readdirSync(p).forEach(f => rimrafSync(path.join(p, f), options))

  // We only end up here once we got ENOTEMPTY at least once, and
  // at this point, we are guaranteed to have removed all the kids.
  // So, we know that it won't be ENOENT or ENOTDIR or anything else.
  // try really hard to delete stuff on windows, because it has a
  // PROFOUNDLY annoying habit of not closing handles promptly when
  // files are deleted, resulting in spurious ENOTEMPTY errors.
  const retries = isWindows ? 100 : 1
  let i = 0
  do {
    let threw = true
    try {
      const ret = options.rmdirSync(p, options)
      threw = false
      return ret
    } finally {
      if (++i < retries && threw)
        continue
    }
  } while (true)
}

module.exports = rimraf
rimraf.sync = rimrafSync


/***/ }),

/***/ 2940:
/***/ ((module) => {

// Returns a wrapper function that returns a wrapped callback
// The wrapper function should do some stuff, and return a
// presumably different callback function.
// This makes sure that own properties are retained, so that
// decorations and such are not lost along the way.
module.exports = wrappy
function wrappy (fn, cb) {
  if (fn && cb) return wrappy(fn)(cb)

  if (typeof fn !== 'function')
    throw new TypeError('need wrapper function')

  Object.keys(fn).forEach(function (k) {
    wrapper[k] = fn[k]
  })

  return wrapper

  function wrapper() {
    var args = new Array(arguments.length)
    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i]
    }
    var ret = fn.apply(this, args)
    var cb = args[args.length-1]
    if (typeof ret === 'function' && ret !== cb) {
      Object.keys(cb).forEach(function (k) {
        ret[k] = cb[k]
      })
    }
    return ret
  }
}


/***/ }),

/***/ 1983:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


var PlainValue = __webpack_require__(5215);
var resolveSeq = __webpack_require__(6140);
var Schema = __webpack_require__(3656);

const defaultOptions = {
  anchorPrefix: 'a',
  customTags: null,
  indent: 2,
  indentSeq: true,
  keepCstNodes: false,
  keepNodeTypes: true,
  keepBlobsInJSON: true,
  mapAsMap: false,
  maxAliasCount: 100,
  prettyErrors: false,
  // TODO Set true in v2
  simpleKeys: false,
  version: '1.2'
};
const scalarOptions = {
  get binary() {
    return resolveSeq.binaryOptions;
  },

  set binary(opt) {
    Object.assign(resolveSeq.binaryOptions, opt);
  },

  get bool() {
    return resolveSeq.boolOptions;
  },

  set bool(opt) {
    Object.assign(resolveSeq.boolOptions, opt);
  },

  get int() {
    return resolveSeq.intOptions;
  },

  set int(opt) {
    Object.assign(resolveSeq.intOptions, opt);
  },

  get null() {
    return resolveSeq.nullOptions;
  },

  set null(opt) {
    Object.assign(resolveSeq.nullOptions, opt);
  },

  get str() {
    return resolveSeq.strOptions;
  },

  set str(opt) {
    Object.assign(resolveSeq.strOptions, opt);
  }

};
const documentOptions = {
  '1.0': {
    schema: 'yaml-1.1',
    merge: true,
    tagPrefixes: [{
      handle: '!',
      prefix: PlainValue.defaultTagPrefix
    }, {
      handle: '!!',
      prefix: 'tag:private.yaml.org,2002:'
    }]
  },
  '1.1': {
    schema: 'yaml-1.1',
    merge: true,
    tagPrefixes: [{
      handle: '!',
      prefix: '!'
    }, {
      handle: '!!',
      prefix: PlainValue.defaultTagPrefix
    }]
  },
  '1.2': {
    schema: 'core',
    merge: false,
    tagPrefixes: [{
      handle: '!',
      prefix: '!'
    }, {
      handle: '!!',
      prefix: PlainValue.defaultTagPrefix
    }]
  }
};

function stringifyTag(doc, tag) {
  if ((doc.version || doc.options.version) === '1.0') {
    const priv = tag.match(/^tag:private\.yaml\.org,2002:([^:/]+)$/);
    if (priv) return '!' + priv[1];
    const vocab = tag.match(/^tag:([a-zA-Z0-9-]+)\.yaml\.org,2002:(.*)/);
    return vocab ? `!${vocab[1]}/${vocab[2]}` : `!${tag.replace(/^tag:/, '')}`;
  }

  let p = doc.tagPrefixes.find(p => tag.indexOf(p.prefix) === 0);

  if (!p) {
    const dtp = doc.getDefaults().tagPrefixes;
    p = dtp && dtp.find(p => tag.indexOf(p.prefix) === 0);
  }

  if (!p) return tag[0] === '!' ? tag : `!<${tag}>`;
  const suffix = tag.substr(p.prefix.length).replace(/[!,[\]{}]/g, ch => ({
    '!': '%21',
    ',': '%2C',
    '[': '%5B',
    ']': '%5D',
    '{': '%7B',
    '}': '%7D'
  })[ch]);
  return p.handle + suffix;
}

function getTagObject(tags, item) {
  if (item instanceof resolveSeq.Alias) return resolveSeq.Alias;

  if (item.tag) {
    const match = tags.filter(t => t.tag === item.tag);
    if (match.length > 0) return match.find(t => t.format === item.format) || match[0];
  }

  let tagObj, obj;

  if (item instanceof resolveSeq.Scalar) {
    obj = item.value; // TODO: deprecate/remove class check

    const match = tags.filter(t => t.identify && t.identify(obj) || t.class && obj instanceof t.class);
    tagObj = match.find(t => t.format === item.format) || match.find(t => !t.format);
  } else {
    obj = item;
    tagObj = tags.find(t => t.nodeClass && obj instanceof t.nodeClass);
  }

  if (!tagObj) {
    const name = obj && obj.constructor ? obj.constructor.name : typeof obj;
    throw new Error(`Tag not resolved for ${name} value`);
  }

  return tagObj;
} // needs to be called before value stringifier to allow for circular anchor refs


function stringifyProps(node, tagObj, {
  anchors,
  doc
}) {
  const props = [];
  const anchor = doc.anchors.getName(node);

  if (anchor) {
    anchors[anchor] = node;
    props.push(`&${anchor}`);
  }

  if (node.tag) {
    props.push(stringifyTag(doc, node.tag));
  } else if (!tagObj.default) {
    props.push(stringifyTag(doc, tagObj.tag));
  }

  return props.join(' ');
}

function stringify(item, ctx, onComment, onChompKeep) {
  const {
    anchors,
    schema
  } = ctx.doc;
  let tagObj;

  if (!(item instanceof resolveSeq.Node)) {
    const createCtx = {
      aliasNodes: [],
      onTagObj: o => tagObj = o,
      prevObjects: new Map()
    };
    item = schema.createNode(item, true, null, createCtx);

    for (const alias of createCtx.aliasNodes) {
      alias.source = alias.source.node;
      let name = anchors.getName(alias.source);

      if (!name) {
        name = anchors.newName();
        anchors.map[name] = alias.source;
      }
    }
  }

  if (item instanceof resolveSeq.Pair) return item.toString(ctx, onComment, onChompKeep);
  if (!tagObj) tagObj = getTagObject(schema.tags, item);
  const props = stringifyProps(item, tagObj, ctx);
  if (props.length > 0) ctx.indentAtStart = (ctx.indentAtStart || 0) + props.length + 1;
  const str = typeof tagObj.stringify === 'function' ? tagObj.stringify(item, ctx, onComment, onChompKeep) : item instanceof resolveSeq.Scalar ? resolveSeq.stringifyString(item, ctx, onComment, onChompKeep) : item.toString(ctx, onComment, onChompKeep);
  if (!props) return str;
  return item instanceof resolveSeq.Scalar || str[0] === '{' || str[0] === '[' ? `${props} ${str}` : `${props}\n${ctx.indent}${str}`;
}

class Anchors {
  static validAnchorNode(node) {
    return node instanceof resolveSeq.Scalar || node instanceof resolveSeq.YAMLSeq || node instanceof resolveSeq.YAMLMap;
  }

  constructor(prefix) {
    PlainValue._defineProperty(this, "map", {});

    this.prefix = prefix;
  }

  createAlias(node, name) {
    this.setAnchor(node, name);
    return new resolveSeq.Alias(node);
  }

  createMergePair(...sources) {
    const merge = new resolveSeq.Merge();
    merge.value.items = sources.map(s => {
      if (s instanceof resolveSeq.Alias) {
        if (s.source instanceof resolveSeq.YAMLMap) return s;
      } else if (s instanceof resolveSeq.YAMLMap) {
        return this.createAlias(s);
      }

      throw new Error('Merge sources must be Map nodes or their Aliases');
    });
    return merge;
  }

  getName(node) {
    const {
      map
    } = this;
    return Object.keys(map).find(a => map[a] === node);
  }

  getNames() {
    return Object.keys(this.map);
  }

  getNode(name) {
    return this.map[name];
  }

  newName(prefix) {
    if (!prefix) prefix = this.prefix;
    const names = Object.keys(this.map);

    for (let i = 1; true; ++i) {
      const name = `${prefix}${i}`;
      if (!names.includes(name)) return name;
    }
  } // During parsing, map & aliases contain CST nodes


  resolveNodes() {
    const {
      map,
      _cstAliases
    } = this;
    Object.keys(map).forEach(a => {
      map[a] = map[a].resolved;
    });

    _cstAliases.forEach(a => {
      a.source = a.source.resolved;
    });

    delete this._cstAliases;
  }

  setAnchor(node, name) {
    if (node != null && !Anchors.validAnchorNode(node)) {
      throw new Error('Anchors may only be set for Scalar, Seq and Map nodes');
    }

    if (name && /[\x00-\x19\s,[\]{}]/.test(name)) {
      throw new Error('Anchor names must not contain whitespace or control characters');
    }

    const {
      map
    } = this;
    const prev = node && Object.keys(map).find(a => map[a] === node);

    if (prev) {
      if (!name) {
        return prev;
      } else if (prev !== name) {
        delete map[prev];
        map[name] = node;
      }
    } else {
      if (!name) {
        if (!node) return null;
        name = this.newName();
      }

      map[name] = node;
    }

    return name;
  }

}

const visit = (node, tags) => {
  if (node && typeof node === 'object') {
    const {
      tag
    } = node;

    if (node instanceof resolveSeq.Collection) {
      if (tag) tags[tag] = true;
      node.items.forEach(n => visit(n, tags));
    } else if (node instanceof resolveSeq.Pair) {
      visit(node.key, tags);
      visit(node.value, tags);
    } else if (node instanceof resolveSeq.Scalar) {
      if (tag) tags[tag] = true;
    }
  }

  return tags;
};

const listTagNames = node => Object.keys(visit(node, {}));

function parseContents(doc, contents) {
  const comments = {
    before: [],
    after: []
  };
  let body = undefined;
  let spaceBefore = false;

  for (const node of contents) {
    if (node.valueRange) {
      if (body !== undefined) {
        const msg = 'Document contains trailing content not separated by a ... or --- line';
        doc.errors.push(new PlainValue.YAMLSyntaxError(node, msg));
        break;
      }

      const res = resolveSeq.resolveNode(doc, node);

      if (spaceBefore) {
        res.spaceBefore = true;
        spaceBefore = false;
      }

      body = res;
    } else if (node.comment !== null) {
      const cc = body === undefined ? comments.before : comments.after;
      cc.push(node.comment);
    } else if (node.type === PlainValue.Type.BLANK_LINE) {
      spaceBefore = true;

      if (body === undefined && comments.before.length > 0 && !doc.commentBefore) {
        // space-separated comments at start are parsed as document comments
        doc.commentBefore = comments.before.join('\n');
        comments.before = [];
      }
    }
  }

  doc.contents = body || null;

  if (!body) {
    doc.comment = comments.before.concat(comments.after).join('\n') || null;
  } else {
    const cb = comments.before.join('\n');

    if (cb) {
      const cbNode = body instanceof resolveSeq.Collection && body.items[0] ? body.items[0] : body;
      cbNode.commentBefore = cbNode.commentBefore ? `${cb}\n${cbNode.commentBefore}` : cb;
    }

    doc.comment = comments.after.join('\n') || null;
  }
}

function resolveTagDirective({
  tagPrefixes
}, directive) {
  const [handle, prefix] = directive.parameters;

  if (!handle || !prefix) {
    const msg = 'Insufficient parameters given for %TAG directive';
    throw new PlainValue.YAMLSemanticError(directive, msg);
  }

  if (tagPrefixes.some(p => p.handle === handle)) {
    const msg = 'The %TAG directive must only be given at most once per handle in the same document.';
    throw new PlainValue.YAMLSemanticError(directive, msg);
  }

  return {
    handle,
    prefix
  };
}

function resolveYamlDirective(doc, directive) {
  let [version] = directive.parameters;
  if (directive.name === 'YAML:1.0') version = '1.0';

  if (!version) {
    const msg = 'Insufficient parameters given for %YAML directive';
    throw new PlainValue.YAMLSemanticError(directive, msg);
  }

  if (!documentOptions[version]) {
    const v0 = doc.version || doc.options.version;
    const msg = `Document will be parsed as YAML ${v0} rather than YAML ${version}`;
    doc.warnings.push(new PlainValue.YAMLWarning(directive, msg));
  }

  return version;
}

function parseDirectives(doc, directives, prevDoc) {
  const directiveComments = [];
  let hasDirectives = false;

  for (const directive of directives) {
    const {
      comment,
      name
    } = directive;

    switch (name) {
      case 'TAG':
        try {
          doc.tagPrefixes.push(resolveTagDirective(doc, directive));
        } catch (error) {
          doc.errors.push(error);
        }

        hasDirectives = true;
        break;

      case 'YAML':
      case 'YAML:1.0':
        if (doc.version) {
          const msg = 'The %YAML directive must only be given at most once per document.';
          doc.errors.push(new PlainValue.YAMLSemanticError(directive, msg));
        }

        try {
          doc.version = resolveYamlDirective(doc, directive);
        } catch (error) {
          doc.errors.push(error);
        }

        hasDirectives = true;
        break;

      default:
        if (name) {
          const msg = `YAML only supports %TAG and %YAML directives, and not %${name}`;
          doc.warnings.push(new PlainValue.YAMLWarning(directive, msg));
        }

    }

    if (comment) directiveComments.push(comment);
  }

  if (prevDoc && !hasDirectives && '1.1' === (doc.version || prevDoc.version || doc.options.version)) {
    const copyTagPrefix = ({
      handle,
      prefix
    }) => ({
      handle,
      prefix
    });

    doc.tagPrefixes = prevDoc.tagPrefixes.map(copyTagPrefix);
    doc.version = prevDoc.version;
  }

  doc.commentBefore = directiveComments.join('\n') || null;
}

function assertCollection(contents) {
  if (contents instanceof resolveSeq.Collection) return true;
  throw new Error('Expected a YAML collection as document contents');
}

class Document {
  constructor(options) {
    this.anchors = new Anchors(options.anchorPrefix);
    this.commentBefore = null;
    this.comment = null;
    this.contents = null;
    this.directivesEndMarker = null;
    this.errors = [];
    this.options = options;
    this.schema = null;
    this.tagPrefixes = [];
    this.version = null;
    this.warnings = [];
  }

  add(value) {
    assertCollection(this.contents);
    return this.contents.add(value);
  }

  addIn(path, value) {
    assertCollection(this.contents);
    this.contents.addIn(path, value);
  }

  delete(key) {
    assertCollection(this.contents);
    return this.contents.delete(key);
  }

  deleteIn(path) {
    if (resolveSeq.isEmptyPath(path)) {
      if (this.contents == null) return false;
      this.contents = null;
      return true;
    }

    assertCollection(this.contents);
    return this.contents.deleteIn(path);
  }

  getDefaults() {
    return Document.defaults[this.version] || Document.defaults[this.options.version] || {};
  }

  get(key, keepScalar) {
    return this.contents instanceof resolveSeq.Collection ? this.contents.get(key, keepScalar) : undefined;
  }

  getIn(path, keepScalar) {
    if (resolveSeq.isEmptyPath(path)) return !keepScalar && this.contents instanceof resolveSeq.Scalar ? this.contents.value : this.contents;
    return this.contents instanceof resolveSeq.Collection ? this.contents.getIn(path, keepScalar) : undefined;
  }

  has(key) {
    return this.contents instanceof resolveSeq.Collection ? this.contents.has(key) : false;
  }

  hasIn(path) {
    if (resolveSeq.isEmptyPath(path)) return this.contents !== undefined;
    return this.contents instanceof resolveSeq.Collection ? this.contents.hasIn(path) : false;
  }

  set(key, value) {
    assertCollection(this.contents);
    this.contents.set(key, value);
  }

  setIn(path, value) {
    if (resolveSeq.isEmptyPath(path)) this.contents = value;else {
      assertCollection(this.contents);
      this.contents.setIn(path, value);
    }
  }

  setSchema(id, customTags) {
    if (!id && !customTags && this.schema) return;
    if (typeof id === 'number') id = id.toFixed(1);

    if (id === '1.0' || id === '1.1' || id === '1.2') {
      if (this.version) this.version = id;else this.options.version = id;
      delete this.options.schema;
    } else if (id && typeof id === 'string') {
      this.options.schema = id;
    }

    if (Array.isArray(customTags)) this.options.customTags = customTags;
    const opt = Object.assign({}, this.getDefaults(), this.options);
    this.schema = new Schema.Schema(opt);
  }

  parse(node, prevDoc) {
    if (this.options.keepCstNodes) this.cstNode = node;
    if (this.options.keepNodeTypes) this.type = 'DOCUMENT';
    const {
      directives = [],
      contents = [],
      directivesEndMarker,
      error,
      valueRange
    } = node;

    if (error) {
      if (!error.source) error.source = this;
      this.errors.push(error);
    }

    parseDirectives(this, directives, prevDoc);
    if (directivesEndMarker) this.directivesEndMarker = true;
    this.range = valueRange ? [valueRange.start, valueRange.end] : null;
    this.setSchema();
    this.anchors._cstAliases = [];
    parseContents(this, contents);
    this.anchors.resolveNodes();

    if (this.options.prettyErrors) {
      for (const error of this.errors) if (error instanceof PlainValue.YAMLError) error.makePretty();

      for (const warn of this.warnings) if (warn instanceof PlainValue.YAMLError) warn.makePretty();
    }

    return this;
  }

  listNonDefaultTags() {
    return listTagNames(this.contents).filter(t => t.indexOf(Schema.Schema.defaultPrefix) !== 0);
  }

  setTagPrefix(handle, prefix) {
    if (handle[0] !== '!' || handle[handle.length - 1] !== '!') throw new Error('Handle must start and end with !');

    if (prefix) {
      const prev = this.tagPrefixes.find(p => p.handle === handle);
      if (prev) prev.prefix = prefix;else this.tagPrefixes.push({
        handle,
        prefix
      });
    } else {
      this.tagPrefixes = this.tagPrefixes.filter(p => p.handle !== handle);
    }
  }

  toJSON(arg, onAnchor) {
    const {
      keepBlobsInJSON,
      mapAsMap,
      maxAliasCount
    } = this.options;
    const keep = keepBlobsInJSON && (typeof arg !== 'string' || !(this.contents instanceof resolveSeq.Scalar));
    const ctx = {
      doc: this,
      indentStep: '  ',
      keep,
      mapAsMap: keep && !!mapAsMap,
      maxAliasCount,
      stringify // Requiring directly in Pair would create circular dependencies

    };
    const anchorNames = Object.keys(this.anchors.map);
    if (anchorNames.length > 0) ctx.anchors = new Map(anchorNames.map(name => [this.anchors.map[name], {
      alias: [],
      aliasCount: 0,
      count: 1
    }]));
    const res = resolveSeq.toJSON(this.contents, arg, ctx);
    if (typeof onAnchor === 'function' && ctx.anchors) for (const {
      count,
      res
    } of ctx.anchors.values()) onAnchor(res, count);
    return res;
  }

  toString() {
    if (this.errors.length > 0) throw new Error('Document with errors cannot be stringified');
    const indentSize = this.options.indent;

    if (!Number.isInteger(indentSize) || indentSize <= 0) {
      const s = JSON.stringify(indentSize);
      throw new Error(`"indent" option must be a positive integer, not ${s}`);
    }

    this.setSchema();
    const lines = [];
    let hasDirectives = false;

    if (this.version) {
      let vd = '%YAML 1.2';

      if (this.schema.name === 'yaml-1.1') {
        if (this.version === '1.0') vd = '%YAML:1.0';else if (this.version === '1.1') vd = '%YAML 1.1';
      }

      lines.push(vd);
      hasDirectives = true;
    }

    const tagNames = this.listNonDefaultTags();
    this.tagPrefixes.forEach(({
      handle,
      prefix
    }) => {
      if (tagNames.some(t => t.indexOf(prefix) === 0)) {
        lines.push(`%TAG ${handle} ${prefix}`);
        hasDirectives = true;
      }
    });
    if (hasDirectives || this.directivesEndMarker) lines.push('---');

    if (this.commentBefore) {
      if (hasDirectives || !this.directivesEndMarker) lines.unshift('');
      lines.unshift(this.commentBefore.replace(/^/gm, '#'));
    }

    const ctx = {
      anchors: {},
      doc: this,
      indent: '',
      indentStep: ' '.repeat(indentSize),
      stringify // Requiring directly in nodes would create circular dependencies

    };
    let chompKeep = false;
    let contentComment = null;

    if (this.contents) {
      if (this.contents instanceof resolveSeq.Node) {
        if (this.contents.spaceBefore && (hasDirectives || this.directivesEndMarker)) lines.push('');
        if (this.contents.commentBefore) lines.push(this.contents.commentBefore.replace(/^/gm, '#')); // top-level block scalars need to be indented if followed by a comment

        ctx.forceBlockIndent = !!this.comment;
        contentComment = this.contents.comment;
      }

      const onChompKeep = contentComment ? null : () => chompKeep = true;
      const body = stringify(this.contents, ctx, () => contentComment = null, onChompKeep);
      lines.push(resolveSeq.addComment(body, '', contentComment));
    } else if (this.contents !== undefined) {
      lines.push(stringify(this.contents, ctx));
    }

    if (this.comment) {
      if ((!chompKeep || contentComment) && lines[lines.length - 1] !== '') lines.push('');
      lines.push(this.comment.replace(/^/gm, '#'));
    }

    return lines.join('\n') + '\n';
  }

}

PlainValue._defineProperty(Document, "defaults", documentOptions);

exports.Document = Document;
exports.defaultOptions = defaultOptions;
exports.scalarOptions = scalarOptions;


/***/ }),

/***/ 5215:
/***/ ((__unused_webpack_module, exports) => {

"use strict";


const Char = {
  ANCHOR: '&',
  COMMENT: '#',
  TAG: '!',
  DIRECTIVES_END: '-',
  DOCUMENT_END: '.'
};
const Type = {
  ALIAS: 'ALIAS',
  BLANK_LINE: 'BLANK_LINE',
  BLOCK_FOLDED: 'BLOCK_FOLDED',
  BLOCK_LITERAL: 'BLOCK_LITERAL',
  COMMENT: 'COMMENT',
  DIRECTIVE: 'DIRECTIVE',
  DOCUMENT: 'DOCUMENT',
  FLOW_MAP: 'FLOW_MAP',
  FLOW_SEQ: 'FLOW_SEQ',
  MAP: 'MAP',
  MAP_KEY: 'MAP_KEY',
  MAP_VALUE: 'MAP_VALUE',
  PLAIN: 'PLAIN',
  QUOTE_DOUBLE: 'QUOTE_DOUBLE',
  QUOTE_SINGLE: 'QUOTE_SINGLE',
  SEQ: 'SEQ',
  SEQ_ITEM: 'SEQ_ITEM'
};
const defaultTagPrefix = 'tag:yaml.org,2002:';
const defaultTags = {
  MAP: 'tag:yaml.org,2002:map',
  SEQ: 'tag:yaml.org,2002:seq',
  STR: 'tag:yaml.org,2002:str'
};

function findLineStarts(src) {
  const ls = [0];
  let offset = src.indexOf('\n');

  while (offset !== -1) {
    offset += 1;
    ls.push(offset);
    offset = src.indexOf('\n', offset);
  }

  return ls;
}

function getSrcInfo(cst) {
  let lineStarts, src;

  if (typeof cst === 'string') {
    lineStarts = findLineStarts(cst);
    src = cst;
  } else {
    if (Array.isArray(cst)) cst = cst[0];

    if (cst && cst.context) {
      if (!cst.lineStarts) cst.lineStarts = findLineStarts(cst.context.src);
      lineStarts = cst.lineStarts;
      src = cst.context.src;
    }
  }

  return {
    lineStarts,
    src
  };
}
/**
 * @typedef {Object} LinePos - One-indexed position in the source
 * @property {number} line
 * @property {number} col
 */

/**
 * Determine the line/col position matching a character offset.
 *
 * Accepts a source string or a CST document as the second parameter. With
 * the latter, starting indices for lines are cached in the document as
 * `lineStarts: number[]`.
 *
 * Returns a one-indexed `{ line, col }` location if found, or
 * `undefined` otherwise.
 *
 * @param {number} offset
 * @param {string|Document|Document[]} cst
 * @returns {?LinePos}
 */


function getLinePos(offset, cst) {
  if (typeof offset !== 'number' || offset < 0) return null;
  const {
    lineStarts,
    src
  } = getSrcInfo(cst);
  if (!lineStarts || !src || offset > src.length) return null;

  for (let i = 0; i < lineStarts.length; ++i) {
    const start = lineStarts[i];

    if (offset < start) {
      return {
        line: i,
        col: offset - lineStarts[i - 1] + 1
      };
    }

    if (offset === start) return {
      line: i + 1,
      col: 1
    };
  }

  const line = lineStarts.length;
  return {
    line,
    col: offset - lineStarts[line - 1] + 1
  };
}
/**
 * Get a specified line from the source.
 *
 * Accepts a source string or a CST document as the second parameter. With
 * the latter, starting indices for lines are cached in the document as
 * `lineStarts: number[]`.
 *
 * Returns the line as a string if found, or `null` otherwise.
 *
 * @param {number} line One-indexed line number
 * @param {string|Document|Document[]} cst
 * @returns {?string}
 */

function getLine(line, cst) {
  const {
    lineStarts,
    src
  } = getSrcInfo(cst);
  if (!lineStarts || !(line >= 1) || line > lineStarts.length) return null;
  const start = lineStarts[line - 1];
  let end = lineStarts[line]; // undefined for last line; that's ok for slice()

  while (end && end > start && src[end - 1] === '\n') --end;

  return src.slice(start, end);
}
/**
 * Pretty-print the starting line from the source indicated by the range `pos`
 *
 * Trims output to `maxWidth` chars while keeping the starting column visible,
 * using `…` at either end to indicate dropped characters.
 *
 * Returns a two-line string (or `null`) with `\n` as separator; the second line
 * will hold appropriately indented `^` marks indicating the column range.
 *
 * @param {Object} pos
 * @param {LinePos} pos.start
 * @param {LinePos} [pos.end]
 * @param {string|Document|Document[]*} cst
 * @param {number} [maxWidth=80]
 * @returns {?string}
 */

function getPrettyContext({
  start,
  end
}, cst, maxWidth = 80) {
  let src = getLine(start.line, cst);
  if (!src) return null;
  let {
    col
  } = start;

  if (src.length > maxWidth) {
    if (col <= maxWidth - 10) {
      src = src.substr(0, maxWidth - 1) + '…';
    } else {
      const halfWidth = Math.round(maxWidth / 2);
      if (src.length > col + halfWidth) src = src.substr(0, col + halfWidth - 1) + '…';
      col -= src.length - maxWidth;
      src = '…' + src.substr(1 - maxWidth);
    }
  }

  let errLen = 1;
  let errEnd = '';

  if (end) {
    if (end.line === start.line && col + (end.col - start.col) <= maxWidth + 1) {
      errLen = end.col - start.col;
    } else {
      errLen = Math.min(src.length + 1, maxWidth) - col;
      errEnd = '…';
    }
  }

  const offset = col > 1 ? ' '.repeat(col - 1) : '';
  const err = '^'.repeat(errLen);
  return `${src}\n${offset}${err}${errEnd}`;
}

class Range {
  static copy(orig) {
    return new Range(orig.start, orig.end);
  }

  constructor(start, end) {
    this.start = start;
    this.end = end || start;
  }

  isEmpty() {
    return typeof this.start !== 'number' || !this.end || this.end <= this.start;
  }
  /**
   * Set `origStart` and `origEnd` to point to the original source range for
   * this node, which may differ due to dropped CR characters.
   *
   * @param {number[]} cr - Positions of dropped CR characters
   * @param {number} offset - Starting index of `cr` from the last call
   * @returns {number} - The next offset, matching the one found for `origStart`
   */


  setOrigRange(cr, offset) {
    const {
      start,
      end
    } = this;

    if (cr.length === 0 || end <= cr[0]) {
      this.origStart = start;
      this.origEnd = end;
      return offset;
    }

    let i = offset;

    while (i < cr.length) {
      if (cr[i] > start) break;else ++i;
    }

    this.origStart = start + i;
    const nextOffset = i;

    while (i < cr.length) {
      // if end was at \n, it should now be at \r
      if (cr[i] >= end) break;else ++i;
    }

    this.origEnd = end + i;
    return nextOffset;
  }

}

/** Root class of all nodes */

class Node {
  static addStringTerminator(src, offset, str) {
    if (str[str.length - 1] === '\n') return str;
    const next = Node.endOfWhiteSpace(src, offset);
    return next >= src.length || src[next] === '\n' ? str + '\n' : str;
  } // ^(---|...)


  static atDocumentBoundary(src, offset, sep) {
    const ch0 = src[offset];
    if (!ch0) return true;
    const prev = src[offset - 1];
    if (prev && prev !== '\n') return false;

    if (sep) {
      if (ch0 !== sep) return false;
    } else {
      if (ch0 !== Char.DIRECTIVES_END && ch0 !== Char.DOCUMENT_END) return false;
    }

    const ch1 = src[offset + 1];
    const ch2 = src[offset + 2];
    if (ch1 !== ch0 || ch2 !== ch0) return false;
    const ch3 = src[offset + 3];
    return !ch3 || ch3 === '\n' || ch3 === '\t' || ch3 === ' ';
  }

  static endOfIdentifier(src, offset) {
    let ch = src[offset];
    const isVerbatim = ch === '<';
    const notOk = isVerbatim ? ['\n', '\t', ' ', '>'] : ['\n', '\t', ' ', '[', ']', '{', '}', ','];

    while (ch && notOk.indexOf(ch) === -1) ch = src[offset += 1];

    if (isVerbatim && ch === '>') offset += 1;
    return offset;
  }

  static endOfIndent(src, offset) {
    let ch = src[offset];

    while (ch === ' ') ch = src[offset += 1];

    return offset;
  }

  static endOfLine(src, offset) {
    let ch = src[offset];

    while (ch && ch !== '\n') ch = src[offset += 1];

    return offset;
  }

  static endOfWhiteSpace(src, offset) {
    let ch = src[offset];

    while (ch === '\t' || ch === ' ') ch = src[offset += 1];

    return offset;
  }

  static startOfLine(src, offset) {
    let ch = src[offset - 1];
    if (ch === '\n') return offset;

    while (ch && ch !== '\n') ch = src[offset -= 1];

    return offset + 1;
  }
  /**
   * End of indentation, or null if the line's indent level is not more
   * than `indent`
   *
   * @param {string} src
   * @param {number} indent
   * @param {number} lineStart
   * @returns {?number}
   */


  static endOfBlockIndent(src, indent, lineStart) {
    const inEnd = Node.endOfIndent(src, lineStart);

    if (inEnd > lineStart + indent) {
      return inEnd;
    } else {
      const wsEnd = Node.endOfWhiteSpace(src, inEnd);
      const ch = src[wsEnd];
      if (!ch || ch === '\n') return wsEnd;
    }

    return null;
  }

  static atBlank(src, offset, endAsBlank) {
    const ch = src[offset];
    return ch === '\n' || ch === '\t' || ch === ' ' || endAsBlank && !ch;
  }

  static nextNodeIsIndented(ch, indentDiff, indicatorAsIndent) {
    if (!ch || indentDiff < 0) return false;
    if (indentDiff > 0) return true;
    return indicatorAsIndent && ch === '-';
  } // should be at line or string end, or at next non-whitespace char


  static normalizeOffset(src, offset) {
    const ch = src[offset];
    return !ch ? offset : ch !== '\n' && src[offset - 1] === '\n' ? offset - 1 : Node.endOfWhiteSpace(src, offset);
  } // fold single newline into space, multiple newlines to N - 1 newlines
  // presumes src[offset] === '\n'


  static foldNewline(src, offset, indent) {
    let inCount = 0;
    let error = false;
    let fold = '';
    let ch = src[offset + 1];

    while (ch === ' ' || ch === '\t' || ch === '\n') {
      switch (ch) {
        case '\n':
          inCount = 0;
          offset += 1;
          fold += '\n';
          break;

        case '\t':
          if (inCount <= indent) error = true;
          offset = Node.endOfWhiteSpace(src, offset + 2) - 1;
          break;

        case ' ':
          inCount += 1;
          offset += 1;
          break;
      }

      ch = src[offset + 1];
    }

    if (!fold) fold = ' ';
    if (ch && inCount <= indent) error = true;
    return {
      fold,
      offset,
      error
    };
  }

  constructor(type, props, context) {
    Object.defineProperty(this, 'context', {
      value: context || null,
      writable: true
    });
    this.error = null;
    this.range = null;
    this.valueRange = null;
    this.props = props || [];
    this.type = type;
    this.value = null;
  }

  getPropValue(idx, key, skipKey) {
    if (!this.context) return null;
    const {
      src
    } = this.context;
    const prop = this.props[idx];
    return prop && src[prop.start] === key ? src.slice(prop.start + (skipKey ? 1 : 0), prop.end) : null;
  }

  get anchor() {
    for (let i = 0; i < this.props.length; ++i) {
      const anchor = this.getPropValue(i, Char.ANCHOR, true);
      if (anchor != null) return anchor;
    }

    return null;
  }

  get comment() {
    const comments = [];

    for (let i = 0; i < this.props.length; ++i) {
      const comment = this.getPropValue(i, Char.COMMENT, true);
      if (comment != null) comments.push(comment);
    }

    return comments.length > 0 ? comments.join('\n') : null;
  }

  commentHasRequiredWhitespace(start) {
    const {
      src
    } = this.context;
    if (this.header && start === this.header.end) return false;
    if (!this.valueRange) return false;
    const {
      end
    } = this.valueRange;
    return start !== end || Node.atBlank(src, end - 1);
  }

  get hasComment() {
    if (this.context) {
      const {
        src
      } = this.context;

      for (let i = 0; i < this.props.length; ++i) {
        if (src[this.props[i].start] === Char.COMMENT) return true;
      }
    }

    return false;
  }

  get hasProps() {
    if (this.context) {
      const {
        src
      } = this.context;

      for (let i = 0; i < this.props.length; ++i) {
        if (src[this.props[i].start] !== Char.COMMENT) return true;
      }
    }

    return false;
  }

  get includesTrailingLines() {
    return false;
  }

  get jsonLike() {
    const jsonLikeTypes = [Type.FLOW_MAP, Type.FLOW_SEQ, Type.QUOTE_DOUBLE, Type.QUOTE_SINGLE];
    return jsonLikeTypes.indexOf(this.type) !== -1;
  }

  get rangeAsLinePos() {
    if (!this.range || !this.context) return undefined;
    const start = getLinePos(this.range.start, this.context.root);
    if (!start) return undefined;
    const end = getLinePos(this.range.end, this.context.root);
    return {
      start,
      end
    };
  }

  get rawValue() {
    if (!this.valueRange || !this.context) return null;
    const {
      start,
      end
    } = this.valueRange;
    return this.context.src.slice(start, end);
  }

  get tag() {
    for (let i = 0; i < this.props.length; ++i) {
      const tag = this.getPropValue(i, Char.TAG, false);

      if (tag != null) {
        if (tag[1] === '<') {
          return {
            verbatim: tag.slice(2, -1)
          };
        } else {
          // eslint-disable-next-line no-unused-vars
          const [_, handle, suffix] = tag.match(/^(.*!)([^!]*)$/);
          return {
            handle,
            suffix
          };
        }
      }
    }

    return null;
  }

  get valueRangeContainsNewline() {
    if (!this.valueRange || !this.context) return false;
    const {
      start,
      end
    } = this.valueRange;
    const {
      src
    } = this.context;

    for (let i = start; i < end; ++i) {
      if (src[i] === '\n') return true;
    }

    return false;
  }

  parseComment(start) {
    const {
      src
    } = this.context;

    if (src[start] === Char.COMMENT) {
      const end = Node.endOfLine(src, start + 1);
      const commentRange = new Range(start, end);
      this.props.push(commentRange);
      return end;
    }

    return start;
  }
  /**
   * Populates the `origStart` and `origEnd` values of all ranges for this
   * node. Extended by child classes to handle descendant nodes.
   *
   * @param {number[]} cr - Positions of dropped CR characters
   * @param {number} offset - Starting index of `cr` from the last call
   * @returns {number} - The next offset, matching the one found for `origStart`
   */


  setOrigRanges(cr, offset) {
    if (this.range) offset = this.range.setOrigRange(cr, offset);
    if (this.valueRange) this.valueRange.setOrigRange(cr, offset);
    this.props.forEach(prop => prop.setOrigRange(cr, offset));
    return offset;
  }

  toString() {
    const {
      context: {
        src
      },
      range,
      value
    } = this;
    if (value != null) return value;
    const str = src.slice(range.start, range.end);
    return Node.addStringTerminator(src, range.end, str);
  }

}

class YAMLError extends Error {
  constructor(name, source, message) {
    if (!message || !(source instanceof Node)) throw new Error(`Invalid arguments for new ${name}`);
    super();
    this.name = name;
    this.message = message;
    this.source = source;
  }

  makePretty() {
    if (!this.source) return;
    this.nodeType = this.source.type;
    const cst = this.source.context && this.source.context.root;

    if (typeof this.offset === 'number') {
      this.range = new Range(this.offset, this.offset + 1);
      const start = cst && getLinePos(this.offset, cst);

      if (start) {
        const end = {
          line: start.line,
          col: start.col + 1
        };
        this.linePos = {
          start,
          end
        };
      }

      delete this.offset;
    } else {
      this.range = this.source.range;
      this.linePos = this.source.rangeAsLinePos;
    }

    if (this.linePos) {
      const {
        line,
        col
      } = this.linePos.start;
      this.message += ` at line ${line}, column ${col}`;
      const ctx = cst && getPrettyContext(this.linePos, cst);
      if (ctx) this.message += `:\n\n${ctx}\n`;
    }

    delete this.source;
  }

}
class YAMLReferenceError extends YAMLError {
  constructor(source, message) {
    super('YAMLReferenceError', source, message);
  }

}
class YAMLSemanticError extends YAMLError {
  constructor(source, message) {
    super('YAMLSemanticError', source, message);
  }

}
class YAMLSyntaxError extends YAMLError {
  constructor(source, message) {
    super('YAMLSyntaxError', source, message);
  }

}
class YAMLWarning extends YAMLError {
  constructor(source, message) {
    super('YAMLWarning', source, message);
  }

}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

class PlainValue extends Node {
  static endOfLine(src, start, inFlow) {
    let ch = src[start];
    let offset = start;

    while (ch && ch !== '\n') {
      if (inFlow && (ch === '[' || ch === ']' || ch === '{' || ch === '}' || ch === ',')) break;
      const next = src[offset + 1];
      if (ch === ':' && (!next || next === '\n' || next === '\t' || next === ' ' || inFlow && next === ',')) break;
      if ((ch === ' ' || ch === '\t') && next === '#') break;
      offset += 1;
      ch = next;
    }

    return offset;
  }

  get strValue() {
    if (!this.valueRange || !this.context) return null;
    let {
      start,
      end
    } = this.valueRange;
    const {
      src
    } = this.context;
    let ch = src[end - 1];

    while (start < end && (ch === '\n' || ch === '\t' || ch === ' ')) ch = src[--end - 1];

    let str = '';

    for (let i = start; i < end; ++i) {
      const ch = src[i];

      if (ch === '\n') {
        const {
          fold,
          offset
        } = Node.foldNewline(src, i, -1);
        str += fold;
        i = offset;
      } else if (ch === ' ' || ch === '\t') {
        // trim trailing whitespace
        const wsStart = i;
        let next = src[i + 1];

        while (i < end && (next === ' ' || next === '\t')) {
          i += 1;
          next = src[i + 1];
        }

        if (next !== '\n') str += i > wsStart ? src.slice(wsStart, i + 1) : ch;
      } else {
        str += ch;
      }
    }

    const ch0 = src[start];

    switch (ch0) {
      case '\t':
        {
          const msg = 'Plain value cannot start with a tab character';
          const errors = [new YAMLSemanticError(this, msg)];
          return {
            errors,
            str
          };
        }

      case '@':
      case '`':
        {
          const msg = `Plain value cannot start with reserved character ${ch0}`;
          const errors = [new YAMLSemanticError(this, msg)];
          return {
            errors,
            str
          };
        }

      default:
        return str;
    }
  }

  parseBlockValue(start) {
    const {
      indent,
      inFlow,
      src
    } = this.context;
    let offset = start;
    let valueEnd = start;

    for (let ch = src[offset]; ch === '\n'; ch = src[offset]) {
      if (Node.atDocumentBoundary(src, offset + 1)) break;
      const end = Node.endOfBlockIndent(src, indent, offset + 1);
      if (end === null || src[end] === '#') break;

      if (src[end] === '\n') {
        offset = end;
      } else {
        valueEnd = PlainValue.endOfLine(src, end, inFlow);
        offset = valueEnd;
      }
    }

    if (this.valueRange.isEmpty()) this.valueRange.start = start;
    this.valueRange.end = valueEnd;
    return valueEnd;
  }
  /**
   * Parses a plain value from the source
   *
   * Accepted forms are:
   * ```
   * #comment
   *
   * first line
   *
   * first line #comment
   *
   * first line
   * block
   * lines
   *
   * #comment
   * block
   * lines
   * ```
   * where block lines are empty or have an indent level greater than `indent`.
   *
   * @param {ParseContext} context
   * @param {number} start - Index of first character
   * @returns {number} - Index of the character after this scalar, may be `\n`
   */


  parse(context, start) {
    this.context = context;
    const {
      inFlow,
      src
    } = context;
    let offset = start;
    const ch = src[offset];

    if (ch && ch !== '#' && ch !== '\n') {
      offset = PlainValue.endOfLine(src, start, inFlow);
    }

    this.valueRange = new Range(start, offset);
    offset = Node.endOfWhiteSpace(src, offset);
    offset = this.parseComment(offset);

    if (!this.hasComment || this.valueRange.isEmpty()) {
      offset = this.parseBlockValue(offset);
    }

    return offset;
  }

}

exports.Char = Char;
exports.Node = Node;
exports.PlainValue = PlainValue;
exports.Range = Range;
exports.Type = Type;
exports.YAMLError = YAMLError;
exports.YAMLReferenceError = YAMLReferenceError;
exports.YAMLSemanticError = YAMLSemanticError;
exports.YAMLSyntaxError = YAMLSyntaxError;
exports.YAMLWarning = YAMLWarning;
exports._defineProperty = _defineProperty;
exports.defaultTagPrefix = defaultTagPrefix;
exports.defaultTags = defaultTags;


/***/ }),

/***/ 3656:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


var PlainValue = __webpack_require__(5215);
var resolveSeq = __webpack_require__(6140);
var warnings = __webpack_require__(7383);

function createMap(schema, obj, ctx) {
  const map = new resolveSeq.YAMLMap(schema);

  if (obj instanceof Map) {
    for (const [key, value] of obj) map.items.push(schema.createPair(key, value, ctx));
  } else if (obj && typeof obj === 'object') {
    for (const key of Object.keys(obj)) map.items.push(schema.createPair(key, obj[key], ctx));
  }

  if (typeof schema.sortMapEntries === 'function') {
    map.items.sort(schema.sortMapEntries);
  }

  return map;
}

const map = {
  createNode: createMap,
  default: true,
  nodeClass: resolveSeq.YAMLMap,
  tag: 'tag:yaml.org,2002:map',
  resolve: resolveSeq.resolveMap
};

function createSeq(schema, obj, ctx) {
  const seq = new resolveSeq.YAMLSeq(schema);

  if (obj && obj[Symbol.iterator]) {
    for (const it of obj) {
      const v = schema.createNode(it, ctx.wrapScalars, null, ctx);
      seq.items.push(v);
    }
  }

  return seq;
}

const seq = {
  createNode: createSeq,
  default: true,
  nodeClass: resolveSeq.YAMLSeq,
  tag: 'tag:yaml.org,2002:seq',
  resolve: resolveSeq.resolveSeq
};

const string = {
  identify: value => typeof value === 'string',
  default: true,
  tag: 'tag:yaml.org,2002:str',
  resolve: resolveSeq.resolveString,

  stringify(item, ctx, onComment, onChompKeep) {
    ctx = Object.assign({
      actualString: true
    }, ctx);
    return resolveSeq.stringifyString(item, ctx, onComment, onChompKeep);
  },

  options: resolveSeq.strOptions
};

const failsafe = [map, seq, string];

/* global BigInt */

const intIdentify = value => typeof value === 'bigint' || Number.isInteger(value);

const intResolve = (src, part, radix) => resolveSeq.intOptions.asBigInt ? BigInt(src) : parseInt(part, radix);

function intStringify(node, radix, prefix) {
  const {
    value
  } = node;
  if (intIdentify(value) && value >= 0) return prefix + value.toString(radix);
  return resolveSeq.stringifyNumber(node);
}

const nullObj = {
  identify: value => value == null,
  createNode: (schema, value, ctx) => ctx.wrapScalars ? new resolveSeq.Scalar(null) : null,
  default: true,
  tag: 'tag:yaml.org,2002:null',
  test: /^(?:~|[Nn]ull|NULL)?$/,
  resolve: () => null,
  options: resolveSeq.nullOptions,
  stringify: () => resolveSeq.nullOptions.nullStr
};
const boolObj = {
  identify: value => typeof value === 'boolean',
  default: true,
  tag: 'tag:yaml.org,2002:bool',
  test: /^(?:[Tt]rue|TRUE|[Ff]alse|FALSE)$/,
  resolve: str => str[0] === 't' || str[0] === 'T',
  options: resolveSeq.boolOptions,
  stringify: ({
    value
  }) => value ? resolveSeq.boolOptions.trueStr : resolveSeq.boolOptions.falseStr
};
const octObj = {
  identify: value => intIdentify(value) && value >= 0,
  default: true,
  tag: 'tag:yaml.org,2002:int',
  format: 'OCT',
  test: /^0o([0-7]+)$/,
  resolve: (str, oct) => intResolve(str, oct, 8),
  options: resolveSeq.intOptions,
  stringify: node => intStringify(node, 8, '0o')
};
const intObj = {
  identify: intIdentify,
  default: true,
  tag: 'tag:yaml.org,2002:int',
  test: /^[-+]?[0-9]+$/,
  resolve: str => intResolve(str, str, 10),
  options: resolveSeq.intOptions,
  stringify: resolveSeq.stringifyNumber
};
const hexObj = {
  identify: value => intIdentify(value) && value >= 0,
  default: true,
  tag: 'tag:yaml.org,2002:int',
  format: 'HEX',
  test: /^0x([0-9a-fA-F]+)$/,
  resolve: (str, hex) => intResolve(str, hex, 16),
  options: resolveSeq.intOptions,
  stringify: node => intStringify(node, 16, '0x')
};
const nanObj = {
  identify: value => typeof value === 'number',
  default: true,
  tag: 'tag:yaml.org,2002:float',
  test: /^(?:[-+]?\.inf|(\.nan))$/i,
  resolve: (str, nan) => nan ? NaN : str[0] === '-' ? Number.NEGATIVE_INFINITY : Number.POSITIVE_INFINITY,
  stringify: resolveSeq.stringifyNumber
};
const expObj = {
  identify: value => typeof value === 'number',
  default: true,
  tag: 'tag:yaml.org,2002:float',
  format: 'EXP',
  test: /^[-+]?(?:\.[0-9]+|[0-9]+(?:\.[0-9]*)?)[eE][-+]?[0-9]+$/,
  resolve: str => parseFloat(str),
  stringify: ({
    value
  }) => Number(value).toExponential()
};
const floatObj = {
  identify: value => typeof value === 'number',
  default: true,
  tag: 'tag:yaml.org,2002:float',
  test: /^[-+]?(?:\.([0-9]+)|[0-9]+\.([0-9]*))$/,

  resolve(str, frac1, frac2) {
    const frac = frac1 || frac2;
    const node = new resolveSeq.Scalar(parseFloat(str));
    if (frac && frac[frac.length - 1] === '0') node.minFractionDigits = frac.length;
    return node;
  },

  stringify: resolveSeq.stringifyNumber
};
const core = failsafe.concat([nullObj, boolObj, octObj, intObj, hexObj, nanObj, expObj, floatObj]);

/* global BigInt */

const intIdentify$1 = value => typeof value === 'bigint' || Number.isInteger(value);

const stringifyJSON = ({
  value
}) => JSON.stringify(value);

const json = [map, seq, {
  identify: value => typeof value === 'string',
  default: true,
  tag: 'tag:yaml.org,2002:str',
  resolve: resolveSeq.resolveString,
  stringify: stringifyJSON
}, {
  identify: value => value == null,
  createNode: (schema, value, ctx) => ctx.wrapScalars ? new resolveSeq.Scalar(null) : null,
  default: true,
  tag: 'tag:yaml.org,2002:null',
  test: /^null$/,
  resolve: () => null,
  stringify: stringifyJSON
}, {
  identify: value => typeof value === 'boolean',
  default: true,
  tag: 'tag:yaml.org,2002:bool',
  test: /^true|false$/,
  resolve: str => str === 'true',
  stringify: stringifyJSON
}, {
  identify: intIdentify$1,
  default: true,
  tag: 'tag:yaml.org,2002:int',
  test: /^-?(?:0|[1-9][0-9]*)$/,
  resolve: str => resolveSeq.intOptions.asBigInt ? BigInt(str) : parseInt(str, 10),
  stringify: ({
    value
  }) => intIdentify$1(value) ? value.toString() : JSON.stringify(value)
}, {
  identify: value => typeof value === 'number',
  default: true,
  tag: 'tag:yaml.org,2002:float',
  test: /^-?(?:0|[1-9][0-9]*)(?:\.[0-9]*)?(?:[eE][-+]?[0-9]+)?$/,
  resolve: str => parseFloat(str),
  stringify: stringifyJSON
}];

json.scalarFallback = str => {
  throw new SyntaxError(`Unresolved plain scalar ${JSON.stringify(str)}`);
};

/* global BigInt */

const boolStringify = ({
  value
}) => value ? resolveSeq.boolOptions.trueStr : resolveSeq.boolOptions.falseStr;

const intIdentify$2 = value => typeof value === 'bigint' || Number.isInteger(value);

function intResolve$1(sign, src, radix) {
  let str = src.replace(/_/g, '');

  if (resolveSeq.intOptions.asBigInt) {
    switch (radix) {
      case 2:
        str = `0b${str}`;
        break;

      case 8:
        str = `0o${str}`;
        break;

      case 16:
        str = `0x${str}`;
        break;
    }

    const n = BigInt(str);
    return sign === '-' ? BigInt(-1) * n : n;
  }

  const n = parseInt(str, radix);
  return sign === '-' ? -1 * n : n;
}

function intStringify$1(node, radix, prefix) {
  const {
    value
  } = node;

  if (intIdentify$2(value)) {
    const str = value.toString(radix);
    return value < 0 ? '-' + prefix + str.substr(1) : prefix + str;
  }

  return resolveSeq.stringifyNumber(node);
}

const yaml11 = failsafe.concat([{
  identify: value => value == null,
  createNode: (schema, value, ctx) => ctx.wrapScalars ? new resolveSeq.Scalar(null) : null,
  default: true,
  tag: 'tag:yaml.org,2002:null',
  test: /^(?:~|[Nn]ull|NULL)?$/,
  resolve: () => null,
  options: resolveSeq.nullOptions,
  stringify: () => resolveSeq.nullOptions.nullStr
}, {
  identify: value => typeof value === 'boolean',
  default: true,
  tag: 'tag:yaml.org,2002:bool',
  test: /^(?:Y|y|[Yy]es|YES|[Tt]rue|TRUE|[Oo]n|ON)$/,
  resolve: () => true,
  options: resolveSeq.boolOptions,
  stringify: boolStringify
}, {
  identify: value => typeof value === 'boolean',
  default: true,
  tag: 'tag:yaml.org,2002:bool',
  test: /^(?:N|n|[Nn]o|NO|[Ff]alse|FALSE|[Oo]ff|OFF)$/i,
  resolve: () => false,
  options: resolveSeq.boolOptions,
  stringify: boolStringify
}, {
  identify: intIdentify$2,
  default: true,
  tag: 'tag:yaml.org,2002:int',
  format: 'BIN',
  test: /^([-+]?)0b([0-1_]+)$/,
  resolve: (str, sign, bin) => intResolve$1(sign, bin, 2),
  stringify: node => intStringify$1(node, 2, '0b')
}, {
  identify: intIdentify$2,
  default: true,
  tag: 'tag:yaml.org,2002:int',
  format: 'OCT',
  test: /^([-+]?)0([0-7_]+)$/,
  resolve: (str, sign, oct) => intResolve$1(sign, oct, 8),
  stringify: node => intStringify$1(node, 8, '0')
}, {
  identify: intIdentify$2,
  default: true,
  tag: 'tag:yaml.org,2002:int',
  test: /^([-+]?)([0-9][0-9_]*)$/,
  resolve: (str, sign, abs) => intResolve$1(sign, abs, 10),
  stringify: resolveSeq.stringifyNumber
}, {
  identify: intIdentify$2,
  default: true,
  tag: 'tag:yaml.org,2002:int',
  format: 'HEX',
  test: /^([-+]?)0x([0-9a-fA-F_]+)$/,
  resolve: (str, sign, hex) => intResolve$1(sign, hex, 16),
  stringify: node => intStringify$1(node, 16, '0x')
}, {
  identify: value => typeof value === 'number',
  default: true,
  tag: 'tag:yaml.org,2002:float',
  test: /^(?:[-+]?\.inf|(\.nan))$/i,
  resolve: (str, nan) => nan ? NaN : str[0] === '-' ? Number.NEGATIVE_INFINITY : Number.POSITIVE_INFINITY,
  stringify: resolveSeq.stringifyNumber
}, {
  identify: value => typeof value === 'number',
  default: true,
  tag: 'tag:yaml.org,2002:float',
  format: 'EXP',
  test: /^[-+]?([0-9][0-9_]*)?(\.[0-9_]*)?[eE][-+]?[0-9]+$/,
  resolve: str => parseFloat(str.replace(/_/g, '')),
  stringify: ({
    value
  }) => Number(value).toExponential()
}, {
  identify: value => typeof value === 'number',
  default: true,
  tag: 'tag:yaml.org,2002:float',
  test: /^[-+]?(?:[0-9][0-9_]*)?\.([0-9_]*)$/,

  resolve(str, frac) {
    const node = new resolveSeq.Scalar(parseFloat(str.replace(/_/g, '')));

    if (frac) {
      const f = frac.replace(/_/g, '');
      if (f[f.length - 1] === '0') node.minFractionDigits = f.length;
    }

    return node;
  },

  stringify: resolveSeq.stringifyNumber
}], warnings.binary, warnings.omap, warnings.pairs, warnings.set, warnings.intTime, warnings.floatTime, warnings.timestamp);

const schemas = {
  core,
  failsafe,
  json,
  yaml11
};
const tags = {
  binary: warnings.binary,
  bool: boolObj,
  float: floatObj,
  floatExp: expObj,
  floatNaN: nanObj,
  floatTime: warnings.floatTime,
  int: intObj,
  intHex: hexObj,
  intOct: octObj,
  intTime: warnings.intTime,
  map,
  null: nullObj,
  omap: warnings.omap,
  pairs: warnings.pairs,
  seq,
  set: warnings.set,
  timestamp: warnings.timestamp
};

function findTagObject(value, tagName, tags) {
  if (tagName) {
    const match = tags.filter(t => t.tag === tagName);
    const tagObj = match.find(t => !t.format) || match[0];
    if (!tagObj) throw new Error(`Tag ${tagName} not found`);
    return tagObj;
  } // TODO: deprecate/remove class check


  return tags.find(t => (t.identify && t.identify(value) || t.class && value instanceof t.class) && !t.format);
}

function createNode(value, tagName, ctx) {
  if (value instanceof resolveSeq.Node) return value;
  const {
    defaultPrefix,
    onTagObj,
    prevObjects,
    schema,
    wrapScalars
  } = ctx;
  if (tagName && tagName.startsWith('!!')) tagName = defaultPrefix + tagName.slice(2);
  let tagObj = findTagObject(value, tagName, schema.tags);

  if (!tagObj) {
    if (typeof value.toJSON === 'function') value = value.toJSON();
    if (typeof value !== 'object') return wrapScalars ? new resolveSeq.Scalar(value) : value;
    tagObj = value instanceof Map ? map : value[Symbol.iterator] ? seq : map;
  }

  if (onTagObj) {
    onTagObj(tagObj);
    delete ctx.onTagObj;
  } // Detect duplicate references to the same object & use Alias nodes for all
  // after first. The `obj` wrapper allows for circular references to resolve.


  const obj = {};

  if (value && typeof value === 'object' && prevObjects) {
    const prev = prevObjects.get(value);

    if (prev) {
      const alias = new resolveSeq.Alias(prev); // leaves source dirty; must be cleaned by caller

      ctx.aliasNodes.push(alias); // defined along with prevObjects

      return alias;
    }

    obj.value = value;
    prevObjects.set(value, obj);
  }

  obj.node = tagObj.createNode ? tagObj.createNode(ctx.schema, value, ctx) : wrapScalars ? new resolveSeq.Scalar(value) : value;
  if (tagName && obj.node instanceof resolveSeq.Node) obj.node.tag = tagName;
  return obj.node;
}

function getSchemaTags(schemas, knownTags, customTags, schemaId) {
  let tags = schemas[schemaId.replace(/\W/g, '')]; // 'yaml-1.1' -> 'yaml11'

  if (!tags) {
    const keys = Object.keys(schemas).map(key => JSON.stringify(key)).join(', ');
    throw new Error(`Unknown schema "${schemaId}"; use one of ${keys}`);
  }

  if (Array.isArray(customTags)) {
    for (const tag of customTags) tags = tags.concat(tag);
  } else if (typeof customTags === 'function') {
    tags = customTags(tags.slice());
  }

  for (let i = 0; i < tags.length; ++i) {
    const tag = tags[i];

    if (typeof tag === 'string') {
      const tagObj = knownTags[tag];

      if (!tagObj) {
        const keys = Object.keys(knownTags).map(key => JSON.stringify(key)).join(', ');
        throw new Error(`Unknown custom tag "${tag}"; use one of ${keys}`);
      }

      tags[i] = tagObj;
    }
  }

  return tags;
}

const sortMapEntriesByKey = (a, b) => a.key < b.key ? -1 : a.key > b.key ? 1 : 0;

class Schema {
  // TODO: remove in v2
  // TODO: remove in v2
  constructor({
    customTags,
    merge,
    schema,
    sortMapEntries,
    tags: deprecatedCustomTags
  }) {
    this.merge = !!merge;
    this.name = schema;
    this.sortMapEntries = sortMapEntries === true ? sortMapEntriesByKey : sortMapEntries || null;
    if (!customTags && deprecatedCustomTags) warnings.warnOptionDeprecation('tags', 'customTags');
    this.tags = getSchemaTags(schemas, tags, customTags || deprecatedCustomTags, schema);
  }

  createNode(value, wrapScalars, tagName, ctx) {
    const baseCtx = {
      defaultPrefix: Schema.defaultPrefix,
      schema: this,
      wrapScalars
    };
    const createCtx = ctx ? Object.assign(ctx, baseCtx) : baseCtx;
    return createNode(value, tagName, createCtx);
  }

  createPair(key, value, ctx) {
    if (!ctx) ctx = {
      wrapScalars: true
    };
    const k = this.createNode(key, ctx.wrapScalars, null, ctx);
    const v = this.createNode(value, ctx.wrapScalars, null, ctx);
    return new resolveSeq.Pair(k, v);
  }

}

PlainValue._defineProperty(Schema, "defaultPrefix", PlainValue.defaultTagPrefix);

PlainValue._defineProperty(Schema, "defaultTags", PlainValue.defaultTags);

exports.Schema = Schema;


/***/ }),

/***/ 5065:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


var PlainValue = __webpack_require__(5215);
var parseCst = __webpack_require__(445);
__webpack_require__(6140);
var Document$1 = __webpack_require__(1983);
var Schema = __webpack_require__(3656);
var warnings = __webpack_require__(7383);

function createNode(value, wrapScalars = true, tag) {
  if (tag === undefined && typeof wrapScalars === 'string') {
    tag = wrapScalars;
    wrapScalars = true;
  }

  const options = Object.assign({}, Document$1.Document.defaults[Document$1.defaultOptions.version], Document$1.defaultOptions);
  const schema = new Schema.Schema(options);
  return schema.createNode(value, wrapScalars, tag);
}

class Document extends Document$1.Document {
  constructor(options) {
    super(Object.assign({}, Document$1.defaultOptions, options));
  }

}

function parseAllDocuments(src, options) {
  const stream = [];
  let prev;

  for (const cstDoc of parseCst.parse(src)) {
    const doc = new Document(options);
    doc.parse(cstDoc, prev);
    stream.push(doc);
    prev = doc;
  }

  return stream;
}

function parseDocument(src, options) {
  const cst = parseCst.parse(src);
  const doc = new Document(options).parse(cst[0]);

  if (cst.length > 1) {
    const errMsg = 'Source contains multiple documents; please use YAML.parseAllDocuments()';
    doc.errors.unshift(new PlainValue.YAMLSemanticError(cst[1], errMsg));
  }

  return doc;
}

function parse(src, options) {
  const doc = parseDocument(src, options);
  doc.warnings.forEach(warning => warnings.warn(warning));
  if (doc.errors.length > 0) throw doc.errors[0];
  return doc.toJSON();
}

function stringify(value, options) {
  const doc = new Document(options);
  doc.contents = value;
  return String(doc);
}

const YAML = {
  createNode,
  defaultOptions: Document$1.defaultOptions,
  Document,
  parse,
  parseAllDocuments,
  parseCST: parseCst.parse,
  parseDocument,
  scalarOptions: Document$1.scalarOptions,
  stringify
};

exports.YAML = YAML;


/***/ }),

/***/ 445:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


var PlainValue = __webpack_require__(5215);

class BlankLine extends PlainValue.Node {
  constructor() {
    super(PlainValue.Type.BLANK_LINE);
  }
  /* istanbul ignore next */


  get includesTrailingLines() {
    // This is never called from anywhere, but if it were,
    // this is the value it should return.
    return true;
  }
  /**
   * Parses a blank line from the source
   *
   * @param {ParseContext} context
   * @param {number} start - Index of first \n character
   * @returns {number} - Index of the character after this
   */


  parse(context, start) {
    this.context = context;
    this.range = new PlainValue.Range(start, start + 1);
    return start + 1;
  }

}

class CollectionItem extends PlainValue.Node {
  constructor(type, props) {
    super(type, props);
    this.node = null;
  }

  get includesTrailingLines() {
    return !!this.node && this.node.includesTrailingLines;
  }
  /**
   * @param {ParseContext} context
   * @param {number} start - Index of first character
   * @returns {number} - Index of the character after this
   */


  parse(context, start) {
    this.context = context;
    const {
      parseNode,
      src
    } = context;
    let {
      atLineStart,
      lineStart
    } = context;
    if (!atLineStart && this.type === PlainValue.Type.SEQ_ITEM) this.error = new PlainValue.YAMLSemanticError(this, 'Sequence items must not have preceding content on the same line');
    const indent = atLineStart ? start - lineStart : context.indent;
    let offset = PlainValue.Node.endOfWhiteSpace(src, start + 1);
    let ch = src[offset];
    const inlineComment = ch === '#';
    const comments = [];
    let blankLine = null;

    while (ch === '\n' || ch === '#') {
      if (ch === '#') {
        const end = PlainValue.Node.endOfLine(src, offset + 1);
        comments.push(new PlainValue.Range(offset, end));
        offset = end;
      } else {
        atLineStart = true;
        lineStart = offset + 1;
        const wsEnd = PlainValue.Node.endOfWhiteSpace(src, lineStart);

        if (src[wsEnd] === '\n' && comments.length === 0) {
          blankLine = new BlankLine();
          lineStart = blankLine.parse({
            src
          }, lineStart);
        }

        offset = PlainValue.Node.endOfIndent(src, lineStart);
      }

      ch = src[offset];
    }

    if (PlainValue.Node.nextNodeIsIndented(ch, offset - (lineStart + indent), this.type !== PlainValue.Type.SEQ_ITEM)) {
      this.node = parseNode({
        atLineStart,
        inCollection: false,
        indent,
        lineStart,
        parent: this
      }, offset);
    } else if (ch && lineStart > start + 1) {
      offset = lineStart - 1;
    }

    if (this.node) {
      if (blankLine) {
        // Only blank lines preceding non-empty nodes are captured. Note that
        // this means that collection item range start indices do not always
        // increase monotonically. -- eemeli/yaml#126
        const items = context.parent.items || context.parent.contents;
        if (items) items.push(blankLine);
      }

      if (comments.length) Array.prototype.push.apply(this.props, comments);
      offset = this.node.range.end;
    } else {
      if (inlineComment) {
        const c = comments[0];
        this.props.push(c);
        offset = c.end;
      } else {
        offset = PlainValue.Node.endOfLine(src, start + 1);
      }
    }

    const end = this.node ? this.node.valueRange.end : offset;
    this.valueRange = new PlainValue.Range(start, end);
    return offset;
  }

  setOrigRanges(cr, offset) {
    offset = super.setOrigRanges(cr, offset);
    return this.node ? this.node.setOrigRanges(cr, offset) : offset;
  }

  toString() {
    const {
      context: {
        src
      },
      node,
      range,
      value
    } = this;
    if (value != null) return value;
    const str = node ? src.slice(range.start, node.range.start) + String(node) : src.slice(range.start, range.end);
    return PlainValue.Node.addStringTerminator(src, range.end, str);
  }

}

class Comment extends PlainValue.Node {
  constructor() {
    super(PlainValue.Type.COMMENT);
  }
  /**
   * Parses a comment line from the source
   *
   * @param {ParseContext} context
   * @param {number} start - Index of first character
   * @returns {number} - Index of the character after this scalar
   */


  parse(context, start) {
    this.context = context;
    const offset = this.parseComment(start);
    this.range = new PlainValue.Range(start, offset);
    return offset;
  }

}

function grabCollectionEndComments(node) {
  let cnode = node;

  while (cnode instanceof CollectionItem) cnode = cnode.node;

  if (!(cnode instanceof Collection)) return null;
  const len = cnode.items.length;
  let ci = -1;

  for (let i = len - 1; i >= 0; --i) {
    const n = cnode.items[i];

    if (n.type === PlainValue.Type.COMMENT) {
      // Keep sufficiently indented comments with preceding node
      const {
        indent,
        lineStart
      } = n.context;
      if (indent > 0 && n.range.start >= lineStart + indent) break;
      ci = i;
    } else if (n.type === PlainValue.Type.BLANK_LINE) ci = i;else break;
  }

  if (ci === -1) return null;
  const ca = cnode.items.splice(ci, len - ci);
  const prevEnd = ca[0].range.start;

  while (true) {
    cnode.range.end = prevEnd;
    if (cnode.valueRange && cnode.valueRange.end > prevEnd) cnode.valueRange.end = prevEnd;
    if (cnode === node) break;
    cnode = cnode.context.parent;
  }

  return ca;
}
class Collection extends PlainValue.Node {
  static nextContentHasIndent(src, offset, indent) {
    const lineStart = PlainValue.Node.endOfLine(src, offset) + 1;
    offset = PlainValue.Node.endOfWhiteSpace(src, lineStart);
    const ch = src[offset];
    if (!ch) return false;
    if (offset >= lineStart + indent) return true;
    if (ch !== '#' && ch !== '\n') return false;
    return Collection.nextContentHasIndent(src, offset, indent);
  }

  constructor(firstItem) {
    super(firstItem.type === PlainValue.Type.SEQ_ITEM ? PlainValue.Type.SEQ : PlainValue.Type.MAP);

    for (let i = firstItem.props.length - 1; i >= 0; --i) {
      if (firstItem.props[i].start < firstItem.context.lineStart) {
        // props on previous line are assumed by the collection
        this.props = firstItem.props.slice(0, i + 1);
        firstItem.props = firstItem.props.slice(i + 1);
        const itemRange = firstItem.props[0] || firstItem.valueRange;
        firstItem.range.start = itemRange.start;
        break;
      }
    }

    this.items = [firstItem];
    const ec = grabCollectionEndComments(firstItem);
    if (ec) Array.prototype.push.apply(this.items, ec);
  }

  get includesTrailingLines() {
    return this.items.length > 0;
  }
  /**
   * @param {ParseContext} context
   * @param {number} start - Index of first character
   * @returns {number} - Index of the character after this
   */


  parse(context, start) {
    this.context = context;
    const {
      parseNode,
      src
    } = context; // It's easier to recalculate lineStart here rather than tracking down the
    // last context from which to read it -- eemeli/yaml#2

    let lineStart = PlainValue.Node.startOfLine(src, start);
    const firstItem = this.items[0]; // First-item context needs to be correct for later comment handling
    // -- eemeli/yaml#17

    firstItem.context.parent = this;
    this.valueRange = PlainValue.Range.copy(firstItem.valueRange);
    const indent = firstItem.range.start - firstItem.context.lineStart;
    let offset = start;
    offset = PlainValue.Node.normalizeOffset(src, offset);
    let ch = src[offset];
    let atLineStart = PlainValue.Node.endOfWhiteSpace(src, lineStart) === offset;
    let prevIncludesTrailingLines = false;

    while (ch) {
      while (ch === '\n' || ch === '#') {
        if (atLineStart && ch === '\n' && !prevIncludesTrailingLines) {
          const blankLine = new BlankLine();
          offset = blankLine.parse({
            src
          }, offset);
          this.valueRange.end = offset;

          if (offset >= src.length) {
            ch = null;
            break;
          }

          this.items.push(blankLine);
          offset -= 1; // blankLine.parse() consumes terminal newline
        } else if (ch === '#') {
          if (offset < lineStart + indent && !Collection.nextContentHasIndent(src, offset, indent)) {
            return offset;
          }

          const comment = new Comment();
          offset = comment.parse({
            indent,
            lineStart,
            src
          }, offset);
          this.items.push(comment);
          this.valueRange.end = offset;

          if (offset >= src.length) {
            ch = null;
            break;
          }
        }

        lineStart = offset + 1;
        offset = PlainValue.Node.endOfIndent(src, lineStart);

        if (PlainValue.Node.atBlank(src, offset)) {
          const wsEnd = PlainValue.Node.endOfWhiteSpace(src, offset);
          const next = src[wsEnd];

          if (!next || next === '\n' || next === '#') {
            offset = wsEnd;
          }
        }

        ch = src[offset];
        atLineStart = true;
      }

      if (!ch) {
        break;
      }

      if (offset !== lineStart + indent && (atLineStart || ch !== ':')) {
        if (offset < lineStart + indent) {
          if (lineStart > start) offset = lineStart;
          break;
        } else if (!this.error) {
          const msg = 'All collection items must start at the same column';
          this.error = new PlainValue.YAMLSyntaxError(this, msg);
        }
      }

      if (firstItem.type === PlainValue.Type.SEQ_ITEM) {
        if (ch !== '-') {
          if (lineStart > start) offset = lineStart;
          break;
        }
      } else if (ch === '-' && !this.error) {
        // map key may start with -, as long as it's followed by a non-whitespace char
        const next = src[offset + 1];

        if (!next || next === '\n' || next === '\t' || next === ' ') {
          const msg = 'A collection cannot be both a mapping and a sequence';
          this.error = new PlainValue.YAMLSyntaxError(this, msg);
        }
      }

      const node = parseNode({
        atLineStart,
        inCollection: true,
        indent,
        lineStart,
        parent: this
      }, offset);
      if (!node) return offset; // at next document start

      this.items.push(node);
      this.valueRange.end = node.valueRange.end;
      offset = PlainValue.Node.normalizeOffset(src, node.range.end);
      ch = src[offset];
      atLineStart = false;
      prevIncludesTrailingLines = node.includesTrailingLines; // Need to reset lineStart and atLineStart here if preceding node's range
      // has advanced to check the current line's indentation level
      // -- eemeli/yaml#10 & eemeli/yaml#38

      if (ch) {
        let ls = offset - 1;
        let prev = src[ls];

        while (prev === ' ' || prev === '\t') prev = src[--ls];

        if (prev === '\n') {
          lineStart = ls + 1;
          atLineStart = true;
        }
      }

      const ec = grabCollectionEndComments(node);
      if (ec) Array.prototype.push.apply(this.items, ec);
    }

    return offset;
  }

  setOrigRanges(cr, offset) {
    offset = super.setOrigRanges(cr, offset);
    this.items.forEach(node => {
      offset = node.setOrigRanges(cr, offset);
    });
    return offset;
  }

  toString() {
    const {
      context: {
        src
      },
      items,
      range,
      value
    } = this;
    if (value != null) return value;
    let str = src.slice(range.start, items[0].range.start) + String(items[0]);

    for (let i = 1; i < items.length; ++i) {
      const item = items[i];
      const {
        atLineStart,
        indent
      } = item.context;
      if (atLineStart) for (let i = 0; i < indent; ++i) str += ' ';
      str += String(item);
    }

    return PlainValue.Node.addStringTerminator(src, range.end, str);
  }

}

class Directive extends PlainValue.Node {
  constructor() {
    super(PlainValue.Type.DIRECTIVE);
    this.name = null;
  }

  get parameters() {
    const raw = this.rawValue;
    return raw ? raw.trim().split(/[ \t]+/) : [];
  }

  parseName(start) {
    const {
      src
    } = this.context;
    let offset = start;
    let ch = src[offset];

    while (ch && ch !== '\n' && ch !== '\t' && ch !== ' ') ch = src[offset += 1];

    this.name = src.slice(start, offset);
    return offset;
  }

  parseParameters(start) {
    const {
      src
    } = this.context;
    let offset = start;
    let ch = src[offset];

    while (ch && ch !== '\n' && ch !== '#') ch = src[offset += 1];

    this.valueRange = new PlainValue.Range(start, offset);
    return offset;
  }

  parse(context, start) {
    this.context = context;
    let offset = this.parseName(start + 1);
    offset = this.parseParameters(offset);
    offset = this.parseComment(offset);
    this.range = new PlainValue.Range(start, offset);
    return offset;
  }

}

class Document extends PlainValue.Node {
  static startCommentOrEndBlankLine(src, start) {
    const offset = PlainValue.Node.endOfWhiteSpace(src, start);
    const ch = src[offset];
    return ch === '#' || ch === '\n' ? offset : start;
  }

  constructor() {
    super(PlainValue.Type.DOCUMENT);
    this.directives = null;
    this.contents = null;
    this.directivesEndMarker = null;
    this.documentEndMarker = null;
  }

  parseDirectives(start) {
    const {
      src
    } = this.context;
    this.directives = [];
    let atLineStart = true;
    let hasDirectives = false;
    let offset = start;

    while (!PlainValue.Node.atDocumentBoundary(src, offset, PlainValue.Char.DIRECTIVES_END)) {
      offset = Document.startCommentOrEndBlankLine(src, offset);

      switch (src[offset]) {
        case '\n':
          if (atLineStart) {
            const blankLine = new BlankLine();
            offset = blankLine.parse({
              src
            }, offset);

            if (offset < src.length) {
              this.directives.push(blankLine);
            }
          } else {
            offset += 1;
            atLineStart = true;
          }

          break;

        case '#':
          {
            const comment = new Comment();
            offset = comment.parse({
              src
            }, offset);
            this.directives.push(comment);
            atLineStart = false;
          }
          break;

        case '%':
          {
            const directive = new Directive();
            offset = directive.parse({
              parent: this,
              src
            }, offset);
            this.directives.push(directive);
            hasDirectives = true;
            atLineStart = false;
          }
          break;

        default:
          if (hasDirectives) {
            this.error = new PlainValue.YAMLSemanticError(this, 'Missing directives-end indicator line');
          } else if (this.directives.length > 0) {
            this.contents = this.directives;
            this.directives = [];
          }

          return offset;
      }
    }

    if (src[offset]) {
      this.directivesEndMarker = new PlainValue.Range(offset, offset + 3);
      return offset + 3;
    }

    if (hasDirectives) {
      this.error = new PlainValue.YAMLSemanticError(this, 'Missing directives-end indicator line');
    } else if (this.directives.length > 0) {
      this.contents = this.directives;
      this.directives = [];
    }

    return offset;
  }

  parseContents(start) {
    const {
      parseNode,
      src
    } = this.context;
    if (!this.contents) this.contents = [];
    let lineStart = start;

    while (src[lineStart - 1] === '-') lineStart -= 1;

    let offset = PlainValue.Node.endOfWhiteSpace(src, start);
    let atLineStart = lineStart === start;
    this.valueRange = new PlainValue.Range(offset);

    while (!PlainValue.Node.atDocumentBoundary(src, offset, PlainValue.Char.DOCUMENT_END)) {
      switch (src[offset]) {
        case '\n':
          if (atLineStart) {
            const blankLine = new BlankLine();
            offset = blankLine.parse({
              src
            }, offset);

            if (offset < src.length) {
              this.contents.push(blankLine);
            }
          } else {
            offset += 1;
            atLineStart = true;
          }

          lineStart = offset;
          break;

        case '#':
          {
            const comment = new Comment();
            offset = comment.parse({
              src
            }, offset);
            this.contents.push(comment);
            atLineStart = false;
          }
          break;

        default:
          {
            const iEnd = PlainValue.Node.endOfIndent(src, offset);
            const context = {
              atLineStart,
              indent: -1,
              inFlow: false,
              inCollection: false,
              lineStart,
              parent: this
            };
            const node = parseNode(context, iEnd);
            if (!node) return this.valueRange.end = iEnd; // at next document start

            this.contents.push(node);
            offset = node.range.end;
            atLineStart = false;
            const ec = grabCollectionEndComments(node);
            if (ec) Array.prototype.push.apply(this.contents, ec);
          }
      }

      offset = Document.startCommentOrEndBlankLine(src, offset);
    }

    this.valueRange.end = offset;

    if (src[offset]) {
      this.documentEndMarker = new PlainValue.Range(offset, offset + 3);
      offset += 3;

      if (src[offset]) {
        offset = PlainValue.Node.endOfWhiteSpace(src, offset);

        if (src[offset] === '#') {
          const comment = new Comment();
          offset = comment.parse({
            src
          }, offset);
          this.contents.push(comment);
        }

        switch (src[offset]) {
          case '\n':
            offset += 1;
            break;

          case undefined:
            break;

          default:
            this.error = new PlainValue.YAMLSyntaxError(this, 'Document end marker line cannot have a non-comment suffix');
        }
      }
    }

    return offset;
  }
  /**
   * @param {ParseContext} context
   * @param {number} start - Index of first character
   * @returns {number} - Index of the character after this
   */


  parse(context, start) {
    context.root = this;
    this.context = context;
    const {
      src
    } = context;
    let offset = src.charCodeAt(start) === 0xfeff ? start + 1 : start; // skip BOM

    offset = this.parseDirectives(offset);
    offset = this.parseContents(offset);
    return offset;
  }

  setOrigRanges(cr, offset) {
    offset = super.setOrigRanges(cr, offset);
    this.directives.forEach(node => {
      offset = node.setOrigRanges(cr, offset);
    });
    if (this.directivesEndMarker) offset = this.directivesEndMarker.setOrigRange(cr, offset);
    this.contents.forEach(node => {
      offset = node.setOrigRanges(cr, offset);
    });
    if (this.documentEndMarker) offset = this.documentEndMarker.setOrigRange(cr, offset);
    return offset;
  }

  toString() {
    const {
      contents,
      directives,
      value
    } = this;
    if (value != null) return value;
    let str = directives.join('');

    if (contents.length > 0) {
      if (directives.length > 0 || contents[0].type === PlainValue.Type.COMMENT) str += '---\n';
      str += contents.join('');
    }

    if (str[str.length - 1] !== '\n') str += '\n';
    return str;
  }

}

class Alias extends PlainValue.Node {
  /**
   * Parses an *alias from the source
   *
   * @param {ParseContext} context
   * @param {number} start - Index of first character
   * @returns {number} - Index of the character after this scalar
   */
  parse(context, start) {
    this.context = context;
    const {
      src
    } = context;
    let offset = PlainValue.Node.endOfIdentifier(src, start + 1);
    this.valueRange = new PlainValue.Range(start + 1, offset);
    offset = PlainValue.Node.endOfWhiteSpace(src, offset);
    offset = this.parseComment(offset);
    return offset;
  }

}

const Chomp = {
  CLIP: 'CLIP',
  KEEP: 'KEEP',
  STRIP: 'STRIP'
};
class BlockValue extends PlainValue.Node {
  constructor(type, props) {
    super(type, props);
    this.blockIndent = null;
    this.chomping = Chomp.CLIP;
    this.header = null;
  }

  get includesTrailingLines() {
    return this.chomping === Chomp.KEEP;
  }

  get strValue() {
    if (!this.valueRange || !this.context) return null;
    let {
      start,
      end
    } = this.valueRange;
    const {
      indent,
      src
    } = this.context;
    if (this.valueRange.isEmpty()) return '';
    let lastNewLine = null;
    let ch = src[end - 1];

    while (ch === '\n' || ch === '\t' || ch === ' ') {
      end -= 1;

      if (end <= start) {
        if (this.chomping === Chomp.KEEP) break;else return ''; // probably never happens
      }

      if (ch === '\n') lastNewLine = end;
      ch = src[end - 1];
    }

    let keepStart = end + 1;

    if (lastNewLine) {
      if (this.chomping === Chomp.KEEP) {
        keepStart = lastNewLine;
        end = this.valueRange.end;
      } else {
        end = lastNewLine;
      }
    }

    const bi = indent + this.blockIndent;
    const folded = this.type === PlainValue.Type.BLOCK_FOLDED;
    let atStart = true;
    let str = '';
    let sep = '';
    let prevMoreIndented = false;

    for (let i = start; i < end; ++i) {
      for (let j = 0; j < bi; ++j) {
        if (src[i] !== ' ') break;
        i += 1;
      }

      const ch = src[i];

      if (ch === '\n') {
        if (sep === '\n') str += '\n';else sep = '\n';
      } else {
        const lineEnd = PlainValue.Node.endOfLine(src, i);
        const line = src.slice(i, lineEnd);
        i = lineEnd;

        if (folded && (ch === ' ' || ch === '\t') && i < keepStart) {
          if (sep === ' ') sep = '\n';else if (!prevMoreIndented && !atStart && sep === '\n') sep = '\n\n';
          str += sep + line; //+ ((lineEnd < end && src[lineEnd]) || '')

          sep = lineEnd < end && src[lineEnd] || '';
          prevMoreIndented = true;
        } else {
          str += sep + line;
          sep = folded && i < keepStart ? ' ' : '\n';
          prevMoreIndented = false;
        }

        if (atStart && line !== '') atStart = false;
      }
    }

    return this.chomping === Chomp.STRIP ? str : str + '\n';
  }

  parseBlockHeader(start) {
    const {
      src
    } = this.context;
    let offset = start + 1;
    let bi = '';

    while (true) {
      const ch = src[offset];

      switch (ch) {
        case '-':
          this.chomping = Chomp.STRIP;
          break;

        case '+':
          this.chomping = Chomp.KEEP;
          break;

        case '0':
        case '1':
        case '2':
        case '3':
        case '4':
        case '5':
        case '6':
        case '7':
        case '8':
        case '9':
          bi += ch;
          break;

        default:
          this.blockIndent = Number(bi) || null;
          this.header = new PlainValue.Range(start, offset);
          return offset;
      }

      offset += 1;
    }
  }

  parseBlockValue(start) {
    const {
      indent,
      src
    } = this.context;
    const explicit = !!this.blockIndent;
    let offset = start;
    let valueEnd = start;
    let minBlockIndent = 1;

    for (let ch = src[offset]; ch === '\n'; ch = src[offset]) {
      offset += 1;
      if (PlainValue.Node.atDocumentBoundary(src, offset)) break;
      const end = PlainValue.Node.endOfBlockIndent(src, indent, offset); // should not include tab?

      if (end === null) break;
      const ch = src[end];
      const lineIndent = end - (offset + indent);

      if (!this.blockIndent) {
        // no explicit block indent, none yet detected
        if (src[end] !== '\n') {
          // first line with non-whitespace content
          if (lineIndent < minBlockIndent) {
            const msg = 'Block scalars with more-indented leading empty lines must use an explicit indentation indicator';
            this.error = new PlainValue.YAMLSemanticError(this, msg);
          }

          this.blockIndent = lineIndent;
        } else if (lineIndent > minBlockIndent) {
          // empty line with more whitespace
          minBlockIndent = lineIndent;
        }
      } else if (ch && ch !== '\n' && lineIndent < this.blockIndent) {
        if (src[end] === '#') break;

        if (!this.error) {
          const src = explicit ? 'explicit indentation indicator' : 'first line';
          const msg = `Block scalars must not be less indented than their ${src}`;
          this.error = new PlainValue.YAMLSemanticError(this, msg);
        }
      }

      if (src[end] === '\n') {
        offset = end;
      } else {
        offset = valueEnd = PlainValue.Node.endOfLine(src, end);
      }
    }

    if (this.chomping !== Chomp.KEEP) {
      offset = src[valueEnd] ? valueEnd + 1 : valueEnd;
    }

    this.valueRange = new PlainValue.Range(start + 1, offset);
    return offset;
  }
  /**
   * Parses a block value from the source
   *
   * Accepted forms are:
   * ```
   * BS
   * block
   * lines
   *
   * BS #comment
   * block
   * lines
   * ```
   * where the block style BS matches the regexp `[|>][-+1-9]*` and block lines
   * are empty or have an indent level greater than `indent`.
   *
   * @param {ParseContext} context
   * @param {number} start - Index of first character
   * @returns {number} - Index of the character after this block
   */


  parse(context, start) {
    this.context = context;
    const {
      src
    } = context;
    let offset = this.parseBlockHeader(start);
    offset = PlainValue.Node.endOfWhiteSpace(src, offset);
    offset = this.parseComment(offset);
    offset = this.parseBlockValue(offset);
    return offset;
  }

  setOrigRanges(cr, offset) {
    offset = super.setOrigRanges(cr, offset);
    return this.header ? this.header.setOrigRange(cr, offset) : offset;
  }

}

class FlowCollection extends PlainValue.Node {
  constructor(type, props) {
    super(type, props);
    this.items = null;
  }

  prevNodeIsJsonLike(idx = this.items.length) {
    const node = this.items[idx - 1];
    return !!node && (node.jsonLike || node.type === PlainValue.Type.COMMENT && this.prevNodeIsJsonLike(idx - 1));
  }
  /**
   * @param {ParseContext} context
   * @param {number} start - Index of first character
   * @returns {number} - Index of the character after this
   */


  parse(context, start) {
    this.context = context;
    const {
      parseNode,
      src
    } = context;
    let {
      indent,
      lineStart
    } = context;
    let char = src[start]; // { or [

    this.items = [{
      char,
      offset: start
    }];
    let offset = PlainValue.Node.endOfWhiteSpace(src, start + 1);
    char = src[offset];

    while (char && char !== ']' && char !== '}') {
      switch (char) {
        case '\n':
          {
            lineStart = offset + 1;
            const wsEnd = PlainValue.Node.endOfWhiteSpace(src, lineStart);

            if (src[wsEnd] === '\n') {
              const blankLine = new BlankLine();
              lineStart = blankLine.parse({
                src
              }, lineStart);
              this.items.push(blankLine);
            }

            offset = PlainValue.Node.endOfIndent(src, lineStart);

            if (offset <= lineStart + indent) {
              char = src[offset];

              if (offset < lineStart + indent || char !== ']' && char !== '}') {
                const msg = 'Insufficient indentation in flow collection';
                this.error = new PlainValue.YAMLSemanticError(this, msg);
              }
            }
          }
          break;

        case ',':
          {
            this.items.push({
              char,
              offset
            });
            offset += 1;
          }
          break;

        case '#':
          {
            const comment = new Comment();
            offset = comment.parse({
              src
            }, offset);
            this.items.push(comment);
          }
          break;

        case '?':
        case ':':
          {
            const next = src[offset + 1];

            if (next === '\n' || next === '\t' || next === ' ' || next === ',' || // in-flow : after JSON-like key does not need to be followed by whitespace
            char === ':' && this.prevNodeIsJsonLike()) {
              this.items.push({
                char,
                offset
              });
              offset += 1;
              break;
            }
          }
        // fallthrough

        default:
          {
            const node = parseNode({
              atLineStart: false,
              inCollection: false,
              inFlow: true,
              indent: -1,
              lineStart,
              parent: this
            }, offset);

            if (!node) {
              // at next document start
              this.valueRange = new PlainValue.Range(start, offset);
              return offset;
            }

            this.items.push(node);
            offset = PlainValue.Node.normalizeOffset(src, node.range.end);
          }
      }

      offset = PlainValue.Node.endOfWhiteSpace(src, offset);
      char = src[offset];
    }

    this.valueRange = new PlainValue.Range(start, offset + 1);

    if (char) {
      this.items.push({
        char,
        offset
      });
      offset = PlainValue.Node.endOfWhiteSpace(src, offset + 1);
      offset = this.parseComment(offset);
    }

    return offset;
  }

  setOrigRanges(cr, offset) {
    offset = super.setOrigRanges(cr, offset);
    this.items.forEach(node => {
      if (node instanceof PlainValue.Node) {
        offset = node.setOrigRanges(cr, offset);
      } else if (cr.length === 0) {
        node.origOffset = node.offset;
      } else {
        let i = offset;

        while (i < cr.length) {
          if (cr[i] > node.offset) break;else ++i;
        }

        node.origOffset = node.offset + i;
        offset = i;
      }
    });
    return offset;
  }

  toString() {
    const {
      context: {
        src
      },
      items,
      range,
      value
    } = this;
    if (value != null) return value;
    const nodes = items.filter(item => item instanceof PlainValue.Node);
    let str = '';
    let prevEnd = range.start;
    nodes.forEach(node => {
      const prefix = src.slice(prevEnd, node.range.start);
      prevEnd = node.range.end;
      str += prefix + String(node);

      if (str[str.length - 1] === '\n' && src[prevEnd - 1] !== '\n' && src[prevEnd] === '\n') {
        // Comment range does not include the terminal newline, but its
        // stringified value does. Without this fix, newlines at comment ends
        // get duplicated.
        prevEnd += 1;
      }
    });
    str += src.slice(prevEnd, range.end);
    return PlainValue.Node.addStringTerminator(src, range.end, str);
  }

}

class QuoteDouble extends PlainValue.Node {
  static endOfQuote(src, offset) {
    let ch = src[offset];

    while (ch && ch !== '"') {
      offset += ch === '\\' ? 2 : 1;
      ch = src[offset];
    }

    return offset + 1;
  }
  /**
   * @returns {string | { str: string, errors: YAMLSyntaxError[] }}
   */


  get strValue() {
    if (!this.valueRange || !this.context) return null;
    const errors = [];
    const {
      start,
      end
    } = this.valueRange;
    const {
      indent,
      src
    } = this.context;
    if (src[end - 1] !== '"') errors.push(new PlainValue.YAMLSyntaxError(this, 'Missing closing "quote')); // Using String#replace is too painful with escaped newlines preceded by
    // escaped backslashes; also, this should be faster.

    let str = '';

    for (let i = start + 1; i < end - 1; ++i) {
      const ch = src[i];

      if (ch === '\n') {
        if (PlainValue.Node.atDocumentBoundary(src, i + 1)) errors.push(new PlainValue.YAMLSemanticError(this, 'Document boundary indicators are not allowed within string values'));
        const {
          fold,
          offset,
          error
        } = PlainValue.Node.foldNewline(src, i, indent);
        str += fold;
        i = offset;
        if (error) errors.push(new PlainValue.YAMLSemanticError(this, 'Multi-line double-quoted string needs to be sufficiently indented'));
      } else if (ch === '\\') {
        i += 1;

        switch (src[i]) {
          case '0':
            str += '\0';
            break;
          // null character

          case 'a':
            str += '\x07';
            break;
          // bell character

          case 'b':
            str += '\b';
            break;
          // backspace

          case 'e':
            str += '\x1b';
            break;
          // escape character

          case 'f':
            str += '\f';
            break;
          // form feed

          case 'n':
            str += '\n';
            break;
          // line feed

          case 'r':
            str += '\r';
            break;
          // carriage return

          case 't':
            str += '\t';
            break;
          // horizontal tab

          case 'v':
            str += '\v';
            break;
          // vertical tab

          case 'N':
            str += '\u0085';
            break;
          // Unicode next line

          case '_':
            str += '\u00a0';
            break;
          // Unicode non-breaking space

          case 'L':
            str += '\u2028';
            break;
          // Unicode line separator

          case 'P':
            str += '\u2029';
            break;
          // Unicode paragraph separator

          case ' ':
            str += ' ';
            break;

          case '"':
            str += '"';
            break;

          case '/':
            str += '/';
            break;

          case '\\':
            str += '\\';
            break;

          case '\t':
            str += '\t';
            break;

          case 'x':
            str += this.parseCharCode(i + 1, 2, errors);
            i += 2;
            break;

          case 'u':
            str += this.parseCharCode(i + 1, 4, errors);
            i += 4;
            break;

          case 'U':
            str += this.parseCharCode(i + 1, 8, errors);
            i += 8;
            break;

          case '\n':
            // skip escaped newlines, but still trim the following line
            while (src[i + 1] === ' ' || src[i + 1] === '\t') i += 1;

            break;

          default:
            errors.push(new PlainValue.YAMLSyntaxError(this, `Invalid escape sequence ${src.substr(i - 1, 2)}`));
            str += '\\' + src[i];
        }
      } else if (ch === ' ' || ch === '\t') {
        // trim trailing whitespace
        const wsStart = i;
        let next = src[i + 1];

        while (next === ' ' || next === '\t') {
          i += 1;
          next = src[i + 1];
        }

        if (next !== '\n') str += i > wsStart ? src.slice(wsStart, i + 1) : ch;
      } else {
        str += ch;
      }
    }

    return errors.length > 0 ? {
      errors,
      str
    } : str;
  }

  parseCharCode(offset, length, errors) {
    const {
      src
    } = this.context;
    const cc = src.substr(offset, length);
    const ok = cc.length === length && /^[0-9a-fA-F]+$/.test(cc);
    const code = ok ? parseInt(cc, 16) : NaN;

    if (isNaN(code)) {
      errors.push(new PlainValue.YAMLSyntaxError(this, `Invalid escape sequence ${src.substr(offset - 2, length + 2)}`));
      return src.substr(offset - 2, length + 2);
    }

    return String.fromCodePoint(code);
  }
  /**
   * Parses a "double quoted" value from the source
   *
   * @param {ParseContext} context
   * @param {number} start - Index of first character
   * @returns {number} - Index of the character after this scalar
   */


  parse(context, start) {
    this.context = context;
    const {
      src
    } = context;
    let offset = QuoteDouble.endOfQuote(src, start + 1);
    this.valueRange = new PlainValue.Range(start, offset);
    offset = PlainValue.Node.endOfWhiteSpace(src, offset);
    offset = this.parseComment(offset);
    return offset;
  }

}

class QuoteSingle extends PlainValue.Node {
  static endOfQuote(src, offset) {
    let ch = src[offset];

    while (ch) {
      if (ch === "'") {
        if (src[offset + 1] !== "'") break;
        ch = src[offset += 2];
      } else {
        ch = src[offset += 1];
      }
    }

    return offset + 1;
  }
  /**
   * @returns {string | { str: string, errors: YAMLSyntaxError[] }}
   */


  get strValue() {
    if (!this.valueRange || !this.context) return null;
    const errors = [];
    const {
      start,
      end
    } = this.valueRange;
    const {
      indent,
      src
    } = this.context;
    if (src[end - 1] !== "'") errors.push(new PlainValue.YAMLSyntaxError(this, "Missing closing 'quote"));
    let str = '';

    for (let i = start + 1; i < end - 1; ++i) {
      const ch = src[i];

      if (ch === '\n') {
        if (PlainValue.Node.atDocumentBoundary(src, i + 1)) errors.push(new PlainValue.YAMLSemanticError(this, 'Document boundary indicators are not allowed within string values'));
        const {
          fold,
          offset,
          error
        } = PlainValue.Node.foldNewline(src, i, indent);
        str += fold;
        i = offset;
        if (error) errors.push(new PlainValue.YAMLSemanticError(this, 'Multi-line single-quoted string needs to be sufficiently indented'));
      } else if (ch === "'") {
        str += ch;
        i += 1;
        if (src[i] !== "'") errors.push(new PlainValue.YAMLSyntaxError(this, 'Unescaped single quote? This should not happen.'));
      } else if (ch === ' ' || ch === '\t') {
        // trim trailing whitespace
        const wsStart = i;
        let next = src[i + 1];

        while (next === ' ' || next === '\t') {
          i += 1;
          next = src[i + 1];
        }

        if (next !== '\n') str += i > wsStart ? src.slice(wsStart, i + 1) : ch;
      } else {
        str += ch;
      }
    }

    return errors.length > 0 ? {
      errors,
      str
    } : str;
  }
  /**
   * Parses a 'single quoted' value from the source
   *
   * @param {ParseContext} context
   * @param {number} start - Index of first character
   * @returns {number} - Index of the character after this scalar
   */


  parse(context, start) {
    this.context = context;
    const {
      src
    } = context;
    let offset = QuoteSingle.endOfQuote(src, start + 1);
    this.valueRange = new PlainValue.Range(start, offset);
    offset = PlainValue.Node.endOfWhiteSpace(src, offset);
    offset = this.parseComment(offset);
    return offset;
  }

}

function createNewNode(type, props) {
  switch (type) {
    case PlainValue.Type.ALIAS:
      return new Alias(type, props);

    case PlainValue.Type.BLOCK_FOLDED:
    case PlainValue.Type.BLOCK_LITERAL:
      return new BlockValue(type, props);

    case PlainValue.Type.FLOW_MAP:
    case PlainValue.Type.FLOW_SEQ:
      return new FlowCollection(type, props);

    case PlainValue.Type.MAP_KEY:
    case PlainValue.Type.MAP_VALUE:
    case PlainValue.Type.SEQ_ITEM:
      return new CollectionItem(type, props);

    case PlainValue.Type.COMMENT:
    case PlainValue.Type.PLAIN:
      return new PlainValue.PlainValue(type, props);

    case PlainValue.Type.QUOTE_DOUBLE:
      return new QuoteDouble(type, props);

    case PlainValue.Type.QUOTE_SINGLE:
      return new QuoteSingle(type, props);

    /* istanbul ignore next */

    default:
      return null;
    // should never happen
  }
}
/**
 * @param {boolean} atLineStart - Node starts at beginning of line
 * @param {boolean} inFlow - true if currently in a flow context
 * @param {boolean} inCollection - true if currently in a collection context
 * @param {number} indent - Current level of indentation
 * @param {number} lineStart - Start of the current line
 * @param {Node} parent - The parent of the node
 * @param {string} src - Source of the YAML document
 */


class ParseContext {
  static parseType(src, offset, inFlow) {
    switch (src[offset]) {
      case '*':
        return PlainValue.Type.ALIAS;

      case '>':
        return PlainValue.Type.BLOCK_FOLDED;

      case '|':
        return PlainValue.Type.BLOCK_LITERAL;

      case '{':
        return PlainValue.Type.FLOW_MAP;

      case '[':
        return PlainValue.Type.FLOW_SEQ;

      case '?':
        return !inFlow && PlainValue.Node.atBlank(src, offset + 1, true) ? PlainValue.Type.MAP_KEY : PlainValue.Type.PLAIN;

      case ':':
        return !inFlow && PlainValue.Node.atBlank(src, offset + 1, true) ? PlainValue.Type.MAP_VALUE : PlainValue.Type.PLAIN;

      case '-':
        return !inFlow && PlainValue.Node.atBlank(src, offset + 1, true) ? PlainValue.Type.SEQ_ITEM : PlainValue.Type.PLAIN;

      case '"':
        return PlainValue.Type.QUOTE_DOUBLE;

      case "'":
        return PlainValue.Type.QUOTE_SINGLE;

      default:
        return PlainValue.Type.PLAIN;
    }
  }

  constructor(orig = {}, {
    atLineStart,
    inCollection,
    inFlow,
    indent,
    lineStart,
    parent
  } = {}) {
    PlainValue._defineProperty(this, "parseNode", (overlay, start) => {
      if (PlainValue.Node.atDocumentBoundary(this.src, start)) return null;
      const context = new ParseContext(this, overlay);
      const {
        props,
        type,
        valueStart
      } = context.parseProps(start);
      const node = createNewNode(type, props);
      let offset = node.parse(context, valueStart);
      node.range = new PlainValue.Range(start, offset);
      /* istanbul ignore if */

      if (offset <= start) {
        // This should never happen, but if it does, let's make sure to at least
        // step one character forward to avoid a busy loop.
        node.error = new Error(`Node#parse consumed no characters`);
        node.error.parseEnd = offset;
        node.error.source = node;
        node.range.end = start + 1;
      }

      if (context.nodeStartsCollection(node)) {
        if (!node.error && !context.atLineStart && context.parent.type === PlainValue.Type.DOCUMENT) {
          node.error = new PlainValue.YAMLSyntaxError(node, 'Block collection must not have preceding content here (e.g. directives-end indicator)');
        }

        const collection = new Collection(node);
        offset = collection.parse(new ParseContext(context), offset);
        collection.range = new PlainValue.Range(start, offset);
        return collection;
      }

      return node;
    });

    this.atLineStart = atLineStart != null ? atLineStart : orig.atLineStart || false;
    this.inCollection = inCollection != null ? inCollection : orig.inCollection || false;
    this.inFlow = inFlow != null ? inFlow : orig.inFlow || false;
    this.indent = indent != null ? indent : orig.indent;
    this.lineStart = lineStart != null ? lineStart : orig.lineStart;
    this.parent = parent != null ? parent : orig.parent || {};
    this.root = orig.root;
    this.src = orig.src;
  }

  nodeStartsCollection(node) {
    const {
      inCollection,
      inFlow,
      src
    } = this;
    if (inCollection || inFlow) return false;
    if (node instanceof CollectionItem) return true; // check for implicit key

    let offset = node.range.end;
    if (src[offset] === '\n' || src[offset - 1] === '\n') return false;
    offset = PlainValue.Node.endOfWhiteSpace(src, offset);
    return src[offset] === ':';
  } // Anchor and tag are before type, which determines the node implementation
  // class; hence this intermediate step.


  parseProps(offset) {
    const {
      inFlow,
      parent,
      src
    } = this;
    const props = [];
    let lineHasProps = false;
    offset = this.atLineStart ? PlainValue.Node.endOfIndent(src, offset) : PlainValue.Node.endOfWhiteSpace(src, offset);
    let ch = src[offset];

    while (ch === PlainValue.Char.ANCHOR || ch === PlainValue.Char.COMMENT || ch === PlainValue.Char.TAG || ch === '\n') {
      if (ch === '\n') {
        const lineStart = offset + 1;
        const inEnd = PlainValue.Node.endOfIndent(src, lineStart);
        const indentDiff = inEnd - (lineStart + this.indent);
        const noIndicatorAsIndent = parent.type === PlainValue.Type.SEQ_ITEM && parent.context.atLineStart;
        if (!PlainValue.Node.nextNodeIsIndented(src[inEnd], indentDiff, !noIndicatorAsIndent)) break;
        this.atLineStart = true;
        this.lineStart = lineStart;
        lineHasProps = false;
        offset = inEnd;
      } else if (ch === PlainValue.Char.COMMENT) {
        const end = PlainValue.Node.endOfLine(src, offset + 1);
        props.push(new PlainValue.Range(offset, end));
        offset = end;
      } else {
        let end = PlainValue.Node.endOfIdentifier(src, offset + 1);

        if (ch === PlainValue.Char.TAG && src[end] === ',' && /^[a-zA-Z0-9-]+\.[a-zA-Z0-9-]+,\d\d\d\d(-\d\d){0,2}\/\S/.test(src.slice(offset + 1, end + 13))) {
          // Let's presume we're dealing with a YAML 1.0 domain tag here, rather
          // than an empty but 'foo.bar' private-tagged node in a flow collection
          // followed without whitespace by a plain string starting with a year
          // or date divided by something.
          end = PlainValue.Node.endOfIdentifier(src, end + 5);
        }

        props.push(new PlainValue.Range(offset, end));
        lineHasProps = true;
        offset = PlainValue.Node.endOfWhiteSpace(src, end);
      }

      ch = src[offset];
    } // '- &a : b' has an anchor on an empty node


    if (lineHasProps && ch === ':' && PlainValue.Node.atBlank(src, offset + 1, true)) offset -= 1;
    const type = ParseContext.parseType(src, offset, inFlow);
    return {
      props,
      type,
      valueStart: offset
    };
  }
  /**
   * Parses a node from the source
   * @param {ParseContext} overlay
   * @param {number} start - Index of first non-whitespace character for the node
   * @returns {?Node} - null if at a document boundary
   */


}

// Published as 'yaml/parse-cst'
function parse(src) {
  const cr = [];

  if (src.indexOf('\r') !== -1) {
    src = src.replace(/\r\n?/g, (match, offset) => {
      if (match.length > 1) cr.push(offset);
      return '\n';
    });
  }

  const documents = [];
  let offset = 0;

  do {
    const doc = new Document();
    const context = new ParseContext({
      src
    });
    offset = doc.parse(context, offset);
    documents.push(doc);
  } while (offset < src.length);

  documents.setOrigRanges = () => {
    if (cr.length === 0) return false;

    for (let i = 1; i < cr.length; ++i) cr[i] -= i;

    let crOffset = 0;

    for (let i = 0; i < documents.length; ++i) {
      crOffset = documents[i].setOrigRanges(cr, crOffset);
    }

    cr.splice(0, cr.length);
    return true;
  };

  documents.toString = () => documents.join('...\n');

  return documents;
}

exports.parse = parse;


/***/ }),

/***/ 6140:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


var PlainValue = __webpack_require__(5215);

function addCommentBefore(str, indent, comment) {
  if (!comment) return str;
  const cc = comment.replace(/[\s\S]^/gm, `$&${indent}#`);
  return `#${cc}\n${indent}${str}`;
}
function addComment(str, indent, comment) {
  return !comment ? str : comment.indexOf('\n') === -1 ? `${str} #${comment}` : `${str}\n` + comment.replace(/^/gm, `${indent || ''}#`);
}

class Node {}

function toJSON(value, arg, ctx) {
  if (Array.isArray(value)) return value.map((v, i) => toJSON(v, String(i), ctx));

  if (value && typeof value.toJSON === 'function') {
    const anchor = ctx && ctx.anchors && ctx.anchors.get(value);
    if (anchor) ctx.onCreate = res => {
      anchor.res = res;
      delete ctx.onCreate;
    };
    const res = value.toJSON(arg, ctx);
    if (anchor && ctx.onCreate) ctx.onCreate(res);
    return res;
  }

  if ((!ctx || !ctx.keep) && typeof value === 'bigint') return Number(value);
  return value;
}

class Scalar extends Node {
  constructor(value) {
    super();
    this.value = value;
  }

  toJSON(arg, ctx) {
    return ctx && ctx.keep ? this.value : toJSON(this.value, arg, ctx);
  }

  toString() {
    return String(this.value);
  }

}

function collectionFromPath(schema, path, value) {
  let v = value;

  for (let i = path.length - 1; i >= 0; --i) {
    const k = path[i];
    const o = Number.isInteger(k) && k >= 0 ? [] : {};
    o[k] = v;
    v = o;
  }

  return schema.createNode(v, false);
} // null, undefined, or an empty non-string iterable (e.g. [])


const isEmptyPath = path => path == null || typeof path === 'object' && path[Symbol.iterator]().next().done;
class Collection extends Node {
  constructor(schema) {
    super();

    PlainValue._defineProperty(this, "items", []);

    this.schema = schema;
  }

  addIn(path, value) {
    if (isEmptyPath(path)) this.add(value);else {
      const [key, ...rest] = path;
      const node = this.get(key, true);
      if (node instanceof Collection) node.addIn(rest, value);else if (node === undefined && this.schema) this.set(key, collectionFromPath(this.schema, rest, value));else throw new Error(`Expected YAML collection at ${key}. Remaining path: ${rest}`);
    }
  }

  deleteIn([key, ...rest]) {
    if (rest.length === 0) return this.delete(key);
    const node = this.get(key, true);
    if (node instanceof Collection) return node.deleteIn(rest);else throw new Error(`Expected YAML collection at ${key}. Remaining path: ${rest}`);
  }

  getIn([key, ...rest], keepScalar) {
    const node = this.get(key, true);
    if (rest.length === 0) return !keepScalar && node instanceof Scalar ? node.value : node;else return node instanceof Collection ? node.getIn(rest, keepScalar) : undefined;
  }

  hasAllNullValues() {
    return this.items.every(node => {
      if (!node || node.type !== 'PAIR') return false;
      const n = node.value;
      return n == null || n instanceof Scalar && n.value == null && !n.commentBefore && !n.comment && !n.tag;
    });
  }

  hasIn([key, ...rest]) {
    if (rest.length === 0) return this.has(key);
    const node = this.get(key, true);
    return node instanceof Collection ? node.hasIn(rest) : false;
  }

  setIn([key, ...rest], value) {
    if (rest.length === 0) {
      this.set(key, value);
    } else {
      const node = this.get(key, true);
      if (node instanceof Collection) node.setIn(rest, value);else if (node === undefined && this.schema) this.set(key, collectionFromPath(this.schema, rest, value));else throw new Error(`Expected YAML collection at ${key}. Remaining path: ${rest}`);
    }
  } // overridden in implementations

  /* istanbul ignore next */


  toJSON() {
    return null;
  }

  toString(ctx, {
    blockItem,
    flowChars,
    isMap,
    itemIndent
  }, onComment, onChompKeep) {
    const {
      indent,
      indentStep,
      stringify
    } = ctx;
    const inFlow = this.type === PlainValue.Type.FLOW_MAP || this.type === PlainValue.Type.FLOW_SEQ || ctx.inFlow;
    if (inFlow) itemIndent += indentStep;
    const allNullValues = isMap && this.hasAllNullValues();
    ctx = Object.assign({}, ctx, {
      allNullValues,
      indent: itemIndent,
      inFlow,
      type: null
    });
    let chompKeep = false;
    let hasItemWithNewLine = false;
    const nodes = this.items.reduce((nodes, item, i) => {
      let comment;

      if (item) {
        if (!chompKeep && item.spaceBefore) nodes.push({
          type: 'comment',
          str: ''
        });
        if (item.commentBefore) item.commentBefore.match(/^.*$/gm).forEach(line => {
          nodes.push({
            type: 'comment',
            str: `#${line}`
          });
        });
        if (item.comment) comment = item.comment;
        if (inFlow && (!chompKeep && item.spaceBefore || item.commentBefore || item.comment || item.key && (item.key.commentBefore || item.key.comment) || item.value && (item.value.commentBefore || item.value.comment))) hasItemWithNewLine = true;
      }

      chompKeep = false;
      let str = stringify(item, ctx, () => comment = null, () => chompKeep = true);
      if (inFlow && !hasItemWithNewLine && str.includes('\n')) hasItemWithNewLine = true;
      if (inFlow && i < this.items.length - 1) str += ',';
      str = addComment(str, itemIndent, comment);
      if (chompKeep && (comment || inFlow)) chompKeep = false;
      nodes.push({
        type: 'item',
        str
      });
      return nodes;
    }, []);
    let str;

    if (nodes.length === 0) {
      str = flowChars.start + flowChars.end;
    } else if (inFlow) {
      const {
        start,
        end
      } = flowChars;
      const strings = nodes.map(n => n.str);

      if (hasItemWithNewLine || strings.reduce((sum, str) => sum + str.length + 2, 2) > Collection.maxFlowStringSingleLineLength) {
        str = start;

        for (const s of strings) {
          str += s ? `\n${indentStep}${indent}${s}` : '\n';
        }

        str += `\n${indent}${end}`;
      } else {
        str = `${start} ${strings.join(' ')} ${end}`;
      }
    } else {
      const strings = nodes.map(blockItem);
      str = strings.shift();

      for (const s of strings) str += s ? `\n${indent}${s}` : '\n';
    }

    if (this.comment) {
      str += '\n' + this.comment.replace(/^/gm, `${indent}#`);
      if (onComment) onComment();
    } else if (chompKeep && onChompKeep) onChompKeep();

    return str;
  }

}

PlainValue._defineProperty(Collection, "maxFlowStringSingleLineLength", 60);

function asItemIndex(key) {
  let idx = key instanceof Scalar ? key.value : key;
  if (idx && typeof idx === 'string') idx = Number(idx);
  return Number.isInteger(idx) && idx >= 0 ? idx : null;
}

class YAMLSeq extends Collection {
  add(value) {
    this.items.push(value);
  }

  delete(key) {
    const idx = asItemIndex(key);
    if (typeof idx !== 'number') return false;
    const del = this.items.splice(idx, 1);
    return del.length > 0;
  }

  get(key, keepScalar) {
    const idx = asItemIndex(key);
    if (typeof idx !== 'number') return undefined;
    const it = this.items[idx];
    return !keepScalar && it instanceof Scalar ? it.value : it;
  }

  has(key) {
    const idx = asItemIndex(key);
    return typeof idx === 'number' && idx < this.items.length;
  }

  set(key, value) {
    const idx = asItemIndex(key);
    if (typeof idx !== 'number') throw new Error(`Expected a valid index, not ${key}.`);
    this.items[idx] = value;
  }

  toJSON(_, ctx) {
    const seq = [];
    if (ctx && ctx.onCreate) ctx.onCreate(seq);
    let i = 0;

    for (const item of this.items) seq.push(toJSON(item, String(i++), ctx));

    return seq;
  }

  toString(ctx, onComment, onChompKeep) {
    if (!ctx) return JSON.stringify(this);
    return super.toString(ctx, {
      blockItem: n => n.type === 'comment' ? n.str : `- ${n.str}`,
      flowChars: {
        start: '[',
        end: ']'
      },
      isMap: false,
      itemIndent: (ctx.indent || '') + '  '
    }, onComment, onChompKeep);
  }

}

const stringifyKey = (key, jsKey, ctx) => {
  if (jsKey === null) return '';
  if (typeof jsKey !== 'object') return String(jsKey);
  if (key instanceof Node && ctx && ctx.doc) return key.toString({
    anchors: {},
    doc: ctx.doc,
    indent: '',
    indentStep: ctx.indentStep,
    inFlow: true,
    inStringifyKey: true,
    stringify: ctx.stringify
  });
  return JSON.stringify(jsKey);
};

class Pair extends Node {
  constructor(key, value = null) {
    super();
    this.key = key;
    this.value = value;
    this.type = Pair.Type.PAIR;
  }

  get commentBefore() {
    return this.key instanceof Node ? this.key.commentBefore : undefined;
  }

  set commentBefore(cb) {
    if (this.key == null) this.key = new Scalar(null);
    if (this.key instanceof Node) this.key.commentBefore = cb;else {
      const msg = 'Pair.commentBefore is an alias for Pair.key.commentBefore. To set it, the key must be a Node.';
      throw new Error(msg);
    }
  }

  addToJSMap(ctx, map) {
    const key = toJSON(this.key, '', ctx);

    if (map instanceof Map) {
      const value = toJSON(this.value, key, ctx);
      map.set(key, value);
    } else if (map instanceof Set) {
      map.add(key);
    } else {
      const stringKey = stringifyKey(this.key, key, ctx);
      map[stringKey] = toJSON(this.value, stringKey, ctx);
    }

    return map;
  }

  toJSON(_, ctx) {
    const pair = ctx && ctx.mapAsMap ? new Map() : {};
    return this.addToJSMap(ctx, pair);
  }

  toString(ctx, onComment, onChompKeep) {
    if (!ctx || !ctx.doc) return JSON.stringify(this);
    const {
      indent: indentSize,
      indentSeq,
      simpleKeys
    } = ctx.doc.options;
    let {
      key,
      value
    } = this;
    let keyComment = key instanceof Node && key.comment;

    if (simpleKeys) {
      if (keyComment) {
        throw new Error('With simple keys, key nodes cannot have comments');
      }

      if (key instanceof Collection) {
        const msg = 'With simple keys, collection cannot be used as a key value';
        throw new Error(msg);
      }
    }

    const explicitKey = !simpleKeys && (!key || keyComment || key instanceof Collection || key.type === PlainValue.Type.BLOCK_FOLDED || key.type === PlainValue.Type.BLOCK_LITERAL);
    const {
      doc,
      indent,
      indentStep,
      stringify
    } = ctx;
    ctx = Object.assign({}, ctx, {
      implicitKey: !explicitKey,
      indent: indent + indentStep
    });
    let chompKeep = false;
    let str = stringify(key, ctx, () => keyComment = null, () => chompKeep = true);
    str = addComment(str, ctx.indent, keyComment);

    if (ctx.allNullValues && !simpleKeys) {
      if (this.comment) {
        str = addComment(str, ctx.indent, this.comment);
        if (onComment) onComment();
      } else if (chompKeep && !keyComment && onChompKeep) onChompKeep();

      return ctx.inFlow ? str : `? ${str}`;
    }

    str = explicitKey ? `? ${str}\n${indent}:` : `${str}:`;

    if (this.comment) {
      // expected (but not strictly required) to be a single-line comment
      str = addComment(str, ctx.indent, this.comment);
      if (onComment) onComment();
    }

    let vcb = '';
    let valueComment = null;

    if (value instanceof Node) {
      if (value.spaceBefore) vcb = '\n';

      if (value.commentBefore) {
        const cs = value.commentBefore.replace(/^/gm, `${ctx.indent}#`);
        vcb += `\n${cs}`;
      }

      valueComment = value.comment;
    } else if (value && typeof value === 'object') {
      value = doc.schema.createNode(value, true);
    }

    ctx.implicitKey = false;
    if (!explicitKey && !this.comment && value instanceof Scalar) ctx.indentAtStart = str.length + 1;
    chompKeep = false;

    if (!indentSeq && indentSize >= 2 && !ctx.inFlow && !explicitKey && value instanceof YAMLSeq && value.type !== PlainValue.Type.FLOW_SEQ && !value.tag && !doc.anchors.getName(value)) {
      // If indentSeq === false, consider '- ' as part of indentation where possible
      ctx.indent = ctx.indent.substr(2);
    }

    const valueStr = stringify(value, ctx, () => valueComment = null, () => chompKeep = true);
    let ws = ' ';

    if (vcb || this.comment) {
      ws = `${vcb}\n${ctx.indent}`;
    } else if (!explicitKey && value instanceof Collection) {
      const flow = valueStr[0] === '[' || valueStr[0] === '{';
      if (!flow || valueStr.includes('\n')) ws = `\n${ctx.indent}`;
    }

    if (chompKeep && !valueComment && onChompKeep) onChompKeep();
    return addComment(str + ws + valueStr, ctx.indent, valueComment);
  }

}

PlainValue._defineProperty(Pair, "Type", {
  PAIR: 'PAIR',
  MERGE_PAIR: 'MERGE_PAIR'
});

const getAliasCount = (node, anchors) => {
  if (node instanceof Alias) {
    const anchor = anchors.get(node.source);
    return anchor.count * anchor.aliasCount;
  } else if (node instanceof Collection) {
    let count = 0;

    for (const item of node.items) {
      const c = getAliasCount(item, anchors);
      if (c > count) count = c;
    }

    return count;
  } else if (node instanceof Pair) {
    const kc = getAliasCount(node.key, anchors);
    const vc = getAliasCount(node.value, anchors);
    return Math.max(kc, vc);
  }

  return 1;
};

class Alias extends Node {
  static stringify({
    range,
    source
  }, {
    anchors,
    doc,
    implicitKey,
    inStringifyKey
  }) {
    let anchor = Object.keys(anchors).find(a => anchors[a] === source);
    if (!anchor && inStringifyKey) anchor = doc.anchors.getName(source) || doc.anchors.newName();
    if (anchor) return `*${anchor}${implicitKey ? ' ' : ''}`;
    const msg = doc.anchors.getName(source) ? 'Alias node must be after source node' : 'Source node not found for alias node';
    throw new Error(`${msg} [${range}]`);
  }

  constructor(source) {
    super();
    this.source = source;
    this.type = PlainValue.Type.ALIAS;
  }

  set tag(t) {
    throw new Error('Alias nodes cannot have tags');
  }

  toJSON(arg, ctx) {
    if (!ctx) return toJSON(this.source, arg, ctx);
    const {
      anchors,
      maxAliasCount
    } = ctx;
    const anchor = anchors.get(this.source);
    /* istanbul ignore if */

    if (!anchor || anchor.res === undefined) {
      const msg = 'This should not happen: Alias anchor was not resolved?';
      if (this.cstNode) throw new PlainValue.YAMLReferenceError(this.cstNode, msg);else throw new ReferenceError(msg);
    }

    if (maxAliasCount >= 0) {
      anchor.count += 1;
      if (anchor.aliasCount === 0) anchor.aliasCount = getAliasCount(this.source, anchors);

      if (anchor.count * anchor.aliasCount > maxAliasCount) {
        const msg = 'Excessive alias count indicates a resource exhaustion attack';
        if (this.cstNode) throw new PlainValue.YAMLReferenceError(this.cstNode, msg);else throw new ReferenceError(msg);
      }
    }

    return anchor.res;
  } // Only called when stringifying an alias mapping key while constructing
  // Object output.


  toString(ctx) {
    return Alias.stringify(this, ctx);
  }

}

PlainValue._defineProperty(Alias, "default", true);

function findPair(items, key) {
  const k = key instanceof Scalar ? key.value : key;

  for (const it of items) {
    if (it instanceof Pair) {
      if (it.key === key || it.key === k) return it;
      if (it.key && it.key.value === k) return it;
    }
  }

  return undefined;
}
class YAMLMap extends Collection {
  add(pair, overwrite) {
    if (!pair) pair = new Pair(pair);else if (!(pair instanceof Pair)) pair = new Pair(pair.key || pair, pair.value);
    const prev = findPair(this.items, pair.key);
    const sortEntries = this.schema && this.schema.sortMapEntries;

    if (prev) {
      if (overwrite) prev.value = pair.value;else throw new Error(`Key ${pair.key} already set`);
    } else if (sortEntries) {
      const i = this.items.findIndex(item => sortEntries(pair, item) < 0);
      if (i === -1) this.items.push(pair);else this.items.splice(i, 0, pair);
    } else {
      this.items.push(pair);
    }
  }

  delete(key) {
    const it = findPair(this.items, key);
    if (!it) return false;
    const del = this.items.splice(this.items.indexOf(it), 1);
    return del.length > 0;
  }

  get(key, keepScalar) {
    const it = findPair(this.items, key);
    const node = it && it.value;
    return !keepScalar && node instanceof Scalar ? node.value : node;
  }

  has(key) {
    return !!findPair(this.items, key);
  }

  set(key, value) {
    this.add(new Pair(key, value), true);
  }
  /**
   * @param {*} arg ignored
   * @param {*} ctx Conversion context, originally set in Document#toJSON()
   * @param {Class} Type If set, forces the returned collection type
   * @returns {*} Instance of Type, Map, or Object
   */


  toJSON(_, ctx, Type) {
    const map = Type ? new Type() : ctx && ctx.mapAsMap ? new Map() : {};
    if (ctx && ctx.onCreate) ctx.onCreate(map);

    for (const item of this.items) item.addToJSMap(ctx, map);

    return map;
  }

  toString(ctx, onComment, onChompKeep) {
    if (!ctx) return JSON.stringify(this);

    for (const item of this.items) {
      if (!(item instanceof Pair)) throw new Error(`Map items must all be pairs; found ${JSON.stringify(item)} instead`);
    }

    return super.toString(ctx, {
      blockItem: n => n.str,
      flowChars: {
        start: '{',
        end: '}'
      },
      isMap: true,
      itemIndent: ctx.indent || ''
    }, onComment, onChompKeep);
  }

}

const MERGE_KEY = '<<';
class Merge extends Pair {
  constructor(pair) {
    if (pair instanceof Pair) {
      let seq = pair.value;

      if (!(seq instanceof YAMLSeq)) {
        seq = new YAMLSeq();
        seq.items.push(pair.value);
        seq.range = pair.value.range;
      }

      super(pair.key, seq);
      this.range = pair.range;
    } else {
      super(new Scalar(MERGE_KEY), new YAMLSeq());
    }

    this.type = Pair.Type.MERGE_PAIR;
  } // If the value associated with a merge key is a single mapping node, each of
  // its key/value pairs is inserted into the current mapping, unless the key
  // already exists in it. If the value associated with the merge key is a
  // sequence, then this sequence is expected to contain mapping nodes and each
  // of these nodes is merged in turn according to its order in the sequence.
  // Keys in mapping nodes earlier in the sequence override keys specified in
  // later mapping nodes. -- http://yaml.org/type/merge.html


  addToJSMap(ctx, map) {
    for (const {
      source
    } of this.value.items) {
      if (!(source instanceof YAMLMap)) throw new Error('Merge sources must be maps');
      const srcMap = source.toJSON(null, ctx, Map);

      for (const [key, value] of srcMap) {
        if (map instanceof Map) {
          if (!map.has(key)) map.set(key, value);
        } else if (map instanceof Set) {
          map.add(key);
        } else {
          if (!Object.prototype.hasOwnProperty.call(map, key)) map[key] = value;
        }
      }
    }

    return map;
  }

  toString(ctx, onComment) {
    const seq = this.value;
    if (seq.items.length > 1) return super.toString(ctx, onComment);
    this.value = seq.items[0];
    const str = super.toString(ctx, onComment);
    this.value = seq;
    return str;
  }

}

const binaryOptions = {
  defaultType: PlainValue.Type.BLOCK_LITERAL,
  lineWidth: 76
};
const boolOptions = {
  trueStr: 'true',
  falseStr: 'false'
};
const intOptions = {
  asBigInt: false
};
const nullOptions = {
  nullStr: 'null'
};
const strOptions = {
  defaultType: PlainValue.Type.PLAIN,
  doubleQuoted: {
    jsonEncoding: false,
    minMultiLineLength: 40
  },
  fold: {
    lineWidth: 80,
    minContentWidth: 20
  }
};

function resolveScalar(str, tags, scalarFallback) {
  for (const {
    format,
    test,
    resolve
  } of tags) {
    if (test) {
      const match = str.match(test);

      if (match) {
        let res = resolve.apply(null, match);
        if (!(res instanceof Scalar)) res = new Scalar(res);
        if (format) res.format = format;
        return res;
      }
    }
  }

  if (scalarFallback) str = scalarFallback(str);
  return new Scalar(str);
}

const FOLD_FLOW = 'flow';
const FOLD_BLOCK = 'block';
const FOLD_QUOTED = 'quoted'; // presumes i+1 is at the start of a line
// returns index of last newline in more-indented block

const consumeMoreIndentedLines = (text, i) => {
  let ch = text[i + 1];

  while (ch === ' ' || ch === '\t') {
    do {
      ch = text[i += 1];
    } while (ch && ch !== '\n');

    ch = text[i + 1];
  }

  return i;
};
/**
 * Tries to keep input at up to `lineWidth` characters, splitting only on spaces
 * not followed by newlines or spaces unless `mode` is `'quoted'`. Lines are
 * terminated with `\n` and started with `indent`.
 *
 * @param {string} text
 * @param {string} indent
 * @param {string} [mode='flow'] `'block'` prevents more-indented lines
 *   from being folded; `'quoted'` allows for `\` escapes, including escaped
 *   newlines
 * @param {Object} options
 * @param {number} [options.indentAtStart] Accounts for leading contents on
 *   the first line, defaulting to `indent.length`
 * @param {number} [options.lineWidth=80]
 * @param {number} [options.minContentWidth=20] Allow highly indented lines to
 *   stretch the line width
 * @param {function} options.onFold Called once if the text is folded
 * @param {function} options.onFold Called once if any line of text exceeds
 *   lineWidth characters
 */


function foldFlowLines(text, indent, mode, {
  indentAtStart,
  lineWidth = 80,
  minContentWidth = 20,
  onFold,
  onOverflow
}) {
  if (!lineWidth || lineWidth < 0) return text;
  const endStep = Math.max(1 + minContentWidth, 1 + lineWidth - indent.length);
  if (text.length <= endStep) return text;
  const folds = [];
  const escapedFolds = {};
  let end = lineWidth - (typeof indentAtStart === 'number' ? indentAtStart : indent.length);
  let split = undefined;
  let prev = undefined;
  let overflow = false;
  let i = -1;

  if (mode === FOLD_BLOCK) {
    i = consumeMoreIndentedLines(text, i);
    if (i !== -1) end = i + endStep;
  }

  for (let ch; ch = text[i += 1];) {
    if (mode === FOLD_QUOTED && ch === '\\') {
      switch (text[i + 1]) {
        case 'x':
          i += 3;
          break;

        case 'u':
          i += 5;
          break;

        case 'U':
          i += 9;
          break;

        default:
          i += 1;
      }
    }

    if (ch === '\n') {
      if (mode === FOLD_BLOCK) i = consumeMoreIndentedLines(text, i);
      end = i + endStep;
      split = undefined;
    } else {
      if (ch === ' ' && prev && prev !== ' ' && prev !== '\n' && prev !== '\t') {
        // space surrounded by non-space can be replaced with newline + indent
        const next = text[i + 1];
        if (next && next !== ' ' && next !== '\n' && next !== '\t') split = i;
      }

      if (i >= end) {
        if (split) {
          folds.push(split);
          end = split + endStep;
          split = undefined;
        } else if (mode === FOLD_QUOTED) {
          // white-space collected at end may stretch past lineWidth
          while (prev === ' ' || prev === '\t') {
            prev = ch;
            ch = text[i += 1];
            overflow = true;
          } // i - 2 accounts for not-dropped last char + newline-escaping \


          folds.push(i - 2);
          escapedFolds[i - 2] = true;
          end = i - 2 + endStep;
          split = undefined;
        } else {
          overflow = true;
        }
      }
    }

    prev = ch;
  }

  if (overflow && onOverflow) onOverflow();
  if (folds.length === 0) return text;
  if (onFold) onFold();
  let res = text.slice(0, folds[0]);

  for (let i = 0; i < folds.length; ++i) {
    const fold = folds[i];
    const end = folds[i + 1] || text.length;
    if (mode === FOLD_QUOTED && escapedFolds[fold]) res += `${text[fold]}\\`;
    res += `\n${indent}${text.slice(fold + 1, end)}`;
  }

  return res;
}

const getFoldOptions = ({
  indentAtStart
}) => indentAtStart ? Object.assign({
  indentAtStart
}, strOptions.fold) : strOptions.fold; // Also checks for lines starting with %, as parsing the output as YAML 1.1 will
// presume that's starting a new document.


const containsDocumentMarker = str => /^(%|---|\.\.\.)/m.test(str);

function lineLengthOverLimit(str, limit) {
  const strLen = str.length;
  if (strLen <= limit) return false;

  for (let i = 0, start = 0; i < strLen; ++i) {
    if (str[i] === '\n') {
      if (i - start > limit) return true;
      start = i + 1;
      if (strLen - start <= limit) return false;
    }
  }

  return true;
}

function doubleQuotedString(value, ctx) {
  const {
    implicitKey
  } = ctx;
  const {
    jsonEncoding,
    minMultiLineLength
  } = strOptions.doubleQuoted;
  const json = JSON.stringify(value);
  if (jsonEncoding) return json;
  const indent = ctx.indent || (containsDocumentMarker(value) ? '  ' : '');
  let str = '';
  let start = 0;

  for (let i = 0, ch = json[i]; ch; ch = json[++i]) {
    if (ch === ' ' && json[i + 1] === '\\' && json[i + 2] === 'n') {
      // space before newline needs to be escaped to not be folded
      str += json.slice(start, i) + '\\ ';
      i += 1;
      start = i;
      ch = '\\';
    }

    if (ch === '\\') switch (json[i + 1]) {
      case 'u':
        {
          str += json.slice(start, i);
          const code = json.substr(i + 2, 4);

          switch (code) {
            case '0000':
              str += '\\0';
              break;

            case '0007':
              str += '\\a';
              break;

            case '000b':
              str += '\\v';
              break;

            case '001b':
              str += '\\e';
              break;

            case '0085':
              str += '\\N';
              break;

            case '00a0':
              str += '\\_';
              break;

            case '2028':
              str += '\\L';
              break;

            case '2029':
              str += '\\P';
              break;

            default:
              if (code.substr(0, 2) === '00') str += '\\x' + code.substr(2);else str += json.substr(i, 6);
          }

          i += 5;
          start = i + 1;
        }
        break;

      case 'n':
        if (implicitKey || json[i + 2] === '"' || json.length < minMultiLineLength) {
          i += 1;
        } else {
          // folding will eat first newline
          str += json.slice(start, i) + '\n\n';

          while (json[i + 2] === '\\' && json[i + 3] === 'n' && json[i + 4] !== '"') {
            str += '\n';
            i += 2;
          }

          str += indent; // space after newline needs to be escaped to not be folded

          if (json[i + 2] === ' ') str += '\\';
          i += 1;
          start = i + 1;
        }

        break;

      default:
        i += 1;
    }
  }

  str = start ? str + json.slice(start) : json;
  return implicitKey ? str : foldFlowLines(str, indent, FOLD_QUOTED, getFoldOptions(ctx));
}

function singleQuotedString(value, ctx) {
  if (ctx.implicitKey) {
    if (/\n/.test(value)) return doubleQuotedString(value, ctx);
  } else {
    // single quoted string can't have leading or trailing whitespace around newline
    if (/[ \t]\n|\n[ \t]/.test(value)) return doubleQuotedString(value, ctx);
  }

  const indent = ctx.indent || (containsDocumentMarker(value) ? '  ' : '');
  const res = "'" + value.replace(/'/g, "''").replace(/\n+/g, `$&\n${indent}`) + "'";
  return ctx.implicitKey ? res : foldFlowLines(res, indent, FOLD_FLOW, getFoldOptions(ctx));
}

function blockString({
  comment,
  type,
  value
}, ctx, onComment, onChompKeep) {
  // 1. Block can't end in whitespace unless the last line is non-empty.
  // 2. Strings consisting of only whitespace are best rendered explicitly.
  if (/\n[\t ]+$/.test(value) || /^\s*$/.test(value)) {
    return doubleQuotedString(value, ctx);
  }

  const indent = ctx.indent || (ctx.forceBlockIndent || containsDocumentMarker(value) ? '  ' : '');
  const indentSize = indent ? '2' : '1'; // root is at -1

  const literal = type === PlainValue.Type.BLOCK_FOLDED ? false : type === PlainValue.Type.BLOCK_LITERAL ? true : !lineLengthOverLimit(value, strOptions.fold.lineWidth - indent.length);
  let header = literal ? '|' : '>';
  if (!value) return header + '\n';
  let wsStart = '';
  let wsEnd = '';
  value = value.replace(/[\n\t ]*$/, ws => {
    const n = ws.indexOf('\n');

    if (n === -1) {
      header += '-'; // strip
    } else if (value === ws || n !== ws.length - 1) {
      header += '+'; // keep

      if (onChompKeep) onChompKeep();
    }

    wsEnd = ws.replace(/\n$/, '');
    return '';
  }).replace(/^[\n ]*/, ws => {
    if (ws.indexOf(' ') !== -1) header += indentSize;
    const m = ws.match(/ +$/);

    if (m) {
      wsStart = ws.slice(0, -m[0].length);
      return m[0];
    } else {
      wsStart = ws;
      return '';
    }
  });
  if (wsEnd) wsEnd = wsEnd.replace(/\n+(?!\n|$)/g, `$&${indent}`);
  if (wsStart) wsStart = wsStart.replace(/\n+/g, `$&${indent}`);

  if (comment) {
    header += ' #' + comment.replace(/ ?[\r\n]+/g, ' ');
    if (onComment) onComment();
  }

  if (!value) return `${header}${indentSize}\n${indent}${wsEnd}`;

  if (literal) {
    value = value.replace(/\n+/g, `$&${indent}`);
    return `${header}\n${indent}${wsStart}${value}${wsEnd}`;
  }

  value = value.replace(/\n+/g, '\n$&').replace(/(?:^|\n)([\t ].*)(?:([\n\t ]*)\n(?![\n\t ]))?/g, '$1$2') // more-indented lines aren't folded
  //         ^ ind.line  ^ empty     ^ capture next empty lines only at end of indent
  .replace(/\n+/g, `$&${indent}`);
  const body = foldFlowLines(`${wsStart}${value}${wsEnd}`, indent, FOLD_BLOCK, strOptions.fold);
  return `${header}\n${indent}${body}`;
}

function plainString(item, ctx, onComment, onChompKeep) {
  const {
    comment,
    type,
    value
  } = item;
  const {
    actualString,
    implicitKey,
    indent,
    inFlow
  } = ctx;

  if (implicitKey && /[\n[\]{},]/.test(value) || inFlow && /[[\]{},]/.test(value)) {
    return doubleQuotedString(value, ctx);
  }

  if (!value || /^[\n\t ,[\]{}#&*!|>'"%@`]|^[?-]$|^[?-][ \t]|[\n:][ \t]|[ \t]\n|[\n\t ]#|[\n\t :]$/.test(value)) {
    // not allowed:
    // - empty string, '-' or '?'
    // - start with an indicator character (except [?:-]) or /[?-] /
    // - '\n ', ': ' or ' \n' anywhere
    // - '#' not preceded by a non-space char
    // - end with ' ' or ':'
    return implicitKey || inFlow || value.indexOf('\n') === -1 ? value.indexOf('"') !== -1 && value.indexOf("'") === -1 ? singleQuotedString(value, ctx) : doubleQuotedString(value, ctx) : blockString(item, ctx, onComment, onChompKeep);
  }

  if (!implicitKey && !inFlow && type !== PlainValue.Type.PLAIN && value.indexOf('\n') !== -1) {
    // Where allowed & type not set explicitly, prefer block style for multiline strings
    return blockString(item, ctx, onComment, onChompKeep);
  }

  if (indent === '' && containsDocumentMarker(value)) {
    ctx.forceBlockIndent = true;
    return blockString(item, ctx, onComment, onChompKeep);
  }

  const str = value.replace(/\n+/g, `$&\n${indent}`); // Verify that output will be parsed as a string, as e.g. plain numbers and
  // booleans get parsed with those types in v1.2 (e.g. '42', 'true' & '0.9e-3'),
  // and others in v1.1.

  if (actualString) {
    const {
      tags
    } = ctx.doc.schema;
    const resolved = resolveScalar(str, tags, tags.scalarFallback).value;
    if (typeof resolved !== 'string') return doubleQuotedString(value, ctx);
  }

  const body = implicitKey ? str : foldFlowLines(str, indent, FOLD_FLOW, getFoldOptions(ctx));

  if (comment && !inFlow && (body.indexOf('\n') !== -1 || comment.indexOf('\n') !== -1)) {
    if (onComment) onComment();
    return addCommentBefore(body, indent, comment);
  }

  return body;
}

function stringifyString(item, ctx, onComment, onChompKeep) {
  const {
    defaultType
  } = strOptions;
  const {
    implicitKey,
    inFlow
  } = ctx;
  let {
    type,
    value
  } = item;

  if (typeof value !== 'string') {
    value = String(value);
    item = Object.assign({}, item, {
      value
    });
  }

  const _stringify = _type => {
    switch (_type) {
      case PlainValue.Type.BLOCK_FOLDED:
      case PlainValue.Type.BLOCK_LITERAL:
        return blockString(item, ctx, onComment, onChompKeep);

      case PlainValue.Type.QUOTE_DOUBLE:
        return doubleQuotedString(value, ctx);

      case PlainValue.Type.QUOTE_SINGLE:
        return singleQuotedString(value, ctx);

      case PlainValue.Type.PLAIN:
        return plainString(item, ctx, onComment, onChompKeep);

      default:
        return null;
    }
  };

  if (type !== PlainValue.Type.QUOTE_DOUBLE && /[\x00-\x08\x0b-\x1f\x7f-\x9f]/.test(value)) {
    // force double quotes on control characters
    type = PlainValue.Type.QUOTE_DOUBLE;
  } else if ((implicitKey || inFlow) && (type === PlainValue.Type.BLOCK_FOLDED || type === PlainValue.Type.BLOCK_LITERAL)) {
    // should not happen; blocks are not valid inside flow containers
    type = PlainValue.Type.QUOTE_DOUBLE;
  }

  let res = _stringify(type);

  if (res === null) {
    res = _stringify(defaultType);
    if (res === null) throw new Error(`Unsupported default string type ${defaultType}`);
  }

  return res;
}

function stringifyNumber({
  format,
  minFractionDigits,
  tag,
  value
}) {
  if (typeof value === 'bigint') return String(value);
  if (!isFinite(value)) return isNaN(value) ? '.nan' : value < 0 ? '-.inf' : '.inf';
  let n = JSON.stringify(value);

  if (!format && minFractionDigits && (!tag || tag === 'tag:yaml.org,2002:float') && /^\d/.test(n)) {
    let i = n.indexOf('.');

    if (i < 0) {
      i = n.length;
      n += '.';
    }

    let d = minFractionDigits - (n.length - i - 1);

    while (d-- > 0) n += '0';
  }

  return n;
}

function checkFlowCollectionEnd(errors, cst) {
  let char, name;

  switch (cst.type) {
    case PlainValue.Type.FLOW_MAP:
      char = '}';
      name = 'flow map';
      break;

    case PlainValue.Type.FLOW_SEQ:
      char = ']';
      name = 'flow sequence';
      break;

    default:
      errors.push(new PlainValue.YAMLSemanticError(cst, 'Not a flow collection!?'));
      return;
  }

  let lastItem;

  for (let i = cst.items.length - 1; i >= 0; --i) {
    const item = cst.items[i];

    if (!item || item.type !== PlainValue.Type.COMMENT) {
      lastItem = item;
      break;
    }
  }

  if (lastItem && lastItem.char !== char) {
    const msg = `Expected ${name} to end with ${char}`;
    let err;

    if (typeof lastItem.offset === 'number') {
      err = new PlainValue.YAMLSemanticError(cst, msg);
      err.offset = lastItem.offset + 1;
    } else {
      err = new PlainValue.YAMLSemanticError(lastItem, msg);
      if (lastItem.range && lastItem.range.end) err.offset = lastItem.range.end - lastItem.range.start;
    }

    errors.push(err);
  }
}
function checkFlowCommentSpace(errors, comment) {
  const prev = comment.context.src[comment.range.start - 1];

  if (prev !== '\n' && prev !== '\t' && prev !== ' ') {
    const msg = 'Comments must be separated from other tokens by white space characters';
    errors.push(new PlainValue.YAMLSemanticError(comment, msg));
  }
}
function getLongKeyError(source, key) {
  const sk = String(key);
  const k = sk.substr(0, 8) + '...' + sk.substr(-8);
  return new PlainValue.YAMLSemanticError(source, `The "${k}" key is too long`);
}
function resolveComments(collection, comments) {
  for (const {
    afterKey,
    before,
    comment
  } of comments) {
    let item = collection.items[before];

    if (!item) {
      if (comment !== undefined) {
        if (collection.comment) collection.comment += '\n' + comment;else collection.comment = comment;
      }
    } else {
      if (afterKey && item.value) item = item.value;

      if (comment === undefined) {
        if (afterKey || !item.commentBefore) item.spaceBefore = true;
      } else {
        if (item.commentBefore) item.commentBefore += '\n' + comment;else item.commentBefore = comment;
      }
    }
  }
}

// on error, will return { str: string, errors: Error[] }
function resolveString(doc, node) {
  const res = node.strValue;
  if (!res) return '';
  if (typeof res === 'string') return res;
  res.errors.forEach(error => {
    if (!error.source) error.source = node;
    doc.errors.push(error);
  });
  return res.str;
}

function resolveTagHandle(doc, node) {
  const {
    handle,
    suffix
  } = node.tag;
  let prefix = doc.tagPrefixes.find(p => p.handle === handle);

  if (!prefix) {
    const dtp = doc.getDefaults().tagPrefixes;
    if (dtp) prefix = dtp.find(p => p.handle === handle);
    if (!prefix) throw new PlainValue.YAMLSemanticError(node, `The ${handle} tag handle is non-default and was not declared.`);
  }

  if (!suffix) throw new PlainValue.YAMLSemanticError(node, `The ${handle} tag has no suffix.`);

  if (handle === '!' && (doc.version || doc.options.version) === '1.0') {
    if (suffix[0] === '^') {
      doc.warnings.push(new PlainValue.YAMLWarning(node, 'YAML 1.0 ^ tag expansion is not supported'));
      return suffix;
    }

    if (/[:/]/.test(suffix)) {
      // word/foo -> tag:word.yaml.org,2002:foo
      const vocab = suffix.match(/^([a-z0-9-]+)\/(.*)/i);
      return vocab ? `tag:${vocab[1]}.yaml.org,2002:${vocab[2]}` : `tag:${suffix}`;
    }
  }

  return prefix.prefix + decodeURIComponent(suffix);
}

function resolveTagName(doc, node) {
  const {
    tag,
    type
  } = node;
  let nonSpecific = false;

  if (tag) {
    const {
      handle,
      suffix,
      verbatim
    } = tag;

    if (verbatim) {
      if (verbatim !== '!' && verbatim !== '!!') return verbatim;
      const msg = `Verbatim tags aren't resolved, so ${verbatim} is invalid.`;
      doc.errors.push(new PlainValue.YAMLSemanticError(node, msg));
    } else if (handle === '!' && !suffix) {
      nonSpecific = true;
    } else {
      try {
        return resolveTagHandle(doc, node);
      } catch (error) {
        doc.errors.push(error);
      }
    }
  }

  switch (type) {
    case PlainValue.Type.BLOCK_FOLDED:
    case PlainValue.Type.BLOCK_LITERAL:
    case PlainValue.Type.QUOTE_DOUBLE:
    case PlainValue.Type.QUOTE_SINGLE:
      return PlainValue.defaultTags.STR;

    case PlainValue.Type.FLOW_MAP:
    case PlainValue.Type.MAP:
      return PlainValue.defaultTags.MAP;

    case PlainValue.Type.FLOW_SEQ:
    case PlainValue.Type.SEQ:
      return PlainValue.defaultTags.SEQ;

    case PlainValue.Type.PLAIN:
      return nonSpecific ? PlainValue.defaultTags.STR : null;

    default:
      return null;
  }
}

function resolveByTagName(doc, node, tagName) {
  const {
    tags
  } = doc.schema;
  const matchWithTest = [];

  for (const tag of tags) {
    if (tag.tag === tagName) {
      if (tag.test) matchWithTest.push(tag);else {
        const res = tag.resolve(doc, node);
        return res instanceof Collection ? res : new Scalar(res);
      }
    }
  }

  const str = resolveString(doc, node);
  if (typeof str === 'string' && matchWithTest.length > 0) return resolveScalar(str, matchWithTest, tags.scalarFallback);
  return null;
}

function getFallbackTagName({
  type
}) {
  switch (type) {
    case PlainValue.Type.FLOW_MAP:
    case PlainValue.Type.MAP:
      return PlainValue.defaultTags.MAP;

    case PlainValue.Type.FLOW_SEQ:
    case PlainValue.Type.SEQ:
      return PlainValue.defaultTags.SEQ;

    default:
      return PlainValue.defaultTags.STR;
  }
}

function resolveTag(doc, node, tagName) {
  try {
    const res = resolveByTagName(doc, node, tagName);

    if (res) {
      if (tagName && node.tag) res.tag = tagName;
      return res;
    }
  } catch (error) {
    /* istanbul ignore if */
    if (!error.source) error.source = node;
    doc.errors.push(error);
    return null;
  }

  try {
    const fallback = getFallbackTagName(node);
    if (!fallback) throw new Error(`The tag ${tagName} is unavailable`);
    const msg = `The tag ${tagName} is unavailable, falling back to ${fallback}`;
    doc.warnings.push(new PlainValue.YAMLWarning(node, msg));
    const res = resolveByTagName(doc, node, fallback);
    res.tag = tagName;
    return res;
  } catch (error) {
    const refError = new PlainValue.YAMLReferenceError(node, error.message);
    refError.stack = error.stack;
    doc.errors.push(refError);
    return null;
  }
}

const isCollectionItem = node => {
  if (!node) return false;
  const {
    type
  } = node;
  return type === PlainValue.Type.MAP_KEY || type === PlainValue.Type.MAP_VALUE || type === PlainValue.Type.SEQ_ITEM;
};

function resolveNodeProps(errors, node) {
  const comments = {
    before: [],
    after: []
  };
  let hasAnchor = false;
  let hasTag = false;
  const props = isCollectionItem(node.context.parent) ? node.context.parent.props.concat(node.props) : node.props;

  for (const {
    start,
    end
  } of props) {
    switch (node.context.src[start]) {
      case PlainValue.Char.COMMENT:
        {
          if (!node.commentHasRequiredWhitespace(start)) {
            const msg = 'Comments must be separated from other tokens by white space characters';
            errors.push(new PlainValue.YAMLSemanticError(node, msg));
          }

          const {
            header,
            valueRange
          } = node;
          const cc = valueRange && (start > valueRange.start || header && start > header.start) ? comments.after : comments.before;
          cc.push(node.context.src.slice(start + 1, end));
          break;
        }
      // Actual anchor & tag resolution is handled by schema, here we just complain

      case PlainValue.Char.ANCHOR:
        if (hasAnchor) {
          const msg = 'A node can have at most one anchor';
          errors.push(new PlainValue.YAMLSemanticError(node, msg));
        }

        hasAnchor = true;
        break;

      case PlainValue.Char.TAG:
        if (hasTag) {
          const msg = 'A node can have at most one tag';
          errors.push(new PlainValue.YAMLSemanticError(node, msg));
        }

        hasTag = true;
        break;
    }
  }

  return {
    comments,
    hasAnchor,
    hasTag
  };
}

function resolveNodeValue(doc, node) {
  const {
    anchors,
    errors,
    schema
  } = doc;

  if (node.type === PlainValue.Type.ALIAS) {
    const name = node.rawValue;
    const src = anchors.getNode(name);

    if (!src) {
      const msg = `Aliased anchor not found: ${name}`;
      errors.push(new PlainValue.YAMLReferenceError(node, msg));
      return null;
    } // Lazy resolution for circular references


    const res = new Alias(src);

    anchors._cstAliases.push(res);

    return res;
  }

  const tagName = resolveTagName(doc, node);
  if (tagName) return resolveTag(doc, node, tagName);

  if (node.type !== PlainValue.Type.PLAIN) {
    const msg = `Failed to resolve ${node.type} node here`;
    errors.push(new PlainValue.YAMLSyntaxError(node, msg));
    return null;
  }

  try {
    const str = resolveString(doc, node);
    return resolveScalar(str, schema.tags, schema.tags.scalarFallback);
  } catch (error) {
    if (!error.source) error.source = node;
    errors.push(error);
    return null;
  }
} // sets node.resolved on success


function resolveNode(doc, node) {
  if (!node) return null;
  if (node.error) doc.errors.push(node.error);
  const {
    comments,
    hasAnchor,
    hasTag
  } = resolveNodeProps(doc.errors, node);

  if (hasAnchor) {
    const {
      anchors
    } = doc;
    const name = node.anchor;
    const prev = anchors.getNode(name); // At this point, aliases for any preceding node with the same anchor
    // name have already been resolved, so it may safely be renamed.

    if (prev) anchors.map[anchors.newName(name)] = prev; // During parsing, we need to store the CST node in anchors.map as
    // anchors need to be available during resolution to allow for
    // circular references.

    anchors.map[name] = node;
  }

  if (node.type === PlainValue.Type.ALIAS && (hasAnchor || hasTag)) {
    const msg = 'An alias node must not specify any properties';
    doc.errors.push(new PlainValue.YAMLSemanticError(node, msg));
  }

  const res = resolveNodeValue(doc, node);

  if (res) {
    res.range = [node.range.start, node.range.end];
    if (doc.options.keepCstNodes) res.cstNode = node;
    if (doc.options.keepNodeTypes) res.type = node.type;
    const cb = comments.before.join('\n');

    if (cb) {
      res.commentBefore = res.commentBefore ? `${res.commentBefore}\n${cb}` : cb;
    }

    const ca = comments.after.join('\n');
    if (ca) res.comment = res.comment ? `${res.comment}\n${ca}` : ca;
  }

  return node.resolved = res;
}

function resolveMap(doc, cst) {
  if (cst.type !== PlainValue.Type.MAP && cst.type !== PlainValue.Type.FLOW_MAP) {
    const msg = `A ${cst.type} node cannot be resolved as a mapping`;
    doc.errors.push(new PlainValue.YAMLSyntaxError(cst, msg));
    return null;
  }

  const {
    comments,
    items
  } = cst.type === PlainValue.Type.FLOW_MAP ? resolveFlowMapItems(doc, cst) : resolveBlockMapItems(doc, cst);
  const map = new YAMLMap();
  map.items = items;
  resolveComments(map, comments);
  let hasCollectionKey = false;

  for (let i = 0; i < items.length; ++i) {
    const {
      key: iKey
    } = items[i];
    if (iKey instanceof Collection) hasCollectionKey = true;

    if (doc.schema.merge && iKey && iKey.value === MERGE_KEY) {
      items[i] = new Merge(items[i]);
      const sources = items[i].value.items;
      let error = null;
      sources.some(node => {
        if (node instanceof Alias) {
          // During parsing, alias sources are CST nodes; to account for
          // circular references their resolved values can't be used here.
          const {
            type
          } = node.source;
          if (type === PlainValue.Type.MAP || type === PlainValue.Type.FLOW_MAP) return false;
          return error = 'Merge nodes aliases can only point to maps';
        }

        return error = 'Merge nodes can only have Alias nodes as values';
      });
      if (error) doc.errors.push(new PlainValue.YAMLSemanticError(cst, error));
    } else {
      for (let j = i + 1; j < items.length; ++j) {
        const {
          key: jKey
        } = items[j];

        if (iKey === jKey || iKey && jKey && Object.prototype.hasOwnProperty.call(iKey, 'value') && iKey.value === jKey.value) {
          const msg = `Map keys must be unique; "${iKey}" is repeated`;
          doc.errors.push(new PlainValue.YAMLSemanticError(cst, msg));
          break;
        }
      }
    }
  }

  if (hasCollectionKey && !doc.options.mapAsMap) {
    const warn = 'Keys with collection values will be stringified as YAML due to JS Object restrictions. Use mapAsMap: true to avoid this.';
    doc.warnings.push(new PlainValue.YAMLWarning(cst, warn));
  }

  cst.resolved = map;
  return map;
}

const valueHasPairComment = ({
  context: {
    lineStart,
    node,
    src
  },
  props
}) => {
  if (props.length === 0) return false;
  const {
    start
  } = props[0];
  if (node && start > node.valueRange.start) return false;
  if (src[start] !== PlainValue.Char.COMMENT) return false;

  for (let i = lineStart; i < start; ++i) if (src[i] === '\n') return false;

  return true;
};

function resolvePairComment(item, pair) {
  if (!valueHasPairComment(item)) return;
  const comment = item.getPropValue(0, PlainValue.Char.COMMENT, true);
  let found = false;
  const cb = pair.value.commentBefore;

  if (cb && cb.startsWith(comment)) {
    pair.value.commentBefore = cb.substr(comment.length + 1);
    found = true;
  } else {
    const cc = pair.value.comment;

    if (!item.node && cc && cc.startsWith(comment)) {
      pair.value.comment = cc.substr(comment.length + 1);
      found = true;
    }
  }

  if (found) pair.comment = comment;
}

function resolveBlockMapItems(doc, cst) {
  const comments = [];
  const items = [];
  let key = undefined;
  let keyStart = null;

  for (let i = 0; i < cst.items.length; ++i) {
    const item = cst.items[i];

    switch (item.type) {
      case PlainValue.Type.BLANK_LINE:
        comments.push({
          afterKey: !!key,
          before: items.length
        });
        break;

      case PlainValue.Type.COMMENT:
        comments.push({
          afterKey: !!key,
          before: items.length,
          comment: item.comment
        });
        break;

      case PlainValue.Type.MAP_KEY:
        if (key !== undefined) items.push(new Pair(key));
        if (item.error) doc.errors.push(item.error);
        key = resolveNode(doc, item.node);
        keyStart = null;
        break;

      case PlainValue.Type.MAP_VALUE:
        {
          if (key === undefined) key = null;
          if (item.error) doc.errors.push(item.error);

          if (!item.context.atLineStart && item.node && item.node.type === PlainValue.Type.MAP && !item.node.context.atLineStart) {
            const msg = 'Nested mappings are not allowed in compact mappings';
            doc.errors.push(new PlainValue.YAMLSemanticError(item.node, msg));
          }

          let valueNode = item.node;

          if (!valueNode && item.props.length > 0) {
            // Comments on an empty mapping value need to be preserved, so we
            // need to construct a minimal empty node here to use instead of the
            // missing `item.node`. -- eemeli/yaml#19
            valueNode = new PlainValue.PlainValue(PlainValue.Type.PLAIN, []);
            valueNode.context = {
              parent: item,
              src: item.context.src
            };
            const pos = item.range.start + 1;
            valueNode.range = {
              start: pos,
              end: pos
            };
            valueNode.valueRange = {
              start: pos,
              end: pos
            };

            if (typeof item.range.origStart === 'number') {
              const origPos = item.range.origStart + 1;
              valueNode.range.origStart = valueNode.range.origEnd = origPos;
              valueNode.valueRange.origStart = valueNode.valueRange.origEnd = origPos;
            }
          }

          const pair = new Pair(key, resolveNode(doc, valueNode));
          resolvePairComment(item, pair);
          items.push(pair);

          if (key && typeof keyStart === 'number') {
            if (item.range.start > keyStart + 1024) doc.errors.push(getLongKeyError(cst, key));
          }

          key = undefined;
          keyStart = null;
        }
        break;

      default:
        if (key !== undefined) items.push(new Pair(key));
        key = resolveNode(doc, item);
        keyStart = item.range.start;
        if (item.error) doc.errors.push(item.error);

        next: for (let j = i + 1;; ++j) {
          const nextItem = cst.items[j];

          switch (nextItem && nextItem.type) {
            case PlainValue.Type.BLANK_LINE:
            case PlainValue.Type.COMMENT:
              continue next;

            case PlainValue.Type.MAP_VALUE:
              break next;

            default:
              {
                const msg = 'Implicit map keys need to be followed by map values';
                doc.errors.push(new PlainValue.YAMLSemanticError(item, msg));
                break next;
              }
          }
        }

        if (item.valueRangeContainsNewline) {
          const msg = 'Implicit map keys need to be on a single line';
          doc.errors.push(new PlainValue.YAMLSemanticError(item, msg));
        }

    }
  }

  if (key !== undefined) items.push(new Pair(key));
  return {
    comments,
    items
  };
}

function resolveFlowMapItems(doc, cst) {
  const comments = [];
  const items = [];
  let key = undefined;
  let explicitKey = false;
  let next = '{';

  for (let i = 0; i < cst.items.length; ++i) {
    const item = cst.items[i];

    if (typeof item.char === 'string') {
      const {
        char,
        offset
      } = item;

      if (char === '?' && key === undefined && !explicitKey) {
        explicitKey = true;
        next = ':';
        continue;
      }

      if (char === ':') {
        if (key === undefined) key = null;

        if (next === ':') {
          next = ',';
          continue;
        }
      } else {
        if (explicitKey) {
          if (key === undefined && char !== ',') key = null;
          explicitKey = false;
        }

        if (key !== undefined) {
          items.push(new Pair(key));
          key = undefined;

          if (char === ',') {
            next = ':';
            continue;
          }
        }
      }

      if (char === '}') {
        if (i === cst.items.length - 1) continue;
      } else if (char === next) {
        next = ':';
        continue;
      }

      const msg = `Flow map contains an unexpected ${char}`;
      const err = new PlainValue.YAMLSyntaxError(cst, msg);
      err.offset = offset;
      doc.errors.push(err);
    } else if (item.type === PlainValue.Type.BLANK_LINE) {
      comments.push({
        afterKey: !!key,
        before: items.length
      });
    } else if (item.type === PlainValue.Type.COMMENT) {
      checkFlowCommentSpace(doc.errors, item);
      comments.push({
        afterKey: !!key,
        before: items.length,
        comment: item.comment
      });
    } else if (key === undefined) {
      if (next === ',') doc.errors.push(new PlainValue.YAMLSemanticError(item, 'Separator , missing in flow map'));
      key = resolveNode(doc, item);
    } else {
      if (next !== ',') doc.errors.push(new PlainValue.YAMLSemanticError(item, 'Indicator : missing in flow map entry'));
      items.push(new Pair(key, resolveNode(doc, item)));
      key = undefined;
      explicitKey = false;
    }
  }

  checkFlowCollectionEnd(doc.errors, cst);
  if (key !== undefined) items.push(new Pair(key));
  return {
    comments,
    items
  };
}

function resolveSeq(doc, cst) {
  if (cst.type !== PlainValue.Type.SEQ && cst.type !== PlainValue.Type.FLOW_SEQ) {
    const msg = `A ${cst.type} node cannot be resolved as a sequence`;
    doc.errors.push(new PlainValue.YAMLSyntaxError(cst, msg));
    return null;
  }

  const {
    comments,
    items
  } = cst.type === PlainValue.Type.FLOW_SEQ ? resolveFlowSeqItems(doc, cst) : resolveBlockSeqItems(doc, cst);
  const seq = new YAMLSeq();
  seq.items = items;
  resolveComments(seq, comments);

  if (!doc.options.mapAsMap && items.some(it => it instanceof Pair && it.key instanceof Collection)) {
    const warn = 'Keys with collection values will be stringified as YAML due to JS Object restrictions. Use mapAsMap: true to avoid this.';
    doc.warnings.push(new PlainValue.YAMLWarning(cst, warn));
  }

  cst.resolved = seq;
  return seq;
}

function resolveBlockSeqItems(doc, cst) {
  const comments = [];
  const items = [];

  for (let i = 0; i < cst.items.length; ++i) {
    const item = cst.items[i];

    switch (item.type) {
      case PlainValue.Type.BLANK_LINE:
        comments.push({
          before: items.length
        });
        break;

      case PlainValue.Type.COMMENT:
        comments.push({
          comment: item.comment,
          before: items.length
        });
        break;

      case PlainValue.Type.SEQ_ITEM:
        if (item.error) doc.errors.push(item.error);
        items.push(resolveNode(doc, item.node));

        if (item.hasProps) {
          const msg = 'Sequence items cannot have tags or anchors before the - indicator';
          doc.errors.push(new PlainValue.YAMLSemanticError(item, msg));
        }

        break;

      default:
        if (item.error) doc.errors.push(item.error);
        doc.errors.push(new PlainValue.YAMLSyntaxError(item, `Unexpected ${item.type} node in sequence`));
    }
  }

  return {
    comments,
    items
  };
}

function resolveFlowSeqItems(doc, cst) {
  const comments = [];
  const items = [];
  let explicitKey = false;
  let key = undefined;
  let keyStart = null;
  let next = '[';
  let prevItem = null;

  for (let i = 0; i < cst.items.length; ++i) {
    const item = cst.items[i];

    if (typeof item.char === 'string') {
      const {
        char,
        offset
      } = item;

      if (char !== ':' && (explicitKey || key !== undefined)) {
        if (explicitKey && key === undefined) key = next ? items.pop() : null;
        items.push(new Pair(key));
        explicitKey = false;
        key = undefined;
        keyStart = null;
      }

      if (char === next) {
        next = null;
      } else if (!next && char === '?') {
        explicitKey = true;
      } else if (next !== '[' && char === ':' && key === undefined) {
        if (next === ',') {
          key = items.pop();

          if (key instanceof Pair) {
            const msg = 'Chaining flow sequence pairs is invalid';
            const err = new PlainValue.YAMLSemanticError(cst, msg);
            err.offset = offset;
            doc.errors.push(err);
          }

          if (!explicitKey && typeof keyStart === 'number') {
            const keyEnd = item.range ? item.range.start : item.offset;
            if (keyEnd > keyStart + 1024) doc.errors.push(getLongKeyError(cst, key));
            const {
              src
            } = prevItem.context;

            for (let i = keyStart; i < keyEnd; ++i) if (src[i] === '\n') {
              const msg = 'Implicit keys of flow sequence pairs need to be on a single line';
              doc.errors.push(new PlainValue.YAMLSemanticError(prevItem, msg));
              break;
            }
          }
        } else {
          key = null;
        }

        keyStart = null;
        explicitKey = false;
        next = null;
      } else if (next === '[' || char !== ']' || i < cst.items.length - 1) {
        const msg = `Flow sequence contains an unexpected ${char}`;
        const err = new PlainValue.YAMLSyntaxError(cst, msg);
        err.offset = offset;
        doc.errors.push(err);
      }
    } else if (item.type === PlainValue.Type.BLANK_LINE) {
      comments.push({
        before: items.length
      });
    } else if (item.type === PlainValue.Type.COMMENT) {
      checkFlowCommentSpace(doc.errors, item);
      comments.push({
        comment: item.comment,
        before: items.length
      });
    } else {
      if (next) {
        const msg = `Expected a ${next} in flow sequence`;
        doc.errors.push(new PlainValue.YAMLSemanticError(item, msg));
      }

      const value = resolveNode(doc, item);

      if (key === undefined) {
        items.push(value);
        prevItem = item;
      } else {
        items.push(new Pair(key, value));
        key = undefined;
      }

      keyStart = item.range.start;
      next = ',';
    }
  }

  checkFlowCollectionEnd(doc.errors, cst);
  if (key !== undefined) items.push(new Pair(key));
  return {
    comments,
    items
  };
}

exports.Alias = Alias;
exports.Collection = Collection;
exports.Merge = Merge;
exports.Node = Node;
exports.Pair = Pair;
exports.Scalar = Scalar;
exports.YAMLMap = YAMLMap;
exports.YAMLSeq = YAMLSeq;
exports.addComment = addComment;
exports.binaryOptions = binaryOptions;
exports.boolOptions = boolOptions;
exports.findPair = findPair;
exports.intOptions = intOptions;
exports.isEmptyPath = isEmptyPath;
exports.nullOptions = nullOptions;
exports.resolveMap = resolveMap;
exports.resolveNode = resolveNode;
exports.resolveSeq = resolveSeq;
exports.resolveString = resolveString;
exports.strOptions = strOptions;
exports.stringifyNumber = stringifyNumber;
exports.stringifyString = stringifyString;
exports.toJSON = toJSON;


/***/ }),

/***/ 7383:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


var PlainValue = __webpack_require__(5215);
var resolveSeq = __webpack_require__(6140);

/* global atob, btoa, Buffer */
const binary = {
  identify: value => value instanceof Uint8Array,
  // Buffer inherits from Uint8Array
  default: false,
  tag: 'tag:yaml.org,2002:binary',

  /**
   * Returns a Buffer in node and an Uint8Array in browsers
   *
   * To use the resulting buffer as an image, you'll want to do something like:
   *
   *   const blob = new Blob([buffer], { type: 'image/jpeg' })
   *   document.querySelector('#photo').src = URL.createObjectURL(blob)
   */
  resolve: (doc, node) => {
    const src = resolveSeq.resolveString(doc, node);

    if (typeof Buffer === 'function') {
      return Buffer.from(src, 'base64');
    } else if (typeof atob === 'function') {
      // On IE 11, atob() can't handle newlines
      const str = atob(src.replace(/[\n\r]/g, ''));
      const buffer = new Uint8Array(str.length);

      for (let i = 0; i < str.length; ++i) buffer[i] = str.charCodeAt(i);

      return buffer;
    } else {
      const msg = 'This environment does not support reading binary tags; either Buffer or atob is required';
      doc.errors.push(new PlainValue.YAMLReferenceError(node, msg));
      return null;
    }
  },
  options: resolveSeq.binaryOptions,
  stringify: ({
    comment,
    type,
    value
  }, ctx, onComment, onChompKeep) => {
    let src;

    if (typeof Buffer === 'function') {
      src = value instanceof Buffer ? value.toString('base64') : Buffer.from(value.buffer).toString('base64');
    } else if (typeof btoa === 'function') {
      let s = '';

      for (let i = 0; i < value.length; ++i) s += String.fromCharCode(value[i]);

      src = btoa(s);
    } else {
      throw new Error('This environment does not support writing binary tags; either Buffer or btoa is required');
    }

    if (!type) type = resolveSeq.binaryOptions.defaultType;

    if (type === PlainValue.Type.QUOTE_DOUBLE) {
      value = src;
    } else {
      const {
        lineWidth
      } = resolveSeq.binaryOptions;
      const n = Math.ceil(src.length / lineWidth);
      const lines = new Array(n);

      for (let i = 0, o = 0; i < n; ++i, o += lineWidth) {
        lines[i] = src.substr(o, lineWidth);
      }

      value = lines.join(type === PlainValue.Type.BLOCK_LITERAL ? '\n' : ' ');
    }

    return resolveSeq.stringifyString({
      comment,
      type,
      value
    }, ctx, onComment, onChompKeep);
  }
};

function parsePairs(doc, cst) {
  const seq = resolveSeq.resolveSeq(doc, cst);

  for (let i = 0; i < seq.items.length; ++i) {
    let item = seq.items[i];
    if (item instanceof resolveSeq.Pair) continue;else if (item instanceof resolveSeq.YAMLMap) {
      if (item.items.length > 1) {
        const msg = 'Each pair must have its own sequence indicator';
        throw new PlainValue.YAMLSemanticError(cst, msg);
      }

      const pair = item.items[0] || new resolveSeq.Pair();
      if (item.commentBefore) pair.commentBefore = pair.commentBefore ? `${item.commentBefore}\n${pair.commentBefore}` : item.commentBefore;
      if (item.comment) pair.comment = pair.comment ? `${item.comment}\n${pair.comment}` : item.comment;
      item = pair;
    }
    seq.items[i] = item instanceof resolveSeq.Pair ? item : new resolveSeq.Pair(item);
  }

  return seq;
}
function createPairs(schema, iterable, ctx) {
  const pairs = new resolveSeq.YAMLSeq(schema);
  pairs.tag = 'tag:yaml.org,2002:pairs';

  for (const it of iterable) {
    let key, value;

    if (Array.isArray(it)) {
      if (it.length === 2) {
        key = it[0];
        value = it[1];
      } else throw new TypeError(`Expected [key, value] tuple: ${it}`);
    } else if (it && it instanceof Object) {
      const keys = Object.keys(it);

      if (keys.length === 1) {
        key = keys[0];
        value = it[key];
      } else throw new TypeError(`Expected { key: value } tuple: ${it}`);
    } else {
      key = it;
    }

    const pair = schema.createPair(key, value, ctx);
    pairs.items.push(pair);
  }

  return pairs;
}
const pairs = {
  default: false,
  tag: 'tag:yaml.org,2002:pairs',
  resolve: parsePairs,
  createNode: createPairs
};

class YAMLOMap extends resolveSeq.YAMLSeq {
  constructor() {
    super();

    PlainValue._defineProperty(this, "add", resolveSeq.YAMLMap.prototype.add.bind(this));

    PlainValue._defineProperty(this, "delete", resolveSeq.YAMLMap.prototype.delete.bind(this));

    PlainValue._defineProperty(this, "get", resolveSeq.YAMLMap.prototype.get.bind(this));

    PlainValue._defineProperty(this, "has", resolveSeq.YAMLMap.prototype.has.bind(this));

    PlainValue._defineProperty(this, "set", resolveSeq.YAMLMap.prototype.set.bind(this));

    this.tag = YAMLOMap.tag;
  }

  toJSON(_, ctx) {
    const map = new Map();
    if (ctx && ctx.onCreate) ctx.onCreate(map);

    for (const pair of this.items) {
      let key, value;

      if (pair instanceof resolveSeq.Pair) {
        key = resolveSeq.toJSON(pair.key, '', ctx);
        value = resolveSeq.toJSON(pair.value, key, ctx);
      } else {
        key = resolveSeq.toJSON(pair, '', ctx);
      }

      if (map.has(key)) throw new Error('Ordered maps must not include duplicate keys');
      map.set(key, value);
    }

    return map;
  }

}

PlainValue._defineProperty(YAMLOMap, "tag", 'tag:yaml.org,2002:omap');

function parseOMap(doc, cst) {
  const pairs = parsePairs(doc, cst);
  const seenKeys = [];

  for (const {
    key
  } of pairs.items) {
    if (key instanceof resolveSeq.Scalar) {
      if (seenKeys.includes(key.value)) {
        const msg = 'Ordered maps must not include duplicate keys';
        throw new PlainValue.YAMLSemanticError(cst, msg);
      } else {
        seenKeys.push(key.value);
      }
    }
  }

  return Object.assign(new YAMLOMap(), pairs);
}

function createOMap(schema, iterable, ctx) {
  const pairs = createPairs(schema, iterable, ctx);
  const omap = new YAMLOMap();
  omap.items = pairs.items;
  return omap;
}

const omap = {
  identify: value => value instanceof Map,
  nodeClass: YAMLOMap,
  default: false,
  tag: 'tag:yaml.org,2002:omap',
  resolve: parseOMap,
  createNode: createOMap
};

class YAMLSet extends resolveSeq.YAMLMap {
  constructor() {
    super();
    this.tag = YAMLSet.tag;
  }

  add(key) {
    const pair = key instanceof resolveSeq.Pair ? key : new resolveSeq.Pair(key);
    const prev = resolveSeq.findPair(this.items, pair.key);
    if (!prev) this.items.push(pair);
  }

  get(key, keepPair) {
    const pair = resolveSeq.findPair(this.items, key);
    return !keepPair && pair instanceof resolveSeq.Pair ? pair.key instanceof resolveSeq.Scalar ? pair.key.value : pair.key : pair;
  }

  set(key, value) {
    if (typeof value !== 'boolean') throw new Error(`Expected boolean value for set(key, value) in a YAML set, not ${typeof value}`);
    const prev = resolveSeq.findPair(this.items, key);

    if (prev && !value) {
      this.items.splice(this.items.indexOf(prev), 1);
    } else if (!prev && value) {
      this.items.push(new resolveSeq.Pair(key));
    }
  }

  toJSON(_, ctx) {
    return super.toJSON(_, ctx, Set);
  }

  toString(ctx, onComment, onChompKeep) {
    if (!ctx) return JSON.stringify(this);
    if (this.hasAllNullValues()) return super.toString(ctx, onComment, onChompKeep);else throw new Error('Set items must all have null values');
  }

}

PlainValue._defineProperty(YAMLSet, "tag", 'tag:yaml.org,2002:set');

function parseSet(doc, cst) {
  const map = resolveSeq.resolveMap(doc, cst);
  if (!map.hasAllNullValues()) throw new PlainValue.YAMLSemanticError(cst, 'Set items must all have null values');
  return Object.assign(new YAMLSet(), map);
}

function createSet(schema, iterable, ctx) {
  const set = new YAMLSet();

  for (const value of iterable) set.items.push(schema.createPair(value, null, ctx));

  return set;
}

const set = {
  identify: value => value instanceof Set,
  nodeClass: YAMLSet,
  default: false,
  tag: 'tag:yaml.org,2002:set',
  resolve: parseSet,
  createNode: createSet
};

const parseSexagesimal = (sign, parts) => {
  const n = parts.split(':').reduce((n, p) => n * 60 + Number(p), 0);
  return sign === '-' ? -n : n;
}; // hhhh:mm:ss.sss


const stringifySexagesimal = ({
  value
}) => {
  if (isNaN(value) || !isFinite(value)) return resolveSeq.stringifyNumber(value);
  let sign = '';

  if (value < 0) {
    sign = '-';
    value = Math.abs(value);
  }

  const parts = [value % 60]; // seconds, including ms

  if (value < 60) {
    parts.unshift(0); // at least one : is required
  } else {
    value = Math.round((value - parts[0]) / 60);
    parts.unshift(value % 60); // minutes

    if (value >= 60) {
      value = Math.round((value - parts[0]) / 60);
      parts.unshift(value); // hours
    }
  }

  return sign + parts.map(n => n < 10 ? '0' + String(n) : String(n)).join(':').replace(/000000\d*$/, '') // % 60 may introduce error
  ;
};

const intTime = {
  identify: value => typeof value === 'number',
  default: true,
  tag: 'tag:yaml.org,2002:int',
  format: 'TIME',
  test: /^([-+]?)([0-9][0-9_]*(?::[0-5]?[0-9])+)$/,
  resolve: (str, sign, parts) => parseSexagesimal(sign, parts.replace(/_/g, '')),
  stringify: stringifySexagesimal
};
const floatTime = {
  identify: value => typeof value === 'number',
  default: true,
  tag: 'tag:yaml.org,2002:float',
  format: 'TIME',
  test: /^([-+]?)([0-9][0-9_]*(?::[0-5]?[0-9])+\.[0-9_]*)$/,
  resolve: (str, sign, parts) => parseSexagesimal(sign, parts.replace(/_/g, '')),
  stringify: stringifySexagesimal
};
const timestamp = {
  identify: value => value instanceof Date,
  default: true,
  tag: 'tag:yaml.org,2002:timestamp',
  // If the time zone is omitted, the timestamp is assumed to be specified in UTC. The time part
  // may be omitted altogether, resulting in a date format. In such a case, the time part is
  // assumed to be 00:00:00Z (start of day, UTC).
  test: RegExp('^(?:' + '([0-9]{4})-([0-9]{1,2})-([0-9]{1,2})' + // YYYY-Mm-Dd
  '(?:(?:t|T|[ \\t]+)' + // t | T | whitespace
  '([0-9]{1,2}):([0-9]{1,2}):([0-9]{1,2}(\\.[0-9]+)?)' + // Hh:Mm:Ss(.ss)?
  '(?:[ \\t]*(Z|[-+][012]?[0-9](?::[0-9]{2})?))?' + // Z | +5 | -03:30
  ')?' + ')$'),
  resolve: (str, year, month, day, hour, minute, second, millisec, tz) => {
    if (millisec) millisec = (millisec + '00').substr(1, 3);
    let date = Date.UTC(year, month - 1, day, hour || 0, minute || 0, second || 0, millisec || 0);

    if (tz && tz !== 'Z') {
      let d = parseSexagesimal(tz[0], tz.slice(1));
      if (Math.abs(d) < 30) d *= 60;
      date -= 60000 * d;
    }

    return new Date(date);
  },
  stringify: ({
    value
  }) => value.toISOString().replace(/((T00:00)?:00)?\.000Z$/, '')
};

/* global console, process, YAML_SILENCE_DEPRECATION_WARNINGS, YAML_SILENCE_WARNINGS */
function shouldWarn(deprecation) {
  const env = typeof process !== 'undefined' && process.env || {};

  if (deprecation) {
    if (typeof YAML_SILENCE_DEPRECATION_WARNINGS !== 'undefined') return !YAML_SILENCE_DEPRECATION_WARNINGS;
    return !env.YAML_SILENCE_DEPRECATION_WARNINGS;
  }

  if (typeof YAML_SILENCE_WARNINGS !== 'undefined') return !YAML_SILENCE_WARNINGS;
  return !env.YAML_SILENCE_WARNINGS;
}

function warn(warning, type) {
  if (shouldWarn(false)) {
    const emit = typeof process !== 'undefined' && process.emitWarning; // This will throw in Jest if `warning` is an Error instance due to
    // https://github.com/facebook/jest/issues/2549

    if (emit) emit(warning, type);else {
      // eslint-disable-next-line no-console
      console.warn(type ? `${type}: ${warning}` : warning);
    }
  }
}
function warnFileDeprecation(filename) {
  if (shouldWarn(true)) {
    const path = filename.replace(/.*yaml[/\\]/i, '').replace(/\.js$/, '').replace(/\\/g, '/');
    warn(`The endpoint 'yaml/${path}' will be removed in a future release.`, 'DeprecationWarning');
  }
}
const warned = {};
function warnOptionDeprecation(name, alternative) {
  if (!warned[name] && shouldWarn(true)) {
    warned[name] = true;
    let msg = `The option '${name}' will be removed in a future release`;
    msg += alternative ? `, use '${alternative}' instead.` : '.';
    warn(msg, 'DeprecationWarning');
  }
}

exports.binary = binary;
exports.floatTime = floatTime;
exports.intTime = intTime;
exports.omap = omap;
exports.pairs = pairs;
exports.set = set;
exports.timestamp = timestamp;
exports.warn = warn;
exports.warnFileDeprecation = warnFileDeprecation;
exports.warnOptionDeprecation = warnOptionDeprecation;


/***/ }),

/***/ 3552:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__(5065).YAML


/***/ }),

/***/ 6356:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

// Note: These are not official or complete. I've basically just made them up based on documentation.
// They are good enough for now but will probably need to be updated/expanded. 
// Hopefully people start publishing OpenAPI schemas soon.

const {objectMeta: metadata}= __webpack_require__(3040);

module.exports = {
  "/azureidentity-aadpodidentity-v1.json": {
    $schema: "http://json-schema.org/draft-04/schema#",
    type: "object",
    properties: {
      apiVersion: {
        type: "string",
      },
      kind: {
        type: "string",
      },
      metadata,
      spec: {
        type: "object",
        properties: {
          type: {
            type: "integer",
          },
          resourceID: {
            type: "string",
          },
          clientID: {
            type: "string",
          },
        },
        required: ["type", "resourceID", "clientID"],
      },
    },
    required: ["apiVersion", "kind", "metadata", "spec"],
  },
};

/***/ }),

/***/ 4374:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

// Note: These are not official or complete. I've basically just made them up based on documentation.
// They are good enough for now but will probably need to be updated/expanded.
// Hopefully people start publishing OpenAPI schemas soon.

const { objectMeta } = __webpack_require__(3040);

module.exports = {
  "/azureidentitybinding-aadpodidentity-v1.json": {
    $schema: "http://json-schema.org/draft-04/schema#",
    type: "object",
    properties: {
      apiVersion: {
        type: "string",
      },
      kind: {
        type: "string",
      },
      metadata: objectMeta,
      spec: {
        type: "object",
        properties: {
          azureIdentity: {
            type: "string",
          },
          selector: {
            type: "string",
          },
        },
        required: ["azureIdentity", "selector"],
      },
    },
    required: ["apiVersion", "kind", "metadata", "spec"],
  },
};


/***/ }),

/***/ 2065:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

// Note: These are not official or complete. I've basically just made them up based on documentation.
// They are good enough for now but will probably need to be updated/expanded. 
// Hopefully people start publishing OpenAPI schemas soon.

const {objectMeta: metadata}= __webpack_require__(3040);

module.exports = {
  "/azurepodidentityexception-aadpodidentity-v1.json": {
    $schema: "http://json-schema.org/draft-04/schema#",
    type: "object",
    properties: {
      apiVersion: {
        type: "string",
      },
      kind: {
        type: "string",
      },
      metadata,
      spec: {
        type: "object",
        properties: {
          name: {
            type: "string",
          },
          podLabels: {
            type: "object",
          },
        },
        required: ["podLabels"],
      },
    },
    required: ["apiVersion", "kind", "metadata", "spec"],
  },
};

/***/ }),

/***/ 3040:
/***/ ((module) => {

module.exports = {
  objectMeta: {
    $schema: "http://json-schema.org/schema#",
    type: "object",
    description:
      "ObjectMeta is metadata that all persisted resources must have, which includes all objects users must create.",
    properties: {
      uid: {
        type: "string",
        description:
          "UID is the unique in time and space value for this object. It is typically generated by the server on successful creation of a resource and is not allowed to change on PUT operations.\n\nPopulated by the system. Read-only. More info: http://kubernetes.io/docs/user-guide/identifiers#uids",
      },
      deletionTimestamp: {
        description:
          "DeletionTimestamp is RFC 3339 date and time at which this resource will be deleted. This field is set by the server when a graceful deletion is requested by the user, and is not directly settable by a client. The resource is expected to be deleted (no longer visible from resource lists, and not reachable by name) after the time in this field, once the finalizers list is empty. As long as the finalizers list contains items, deletion is blocked. Once the deletionTimestamp is set, this value may not be unset or be set further into the future, although it may be shortened or the resource may be deleted prior to this time. For example, a user may request that a pod is deleted in 30 seconds. The Kubelet will react by sending a graceful termination signal to the containers in the pod. After that 30 seconds, the Kubelet will send a hard termination signal (SIGKILL) to the container and after cleanup, remove the pod from the API. In the presence of network partitions, this object may still exist after this timestamp, until an administrator or automated process can determine the resource is fully terminated. If not set, graceful deletion of the object has not been requested.\n\nPopulated by the system when a graceful deletion is requested. Read-only. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata",
        type: ["object", "null"],
        // Removed because its out of scope for now
        // $ref:
        //   "_definitions.json#/definitions/io.k8s.apimachinery.pkg.apis.meta.v1.Time",
      },
      clusterName: {
        type: "string",
        description:
          "The name of the cluster which the object belongs to. This is used to distinguish resources with same name and namespace in different clusters. This field is not set anywhere right now and apiserver is going to ignore it if set in create or update request.",
      },
      deletionGracePeriodSeconds: {
        type: "integer",
        description:
          "Number of seconds allowed for this object to gracefully terminate before it will be removed from the system. Only set when deletionTimestamp is also set. May only be shortened. Read-only.",
        format: "int64",
      },
      labels: {
        additionalProperties: {
          type: "string",
        },
        type: "object",
        description:
          "Map of string keys and values that can be used to organize and categorize (scope and select) objects. May match selectors of replication controllers and services. More info: http://kubernetes.io/docs/user-guide/labels",
      },
      namespace: {
        type: "string",
        description:
          'Namespace defines the space within each name must be unique. An empty namespace is equivalent to the "default" namespace, but "default" is the canonical representation. Not all objects are required to be scoped to a namespace - the value of this field for those objects will be empty.\n\nMust be a DNS_LABEL. Cannot be updated. More info: http://kubernetes.io/docs/user-guide/namespaces',
      },
      generation: {
        type: "integer",
        description:
          "A sequence number representing a specific generation of the desired state. Populated by the system. Read-only.",
        format: "int64",
      },
      finalizers: {
        items: {
          type: "string",
        },
        type: "array",
        description:
          "Must be empty before the object is deleted from the registry. Each entry is an identifier for the responsible component that will remove the entry from the list. If the deletionTimestamp of the object is non-nil, entries in this list can only be removed. Finalizers may be processed and removed in any order.  Order is NOT enforced because it introduces significant risk of stuck finalizers. finalizers is a shared field, any actor with permission can reorder it. If the finalizer list is processed in order, then this can lead to a situation in which the component responsible for the first finalizer in the list is waiting for a signal (field value, external system, or other) produced by a component responsible for a finalizer later in the list, resulting in a deadlock. Without enforced ordering finalizers are free to order amongst themselves and are not vulnerable to ordering changes in the list.",
        "x-kubernetes-patch-strategy": "merge",
      },
      generateName: {
        type: "string",
        description:
          "GenerateName is an optional prefix, used by the server, to generate a unique name ONLY IF the Name field has not been provided. If this field is used, the name returned to the client will be different than the name passed. This value will also be combined with a unique suffix. The provided value has the same validation rules as the Name field, and may be truncated by the length of the suffix required to make the value unique on the server.\n\nIf this field is specified and the generated name exists, the server will NOT return a 409 - instead, it will either return 201 Created or 500 with Reason ServerTimeout indicating a unique name could not be found in the time allotted, and the client should retry (optionally after the time indicated in the Retry-After header).\n\nApplied only if Name is not specified. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#idempotency",
      },
      annotations: {
        additionalProperties: {
          type: "string",
        },
        type: "object",
        description:
          "Annotations is an unstructured key value map stored with a resource that may be set by external tools to store and retrieve arbitrary metadata. They are not queryable and should be preserved when modifying objects. More info: http://kubernetes.io/docs/user-guide/annotations",
      },
      resourceVersion: {
        type: "string",
        description:
          "An opaque value that represents the internal version of this object that can be used by clients to determine when objects have changed. May be used for optimistic concurrency, change detection, and the watch operation on a resource or set of resources. Clients must treat these values as opaque and passed unmodified back to the server. They may only be valid for a particular resource or set of resources.\n\nPopulated by the system. Read-only. Value must be treated as opaque by clients and . More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#concurrency-control-and-consistency",
      },
      ownerReferences: {
        items: {
          type: "object",
          // Removed because its out of scope for now
          // $ref:
          //   "_definitions.json#/definitions/io.k8s.apimachinery.pkg.apis.meta.v1.OwnerReference",
        },
        type: "array",
        description:
          "List of objects depended by this object. If ALL objects in the list have been deleted, this object will be garbage collected. If this object is managed by a controller, then an entry in this list will point to this controller, with the controller field set to true. There cannot be more than one managing controller.",
        "x-kubernetes-patch-strategy": "merge",
        "x-kubernetes-patch-merge-key": "uid",
      },
      creationTimestamp: {
        description:
          "CreationTimestamp is a timestamp representing the server time when this object was created. It is not guaranteed to be set in happens-before order across separate operations. Clients may not set this value. It is represented in RFC3339 form and is in UTC.\n\nPopulated by the system. Read-only. Null for lists. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata",
        type: ["object", "null"],
        // Removed because its out of scope for now
        // $ref:
        //   "_definitions.json#/definitions/io.k8s.apimachinery.pkg.apis.meta.v1.Time",
      },
      managedFields: {
        items: {
          type: "object",
          // Removed because its out of scope for now
          // $ref:
          //   "_definitions.json#/definitions/io.k8s.apimachinery.pkg.apis.meta.v1.ManagedFieldsEntry",
        },
        type: "array",
        description:
          "ManagedFields maps workflow-id and version to the set of fields that are managed by that workflow. This is mostly for internal housekeeping, and users typically shouldn't need to set or understand this field. A workflow can be the user's name, a controller's name, or the name of a specific apply path like \"ci-cd\". The set of fields is always in the version that the workflow used when modifying the object.",
      },
      selfLink: {
        type: "string",
        description:
          "SelfLink is a URL representing this object. Populated by the system. Read-only.\n\nDEPRECATED Kubernetes will stop propagating this field in 1.20 release and the field is planned to be removed in 1.21 release.",
      },
      name: {
        type: "string",
        description:
          "Name must be unique within a namespace. Is required when creating resources, although some resources may allow a client to request the generation of an appropriate name automatically. Name is primarily intended for creation idempotence and configuration definition. Cannot be updated. More info: http://kubernetes.io/docs/user-guide/identifiers#names",
      },
    },
  },
  listMeta: {
    $schema: "http://json-schema.org/schema#",
    type: "object",
    description:
      "ListMeta describes metadata that synthetic resources must have, including lists and various status objects. A resource may have only one of {ObjectMeta, ListMeta}.",
    properties: {
      continue: {
        type: "string",
        description:
          "continue may be set if the user set a limit on the number of items returned, and indicates that the server has more data available. The value is opaque and may be used to issue another request to the endpoint that served this list to retrieve the next set of available objects. Continuing a consistent list may not be possible if the server configuration has changed or more than a few minutes have passed. The resourceVersion field returned when using this continue value will be identical to the value in the first response, unless you have received this token from an error message.",
      },
      remainingItemCount: {
        type: "integer",
        description:
          "remainingItemCount is the number of subsequent items in the list which are not included in this list response. If the list request contained label or field selectors, then the number of remaining items is unknown and the field will be left unset and omitted during serialization. If the list is complete (either because it is not chunking or because this is the last chunk), then there are no more remaining items and this field will be left unset and omitted during serialization. Servers older than v1.15 do not set this field. The intended use of the remainingItemCount is *estimating* the size of a collection. Clients should not rely on the remainingItemCount to be set or to be exact.",
        format: "int64",
      },
      selfLink: {
        type: "string",
        description:
          "selfLink is a URL representing this object. Populated by the system. Read-only.\n\nDEPRECATED Kubernetes will stop propagating this field in 1.20 release and the field is planned to be removed in 1.21 release.",
      },
      resourceVersion: {
        type: "string",
        description:
          "String that identifies the server's internal version of this object that can be used by clients to determine when objects have changed. Value must be treated as opaque by clients and passed unmodified back to the server. Populated by the system. Read-only. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#concurrency-control-and-consistency",
      },
    },
  },
};


/***/ }),

/***/ 5306:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const { objectMeta, listMeta } = __webpack_require__(3040);

// Generated using openapi2jsonschema https://raw.githubusercontent.com/kubernetes/kubernetes/master/api/openapi-spec/swagger.json

const customResourceDefinitionCondition = {
  $schema: "http://json-schema.org/schema#",
  required: ["type", "status"],
  type: "object",
  description:
    "CustomResourceDefinitionCondition contains details for the current condition of this pod.",
  properties: {
    status: {
      type: "string",
      description:
        "status is the status of the condition. Can be True, False, Unknown.",
    },
    type: {
      type: "string",
      description:
        "type is the type of the condition. Types include Established, NamesAccepted and Terminating.",
    },
    message: {
      type: "string",
      description:
        "message is a human-readable message indicating details about last transition.",
    },
    lastTransitionTime: {
      description:
        "lastTransitionTime last time the condition transitioned from one status to another.",
      type: ["object", "null"],
      // Removed because its out of scope for now
      //   $ref:
      //     "_definitions.json#/definitions/io.k8s.apimachinery.pkg.apis.meta.v1.Time",
    },
    reason: {
      type: "string",
      description:
        "reason is a unique, one-word, CamelCase reason for the condition's last transition.",
    },
  },
};

const customResourceDefinitionNames = {
  $schema: "http://json-schema.org/schema#",
  required: ["plural", "kind"],
  type: "object",
  description:
    "CustomResourceDefinitionNames indicates the names to serve this CustomResourceDefinition",
  properties: {
    shortNames: {
      items: {
        type: "string",
      },
      type: "array",
      description:
        "shortNames are short names for the resource, exposed in API discovery documents, and used by clients to support invocations like `kubectl get <shortname>`. It must be all lowercase.",
    },
    kind: {
      type: "string",
      description:
        "kind is the serialized kind of the resource. It is normally CamelCase and singular. Custom resource instances will use this value as the `kind` attribute in API calls.",
    },
    singular: {
      type: "string",
      description:
        "singular is the singular name of the resource. It must be all lowercase. Defaults to lowercased `kind`.",
    },
    listKind: {
      type: "string",
      description:
        'listKind is the serialized kind of the list for this resource. Defaults to "`kind`List".',
    },
    plural: {
      type: "string",
      description:
        "plural is the plural name of the resource to serve. The custom resources are served under `/apis/<group>/<version>/.../<plural>`. Must match the name of the CustomResourceDefinition (in the form `<names.plural>.<group>`). Must be all lowercase.",
    },
    categories: {
      items: {
        type: "string",
      },
      type: "array",
      description:
        "categories is a list of grouped resources this custom resource belongs to (e.g. 'all'). This is published in API discovery documents, and used by clients to support invocations like `kubectl get all`.",
    },
  },
};

const customResourceValidation = {
  $schema: "http://json-schema.org/schema#",
  type: "object",
  description:
    "CustomResourceValidation is a list of validation methods for CustomResources.",
  properties: {
    openAPIV3Schema: {
      description:
        "openAPIV3Schema is the OpenAPI v3 schema to use for validation and pruning.",
      type: ["object", "null"],
      // Removed because its out of scope for now
      //"$ref": "_definitions.json#/definitions/io.k8s.apiextensions-apiserver.pkg.apis.apiextensions.v1.JSONSchemaProps"
    },
  },
};

const customResourceDefinitionVersion = {
  $schema: "http://json-schema.org/schema#",
  required: ["name", "served", "storage"],
  type: "object",
  description: "CustomResourceDefinitionVersion describes a version for CRD.",
  properties: {
    name: {
      type: "string",
      description:
        "name is the version name, e.g. \u201cv1\u201d, \u201cv2beta1\u201d, etc. The custom resources are served under this version at `/apis/<group>/<version>/...` if `served` is true.",
    },
    storage: {
      type: "boolean",
      description:
        "storage indicates this version should be used when persisting custom resources to storage. There must be exactly one version with storage=true.",
    },
    additionalPrinterColumns: {
      items: {
        type: ["object", "null"],
        // Removed because its out of scope for now
        // $ref:
        //   "_definitions.json#/definitions/io.k8s.apiextensions-apiserver.pkg.apis.apiextensions.v1beta1.CustomResourceColumnDefinition",
      },
      type: "array",
      description:
        "additionalPrinterColumns specifies additional columns returned in Table output. See https://kubernetes.io/docs/reference/using-api/api-concepts/#receiving-resources-as-tables for details. Top-level and per-version columns are mutually exclusive. Per-version columns must not all be set to identical values (top-level columns should be used instead). If no top-level or per-version columns are specified, a single column displaying the age of the custom resource is used.",
    },
    subresources: {
      description:
        "subresources specify what subresources this version of the defined custom resource have. Top-level and per-version subresources are mutually exclusive. Per-version subresources must not all be set to identical values (top-level subresources should be used instead).",
      type: ["object", "null"],
      // Removed because its out of scope for now
      //   $ref:
      //     "_definitions.json#/definitions/io.k8s.apiextensions-apiserver.pkg.apis.apiextensions.v1beta1.CustomResourceSubresources",
    },
    served: {
      type: "boolean",
      description:
        "served is a flag enabling/disabling this version from being served via REST APIs",
    },
    schema: customResourceValidation,
  },
};

const customResourceDefinitionStatus = {
  $schema: "http://json-schema.org/schema#",
  type: "object",
  description:
    "CustomResourceDefinitionStatus indicates the state of the CustomResourceDefinition",
  properties: {
    acceptedNames: customResourceDefinitionNames,
    conditions: {
      items: customResourceDefinitionCondition,
      type: "array",
      description:
        "conditions indicate state for particular aspects of a CustomResourceDefinition",
    },
    storedVersions: {
      items: {
        type: "string",
      },
      type: "array",
      description:
        "storedVersions lists all versions of CustomResources that were ever persisted. Tracking these versions allows a migration path for stored versions in etcd. The field is mutable so a migration controller can finish a migration to another version (ensuring no old objects are left in storage), and then remove the rest of the versions from this list. Versions may not be removed from `spec.versions` while they exist in this list.",
    },
  },
};

const customResourceDefinitionSpec = {
  $schema: "http://json-schema.org/schema#",
  required: ["group", "names", "scope"],
  type: "object",
  description:
    "CustomResourceDefinitionSpec describes how a user wants their resource to appear",
  properties: {
    conversion: {
      description: "conversion defines conversion settings for the CRD.",
      type: ["object", "null"],
      // Removed because its out of scope for now
      //   $ref:
      //     "_definitions.json#/definitions/io.k8s.apiextensions-apiserver.pkg.apis.apiextensions.v1beta1.CustomResourceConversion",
    },
    group: {
      type: "string",
      description:
        "group is the API group of the defined custom resource. The custom resources are served under `/apis/<group>/...`. Must match the name of the CustomResourceDefinition (in the form `<names.plural>.<group>`).",
    },
    versions: {
      items: customResourceDefinitionVersion,
      type: "array",
      description:
        'versions is the list of all API versions of the defined custom resource. Optional if `version` is specified. The name of the first item in the `versions` list must match the `version` field if `version` and `versions` are both specified. Version names are used to compute the order in which served versions are listed in API discovery. If the version string is "kube-like", it will sort above non "kube-like" version strings, which are ordered lexicographically. "Kube-like" versions start with a "v", then are followed by a number (the major version), then optionally the string "alpha" or "beta" and another number (the minor version). These are sorted first by GA > beta > alpha (where GA is a version with no suffix such as beta or alpha), and then by comparing major version, then minor version. An example sorted list of versions: v10, v2, v1, v11beta2, v10beta3, v3beta1, v12alpha1, v11alpha2, foo1, foo10.',
    },
    additionalPrinterColumns: {
      items: {
        type: ["object", "null"],
        // Removed because its out of scope for now
        // $ref:
        //   "_definitions.json#/definitions/io.k8s.apiextensions-apiserver.pkg.apis.apiextensions.v1beta1.CustomResourceColumnDefinition",
      },
      type: "array",
      description:
        "additionalPrinterColumns specifies additional columns returned in Table output. See https://kubernetes.io/docs/reference/using-api/api-concepts/#receiving-resources-as-tables for details. If present, this field configures columns for all versions. Top-level and per-version columns are mutually exclusive. If no top-level or per-version columns are specified, a single column displaying the age of the custom resource is used.",
    },
    preserveUnknownFields: {
      type: "boolean",
      description:
        "preserveUnknownFields indicates that object fields which are not specified in the OpenAPI schema should be preserved when persisting to storage. apiVersion, kind, metadata and known fields inside metadata are always preserved. If false, schemas must be defined for all versions. Defaults to true in v1beta for backwards compatibility. Deprecated: will be required to be false in v1. Preservation of unknown fields can be specified in the validation schema using the `x-kubernetes-preserve-unknown-fields: true` extension. See https://kubernetes.io/docs/tasks/access-kubernetes-api/custom-resources/custom-resource-definitions/#pruning-versus-preserving-unknown-fields for details.",
    },
    version: {
      type: "string",
      description:
        "version is the API version of the defined custom resource. The custom resources are served under `/apis/<group>/<version>/...`. Must match the name of the first item in the `versions` list if `version` and `versions` are both specified. Optional if `versions` is specified. Deprecated: use `versions` instead.",
    },
    names: customResourceDefinitionNames,
    scope: {
      type: "string",
      description:
        "scope indicates whether the defined custom resource is cluster- or namespace-scoped. Allowed values are `Cluster` and `Namespaced`. Default is `Namespaced`.",
    },
    validation: customResourceValidation,
    subresources: {
      description:
        "subresources specify what subresources the defined custom resource has. If present, this field configures subresources for all versions. Top-level and per-version subresources are mutually exclusive.",
      type: ["object", "null"],
      // Removed because its out of scope for now
      //   $ref:
      //     "_definitions.json#/definitions/io.k8s.apiextensions-apiserver.pkg.apis.apiextensions.v1beta1.CustomResourceSubresources",
    },
  },
};

const customResourceDefinition = {
  description:
    "CustomResourceDefinition represents a resource that should be exposed on the API server.  Its name MUST be in the format <.spec.name>.<.spec.group>. Deprecated in v1.16, planned for removal in v1.19. Use apiextensions.k8s.io/v1 CustomResourceDefinition instead.",
  required: ["spec"],
  "x-kubernetes-group-version-kind": [
    {
      kind: "CustomResourceDefinition",
      version: "v1beta1",
      group: "apiextensions.k8s.io",
    },
  ],
  $schema: "http://json-schema.org/schema#",
  type: "object",
  properties: {
    status: customResourceDefinitionStatus,
    kind: {
      type: "string",
      description:
        "Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds",
    },
    spec: customResourceDefinitionSpec,
    apiVersion: {
      type: "string",
      description:
        "APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources",
    },
    metadata: objectMeta,
  },
};

const customResourceDefinitionList = {
  description:
    "CustomResourceDefinitionList is a list of CustomResourceDefinition objects.",
  required: ["items"],
  "x-kubernetes-group-version-kind": [
    {
      kind: "CustomResourceDefinitionList",
      version: "v1",
      group: "apiextensions.k8s.io",
    },
  ],
  $schema: "http://json-schema.org/schema#",
  type: "object",
  properties: {
    items: {
      items: customResourceDefinition,
    },
    type: "array",
    description: "items list individual CustomResourceDefinition objects",
  },
  kind: {
    type: "string",
    description:
      "Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds",
  },
  apiVersion: {
    type: "string",
    description:
      "APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources",
  },
  metadata: listMeta,
};

module.exports = {
  "/customresourcedefinition-apiextensions-v1beta1.json": customResourceDefinition,
  "/customresourcedefinitionlist-apiextensions-v1beta1.json": customResourceDefinitionList,
};


/***/ }),

/***/ 5225:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const azureIdentity = __webpack_require__(6356);
const azureIdentityBinding = __webpack_require__(4374);
const azureIdentityException = __webpack_require__(2065);
const sealedSecrets = __webpack_require__(216);
const networkPolicy = __webpack_require__(7810);
const customResourceDefinition = __webpack_require__(5306);
const istio = __webpack_require__(769);

const schemas = {
  ...azureIdentity,
  ...azureIdentityException,
  ...azureIdentityBinding,
  ...sealedSecrets,
  ...networkPolicy,
  ...customResourceDefinition,
  ...istio,
};

module.exports = schemas;


/***/ }),

/***/ 769:
/***/ ((module) => {

// ➜  tmp.cxdEWiLJbp git clone git@github.com:istio/api.git
// ➜  tmp.cxdEWiLJbp echo '[' > schema.js; find api -iname '*.gen.json' -exec sh -c "cat {}; echo ','" \; >> schema.js; echo ']' >> schema.js
const schemas = [
  {
    openapi: "3.0.0",
    info: {
      title: "Configuration affecting network reachability of a sidecar.",
      version: "v1alpha3",
    },
    components: {
      schemas: {
        "istio.networking.v1alpha3.ClientTLSSettings": {
          description:
            "SSL/TLS related settings for upstream connections. See Envoy's [TLS context](https://www.envoyproxy.io/docs/envoy/latest/api-v2/api/v2/auth/cert.proto.html) for more details. These settings are common to both HTTP and TCP upstreams.",
          type: "object",
          properties: {
            mode: {
              $ref:
                "#/components/schemas/istio.networking.v1alpha3.ClientTLSSettings.TLSmode",
            },
            clientCertificate: {
              description:
                "REQUIRED if mode is `MUTUAL`. The path to the file holding the client-side TLS certificate to use. Should be empty if mode is `ISTIO_MUTUAL`.",
              type: "string",
              format: "string",
            },
            privateKey: {
              description:
                "REQUIRED if mode is `MUTUAL`. The path to the file holding the client's private key. Should be empty if mode is `ISTIO_MUTUAL`.",
              type: "string",
              format: "string",
            },
            caCertificates: {
              description:
                "OPTIONAL: The path to the file containing certificate authority certificates to use in verifying a presented server certificate. If omitted, the proxy will not verify the server's certificate. Should be empty if mode is `ISTIO_MUTUAL`.",
              type: "string",
              format: "string",
            },
            credentialName: {
              description:
                "The name of the secret that holds the TLS certs for the client including the CA certificates. Applicable only on Kubernetes. Secret must exist in the same namespace with the proxy using the certificates. The secret (of type `generic`)should contain the following keys and values: `key: \u003cprivateKey\u003e`, `cert: \u003cserverCert\u003e`, `cacert: \u003cCACertificate\u003e`. Secret of type tls for client certificates along with ca.crt key for CA certificates is also supported. Only one of client certificates and CA certificate or credentialName can be specified.",
              type: "string",
              format: "string",
            },
            subjectAltNames: {
              description:
                "A list of alternate names to verify the subject identity in the certificate. If specified, the proxy will verify that the server certificate's subject alt name matches one of the specified values. If specified, this list overrides the value of subject_alt_names from the ServiceEntry.",
              type: "array",
              items: {
                type: "string",
                format: "string",
              },
            },
            sni: {
              description:
                "SNI string to present to the server during TLS handshake.",
              type: "string",
              format: "string",
            },
          },
        },
        "istio.networking.v1alpha3.PortSelector": {
          description:
            "PortSelector specifies the number of a port to be used for matching or selection for final routing.",
          type: "object",
          properties: {
            number: {
              description: "Valid port number",
              type: "integer",
            },
          },
        },
        "istio.networking.v1alpha3.ClientTLSSettings.TLSmode": {
          description: "TLS connection mode",
          type: "string",
          enum: ["DISABLE", "SIMPLE", "MUTUAL", "ISTIO_MUTUAL"],
        },
        "istio.networking.v1alpha3.WorkloadSelector": {
          description:
            "`WorkloadSelector` specifies the criteria used to determine if the `Gateway`, `Sidecar`, or `EnvoyFilter` or `ServiceEntry` configuration can be applied to a proxy. The matching criteria includes the metadata associated with a proxy, workload instance info such as labels attached to the pod/VM, or any other info that the proxy provides to Istio during the initial handshake. If multiple conditions are specified, all conditions need to match in order for the workload instance to be selected. Currently, only label based selection mechanism is supported.",
          type: "object",
          properties: {
            labels: {
              description:
                "One or more labels that indicate a specific set of pods/VMs on which the configuration should be applied. The scope of label search is restricted to the configuration namespace in which the the resource is present.",
              type: "object",
              additionalProperties: {
                type: "string",
                format: "string",
              },
            },
          },
        },
        "istio.networking.v1alpha3.Port": {
          description:
            "Port describes the properties of a specific port of a service.",
          type: "object",
          properties: {
            number: {
              description: "A valid non-negative integer port number.",
              type: "integer",
            },
            name: {
              description: "Label assigned to the port.",
              type: "string",
              format: "string",
            },
            protocol: {
              description:
                "The protocol exposed on the port. MUST BE one of HTTP|HTTPS|GRPC|HTTP2|MONGO|TCP|TLS. TLS implies the connection will be routed based on the SNI header to the destination without terminating the TLS connection.",
              type: "string",
              format: "string",
            },
          },
        },
        "istio.networking.v1alpha3.ServerTLSSettings": {
          type: "object",
          properties: {
            mode: {
              $ref:
                "#/components/schemas/istio.networking.v1alpha3.ServerTLSSettings.TLSmode",
            },
            privateKey: {
              description:
                "REQUIRED if mode is `SIMPLE` or `MUTUAL`. The path to the file holding the server's private key.",
              type: "string",
              format: "string",
            },
            caCertificates: {
              description:
                "REQUIRED if mode is `MUTUAL`. The path to a file containing certificate authority certificates to use in verifying a presented client side certificate.",
              type: "string",
              format: "string",
            },
            credentialName: {
              description:
                "For gateways running on Kubernetes, the name of the secret that holds the TLS certs including the CA certificates. Applicable only on Kubernetes. The secret (of type`generic`) should contain the following keys and values: `key: \u003cprivateKey\u003e`, `cert: \u003cserverCert\u003e`, `cacert: \u003cCACertificate\u003e`. Secret of type tls for server certificates along with ca.crt key for CA certificates is also supported. Only one of server certificates and CA certificate or credentialName can be specified.",
              type: "string",
              format: "string",
            },
            subjectAltNames: {
              description:
                "A list of alternate names to verify the subject identity in the certificate presented by the client.",
              type: "array",
              items: {
                type: "string",
                format: "string",
              },
            },
            httpsRedirect: {
              description:
                "If set to true, the load balancer will send a 301 redirect for all http connections, asking the clients to use HTTPS.",
              type: "boolean",
            },
            serverCertificate: {
              description:
                "REQUIRED if mode is `SIMPLE` or `MUTUAL`. The path to the file holding the server-side TLS certificate to use.",
              type: "string",
              format: "string",
            },
            verifyCertificateSpki: {
              description:
                "An optional list of base64-encoded SHA-256 hashes of the SKPIs of authorized client certificates. Note: When both verify_certificate_hash and verify_certificate_spki are specified, a hash matching either value will result in the certificate being accepted.",
              type: "array",
              items: {
                type: "string",
                format: "string",
              },
            },
            verifyCertificateHash: {
              description:
                "An optional list of hex-encoded SHA-256 hashes of the authorized client certificates. Both simple and colon separated formats are acceptable. Note: When both verify_certificate_hash and verify_certificate_spki are specified, a hash matching either value will result in the certificate being accepted.",
              type: "array",
              items: {
                type: "string",
                format: "string",
              },
            },
            minProtocolVersion: {
              $ref:
                "#/components/schemas/istio.networking.v1alpha3.ServerTLSSettings.TLSProtocol",
            },
            maxProtocolVersion: {
              $ref:
                "#/components/schemas/istio.networking.v1alpha3.ServerTLSSettings.TLSProtocol",
            },
            cipherSuites: {
              description:
                "Optional: If specified, only support the specified cipher list. Otherwise default to the default cipher list supported by Envoy.",
              type: "array",
              items: {
                type: "string",
                format: "string",
              },
            },
          },
        },
        "istio.networking.v1alpha3.ServerTLSSettings.TLSmode": {
          description: "TLS modes enforced by the proxy",
          type: "string",
          enum: [
            "PASSTHROUGH",
            "SIMPLE",
            "MUTUAL",
            "AUTO_PASSTHROUGH",
            "ISTIO_MUTUAL",
          ],
        },
        "istio.networking.v1alpha3.ServerTLSSettings.TLSProtocol": {
          description: "TLS protocol versions.",
          type: "string",
          enum: ["TLS_AUTO", "TLSV1_0", "TLSV1_1", "TLSV1_2", "TLSV1_3"],
        },
        "istio.networking.v1alpha3.Sidecar": {
          description:
            "`Sidecar` describes the configuration of the sidecar proxy that mediates inbound and outbound communication of the workload instance to which it is attached.",
          type: "object",
          properties: {
            workloadSelector: {
              $ref:
                "#/components/schemas/istio.networking.v1alpha3.WorkloadSelector",
            },
            ingress: {
              description:
                "Ingress specifies the configuration of the sidecar for processing inbound traffic to the attached workload instance. If omitted, Istio will automatically configure the sidecar based on the information about the workload obtained from the orchestration platform (e.g., exposed ports, services, etc.). If specified, inbound ports are configured if and only if the workload instance is associated with a service.",
              type: "array",
              items: {
                $ref:
                  "#/components/schemas/istio.networking.v1alpha3.IstioIngressListener",
              },
            },
            egress: {
              description:
                "Egress specifies the configuration of the sidecar for processing outbound traffic from the attached workload instance to other services in the mesh. If not specified, inherits the system detected defaults from the namespace-wide or the global default Sidecar.",
              type: "array",
              items: {
                $ref:
                  "#/components/schemas/istio.networking.v1alpha3.IstioEgressListener",
              },
            },
            outboundTrafficPolicy: {
              $ref:
                "#/components/schemas/istio.networking.v1alpha3.OutboundTrafficPolicy",
            },
            localhost: {
              $ref: "#/components/schemas/istio.networking.v1alpha3.Localhost",
            },
          },
        },
        "istio.networking.v1alpha3.IstioIngressListener": {
          description:
            "`IstioIngressListener` specifies the properties of an inbound traffic listener on the sidecar proxy attached to a workload instance.",
          type: "object",
          properties: {
            port: {
              $ref: "#/components/schemas/istio.networking.v1alpha3.Port",
            },
            bind: {
              description:
                "The IP to which the listener should be bound. Must be in the format `x.x.x.x`. Unix domain socket addresses are not allowed in the bind field for ingress listeners. If omitted, Istio will automatically configure the defaults based on imported services and the workload instances to which this configuration is applied to.",
              type: "string",
              format: "string",
            },
            defaultEndpoint: {
              description:
                "The loopback IP endpoint or Unix domain socket to which traffic should be forwarded to. This configuration can be used to redirect traffic arriving at the bind `IP:Port` on the sidecar to a `localhost:port` or Unix domain socket where the application workload instance is listening for connections. Format should be `127.0.0.1:PORT` or `unix:///path/to/socket`",
              type: "string",
              format: "string",
            },
            captureMode: {
              $ref:
                "#/components/schemas/istio.networking.v1alpha3.CaptureMode",
            },
            localhostClientTls: {
              $ref:
                "#/components/schemas/istio.networking.v1alpha3.ClientTLSSettings",
            },
          },
        },
        "istio.networking.v1alpha3.IstioEgressListener": {
          description:
            "`IstioEgressListener` specifies the properties of an outbound traffic listener on the sidecar proxy attached to a workload instance.",
          type: "object",
          properties: {
            port: {
              $ref: "#/components/schemas/istio.networking.v1alpha3.Port",
            },
            bind: {
              description:
                "The IP or the Unix domain socket to which the listener should be bound to. Port MUST be specified if bind is not empty. Format: `x.x.x.x` or `unix:///path/to/uds` or `unix://@foobar` (Linux abstract namespace). If omitted, Istio will automatically configure the defaults based on imported services, the workload instances to which this configuration is applied to and the captureMode. If captureMode is `NONE`, bind will default to 127.0.0.1.",
              type: "string",
              format: "string",
            },
            hosts: {
              description:
                "One or more service hosts exposed by the listener in `namespace/dnsName` format. Services in the specified namespace matching `dnsName` will be exposed. The corresponding service can be a service in the service registry (e.g., a Kubernetes or cloud foundry service) or a service specified using a `ServiceEntry` or `VirtualService` configuration. Any associated `DestinationRule` in the same namespace will also be used.",
              type: "array",
              items: {
                type: "string",
                format: "string",
              },
            },
            captureMode: {
              $ref:
                "#/components/schemas/istio.networking.v1alpha3.CaptureMode",
            },
            localhostServerTls: {
              $ref:
                "#/components/schemas/istio.networking.v1alpha3.ServerTLSSettings",
            },
          },
        },
        "istio.networking.v1alpha3.OutboundTrafficPolicy": {
          description:
            "`OutboundTrafficPolicy` sets the default behavior of the sidecar for handling outbound traffic from the application. If your application uses one or more external services that are not known apriori, setting the policy to `ALLOW_ANY` will cause the sidecars to route any unknown traffic originating from the application to its requested destination. Users are strongly encouraged to use `ServiceEntry` configurations to explicitly declare any external dependencies, instead of using `ALLOW_ANY`, so that traffic to these services can be monitored.",
          type: "object",
          properties: {
            mode: {
              $ref:
                "#/components/schemas/istio.networking.v1alpha3.OutboundTrafficPolicy.Mode",
            },
            egressProxy: {
              $ref:
                "#/components/schemas/istio.networking.v1alpha3.Destination",
            },
          },
        },
        "istio.networking.v1alpha3.Localhost": {
          description:
            "`Localhost` describes the sidecar settings related to the communication between the sidecar and the workload it is attached to in a Kubernetes Pod or a VM. These settings apply by default to all ingress and egress listeners in a sidecar unless overridden.",
          type: "object",
          properties: {
            clientTls: {
              $ref:
                "#/components/schemas/istio.networking.v1alpha3.ClientTLSSettings",
            },
            serverTls: {
              $ref:
                "#/components/schemas/istio.networking.v1alpha3.ServerTLSSettings",
            },
          },
        },
        "istio.networking.v1alpha3.CaptureMode": {
          description:
            "`CaptureMode` describes how traffic to a listener is expected to be captured. Applicable only when the listener is bound to an IP.",
          type: "string",
          enum: ["DEFAULT", "IPTABLES", "NONE"],
        },
        "istio.networking.v1alpha3.OutboundTrafficPolicy.Mode": {
          type: "string",
          enum: ["REGISTRY_ONLY", "ALLOW_ANY"],
        },
        "istio.networking.v1alpha3.Destination": {
          description:
            "Destination indicates the network addressable service to which the request/connection will be sent after processing a routing rule. The destination.host should unambiguously refer to a service in the service registry. Istio's service registry is composed of all the services found in the platform's service registry (e.g., Kubernetes services, Consul services), as well as services declared through the [ServiceEntry](https://istio.io/docs/reference/config/networking/service-entry/#ServiceEntry) resource.",
          type: "object",
          properties: {
            host: {
              description:
                "The name of a service from the service registry. Service names are looked up from the platform's service registry (e.g., Kubernetes services, Consul services, etc.) and from the hosts declared by [ServiceEntry](https://istio.io/docs/reference/config/networking/service-entry/#ServiceEntry). Traffic forwarded to destinations that are not found in either of the two, will be dropped.",
              type: "string",
              format: "string",
            },
            port: {
              $ref:
                "#/components/schemas/istio.networking.v1alpha3.PortSelector",
            },
            subset: {
              description:
                "The name of a subset within the service. Applicable only to services within the mesh. The subset must be defined in a corresponding DestinationRule.",
              type: "string",
              format: "string",
            },
          },
        },
      },
    },
  },
  {
    openapi: "3.0.0",
    info: {
      title: "Customizing Envoy configuration generated by Istio.",
      version: "v1alpha3",
    },
    components: {
      schemas: {
        "istio.networking.v1alpha3.EnvoyFilter": {
          description:
            "EnvoyFilter provides a mechanism to customize the Envoy configuration generated by Istio Pilot.",
          type: "object",
          properties: {
            workloadSelector: {
              $ref:
                "#/components/schemas/istio.networking.v1alpha3.WorkloadSelector",
            },
            configPatches: {
              description: "One or more patches with match conditions.",
              type: "array",
              items: {
                $ref:
                  "#/components/schemas/istio.networking.v1alpha3.EnvoyFilter.EnvoyConfigObjectPatch",
              },
            },
          },
        },
        "istio.networking.v1alpha3.WorkloadSelector": {
          description:
            "`WorkloadSelector` specifies the criteria used to determine if the `Gateway`, `Sidecar`, or `EnvoyFilter` or `ServiceEntry` configuration can be applied to a proxy. The matching criteria includes the metadata associated with a proxy, workload instance info such as labels attached to the pod/VM, or any other info that the proxy provides to Istio during the initial handshake. If multiple conditions are specified, all conditions need to match in order for the workload instance to be selected. Currently, only label based selection mechanism is supported.",
          type: "object",
          properties: {
            labels: {
              description:
                "One or more labels that indicate a specific set of pods/VMs on which the configuration should be applied. The scope of label search is restricted to the configuration namespace in which the the resource is present.",
              type: "object",
              additionalProperties: {
                type: "string",
                format: "string",
              },
            },
          },
        },
        "istio.networking.v1alpha3.EnvoyFilter.EnvoyConfigObjectPatch": {
          description: "Changes to be made to various envoy config objects.",
          type: "object",
          properties: {
            applyTo: {
              $ref:
                "#/components/schemas/istio.networking.v1alpha3.EnvoyFilter.ApplyTo",
            },
            match: {
              $ref:
                "#/components/schemas/istio.networking.v1alpha3.EnvoyFilter.EnvoyConfigObjectMatch",
            },
            patch: {
              $ref:
                "#/components/schemas/istio.networking.v1alpha3.EnvoyFilter.Patch",
            },
          },
        },
        "istio.networking.v1alpha3.EnvoyFilter.ApplyTo": {
          description:
            "ApplyTo specifies where in the Envoy configuration, the given patch should be applied.",
          type: "string",
          enum: [
            "INVALID",
            "LISTENER",
            "FILTER_CHAIN",
            "NETWORK_FILTER",
            "HTTP_FILTER",
            "ROUTE_CONFIGURATION",
            "VIRTUAL_HOST",
            "HTTP_ROUTE",
            "CLUSTER",
          ],
        },
        "istio.networking.v1alpha3.EnvoyFilter.PatchContext": {
          description:
            "PatchContext selects a class of configurations based on the traffic flow direction and workload type.",
          type: "string",
          enum: ["ANY", "SIDECAR_INBOUND", "SIDECAR_OUTBOUND", "GATEWAY"],
        },
        "istio.networking.v1alpha3.EnvoyFilter.ProxyMatch": {
          description: "One or more properties of the proxy to match on.",
          type: "object",
          properties: {
            proxyVersion: {
              description:
                "A regular expression in golang regex format (RE2) that can be used to select proxies using a specific version of istio proxy. The Istio version for a given proxy is obtained from the node metadata field ISTIO_VERSION supplied by the proxy when connecting to Pilot. This value is embedded as an environment variable (ISTIO_META_ISTIO_VERSION) in the Istio proxy docker image. Custom proxy implementations should provide this metadata variable to take advantage of the Istio version check option.",
              type: "string",
              format: "string",
            },
            metadata: {
              description:
                "Match on the node metadata supplied by a proxy when connecting to Istio Pilot. Note that while Envoy's node metadata is of type Struct, only string key-value pairs are processed by Pilot. All keys specified in the metadata must match with exact values. The match will fail if any of the specified keys are absent or the values fail to match.",
              type: "object",
              additionalProperties: {
                type: "string",
                format: "string",
              },
            },
          },
        },
        "istio.networking.v1alpha3.EnvoyFilter.ClusterMatch": {
          description:
            "Conditions specified in ClusterMatch must be met for the patch to be applied to a cluster.",
          type: "object",
          properties: {
            name: {
              description:
                'The exact name of the cluster to match. To match a specific cluster by name, such as the internally generated "Passthrough" cluster, leave all fields in clusterMatch empty, except the name.',
              type: "string",
              format: "string",
            },
            portNumber: {
              description:
                "The service port for which this cluster was generated. If omitted, applies to clusters for any port.",
              type: "integer",
            },
            service: {
              description:
                "The fully qualified service name for this cluster. If omitted, applies to clusters for any service. For services defined through service entries, the service name is same as the hosts defined in the service entry.",
              type: "string",
              format: "string",
            },
            subset: {
              description:
                "The subset associated with the service. If omitted, applies to clusters for any subset of a service.",
              type: "string",
              format: "string",
            },
          },
        },
        "istio.networking.v1alpha3.EnvoyFilter.RouteConfigurationMatch": {
          description:
            "Conditions specified in RouteConfigurationMatch must be met for the patch to be applied to a route configuration object or a specific virtual host within the route configuration.",
          type: "object",
          properties: {
            name: {
              description:
                'Route configuration name to match on. Can be used to match a specific route configuration by name, such as the internally generated "http_proxy" route configuration for all sidecars.',
              type: "string",
              format: "string",
            },
            portNumber: {
              description:
                "The service port number or gateway server port number for which this route configuration was generated. If omitted, applies to route configurations for all ports.",
              type: "integer",
            },
            portName: {
              description:
                "Applicable only for GATEWAY context. The gateway server port name for which this route configuration was generated.",
              type: "string",
              format: "string",
            },
            gateway: {
              description:
                "The Istio gateway config's namespace/name for which this route configuration was generated. Applies only if the context is GATEWAY. Should be in the namespace/name format. Use this field in conjunction with the portNumber and portName to accurately select the Envoy route configuration for a specific HTTPS server within a gateway config object.",
              type: "string",
              format: "string",
            },
            vhost: {
              $ref:
                "#/components/schemas/istio.networking.v1alpha3.EnvoyFilter.RouteConfigurationMatch.VirtualHostMatch",
            },
          },
        },
        "istio.networking.v1alpha3.EnvoyFilter.RouteConfigurationMatch.VirtualHostMatch": {
          description:
            "Match a specific virtual host inside a route configuration.",
          type: "object",
          properties: {
            name: {
              description:
                "The VirtualHosts objects generated by Istio are named as host:port, where the host typically corresponds to the VirtualService's host field or the hostname of a service in the registry.",
              type: "string",
              format: "string",
            },
            route: {
              $ref:
                "#/components/schemas/istio.networking.v1alpha3.EnvoyFilter.RouteConfigurationMatch.RouteMatch",
            },
          },
        },
        "istio.networking.v1alpha3.EnvoyFilter.RouteConfigurationMatch.RouteMatch": {
          description:
            "Match a specific route inside a virtual host in a route configuration.",
          type: "object",
          properties: {
            name: {
              description:
                'The Route objects generated by default are named as "default". Route objects generated using a virtual service will carry the name used in the virtual service\'s HTTP routes.',
              type: "string",
              format: "string",
            },
            action: {
              $ref:
                "#/components/schemas/istio.networking.v1alpha3.EnvoyFilter.RouteConfigurationMatch.RouteMatch.Action",
            },
          },
        },
        "istio.networking.v1alpha3.EnvoyFilter.RouteConfigurationMatch.RouteMatch.Action": {
          description:
            "Action refers to the route action taken by Envoy when a http route matches.",
          type: "string",
          enum: ["ANY", "ROUTE", "REDIRECT", "DIRECT_RESPONSE"],
        },
        "istio.networking.v1alpha3.EnvoyFilter.ListenerMatch": {
          description:
            "Conditions specified in a listener match must be met for the patch to be applied to a specific listener across all filter chains, or a specific filter chain inside the listener.",
          type: "object",
          properties: {
            name: {
              description:
                "Match a specific listener by its name. The listeners generated by Pilot are typically named as IP:Port.",
              type: "string",
              format: "string",
            },
            portNumber: {
              description:
                "The service port/gateway port to which traffic is being sent/received. If not specified, matches all listeners. Even though inbound listeners are generated for the instance/pod ports, only service ports should be used to match listeners.",
              type: "integer",
            },
            portName: {
              description:
                "Instead of using specific port numbers, a set of ports matching a given service's port name can be selected. Matching is case insensitive. Not implemented. $hide_from_docs",
              type: "string",
              format: "string",
            },
            filterChain: {
              $ref:
                "#/components/schemas/istio.networking.v1alpha3.EnvoyFilter.ListenerMatch.FilterChainMatch",
            },
          },
        },
        "istio.networking.v1alpha3.EnvoyFilter.ListenerMatch.FilterChainMatch": {
          description:
            "For listeners with multiple filter chains (e.g., inbound listeners on sidecars with permissive mTLS, gateway listeners with multiple SNI matches), the filter chain match can be used to select a specific filter chain to patch.",
          type: "object",
          properties: {
            name: {
              description: "The name assigned to the filter chain.",
              type: "string",
              format: "string",
            },
            sni: {
              description:
                "The SNI value used by a filter chain's match condition. This condition will evaluate to false if the filter chain has no sni match.",
              type: "string",
              format: "string",
            },
            transportProtocol: {
              description:
                "Applies only to SIDECAR_INBOUND context. If non-empty, a transport protocol to consider when determining a filter chain match. This value will be compared against the transport protocol of a new connection, when it's detected by the tls_inspector listener filter.",
              type: "string",
              format: "string",
            },
            applicationProtocols: {
              description:
                "Applies only to sidecars. If non-empty, a comma separated set of application protocols to consider when determining a filter chain match. This value will be compared against the application protocols of a new connection, when it's detected by one of the listener filters such as the http_inspector.",
              type: "string",
              format: "string",
            },
            filter: {
              $ref:
                "#/components/schemas/istio.networking.v1alpha3.EnvoyFilter.ListenerMatch.FilterMatch",
            },
          },
        },
        "istio.networking.v1alpha3.EnvoyFilter.ListenerMatch.FilterMatch": {
          description:
            "Conditions to match a specific filter within a filter chain.",
          type: "object",
          properties: {
            name: {
              description: "The filter name to match on.",
              type: "string",
              format: "string",
            },
            subFilter: {
              $ref:
                "#/components/schemas/istio.networking.v1alpha3.EnvoyFilter.ListenerMatch.SubFilterMatch",
            },
          },
        },
        "istio.networking.v1alpha3.EnvoyFilter.ListenerMatch.SubFilterMatch": {
          description:
            "Conditions to match a specific filter within another filter. This field is typically useful to match a HTTP filter inside the envoy.http_connection_manager network filter. This could also be applicable for thrift filters.",
          type: "object",
          properties: {
            name: {
              description: "The filter name to match on.",
              type: "string",
              format: "string",
            },
          },
        },
        "istio.networking.v1alpha3.EnvoyFilter.Patch": {
          description:
            "Patch specifies how the selected object should be modified.",
          type: "object",
          properties: {
            operation: {
              $ref:
                "#/components/schemas/istio.networking.v1alpha3.EnvoyFilter.Patch.Operation",
            },
            value: {
              description:
                "The JSON config of the object being patched. This will be merged using json merge semantics with the existing proto in the path.",
              type: "object",
            },
          },
        },
        "istio.networking.v1alpha3.EnvoyFilter.Patch.Operation": {
          description:
            "Operation denotes how the patch should be applied to the selected configuration.",
          type: "string",
          enum: [
            "INVALID",
            "MERGE",
            "ADD",
            "REMOVE",
            "INSERT_BEFORE",
            "INSERT_AFTER",
            "INSERT_FIRST",
          ],
        },
        "istio.networking.v1alpha3.EnvoyFilter.EnvoyConfigObjectMatch": {
          description:
            "One or more match conditions to be met before a patch is applied to the generated configuration for a given proxy.",
          type: "object",
          properties: {
            context: {
              $ref:
                "#/components/schemas/istio.networking.v1alpha3.EnvoyFilter.PatchContext",
            },
            proxy: {
              $ref:
                "#/components/schemas/istio.networking.v1alpha3.EnvoyFilter.ProxyMatch",
            },
          },
          oneOf: [
            {
              not: {
                anyOf: [
                  {
                    required: ["listener"],
                    properties: {
                      listener: {
                        $ref:
                          "#/components/schemas/istio.networking.v1alpha3.EnvoyFilter.ListenerMatch",
                      },
                    },
                  },
                  {
                    required: ["routeConfiguration"],
                    properties: {
                      routeConfiguration: {
                        $ref:
                          "#/components/schemas/istio.networking.v1alpha3.EnvoyFilter.RouteConfigurationMatch",
                      },
                    },
                  },
                  {
                    required: ["cluster"],
                    properties: {
                      cluster: {
                        $ref:
                          "#/components/schemas/istio.networking.v1alpha3.EnvoyFilter.ClusterMatch",
                      },
                    },
                  },
                ],
              },
            },
            {
              required: ["listener"],
              properties: {
                listener: {
                  $ref:
                    "#/components/schemas/istio.networking.v1alpha3.EnvoyFilter.ListenerMatch",
                },
              },
            },
            {
              required: ["routeConfiguration"],
              properties: {
                routeConfiguration: {
                  $ref:
                    "#/components/schemas/istio.networking.v1alpha3.EnvoyFilter.RouteConfigurationMatch",
                },
              },
            },
            {
              required: ["cluster"],
              properties: {
                cluster: {
                  $ref:
                    "#/components/schemas/istio.networking.v1alpha3.EnvoyFilter.ClusterMatch",
                },
              },
            },
          ],
        },
      },
    },
  },
  {
    openapi: "3.0.0",
    info: {
      title: "Configuration affecting service registry.",
      version: "v1alpha3",
    },
    components: {
      schemas: {
        "istio.networking.v1alpha3.WorkloadSelector": {
          description:
            "`WorkloadSelector` specifies the criteria used to determine if the `Gateway`, `Sidecar`, or `EnvoyFilter` or `ServiceEntry` configuration can be applied to a proxy. The matching criteria includes the metadata associated with a proxy, workload instance info such as labels attached to the pod/VM, or any other info that the proxy provides to Istio during the initial handshake. If multiple conditions are specified, all conditions need to match in order for the workload instance to be selected. Currently, only label based selection mechanism is supported.",
          type: "object",
          properties: {
            labels: {
              description:
                "One or more labels that indicate a specific set of pods/VMs on which the configuration should be applied. The scope of label search is restricted to the configuration namespace in which the the resource is present.",
              type: "object",
              additionalProperties: {
                type: "string",
                format: "string",
              },
            },
          },
        },
        "istio.networking.v1alpha3.Port": {
          description:
            "Port describes the properties of a specific port of a service.",
          type: "object",
          properties: {
            number: {
              description: "A valid non-negative integer port number.",
              type: "integer",
            },
            name: {
              description: "Label assigned to the port.",
              type: "string",
              format: "string",
            },
            protocol: {
              description:
                "The protocol exposed on the port. MUST BE one of HTTP|HTTPS|GRPC|HTTP2|MONGO|TCP|TLS. TLS implies the connection will be routed based on the SNI header to the destination without terminating the TLS connection.",
              type: "string",
              format: "string",
            },
          },
        },
        "istio.networking.v1alpha3.ServiceEntry": {
          description:
            "ServiceEntry enables adding additional entries into Istio's internal service registry.",
          type: "object",
          properties: {
            exportTo: {
              description:
                "A list of namespaces to which this service is exported. Exporting a service allows it to be used by sidecars, gateways and virtual services defined in other namespaces. This feature provides a mechanism for service owners and mesh administrators to control the visibility of services across namespace boundaries.",
              type: "array",
              items: {
                type: "string",
                format: "string",
              },
            },
            subjectAltNames: {
              description:
                "If specified, the proxy will verify that the server certificate's subject alternate name matches one of the specified values.",
              type: "array",
              items: {
                type: "string",
                format: "string",
              },
            },
            workloadSelector: {
              $ref:
                "#/components/schemas/istio.networking.v1alpha3.WorkloadSelector",
            },
            hosts: {
              description:
                "The hosts associated with the ServiceEntry. Could be a DNS name with wildcard prefix.",
              type: "array",
              items: {
                type: "string",
                format: "string",
              },
            },
            addresses: {
              description:
                "The virtual IP addresses associated with the service. Could be CIDR prefix. For HTTP traffic, generated route configurations will include http route domains for both the `addresses` and `hosts` field values and the destination will be identified based on the HTTP Host/Authority header. If one or more IP addresses are specified, the incoming traffic will be identified as belonging to this service if the destination IP matches the IP/CIDRs specified in the addresses field. If the Addresses field is empty, traffic will be identified solely based on the destination port. In such scenarios, the port on which the service is being accessed must not be shared by any other service in the mesh. In other words, the sidecar will behave as a simple TCP proxy, forwarding incoming traffic on a specified port to the specified destination endpoint IP/host. Unix domain socket addresses are not supported in this field.",
              type: "array",
              items: {
                type: "string",
                format: "string",
              },
            },
            ports: {
              description:
                "The ports associated with the external service. If the Endpoints are Unix domain socket addresses, there must be exactly one port.",
              type: "array",
              items: {
                $ref: "#/components/schemas/istio.networking.v1alpha3.Port",
              },
            },
            location: {
              $ref:
                "#/components/schemas/istio.networking.v1alpha3.ServiceEntry.Location",
            },
            resolution: {
              $ref:
                "#/components/schemas/istio.networking.v1alpha3.ServiceEntry.Resolution",
            },
            endpoints: {
              description:
                "One or more endpoints associated with the service. Only one of `endpoints` or `workloadSelector` can be specified.",
              type: "array",
              items: {
                $ref:
                  "#/components/schemas/istio.networking.v1alpha3.WorkloadEntry",
              },
            },
          },
        },
        "istio.networking.v1alpha3.ServiceEntry.Location": {
          description:
            "Location specifies whether the service is part of Istio mesh or outside the mesh. Location determines the behavior of several features, such as service-to-service mTLS authentication, policy enforcement, etc. When communicating with services outside the mesh, Istio's mTLS authentication is disabled, and policy enforcement is performed on the client-side as opposed to server-side.",
          type: "string",
          enum: ["MESH_EXTERNAL", "MESH_INTERNAL"],
        },
        "istio.networking.v1alpha3.ServiceEntry.Resolution": {
          description:
            "Resolution determines how the proxy will resolve the IP addresses of the network endpoints associated with the service, so that it can route to one of them. The resolution mode specified here has no impact on how the application resolves the IP address associated with the service. The application may still have to use DNS to resolve the service to an IP so that the outbound traffic can be captured by the Proxy. Alternatively, for HTTP services, the application could directly communicate with the proxy (e.g., by setting HTTP_PROXY) to talk to these services.",
          type: "string",
          enum: ["NONE", "STATIC", "DNS"],
        },
        "istio.networking.v1alpha3.WorkloadEntry": {
          description:
            "WorkloadEntry enables specifying the properties of a single non-Kubernetes workload such a VM or a bare metal services that can be referred to by service entries.",
          type: "object",
          properties: {
            labels: {
              description: "One or more labels associated with the endpoint.",
              type: "object",
              additionalProperties: {
                type: "string",
                format: "string",
              },
            },
            ports: {
              description:
                "Set of ports associated with the endpoint. The ports must be associated with a port name that was declared as part of the service. Do not use for `unix://` addresses.",
              type: "object",
              additionalProperties: {
                type: "integer",
              },
            },
            weight: {
              description:
                "The load balancing weight associated with the endpoint. Endpoints with higher weights will receive proportionally higher traffic.",
              type: "integer",
            },
            address: {
              description:
                "Address associated with the network endpoint without the port. Domain names can be used if and only if the resolution is set to DNS, and must be fully-qualified without wildcards. Use the form unix:///absolute/path/to/socket for Unix domain socket endpoints.",
              type: "string",
              format: "string",
            },
            network: {
              description:
                "Network enables Istio to group endpoints resident in the same L3 domain/network. All endpoints in the same network are assumed to be directly reachable from one another. When endpoints in different networks cannot reach each other directly, an Istio Gateway can be used to establish connectivity (usually using the `AUTO_PASSTHROUGH` mode in a Gateway Server). This is an advanced configuration used typically for spanning an Istio mesh over multiple clusters.",
              type: "string",
              format: "string",
            },
            locality: {
              description:
                'The locality associated with the endpoint. A locality corresponds to a failure domain (e.g., country/region/zone). Arbitrary failure domain hierarchies can be represented by separating each encapsulating failure domain by /. For example, the locality of an an endpoint in US, in US-East-1 region, within availability zone az-1, in data center rack r11 can be represented as us/us-east-1/az-1/r11. Istio will configure the sidecar to route to endpoints within the same locality as the sidecar. If none of the endpoints in the locality are available, endpoints parent locality (but within the same network ID) will be chosen. For example, if there are two endpoints in same network (networkID "n1"), say e1 with locality us/us-east-1/az-1/r11 and e2 with locality us/us-east-1/az-2/r12, a sidecar from us/us-east-1/az-1/r11 locality will prefer e1 from the same locality over e2 from a different locality. Endpoint e2 could be the IP associated with a gateway (that bridges networks n1 and n2), or the IP associated with a standard service endpoint.',
              type: "string",
              format: "string",
            },
            serviceAccount: {
              description:
                "The service account associated with the workload if a sidecar is present in the workload. The service account must be present in the same namespace as the configuration ( WorkloadEntry or a ServiceEntry)",
              type: "string",
              format: "string",
            },
          },
        },
      },
    },
  },
  {
    openapi: "3.0.0",
    info: {
      title: "Configuration affecting edge load balancer.",
      version: "v1alpha3",
    },
    components: {
      schemas: {
        "istio.networking.v1alpha3.Gateway": {
          description:
            "Gateway describes a load balancer operating at the edge of the mesh receiving incoming or outgoing HTTP/TCP connections.",
          type: "object",
          properties: {
            servers: {
              description: "A list of server specifications.",
              type: "array",
              items: {
                $ref: "#/components/schemas/istio.networking.v1alpha3.Server",
              },
            },
            selector: {
              description:
                "One or more labels that indicate a specific set of pods/VMs on which this gateway configuration should be applied. The scope of label search is restricted to the configuration namespace in which the the resource is present. In other words, the Gateway resource must reside in the same namespace as the gateway workload instance. If selector is nil, the Gateway will be applied to all workloads.",
              type: "object",
              additionalProperties: {
                type: "string",
                format: "string",
              },
            },
          },
        },
        "istio.networking.v1alpha3.Server": {
          description:
            "`Server` describes the properties of the proxy on a given load balancer port. For example,",
          type: "object",
          properties: {
            name: {
              description:
                "An optional name of the server, when set must be unique across all servers. This will be used for variety of purposes like prefixing stats generated with this name etc.",
              type: "string",
              format: "string",
            },
            tls: {
              $ref:
                "#/components/schemas/istio.networking.v1alpha3.ServerTLSSettings",
            },
            port: {
              $ref: "#/components/schemas/istio.networking.v1alpha3.Port",
            },
            bind: {
              description:
                "The ip or the Unix domain socket to which the listener should be bound to. Format: `x.x.x.x` or `unix:///path/to/uds` or `unix://@foobar` (Linux abstract namespace). When using Unix domain sockets, the port number should be 0.",
              type: "string",
              format: "string",
            },
            hosts: {
              description:
                "One or more hosts exposed by this gateway. While typically applicable to HTTP services, it can also be used for TCP services using TLS with SNI. A host is specified as a `dnsName` with an optional `namespace/` prefix. The `dnsName` should be specified using FQDN format, optionally including a wildcard character in the left-most component (e.g., `prod/*.example.com`). Set the `dnsName` to `*` to select all `VirtualService` hosts from the specified namespace (e.g.,`prod/*`).",
              type: "array",
              items: {
                type: "string",
                format: "string",
              },
            },
            defaultEndpoint: {
              description:
                "The loopback IP endpoint or Unix domain socket to which traffic should be forwarded to by default. Format should be `127.0.0.1:PORT` or `unix:///path/to/socket` or `unix://@foobar` (Linux abstract namespace). NOT IMPLEMENTED. $hide_from_docs",
              type: "string",
              format: "string",
            },
          },
        },
        "istio.networking.v1alpha3.Port": {
          description:
            "Port describes the properties of a specific port of a service.",
          type: "object",
          properties: {
            number: {
              description: "A valid non-negative integer port number.",
              type: "integer",
            },
            name: {
              description: "Label assigned to the port.",
              type: "string",
              format: "string",
            },
            protocol: {
              description:
                "The protocol exposed on the port. MUST BE one of HTTP|HTTPS|GRPC|HTTP2|MONGO|TCP|TLS. TLS implies the connection will be routed based on the SNI header to the destination without terminating the TLS connection.",
              type: "string",
              format: "string",
            },
          },
        },
        "istio.networking.v1alpha3.ServerTLSSettings": {
          type: "object",
          properties: {
            mode: {
              $ref:
                "#/components/schemas/istio.networking.v1alpha3.ServerTLSSettings.TLSmode",
            },
            privateKey: {
              description:
                "REQUIRED if mode is `SIMPLE` or `MUTUAL`. The path to the file holding the server's private key.",
              type: "string",
              format: "string",
            },
            caCertificates: {
              description:
                "REQUIRED if mode is `MUTUAL`. The path to a file containing certificate authority certificates to use in verifying a presented client side certificate.",
              type: "string",
              format: "string",
            },
            credentialName: {
              description:
                "For gateways running on Kubernetes, the name of the secret that holds the TLS certs including the CA certificates. Applicable only on Kubernetes. The secret (of type`generic`) should contain the following keys and values: `key: \u003cprivateKey\u003e`, `cert: \u003cserverCert\u003e`, `cacert: \u003cCACertificate\u003e`. Secret of type tls for server certificates along with ca.crt key for CA certificates is also supported. Only one of server certificates and CA certificate or credentialName can be specified.",
              type: "string",
              format: "string",
            },
            subjectAltNames: {
              description:
                "A list of alternate names to verify the subject identity in the certificate presented by the client.",
              type: "array",
              items: {
                type: "string",
                format: "string",
              },
            },
            httpsRedirect: {
              description:
                "If set to true, the load balancer will send a 301 redirect for all http connections, asking the clients to use HTTPS.",
              type: "boolean",
            },
            serverCertificate: {
              description:
                "REQUIRED if mode is `SIMPLE` or `MUTUAL`. The path to the file holding the server-side TLS certificate to use.",
              type: "string",
              format: "string",
            },
            verifyCertificateSpki: {
              description:
                "An optional list of base64-encoded SHA-256 hashes of the SKPIs of authorized client certificates. Note: When both verify_certificate_hash and verify_certificate_spki are specified, a hash matching either value will result in the certificate being accepted.",
              type: "array",
              items: {
                type: "string",
                format: "string",
              },
            },
            verifyCertificateHash: {
              description:
                "An optional list of hex-encoded SHA-256 hashes of the authorized client certificates. Both simple and colon separated formats are acceptable. Note: When both verify_certificate_hash and verify_certificate_spki are specified, a hash matching either value will result in the certificate being accepted.",
              type: "array",
              items: {
                type: "string",
                format: "string",
              },
            },
            minProtocolVersion: {
              $ref:
                "#/components/schemas/istio.networking.v1alpha3.ServerTLSSettings.TLSProtocol",
            },
            maxProtocolVersion: {
              $ref:
                "#/components/schemas/istio.networking.v1alpha3.ServerTLSSettings.TLSProtocol",
            },
            cipherSuites: {
              description:
                "Optional: If specified, only support the specified cipher list. Otherwise default to the default cipher list supported by Envoy.",
              type: "array",
              items: {
                type: "string",
                format: "string",
              },
            },
          },
        },
        "istio.networking.v1alpha3.ServerTLSSettings.TLSmode": {
          description: "TLS modes enforced by the proxy",
          type: "string",
          enum: [
            "PASSTHROUGH",
            "SIMPLE",
            "MUTUAL",
            "AUTO_PASSTHROUGH",
            "ISTIO_MUTUAL",
          ],
        },
        "istio.networking.v1alpha3.ServerTLSSettings.TLSProtocol": {
          description: "TLS protocol versions.",
          type: "string",
          enum: ["TLS_AUTO", "TLSV1_0", "TLSV1_1", "TLSV1_2", "TLSV1_3"],
        },
      },
    },
  },
  {
    openapi: "3.0.0",
    info: {
      title: "Configuration affecting VMs onboarded into the mesh.",
      version: "v1alpha3",
    },
    components: {
      schemas: {
        "istio.networking.v1alpha3.WorkloadEntry": {
          description:
            "WorkloadEntry enables specifying the properties of a single non-Kubernetes workload such a VM or a bare metal services that can be referred to by service entries.",
          type: "object",
          properties: {
            labels: {
              description: "One or more labels associated with the endpoint.",
              type: "object",
              additionalProperties: {
                type: "string",
                format: "string",
              },
            },
            ports: {
              description:
                "Set of ports associated with the endpoint. The ports must be associated with a port name that was declared as part of the service. Do not use for `unix://` addresses.",
              type: "object",
              additionalProperties: {
                type: "integer",
              },
            },
            weight: {
              description:
                "The load balancing weight associated with the endpoint. Endpoints with higher weights will receive proportionally higher traffic.",
              type: "integer",
            },
            address: {
              description:
                "Address associated with the network endpoint without the port. Domain names can be used if and only if the resolution is set to DNS, and must be fully-qualified without wildcards. Use the form unix:///absolute/path/to/socket for Unix domain socket endpoints.",
              type: "string",
              format: "string",
            },
            network: {
              description:
                "Network enables Istio to group endpoints resident in the same L3 domain/network. All endpoints in the same network are assumed to be directly reachable from one another. When endpoints in different networks cannot reach each other directly, an Istio Gateway can be used to establish connectivity (usually using the `AUTO_PASSTHROUGH` mode in a Gateway Server). This is an advanced configuration used typically for spanning an Istio mesh over multiple clusters.",
              type: "string",
              format: "string",
            },
            locality: {
              description:
                'The locality associated with the endpoint. A locality corresponds to a failure domain (e.g., country/region/zone). Arbitrary failure domain hierarchies can be represented by separating each encapsulating failure domain by /. For example, the locality of an an endpoint in US, in US-East-1 region, within availability zone az-1, in data center rack r11 can be represented as us/us-east-1/az-1/r11. Istio will configure the sidecar to route to endpoints within the same locality as the sidecar. If none of the endpoints in the locality are available, endpoints parent locality (but within the same network ID) will be chosen. For example, if there are two endpoints in same network (networkID "n1"), say e1 with locality us/us-east-1/az-1/r11 and e2 with locality us/us-east-1/az-2/r12, a sidecar from us/us-east-1/az-1/r11 locality will prefer e1 from the same locality over e2 from a different locality. Endpoint e2 could be the IP associated with a gateway (that bridges networks n1 and n2), or the IP associated with a standard service endpoint.',
              type: "string",
              format: "string",
            },
            serviceAccount: {
              description:
                "The service account associated with the workload if a sidecar is present in the workload. The service account must be present in the same namespace as the configuration ( WorkloadEntry or a ServiceEntry)",
              type: "string",
              format: "string",
            },
          },
        },
      },
    },
  },
  {
    openapi: "3.0.0",
    info: {
      title: "Configuration affecting label/content routing, sni routing, etc.",
      version: "v1alpha3",
    },
    components: {
      schemas: {
        "istio.networking.v1alpha3.PortSelector": {
          description:
            "PortSelector specifies the number of a port to be used for matching or selection for final routing.",
          type: "object",
          properties: {
            number: {
              description: "Valid port number",
              type: "integer",
            },
          },
        },
        "istio.networking.v1alpha3.Destination": {
          description:
            "Destination indicates the network addressable service to which the request/connection will be sent after processing a routing rule. The destination.host should unambiguously refer to a service in the service registry. Istio's service registry is composed of all the services found in the platform's service registry (e.g., Kubernetes services, Consul services), as well as services declared through the [ServiceEntry](https://istio.io/docs/reference/config/networking/service-entry/#ServiceEntry) resource.",
          type: "object",
          properties: {
            host: {
              description:
                "The name of a service from the service registry. Service names are looked up from the platform's service registry (e.g., Kubernetes services, Consul services, etc.) and from the hosts declared by [ServiceEntry](https://istio.io/docs/reference/config/networking/service-entry/#ServiceEntry). Traffic forwarded to destinations that are not found in either of the two, will be dropped.",
              type: "string",
              format: "string",
            },
            port: {
              $ref:
                "#/components/schemas/istio.networking.v1alpha3.PortSelector",
            },
            subset: {
              description:
                "The name of a subset within the service. Applicable only to services within the mesh. The subset must be defined in a corresponding DestinationRule.",
              type: "string",
              format: "string",
            },
          },
        },
        "istio.networking.v1alpha3.VirtualService": {
          description: "Configuration affecting traffic routing.",
          type: "object",
          properties: {
            exportTo: {
              description:
                "A list of namespaces to which this virtual service is exported. Exporting a virtual service allows it to be used by sidecars and gateways defined in other namespaces. This feature provides a mechanism for service owners and mesh administrators to control the visibility of virtual services across namespace boundaries.",
              type: "array",
              items: {
                type: "string",
                format: "string",
              },
            },
            tls: {
              description:
                "An ordered list of route rule for non-terminated TLS \u0026 HTTPS traffic. Routing is typically performed using the SNI value presented by the ClientHello message. TLS routes will be applied to platform service ports named 'https-*', 'tls-*', unterminated gateway ports using HTTPS/TLS protocols (i.e. with \"passthrough\" TLS mode) and service entry ports using HTTPS/TLS protocols. The first rule matching an incoming request is used. NOTE: Traffic 'https-*' or 'tls-*' ports without associated virtual service will be treated as opaque TCP traffic.",
              type: "array",
              items: {
                $ref: "#/components/schemas/istio.networking.v1alpha3.TLSRoute",
              },
            },
            tcp: {
              description:
                "An ordered list of route rules for opaque TCP traffic. TCP routes will be applied to any port that is not a HTTP or TLS port. The first rule matching an incoming request is used.",
              type: "array",
              items: {
                $ref: "#/components/schemas/istio.networking.v1alpha3.TCPRoute",
              },
            },
            http: {
              description:
                "An ordered list of route rules for HTTP traffic. HTTP routes will be applied to platform service ports named 'http-*'/'http2-*'/'grpc-*', gateway ports with protocol HTTP/HTTP2/GRPC/ TLS-terminated-HTTPS and service entry ports using HTTP/HTTP2/GRPC protocols. The first rule matching an incoming request is used.",
              type: "array",
              items: {
                $ref:
                  "#/components/schemas/istio.networking.v1alpha3.HTTPRoute",
              },
            },
            hosts: {
              description:
                "The destination hosts to which traffic is being sent. Could be a DNS name with wildcard prefix or an IP address. Depending on the platform, short-names can also be used instead of a FQDN (i.e. has no dots in the name). In such a scenario, the FQDN of the host would be derived based on the underlying platform.",
              type: "array",
              items: {
                type: "string",
                format: "string",
              },
            },
            gateways: {
              description:
                "The names of gateways and sidecars that should apply these routes. Gateways in other namespaces may be referred to by `\u003cgateway namespace\u003e/\u003cgateway name\u003e`; specifying a gateway with no namespace qualifier is the same as specifying the VirtualService's namespace. A single VirtualService is used for sidecars inside the mesh as well as for one or more gateways. The selection condition imposed by this field can be overridden using the source field in the match conditions of protocol-specific routes. The reserved word `mesh` is used to imply all the sidecars in the mesh. When this field is omitted, the default gateway (`mesh`) will be used, which would apply the rule to all sidecars in the mesh. If a list of gateway names is provided, the rules will apply only to the gateways. To apply the rules to both gateways and sidecars, specify `mesh` as one of the gateway names.",
              type: "array",
              items: {
                type: "string",
                format: "string",
              },
            },
          },
        },
        "istio.networking.v1alpha3.HTTPRoute": {
          description:
            "Describes match conditions and actions for routing HTTP/1.1, HTTP2, and gRPC traffic. See VirtualService for usage examples.",
          type: "object",
          properties: {
            name: {
              description:
                "The name assigned to the route for debugging purposes. The route's name will be concatenated with the match's name and will be logged in the access logs for requests matching this route/match.",
              type: "string",
              format: "string",
            },
            route: {
              description:
                "A HTTP rule can either redirect or forward (default) traffic. The forwarding target can be one of several versions of a service (see glossary in beginning of document). Weights associated with the service version determine the proportion of traffic it receives.",
              type: "array",
              items: {
                $ref:
                  "#/components/schemas/istio.networking.v1alpha3.HTTPRouteDestination",
              },
            },
            match: {
              description:
                "Match conditions to be satisfied for the rule to be activated. All conditions inside a single match block have AND semantics, while the list of match blocks have OR semantics. The rule is matched if any one of the match blocks succeed.",
              type: "array",
              items: {
                $ref:
                  "#/components/schemas/istio.networking.v1alpha3.HTTPMatchRequest",
              },
            },
            redirect: {
              $ref:
                "#/components/schemas/istio.networking.v1alpha3.HTTPRedirect",
            },
            delegate: {
              $ref: "#/components/schemas/istio.networking.v1alpha3.Delegate",
            },
            rewrite: {
              $ref:
                "#/components/schemas/istio.networking.v1alpha3.HTTPRewrite",
            },
            timeout: {
              description: "Timeout for HTTP requests.",
              type: "string",
            },
            retries: {
              $ref: "#/components/schemas/istio.networking.v1alpha3.HTTPRetry",
            },
            fault: {
              $ref:
                "#/components/schemas/istio.networking.v1alpha3.HTTPFaultInjection",
            },
            mirror: {
              $ref:
                "#/components/schemas/istio.networking.v1alpha3.Destination",
            },
            mirrorPercent: {
              description:
                "Percentage of the traffic to be mirrored by the `mirror` field. Use of integer `mirror_percent` value is deprecated. Use the double `mirror_percentage` field instead",
              type: "integer",
              deprecated: true,
              nullable: true,
            },
            mirrorPercentage: {
              $ref: "#/components/schemas/istio.networking.v1alpha3.Percent",
            },
            corsPolicy: {
              $ref: "#/components/schemas/istio.networking.v1alpha3.CorsPolicy",
            },
            headers: {
              $ref: "#/components/schemas/istio.networking.v1alpha3.Headers",
            },
          },
        },
        "istio.networking.v1alpha3.TLSRoute": {
          description:
            'Describes match conditions and actions for routing unterminated TLS traffic (TLS/HTTPS) The following routing rule forwards unterminated TLS traffic arriving at port 443 of gateway called "mygateway" to internal services in the mesh based on the SNI value.',
          type: "object",
          properties: {
            route: {
              description:
                "The destination to which the connection should be forwarded to.",
              type: "array",
              items: {
                $ref:
                  "#/components/schemas/istio.networking.v1alpha3.RouteDestination",
              },
            },
            match: {
              description:
                "Match conditions to be satisfied for the rule to be activated. All conditions inside a single match block have AND semantics, while the list of match blocks have OR semantics. The rule is matched if any one of the match blocks succeed.",
              type: "array",
              items: {
                $ref:
                  "#/components/schemas/istio.networking.v1alpha3.TLSMatchAttributes",
              },
            },
          },
        },
        "istio.networking.v1alpha3.TCPRoute": {
          description:
            "Describes match conditions and actions for routing TCP traffic. The following routing rule forwards traffic arriving at port 27017 for mongo.prod.svc.cluster.local to another Mongo server on port 5555.",
          type: "object",
          properties: {
            route: {
              description:
                "The destination to which the connection should be forwarded to.",
              type: "array",
              items: {
                $ref:
                  "#/components/schemas/istio.networking.v1alpha3.RouteDestination",
              },
            },
            match: {
              description:
                "Match conditions to be satisfied for the rule to be activated. All conditions inside a single match block have AND semantics, while the list of match blocks have OR semantics. The rule is matched if any one of the match blocks succeed.",
              type: "array",
              items: {
                $ref:
                  "#/components/schemas/istio.networking.v1alpha3.L4MatchAttributes",
              },
            },
          },
        },
        "istio.networking.v1alpha3.HTTPMatchRequest": {
          description:
            "HttpMatchRequest specifies a set of criterion to be met in order for the rule to be applied to the HTTP request. For example, the following restricts the rule to match only requests where the URL path starts with /ratings/v2/ and the request contains a custom `end-user` header with value `jason`.",
          type: "object",
          properties: {
            name: {
              description:
                "The name assigned to a match. The match's name will be concatenated with the parent route's name and will be logged in the access logs for requests matching this route.",
              type: "string",
              format: "string",
            },
            method: {
              $ref:
                "#/components/schemas/istio.networking.v1alpha3.StringMatch",
            },
            port: {
              description:
                "Specifies the ports on the host that is being addressed. Many services only expose a single port or label ports with the protocols they support, in these cases it is not required to explicitly select the port.",
              type: "integer",
            },
            gateways: {
              description:
                "Names of gateways where the rule should be applied. Gateway names in the top-level `gateways` field of the VirtualService (if any) are overridden. The gateway match is independent of sourceLabels.",
              type: "array",
              items: {
                type: "string",
                format: "string",
              },
            },
            headers: {
              description:
                "The header keys must be lowercase and use hyphen as the separator, e.g. _x-request-id_.",
              type: "object",
              additionalProperties: {
                $ref:
                  "#/components/schemas/istio.networking.v1alpha3.StringMatch",
              },
            },
            uri: {
              $ref:
                "#/components/schemas/istio.networking.v1alpha3.StringMatch",
            },
            scheme: {
              $ref:
                "#/components/schemas/istio.networking.v1alpha3.StringMatch",
            },
            authority: {
              $ref:
                "#/components/schemas/istio.networking.v1alpha3.StringMatch",
            },
            sourceLabels: {
              description:
                "One or more labels that constrain the applicability of a rule to workloads with the given labels. If the VirtualService has a list of gateways specified in the top-level `gateways` field, it must include the reserved gateway `mesh` for this field to be applicable.",
              type: "object",
              additionalProperties: {
                type: "string",
                format: "string",
              },
            },
            queryParams: {
              description: "Query parameters for matching.",
              type: "object",
              additionalProperties: {
                $ref:
                  "#/components/schemas/istio.networking.v1alpha3.StringMatch",
              },
            },
            ignoreUriCase: {
              description:
                "Flag to specify whether the URI matching should be case-insensitive.",
              type: "boolean",
            },
            withoutHeaders: {
              description:
                "withoutHeader has the same syntax with the header, but has opposite meaning. If a header is matched with a matching rule among withoutHeader, the traffic becomes not matched one.",
              type: "object",
              additionalProperties: {
                $ref:
                  "#/components/schemas/istio.networking.v1alpha3.StringMatch",
              },
            },
            sourceNamespace: {
              description:
                "Source namespace constraining the applicability of a rule to workloads in that namespace. If the VirtualService has a list of gateways specified in the top-level `gateways` field, it must include the reserved gateway `mesh` for this field to be applicable.",
              type: "string",
              format: "string",
            },
          },
        },
        "istio.networking.v1alpha3.HTTPRouteDestination": {
          description:
            'Each routing rule is associated with one or more service versions (see glossary in beginning of document). Weights associated with the version determine the proportion of traffic it receives. For example, the following rule will route 25% of traffic for the "reviews" service to instances with the "v2" tag and the remaining traffic (i.e., 75%) to "v1".',
          type: "object",
          properties: {
            headers: {
              $ref: "#/components/schemas/istio.networking.v1alpha3.Headers",
            },
            destination: {
              $ref:
                "#/components/schemas/istio.networking.v1alpha3.Destination",
            },
            weight: {
              description:
                "The proportion of traffic to be forwarded to the service version. (0-100). Sum of weights across destinations SHOULD BE == 100. If there is only one destination in a rule, the weight value is assumed to be 100.",
              type: "integer",
              format: "int32",
            },
          },
        },
        "istio.networking.v1alpha3.HTTPRedirect": {
          description:
            "HTTPRedirect can be used to send a 301 redirect response to the caller, where the Authority/Host and the URI in the response can be swapped with the specified values. For example, the following rule redirects requests for /v1/getProductRatings API on the ratings service to /v1/bookRatings provided by the bookratings service.",
          type: "object",
          properties: {
            uri: {
              description:
                "On a redirect, overwrite the Path portion of the URL with this value. Note that the entire path will be replaced, irrespective of the request URI being matched as an exact path or prefix.",
              type: "string",
              format: "string",
            },
            authority: {
              description:
                "On a redirect, overwrite the Authority/Host portion of the URL with this value.",
              type: "string",
              format: "string",
            },
            redirectCode: {
              description:
                "On a redirect, Specifies the HTTP status code to use in the redirect response. The default response code is MOVED_PERMANENTLY (301).",
              type: "integer",
            },
          },
        },
        "istio.networking.v1alpha3.Delegate": {
          description:
            "Describes the delegate VirtualService. The following routing rules forward the traffic to `/productpage` by a delegate VirtualService named `productpage`, forward the traffic to `/reviews` by a delegate VirtualService named `reviews`.",
          type: "object",
          properties: {
            name: {
              description:
                "Name specifies the name of the delegate VirtualService.",
              type: "string",
              format: "string",
            },
            namespace: {
              description:
                "Namespace specifies the namespace where the delegate VirtualService resides. By default, it is same to the root's.",
              type: "string",
              format: "string",
            },
          },
        },
        "istio.networking.v1alpha3.HTTPRewrite": {
          description:
            "HTTPRewrite can be used to rewrite specific parts of a HTTP request before forwarding the request to the destination. Rewrite primitive can be used only with HTTPRouteDestination. The following example demonstrates how to rewrite the URL prefix for api call (/ratings) to ratings service before making the actual API call.",
          type: "object",
          properties: {
            uri: {
              description:
                "rewrite the path (or the prefix) portion of the URI with this value. If the original URI was matched based on prefix, the value provided in this field will replace the corresponding matched prefix.",
              type: "string",
              format: "string",
            },
            authority: {
              description: "rewrite the Authority/Host header with this value.",
              type: "string",
              format: "string",
            },
          },
        },
        "istio.networking.v1alpha3.HTTPRetry": {
          description:
            "Describes the retry policy to use when a HTTP request fails. For example, the following rule sets the maximum number of retries to 3 when calling ratings:v1 service, with a 2s timeout per retry attempt.",
          type: "object",
          properties: {
            attempts: {
              description:
                "Number of retries for a given request. The interval between retries will be determined automatically (25ms+). Actual number of retries attempted depends on the request `timeout` of the [HTTP route](https://istio.io/docs/reference/config/networking/virtual-service/#HTTPRoute).",
              type: "integer",
              format: "int32",
            },
            perTryTimeout: {
              description:
                "Timeout per retry attempt for a given request. format: 1h/1m/1s/1ms. MUST BE \u003e=1ms.",
              type: "string",
            },
            retryOn: {
              description:
                "Specifies the conditions under which retry takes place. One or more policies can be specified using a ‘,’ delimited list. See the [retry policies](https://www.envoyproxy.io/docs/envoy/latest/configuration/http/http_filters/router_filter#x-envoy-retry-on) and [gRPC retry policies](https://www.envoyproxy.io/docs/envoy/latest/configuration/http/http_filters/router_filter#x-envoy-retry-grpc-on) for more details.",
              type: "string",
              format: "string",
            },
            retryRemoteLocalities: {
              description:
                "Flag to specify whether the retries should retry to other localities. See the [retry plugin configuration](https://www.envoyproxy.io/docs/envoy/latest/intro/arch_overview/http/http_connection_management#retry-plugin-configuration) for more details.",
              type: "boolean",
              nullable: true,
            },
          },
        },
        "istio.networking.v1alpha3.HTTPFaultInjection": {
          description:
            "HTTPFaultInjection can be used to specify one or more faults to inject while forwarding HTTP requests to the destination specified in a route. Fault specification is part of a VirtualService rule. Faults include aborting the Http request from downstream service, and/or delaying proxying of requests. A fault rule MUST HAVE delay or abort or both.",
          type: "object",
          properties: {
            delay: {
              $ref:
                "#/components/schemas/istio.networking.v1alpha3.HTTPFaultInjection.Delay",
            },
            abort: {
              $ref:
                "#/components/schemas/istio.networking.v1alpha3.HTTPFaultInjection.Abort",
            },
          },
        },
        "istio.networking.v1alpha3.Percent": {
          description:
            "Percent specifies a percentage in the range of [0.0, 100.0].",
          type: "object",
          properties: {
            value: {
              type: "number",
              format: "double",
            },
          },
        },
        "istio.networking.v1alpha3.CorsPolicy": {
          description:
            "Describes the Cross-Origin Resource Sharing (CORS) policy, for a given service. Refer to [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/Access_control_CORS) for further details about cross origin resource sharing. For example, the following rule restricts cross origin requests to those originating from example.com domain using HTTP POST/GET, and sets the `Access-Control-Allow-Credentials` header to false. In addition, it only exposes `X-Foo-bar` header and sets an expiry period of 1 day.",
          type: "object",
          properties: {
            allowOrigin: {
              description:
                "The list of origins that are allowed to perform CORS requests. The content will be serialized into the Access-Control-Allow-Origin header. Wildcard * will allow all origins. $hide_from_docs",
              type: "array",
              items: {
                type: "string",
                format: "string",
              },
              deprecated: true,
            },
            allowOrigins: {
              description:
                "String patterns that match allowed origins. An origin is allowed if any of the string matchers match. If a match is found, then the outgoing Access-Control-Allow-Origin would be set to the origin as provided by the client.",
              type: "array",
              items: {
                $ref:
                  "#/components/schemas/istio.networking.v1alpha3.StringMatch",
              },
            },
            allowMethods: {
              description:
                "List of HTTP methods allowed to access the resource. The content will be serialized into the Access-Control-Allow-Methods header.",
              type: "array",
              items: {
                type: "string",
                format: "string",
              },
            },
            allowHeaders: {
              description:
                "List of HTTP headers that can be used when requesting the resource. Serialized to Access-Control-Allow-Headers header.",
              type: "array",
              items: {
                type: "string",
                format: "string",
              },
            },
            exposeHeaders: {
              description:
                "A white list of HTTP headers that the browsers are allowed to access. Serialized into Access-Control-Expose-Headers header.",
              type: "array",
              items: {
                type: "string",
                format: "string",
              },
            },
            maxAge: {
              description:
                "Specifies how long the results of a preflight request can be cached. Translates to the `Access-Control-Max-Age` header.",
              type: "string",
            },
            allowCredentials: {
              description:
                "Indicates whether the caller is allowed to send the actual request (not the preflight) using credentials. Translates to `Access-Control-Allow-Credentials` header.",
              type: "boolean",
              nullable: true,
            },
          },
        },
        "istio.networking.v1alpha3.Headers": {
          description:
            "Message headers can be manipulated when Envoy forwards requests to, or responses from, a destination service. Header manipulation rules can be specified for a specific route destination or for all destinations. The following VirtualService adds a `test` header with the value `true` to requests that are routed to any `reviews` service destination. It also romoves the `foo` response header, but only from responses coming from the `v1` subset (version) of the `reviews` service.",
          type: "object",
          properties: {
            response: {
              $ref:
                "#/components/schemas/istio.networking.v1alpha3.Headers.HeaderOperations",
            },
            request: {
              $ref:
                "#/components/schemas/istio.networking.v1alpha3.Headers.HeaderOperations",
            },
          },
        },
        "istio.networking.v1alpha3.Headers.HeaderOperations": {
          description:
            "HeaderOperations Describes the header manipulations to apply",
          type: "object",
          properties: {
            set: {
              description:
                "Overwrite the headers specified by key with the given values",
              type: "object",
              additionalProperties: {
                type: "string",
                format: "string",
              },
            },
            add: {
              description:
                "Append the given values to the headers specified by keys (will create a comma-separated list of values)",
              type: "object",
              additionalProperties: {
                type: "string",
                format: "string",
              },
            },
            remove: {
              description: "Remove a the specified headers",
              type: "array",
              items: {
                type: "string",
                format: "string",
              },
            },
          },
        },
        "istio.networking.v1alpha3.TLSMatchAttributes": {
          description: "TLS connection match attributes.",
          type: "object",
          properties: {
            port: {
              description:
                "Specifies the port on the host that is being addressed. Many services only expose a single port or label ports with the protocols they support, in these cases it is not required to explicitly select the port.",
              type: "integer",
            },
            gateways: {
              description:
                "Names of gateways where the rule should be applied. Gateway names in the top-level `gateways` field of the VirtualService (if any) are overridden. The gateway match is independent of sourceLabels.",
              type: "array",
              items: {
                type: "string",
                format: "string",
              },
            },
            sourceLabels: {
              description:
                "One or more labels that constrain the applicability of a rule to workloads with the given labels. If the VirtualService has a list of gateways specified in the top-level `gateways` field, it should include the reserved gateway `mesh` in order for this field to be applicable.",
              type: "object",
              additionalProperties: {
                type: "string",
                format: "string",
              },
            },
            sourceNamespace: {
              description:
                "Source namespace constraining the applicability of a rule to workloads in that namespace. If the VirtualService has a list of gateways specified in the top-level `gateways` field, it must include the reserved gateway `mesh` for this field to be applicable.",
              type: "string",
              format: "string",
            },
            destinationSubnets: {
              description:
                "IPv4 or IPv6 ip addresses of destination with optional subnet. E.g., a.b.c.d/xx form or just a.b.c.d.",
              type: "array",
              items: {
                type: "string",
                format: "string",
              },
            },
            sniHosts: {
              description:
                "SNI (server name indicator) to match on. Wildcard prefixes can be used in the SNI value, e.g., *.com will match foo.example.com as well as example.com. An SNI value must be a subset (i.e., fall within the domain) of the corresponding virtual serivce's hosts.",
              type: "array",
              items: {
                type: "string",
                format: "string",
              },
            },
          },
        },
        "istio.networking.v1alpha3.RouteDestination": {
          description: "L4 routing rule weighted destination.",
          type: "object",
          properties: {
            destination: {
              $ref:
                "#/components/schemas/istio.networking.v1alpha3.Destination",
            },
            weight: {
              description:
                "The proportion of traffic to be forwarded to the service version. If there is only one destination in a rule, all traffic will be routed to it irrespective of the weight.",
              type: "integer",
              format: "int32",
            },
          },
        },
        "istio.networking.v1alpha3.L4MatchAttributes": {
          description:
            "L4 connection match attributes. Note that L4 connection matching support is incomplete.",
          type: "object",
          properties: {
            port: {
              description:
                "Specifies the port on the host that is being addressed. Many services only expose a single port or label ports with the protocols they support, in these cases it is not required to explicitly select the port.",
              type: "integer",
            },
            gateways: {
              description:
                "Names of gateways where the rule should be applied. Gateway names in the top-level `gateways` field of the VirtualService (if any) are overridden. The gateway match is independent of sourceLabels.",
              type: "array",
              items: {
                type: "string",
                format: "string",
              },
            },
            sourceLabels: {
              description:
                "One or more labels that constrain the applicability of a rule to workloads with the given labels. If the VirtualService has a list of gateways specified in the top-level `gateways` field, it should include the reserved gateway `mesh` in order for this field to be applicable.",
              type: "object",
              additionalProperties: {
                type: "string",
                format: "string",
              },
            },
            sourceNamespace: {
              description:
                "Source namespace constraining the applicability of a rule to workloads in that namespace. If the VirtualService has a list of gateways specified in the top-level `gateways` field, it must include the reserved gateway `mesh` for this field to be applicable.",
              type: "string",
              format: "string",
            },
            destinationSubnets: {
              description:
                "IPv4 or IPv6 ip addresses of destination with optional subnet. E.g., a.b.c.d/xx form or just a.b.c.d.",
              type: "array",
              items: {
                type: "string",
                format: "string",
              },
            },
            sourceSubnet: {
              description:
                "IPv4 or IPv6 ip address of source with optional subnet. E.g., a.b.c.d/xx form or just a.b.c.d $hide_from_docs",
              type: "string",
              format: "string",
            },
          },
        },
        "istio.networking.v1alpha3.StringMatch": {
          description:
            "Describes how to match a given string in HTTP headers. Match is case-sensitive.",
          type: "object",
          oneOf: [
            {
              not: {
                anyOf: [
                  {
                    required: ["exact"],
                    properties: {
                      exact: {
                        description: "exact string match",
                        type: "string",
                        format: "string",
                      },
                    },
                  },
                  {
                    required: ["prefix"],
                    properties: {
                      prefix: {
                        description: "prefix-based match",
                        type: "string",
                        format: "string",
                      },
                    },
                  },
                  {
                    required: ["regex"],
                    properties: {
                      regex: {
                        description:
                          "RE2 style regex-based match (https://github.com/google/re2/wiki/Syntax).",
                        type: "string",
                        format: "string",
                      },
                    },
                  },
                ],
              },
            },
            {
              required: ["exact"],
              properties: {
                exact: {
                  description: "exact string match",
                  type: "string",
                  format: "string",
                },
              },
            },
            {
              required: ["prefix"],
              properties: {
                prefix: {
                  description: "prefix-based match",
                  type: "string",
                  format: "string",
                },
              },
            },
            {
              required: ["regex"],
              properties: {
                regex: {
                  description:
                    "RE2 style regex-based match (https://github.com/google/re2/wiki/Syntax).",
                  type: "string",
                  format: "string",
                },
              },
            },
          ],
        },
        "istio.networking.v1alpha3.HTTPFaultInjection.Delay": {
          description:
            'Delay specification is used to inject latency into the request forwarding path. The following example will introduce a 5 second delay in 1 out of every 1000 requests to the "v1" version of the "reviews" service from all pods with label env: prod',
          type: "object",
          properties: {
            percent: {
              description:
                "Percentage of requests on which the delay will be injected (0-100). Use of integer `percent` value is deprecated. Use the double `percentage` field instead.",
              type: "integer",
              format: "int32",
              deprecated: true,
            },
            percentage: {
              $ref: "#/components/schemas/istio.networking.v1alpha3.Percent",
            },
          },
          oneOf: [
            {
              not: {
                anyOf: [
                  {
                    required: ["fixedDelay"],
                    properties: {
                      fixedDelay: {
                        description:
                          "Add a fixed delay before forwarding the request. Format: 1h/1m/1s/1ms. MUST be \u003e=1ms.",
                        type: "string",
                      },
                    },
                  },
                  {
                    required: ["exponentialDelay"],
                    properties: {
                      exponentialDelay: {
                        type: "string",
                      },
                    },
                  },
                ],
              },
            },
            {
              required: ["fixedDelay"],
              properties: {
                fixedDelay: {
                  description:
                    "Add a fixed delay before forwarding the request. Format: 1h/1m/1s/1ms. MUST be \u003e=1ms.",
                  type: "string",
                },
              },
            },
            {
              required: ["exponentialDelay"],
              properties: {
                exponentialDelay: {
                  type: "string",
                },
              },
            },
          ],
        },
        "istio.networking.v1alpha3.HTTPFaultInjection.Abort": {
          description:
            'Abort specification is used to prematurely abort a request with a pre-specified error code. The following example will return an HTTP 400 error code for 1 out of every 1000 requests to the "ratings" service "v1".',
          type: "object",
          properties: {
            percentage: {
              $ref: "#/components/schemas/istio.networking.v1alpha3.Percent",
            },
          },
          oneOf: [
            {
              not: {
                anyOf: [
                  {
                    required: ["httpStatus"],
                    properties: {
                      httpStatus: {
                        description:
                          "HTTP status code to use to abort the Http request.",
                        type: "integer",
                        format: "int32",
                      },
                    },
                  },
                  {
                    required: ["grpcStatus"],
                    properties: {
                      grpcStatus: {
                        type: "string",
                        format: "string",
                      },
                    },
                  },
                  {
                    required: ["http2Error"],
                    properties: {
                      http2Error: {
                        type: "string",
                        format: "string",
                      },
                    },
                  },
                ],
              },
            },
            {
              required: ["httpStatus"],
              properties: {
                httpStatus: {
                  description:
                    "HTTP status code to use to abort the Http request.",
                  type: "integer",
                  format: "int32",
                },
              },
            },
            {
              required: ["grpcStatus"],
              properties: {
                grpcStatus: {
                  type: "string",
                  format: "string",
                },
              },
            },
            {
              required: ["http2Error"],
              properties: {
                http2Error: {
                  type: "string",
                  format: "string",
                },
              },
            },
          ],
        },
      },
    },
  },
  {
    openapi: "3.0.0",
    info: {
      title: "Configuration affecting load balancing, outlier detection, etc.",
      version: "v1alpha3",
    },
    components: {
      schemas: {
        "istio.networking.v1alpha3.DestinationRule": {
          description:
            "DestinationRule defines policies that apply to traffic intended for a service after routing has occurred.",
          type: "object",
          properties: {
            host: {
              description:
                "The name of a service from the service registry. Service names are looked up from the platform's service registry (e.g., Kubernetes services, Consul services, etc.) and from the hosts declared by [ServiceEntries](https://istio.io/docs/reference/config/networking/service-entry/#ServiceEntry). Rules defined for services that do not exist in the service registry will be ignored.",
              type: "string",
              format: "string",
            },
            trafficPolicy: {
              $ref:
                "#/components/schemas/istio.networking.v1alpha3.TrafficPolicy",
            },
            subsets: {
              description:
                "One or more named sets that represent individual versions of a service. Traffic policies can be overridden at subset level.",
              type: "array",
              items: {
                $ref: "#/components/schemas/istio.networking.v1alpha3.Subset",
              },
            },
            exportTo: {
              description:
                "A list of namespaces to which this destination rule is exported. The resolution of a destination rule to apply to a service occurs in the context of a hierarchy of namespaces. Exporting a destination rule allows it to be included in the resolution hierarchy for services in other namespaces. This feature provides a mechanism for service owners and mesh administrators to control the visibility of destination rules across namespace boundaries.",
              type: "array",
              items: {
                type: "string",
                format: "string",
              },
            },
          },
        },
        "istio.networking.v1alpha3.TrafficPolicy": {
          description:
            "Traffic policies to apply for a specific destination, across all destination ports. See DestinationRule for examples.",
          type: "object",
          properties: {
            loadBalancer: {
              $ref:
                "#/components/schemas/istio.networking.v1alpha3.LoadBalancerSettings",
            },
            connectionPool: {
              $ref:
                "#/components/schemas/istio.networking.v1alpha3.ConnectionPoolSettings",
            },
            outlierDetection: {
              $ref:
                "#/components/schemas/istio.networking.v1alpha3.OutlierDetection",
            },
            tls: {
              $ref:
                "#/components/schemas/istio.networking.v1alpha3.ClientTLSSettings",
            },
            portLevelSettings: {
              description:
                "Traffic policies specific to individual ports. Note that port level settings will override the destination-level settings. Traffic settings specified at the destination-level will not be inherited when overridden by port-level settings, i.e. default values will be applied to fields omitted in port-level traffic policies.",
              type: "array",
              items: {
                $ref:
                  "#/components/schemas/istio.networking.v1alpha3.TrafficPolicy.PortTrafficPolicy",
              },
            },
          },
        },
        "istio.networking.v1alpha3.Subset": {
          description:
            "A subset of endpoints of a service. Subsets can be used for scenarios like A/B testing, or routing to a specific version of a service. Refer to [VirtualService](https://istio.io/docs/reference/config/networking/virtual-service/#VirtualService) documentation for examples of using subsets in these scenarios. In addition, traffic policies defined at the service-level can be overridden at a subset-level. The following rule uses a round robin load balancing policy for all traffic going to a subset named testversion that is composed of endpoints (e.g., pods) with labels (version:v3).",
          type: "object",
          properties: {
            name: {
              description:
                "Name of the subset. The service name and the subset name can be used for traffic splitting in a route rule.",
              type: "string",
              format: "string",
            },
            trafficPolicy: {
              $ref:
                "#/components/schemas/istio.networking.v1alpha3.TrafficPolicy",
            },
            labels: {
              description:
                "Labels apply a filter over the endpoints of a service in the service registry. See route rules for examples of usage.",
              type: "object",
              additionalProperties: {
                type: "string",
                format: "string",
              },
            },
          },
        },
        "istio.networking.v1alpha3.LoadBalancerSettings": {
          description:
            "Load balancing policies to apply for a specific destination. See Envoy's load balancing [documentation](https://www.envoyproxy.io/docs/envoy/latest/intro/arch_overview/upstream/load_balancing/load_balancing) for more details.",
          type: "object",
          properties: {
            localityLbSetting: {
              $ref:
                "#/components/schemas/istio.networking.v1alpha3.LocalityLoadBalancerSetting",
            },
          },
          oneOf: [
            {
              not: {
                anyOf: [
                  {
                    required: ["simple"],
                    properties: {
                      simple: {
                        $ref:
                          "#/components/schemas/istio.networking.v1alpha3.LoadBalancerSettings.SimpleLB",
                      },
                    },
                  },
                  {
                    required: ["consistentHash"],
                    properties: {
                      consistentHash: {
                        $ref:
                          "#/components/schemas/istio.networking.v1alpha3.LoadBalancerSettings.ConsistentHashLB",
                      },
                    },
                  },
                ],
              },
            },
            {
              required: ["simple"],
              properties: {
                simple: {
                  $ref:
                    "#/components/schemas/istio.networking.v1alpha3.LoadBalancerSettings.SimpleLB",
                },
              },
            },
            {
              required: ["consistentHash"],
              properties: {
                consistentHash: {
                  $ref:
                    "#/components/schemas/istio.networking.v1alpha3.LoadBalancerSettings.ConsistentHashLB",
                },
              },
            },
          ],
        },
        "istio.networking.v1alpha3.ConnectionPoolSettings": {
          description:
            "Connection pool settings for an upstream host. The settings apply to each individual host in the upstream service. See Envoy's [circuit breaker](https://www.envoyproxy.io/docs/envoy/latest/intro/arch_overview/upstream/circuit_breaking) for more details. Connection pool settings can be applied at the TCP level as well as at HTTP level.",
          type: "object",
          properties: {
            tcp: {
              $ref:
                "#/components/schemas/istio.networking.v1alpha3.ConnectionPoolSettings.TCPSettings",
            },
            http: {
              $ref:
                "#/components/schemas/istio.networking.v1alpha3.ConnectionPoolSettings.HTTPSettings",
            },
          },
        },
        "istio.networking.v1alpha3.OutlierDetection": {
          description:
            "A Circuit breaker implementation that tracks the status of each individual host in the upstream service. Applicable to both HTTP and TCP services. For HTTP services, hosts that continually return 5xx errors for API calls are ejected from the pool for a pre-defined period of time. For TCP services, connection timeouts or connection failures to a given host counts as an error when measuring the consecutive errors metric. See Envoy's [outlier detection](https://www.envoyproxy.io/docs/envoy/latest/intro/arch_overview/upstream/outlier) for more details.",
          type: "object",
          properties: {
            interval: {
              description:
                "Time interval between ejection sweep analysis. format: 1h/1m/1s/1ms. MUST BE \u003e=1ms. Default is 10s.",
              type: "string",
            },
            consecutiveErrors: {
              description:
                "Number of errors before a host is ejected from the connection pool. Defaults to 5. When the upstream host is accessed over HTTP, a 502, 503, or 504 return code qualifies as an error. When the upstream host is accessed over an opaque TCP connection, connect timeouts and connection error/failure events qualify as an error. $hide_from_docs",
              type: "integer",
              format: "int32",
              deprecated: true,
            },
            consecutiveGatewayErrors: {
              description:
                "Number of gateway errors before a host is ejected from the connection pool. When the upstream host is accessed over HTTP, a 502, 503, or 504 return code qualifies as a gateway error. When the upstream host is accessed over an opaque TCP connection, connect timeouts and connection error/failure events qualify as a gateway error. This feature is disabled by default or when set to the value 0.",
              type: "integer",
              nullable: true,
            },
            consecutive5xxErrors: {
              description:
                "Number of 5xx errors before a host is ejected from the connection pool. When the upstream host is accessed over an opaque TCP connection, connect timeouts, connection error/failure and request failure events qualify as a 5xx error. This feature defaults to 5 but can be disabled by setting the value to 0.",
              type: "integer",
              nullable: true,
            },
            baseEjectionTime: {
              description:
                "Minimum ejection duration. A host will remain ejected for a period equal to the product of minimum ejection duration and the number of times the host has been ejected. This technique allows the system to automatically increase the ejection period for unhealthy upstream servers. format: 1h/1m/1s/1ms. MUST BE \u003e=1ms. Default is 30s.",
              type: "string",
            },
            maxEjectionPercent: {
              description:
                "Maximum % of hosts in the load balancing pool for the upstream service that can be ejected. Defaults to 10%.",
              type: "integer",
              format: "int32",
            },
            minHealthPercent: {
              description:
                "Outlier detection will be enabled as long as the associated load balancing pool has at least min_health_percent hosts in healthy mode. When the percentage of healthy hosts in the load balancing pool drops below this threshold, outlier detection will be disabled and the proxy will load balance across all hosts in the pool (healthy and unhealthy). The threshold can be disabled by setting it to 0%. The default is 0% as it's not typically applicable in k8s environments with few pods per service.",
              type: "integer",
              format: "int32",
            },
          },
        },
        "istio.networking.v1alpha3.ClientTLSSettings": {
          description:
            "SSL/TLS related settings for upstream connections. See Envoy's [TLS context](https://www.envoyproxy.io/docs/envoy/latest/api-v2/api/v2/auth/cert.proto.html) for more details. These settings are common to both HTTP and TCP upstreams.",
          type: "object",
          properties: {
            mode: {
              $ref:
                "#/components/schemas/istio.networking.v1alpha3.ClientTLSSettings.TLSmode",
            },
            clientCertificate: {
              description:
                "REQUIRED if mode is `MUTUAL`. The path to the file holding the client-side TLS certificate to use. Should be empty if mode is `ISTIO_MUTUAL`.",
              type: "string",
              format: "string",
            },
            privateKey: {
              description:
                "REQUIRED if mode is `MUTUAL`. The path to the file holding the client's private key. Should be empty if mode is `ISTIO_MUTUAL`.",
              type: "string",
              format: "string",
            },
            caCertificates: {
              description:
                "OPTIONAL: The path to the file containing certificate authority certificates to use in verifying a presented server certificate. If omitted, the proxy will not verify the server's certificate. Should be empty if mode is `ISTIO_MUTUAL`.",
              type: "string",
              format: "string",
            },
            credentialName: {
              description:
                "The name of the secret that holds the TLS certs for the client including the CA certificates. Applicable only on Kubernetes. Secret must exist in the same namespace with the proxy using the certificates. The secret (of type `generic`)should contain the following keys and values: `key: \u003cprivateKey\u003e`, `cert: \u003cserverCert\u003e`, `cacert: \u003cCACertificate\u003e`. Secret of type tls for client certificates along with ca.crt key for CA certificates is also supported. Only one of client certificates and CA certificate or credentialName can be specified.",
              type: "string",
              format: "string",
            },
            subjectAltNames: {
              description:
                "A list of alternate names to verify the subject identity in the certificate. If specified, the proxy will verify that the server certificate's subject alt name matches one of the specified values. If specified, this list overrides the value of subject_alt_names from the ServiceEntry.",
              type: "array",
              items: {
                type: "string",
                format: "string",
              },
            },
            sni: {
              description:
                "SNI string to present to the server during TLS handshake.",
              type: "string",
              format: "string",
            },
          },
        },
        "istio.networking.v1alpha3.TrafficPolicy.PortTrafficPolicy": {
          description:
            "Traffic policies that apply to specific ports of the service",
          type: "object",
          properties: {
            loadBalancer: {
              $ref:
                "#/components/schemas/istio.networking.v1alpha3.LoadBalancerSettings",
            },
            connectionPool: {
              $ref:
                "#/components/schemas/istio.networking.v1alpha3.ConnectionPoolSettings",
            },
            outlierDetection: {
              $ref:
                "#/components/schemas/istio.networking.v1alpha3.OutlierDetection",
            },
            tls: {
              $ref:
                "#/components/schemas/istio.networking.v1alpha3.ClientTLSSettings",
            },
            port: {
              $ref:
                "#/components/schemas/istio.networking.v1alpha3.PortSelector",
            },
          },
        },
        "istio.networking.v1alpha3.PortSelector": {
          description:
            "PortSelector specifies the number of a port to be used for matching or selection for final routing.",
          type: "object",
          properties: {
            number: {
              description: "Valid port number",
              type: "integer",
            },
          },
        },
        "istio.networking.v1alpha3.LocalityLoadBalancerSetting": {
          description:
            "Locality-weighted load balancing allows administrators to control the distribution of traffic to endpoints based on the localities of where the traffic originates and where it will terminate. These localities are specified using arbitrary labels that designate a hierarchy of localities in {region}/{zone}/{sub-zone} form. For additional detail refer to [Locality Weight](https://www.envoyproxy.io/docs/envoy/latest/intro/arch_overview/upstream/load_balancing/locality_weight) The following example shows how to setup locality weights mesh-wide.",
          type: "object",
          properties: {
            distribute: {
              description:
                "Optional: only one of distribute or failover can be set. Explicitly specify loadbalancing weight across different zones and geographical locations. Refer to [Locality weighted load balancing](https://www.envoyproxy.io/docs/envoy/latest/intro/arch_overview/upstream/load_balancing/locality_weight) If empty, the locality weight is set according to the endpoints number within it.",
              type: "array",
              items: {
                $ref:
                  "#/components/schemas/istio.networking.v1alpha3.LocalityLoadBalancerSetting.Distribute",
              },
            },
            failover: {
              description:
                "Optional: only failover or distribute can be set. Explicitly specify the region traffic will land on when endpoints in local region becomes unhealthy. Should be used together with OutlierDetection to detect unhealthy endpoints. Note: if no OutlierDetection specified, this will not take effect.",
              type: "array",
              items: {
                $ref:
                  "#/components/schemas/istio.networking.v1alpha3.LocalityLoadBalancerSetting.Failover",
              },
            },
            enabled: {
              description:
                "enable locality load balancing, this is DestinationRule-level and will override mesh wide settings in entirety. e.g. true means that turn on locality load balancing for this DestinationRule no matter what mesh wide settings is.",
              type: "boolean",
              nullable: true,
            },
          },
        },
        "istio.networking.v1alpha3.LoadBalancerSettings.SimpleLB": {
          description:
            "Standard load balancing algorithms that require no tuning.",
          type: "string",
          enum: ["ROUND_ROBIN", "LEAST_CONN", "RANDOM", "PASSTHROUGH"],
        },
        "istio.networking.v1alpha3.LoadBalancerSettings.ConsistentHashLB": {
          description:
            "Consistent Hash-based load balancing can be used to provide soft session affinity based on HTTP headers, cookies or other properties. This load balancing policy is applicable only for HTTP connections. The affinity to a particular destination host will be lost when one or more hosts are added/removed from the destination service.",
          type: "object",
          properties: {
            minimumRingSize: {
              description:
                "The minimum number of virtual nodes to use for the hash ring. Defaults to 1024. Larger ring sizes result in more granular load distributions. If the number of hosts in the load balancing pool is larger than the ring size, each host will be assigned a single virtual node.",
              type: "integer",
            },
          },
          oneOf: [
            {
              not: {
                anyOf: [
                  {
                    required: ["httpHeaderName"],
                    properties: {
                      httpHeaderName: {
                        description: "Hash based on a specific HTTP header.",
                        type: "string",
                        format: "string",
                      },
                    },
                  },
                  {
                    required: ["httpCookie"],
                    properties: {
                      httpCookie: {
                        $ref:
                          "#/components/schemas/istio.networking.v1alpha3.LoadBalancerSettings.ConsistentHashLB.HTTPCookie",
                      },
                    },
                  },
                  {
                    required: ["useSourceIp"],
                    properties: {
                      useSourceIp: {
                        description: "Hash based on the source IP address.",
                        type: "boolean",
                      },
                    },
                  },
                  {
                    required: ["httpQueryParameterName"],
                    properties: {
                      httpQueryParameterName: {
                        description:
                          "Hash based on a specific HTTP query parameter.",
                        type: "string",
                        format: "string",
                      },
                    },
                  },
                ],
              },
            },
            {
              required: ["httpHeaderName"],
              properties: {
                httpHeaderName: {
                  description: "Hash based on a specific HTTP header.",
                  type: "string",
                  format: "string",
                },
              },
            },
            {
              required: ["httpCookie"],
              properties: {
                httpCookie: {
                  $ref:
                    "#/components/schemas/istio.networking.v1alpha3.LoadBalancerSettings.ConsistentHashLB.HTTPCookie",
                },
              },
            },
            {
              required: ["useSourceIp"],
              properties: {
                useSourceIp: {
                  description: "Hash based on the source IP address.",
                  type: "boolean",
                },
              },
            },
            {
              required: ["httpQueryParameterName"],
              properties: {
                httpQueryParameterName: {
                  description: "Hash based on a specific HTTP query parameter.",
                  type: "string",
                  format: "string",
                },
              },
            },
          ],
        },
        "istio.networking.v1alpha3.LoadBalancerSettings.ConsistentHashLB.HTTPCookie": {
          description:
            "Describes a HTTP cookie that will be used as the hash key for the Consistent Hash load balancer. If the cookie is not present, it will be generated.",
          type: "object",
          properties: {
            path: {
              description: "Path to set for the cookie.",
              type: "string",
              format: "string",
            },
            name: {
              description: "Name of the cookie.",
              type: "string",
              format: "string",
            },
            ttl: {
              description: "Lifetime of the cookie.",
              type: "string",
            },
          },
        },
        "istio.networking.v1alpha3.ConnectionPoolSettings.TCPSettings": {
          description:
            "Settings common to both HTTP and TCP upstream connections.",
          type: "object",
          properties: {
            maxConnections: {
              description:
                "Maximum number of HTTP1 /TCP connections to a destination host. Default 2^32-1.",
              type: "integer",
              format: "int32",
            },
            connectTimeout: {
              description:
                "TCP connection timeout. format: 1h/1m/1s/1ms. MUST BE \u003e=1ms. Default is 10s.",
              type: "string",
            },
            tcpKeepalive: {
              $ref:
                "#/components/schemas/istio.networking.v1alpha3.ConnectionPoolSettings.TCPSettings.TcpKeepalive",
            },
          },
        },
        "istio.networking.v1alpha3.ConnectionPoolSettings.HTTPSettings": {
          description: "Settings applicable to HTTP1.1/HTTP2/GRPC connections.",
          type: "object",
          properties: {
            http1MaxPendingRequests: {
              description:
                "Maximum number of pending HTTP requests to a destination. Default 2^32-1.",
              type: "integer",
              format: "int32",
            },
            http2MaxRequests: {
              description:
                "Maximum number of requests to a backend. Default 2^32-1.",
              type: "integer",
              format: "int32",
            },
            maxRequestsPerConnection: {
              description:
                'Maximum number of requests per connection to a backend. Setting this parameter to 1 disables keep alive. Default 0, meaning "unlimited", up to 2^29.',
              type: "integer",
              format: "int32",
            },
            maxRetries: {
              description:
                "Maximum number of retries that can be outstanding to all hosts in a cluster at a given time. Defaults to 2^32-1.",
              type: "integer",
              format: "int32",
            },
            idleTimeout: {
              description:
                "The idle timeout for upstream connection pool connections. The idle timeout is defined as the period in which there are no active requests. If not set, the default is 1 hour. When the idle timeout is reached the connection will be closed. Note that request based timeouts mean that HTTP/2 PINGs will not keep the connection alive. Applies to both HTTP1.1 and HTTP2 connections.",
              type: "string",
            },
            h2UpgradePolicy: {
              $ref:
                "#/components/schemas/istio.networking.v1alpha3.ConnectionPoolSettings.HTTPSettings.H2UpgradePolicy",
            },
          },
        },
        "istio.networking.v1alpha3.ConnectionPoolSettings.TCPSettings.TcpKeepalive": {
          description: "TCP keepalive.",
          type: "object",
          properties: {
            time: {
              description:
                "The time duration a connection needs to be idle before keep-alive probes start being sent. Default is to use the OS level configuration (unless overridden, Linux defaults to 7200s (ie 2 hours.)",
              type: "string",
            },
            probes: {
              description:
                "Maximum number of keepalive probes to send without response before deciding the connection is dead. Default is to use the OS level configuration (unless overridden, Linux defaults to 9.)",
              type: "integer",
            },
            interval: {
              description:
                "The time duration between keep-alive probes. Default is to use the OS level configuration (unless overridden, Linux defaults to 75s.)",
              type: "string",
            },
          },
        },
        "istio.networking.v1alpha3.ConnectionPoolSettings.HTTPSettings.H2UpgradePolicy": {
          description: "Policy for upgrading http1.1 connections to http2.",
          type: "string",
          enum: ["DEFAULT", "DO_NOT_UPGRADE", "UPGRADE"],
        },
        "istio.networking.v1alpha3.ClientTLSSettings.TLSmode": {
          description: "TLS connection mode",
          type: "string",
          enum: ["DISABLE", "SIMPLE", "MUTUAL", "ISTIO_MUTUAL"],
        },
        "istio.networking.v1alpha3.LocalityLoadBalancerSetting.Distribute": {
          description:
            "Describes how traffic originating in the 'from' zone or sub-zone is distributed over a set of 'to' zones. Syntax for specifying a zone is {region}/{zone}/{sub-zone} and terminal wildcards are allowed on any segment of the specification. Examples: * - matches all localities us-west/* - all zones and sub-zones within the us-west region us-west/zone-1/* - all sub-zones within us-west/zone-1",
          type: "object",
          properties: {
            from: {
              description:
                "Originating locality, '/' separated, e.g. 'region/zone/sub_zone'.",
              type: "string",
              format: "string",
            },
            to: {
              description:
                "Map of upstream localities to traffic distribution weights. The sum of all weights should be == 100. Any locality not assigned a weight will receive no traffic.",
              type: "object",
              additionalProperties: {
                type: "integer",
              },
            },
          },
        },
        "istio.networking.v1alpha3.LocalityLoadBalancerSetting.Failover": {
          description:
            "Specify the traffic failover policy across regions. Since zone and sub-zone failover is supported by default this only needs to be specified for regions when the operator needs to constrain traffic failover so that the default behavior of failing over to any endpoint globally does not apply. This is useful when failing over traffic across regions would not improve service health or may need to be restricted for other reasons like regulatory controls.",
          type: "object",
          properties: {
            from: {
              description: "Originating region.",
              type: "string",
              format: "string",
            },
            to: {
              description:
                "Destination region the traffic will fail over to when endpoints in the 'from' region becomes unhealthy.",
              type: "string",
              format: "string",
            },
          },
        },
      },
    },
  },
  {
    openapi: "3.0.0",
    info: {
      title: "Configuration affecting network reachability of a sidecar.",
      version: "v1beta1",
    },
    components: {
      schemas: {
        "istio.networking.v1beta1.ClientTLSSettings": {
          description:
            "SSL/TLS related settings for upstream connections. See Envoy's [TLS context](https://www.envoyproxy.io/docs/envoy/latest/api-v2/api/v2/auth/cert.proto.html) for more details. These settings are common to both HTTP and TCP upstreams.",
          type: "object",
          properties: {
            mode: {
              $ref:
                "#/components/schemas/istio.networking.v1beta1.ClientTLSSettings.TLSmode",
            },
            clientCertificate: {
              description:
                "REQUIRED if mode is `MUTUAL`. The path to the file holding the client-side TLS certificate to use. Should be empty if mode is `ISTIO_MUTUAL`.",
              type: "string",
              format: "string",
            },
            privateKey: {
              description:
                "REQUIRED if mode is `MUTUAL`. The path to the file holding the client's private key. Should be empty if mode is `ISTIO_MUTUAL`.",
              type: "string",
              format: "string",
            },
            caCertificates: {
              description:
                "OPTIONAL: The path to the file containing certificate authority certificates to use in verifying a presented server certificate. If omitted, the proxy will not verify the server's certificate. Should be empty if mode is `ISTIO_MUTUAL`.",
              type: "string",
              format: "string",
            },
            credentialName: {
              description:
                "The name of the secret that holds the TLS certs for the client including the CA certificates. Applicable only on Kubernetes. Secret must exist in the same namespace with the proxy using the certificates. The secret (of type `generic`)should contain the following keys and values: `key: \u003cprivateKey\u003e`, `cert: \u003cserverCert\u003e`, `cacert: \u003cCACertificate\u003e`. Secret of type tls for client certificates along with ca.crt key for CA certificates is also supported. Only one of client certificates and CA certificate or credentialName can be specified.",
              type: "string",
              format: "string",
            },
            subjectAltNames: {
              description:
                "A list of alternate names to verify the subject identity in the certificate. If specified, the proxy will verify that the server certificate's subject alt name matches one of the specified values. If specified, this list overrides the value of subject_alt_names from the ServiceEntry.",
              type: "array",
              items: {
                type: "string",
                format: "string",
              },
            },
            sni: {
              description:
                "SNI string to present to the server during TLS handshake.",
              type: "string",
              format: "string",
            },
          },
        },
        "istio.networking.v1beta1.PortSelector": {
          description:
            "PortSelector specifies the number of a port to be used for matching or selection for final routing.",
          type: "object",
          properties: {
            number: {
              description: "Valid port number",
              type: "integer",
            },
          },
        },
        "istio.networking.v1beta1.ClientTLSSettings.TLSmode": {
          description: "TLS connection mode",
          type: "string",
          enum: ["DISABLE", "SIMPLE", "MUTUAL", "ISTIO_MUTUAL"],
        },
        "istio.networking.v1beta1.Port": {
          description:
            "Port describes the properties of a specific port of a service.",
          type: "object",
          properties: {
            number: {
              description: "A valid non-negative integer port number.",
              type: "integer",
            },
            name: {
              description: "Label assigned to the port.",
              type: "string",
              format: "string",
            },
            protocol: {
              description:
                "The protocol exposed on the port. MUST BE one of HTTP|HTTPS|GRPC|HTTP2|MONGO|TCP|TLS. TLS implies the connection will be routed based on the SNI header to the destination without terminating the TLS connection.",
              type: "string",
              format: "string",
            },
          },
        },
        "istio.networking.v1beta1.ServerTLSSettings": {
          type: "object",
          properties: {
            mode: {
              $ref:
                "#/components/schemas/istio.networking.v1beta1.ServerTLSSettings.TLSmode",
            },
            privateKey: {
              description:
                "REQUIRED if mode is `SIMPLE` or `MUTUAL`. The path to the file holding the server's private key.",
              type: "string",
              format: "string",
            },
            caCertificates: {
              description:
                "REQUIRED if mode is `MUTUAL`. The path to a file containing certificate authority certificates to use in verifying a presented client side certificate.",
              type: "string",
              format: "string",
            },
            credentialName: {
              description:
                "For gateways running on Kubernetes, the name of the secret that holds the TLS certs including the CA certificates. Applicable only on Kubernetes, and only if the dynamic credential fetching feature is enabled in the proxy by setting `ISTIO_META_USER_SDS` metadata variable. The secret (of type `generic`) should contain the following keys and values: `key: \u003cprivateKey\u003e`, `cert: \u003cserverCert\u003e`, `cacert: \u003cCACertificate\u003e`. Secret of type tls for server certificates along with ca.crt key for CA certificates is also supported. Only one of server certificates and CA certificate or credentialName can be specified.",
              type: "string",
              format: "string",
            },
            subjectAltNames: {
              description:
                "A list of alternate names to verify the subject identity in the certificate presented by the client.",
              type: "array",
              items: {
                type: "string",
                format: "string",
              },
            },
            httpsRedirect: {
              description:
                "If set to true, the load balancer will send a 301 redirect for all http connections, asking the clients to use HTTPS.",
              type: "boolean",
            },
            serverCertificate: {
              description:
                "REQUIRED if mode is `SIMPLE` or `MUTUAL`. The path to the file holding the server-side TLS certificate to use.",
              type: "string",
              format: "string",
            },
            verifyCertificateSpki: {
              description:
                "An optional list of base64-encoded SHA-256 hashes of the SKPIs of authorized client certificates. Note: When both verify_certificate_hash and verify_certificate_spki are specified, a hash matching either value will result in the certificate being accepted.",
              type: "array",
              items: {
                type: "string",
                format: "string",
              },
            },
            verifyCertificateHash: {
              description:
                "An optional list of hex-encoded SHA-256 hashes of the authorized client certificates. Both simple and colon separated formats are acceptable. Note: When both verify_certificate_hash and verify_certificate_spki are specified, a hash matching either value will result in the certificate being accepted.",
              type: "array",
              items: {
                type: "string",
                format: "string",
              },
            },
            minProtocolVersion: {
              $ref:
                "#/components/schemas/istio.networking.v1beta1.ServerTLSSettings.TLSProtocol",
            },
            maxProtocolVersion: {
              $ref:
                "#/components/schemas/istio.networking.v1beta1.ServerTLSSettings.TLSProtocol",
            },
            cipherSuites: {
              description:
                "Optional: If specified, only support the specified cipher list. Otherwise default to the default cipher list supported by Envoy.",
              type: "array",
              items: {
                type: "string",
                format: "string",
              },
            },
          },
        },
        "istio.networking.v1beta1.ServerTLSSettings.TLSmode": {
          description: "TLS modes enforced by the proxy",
          type: "string",
          enum: [
            "PASSTHROUGH",
            "SIMPLE",
            "MUTUAL",
            "AUTO_PASSTHROUGH",
            "ISTIO_MUTUAL",
          ],
        },
        "istio.networking.v1beta1.ServerTLSSettings.TLSProtocol": {
          description: "TLS protocol versions.",
          type: "string",
          enum: ["TLS_AUTO", "TLSV1_0", "TLSV1_1", "TLSV1_2", "TLSV1_3"],
        },
        "istio.networking.v1beta1.WorkloadSelector": {
          description:
            "`WorkloadSelector` specifies the criteria used to determine if the `Gateway`, `Sidecar`, or `EnvoyFilter` configuration can be applied to a proxy. The matching criteria includes the metadata associated with a proxy, workload instance info such as labels attached to the pod/VM, or any other info that the proxy provides to Istio during the initial handshake. If multiple conditions are specified, all conditions need to match in order for the workload instance to be selected. Currently, only label based selection mechanism is supported.",
          type: "object",
          properties: {
            labels: {
              description:
                "One or more labels that indicate a specific set of pods/VMs on which this `Sidecar` configuration should be applied. The scope of label search is restricted to the configuration namespace in which the the resource is present.",
              type: "object",
              additionalProperties: {
                type: "string",
                format: "string",
              },
            },
          },
        },
        "istio.networking.v1beta1.Sidecar": {
          description:
            "`Sidecar` describes the configuration of the sidecar proxy that mediates inbound and outbound communication of the workload instance to which it is attached.",
          type: "object",
          properties: {
            workloadSelector: {
              $ref:
                "#/components/schemas/istio.networking.v1beta1.WorkloadSelector",
            },
            ingress: {
              description:
                "Ingress specifies the configuration of the sidecar for processing inbound traffic to the attached workload instance. If omitted, Istio will automatically configure the sidecar based on the information about the workload obtained from the orchestration platform (e.g., exposed ports, services, etc.). If specified, inbound ports are configured if and only if the workload instance is associated with a service.",
              type: "array",
              items: {
                $ref:
                  "#/components/schemas/istio.networking.v1beta1.IstioIngressListener",
              },
            },
            egress: {
              description:
                "Egress specifies the configuration of the sidecar for processing outbound traffic from the attached workload instance to other services in the mesh. If not specified, inherits the system detected defaults from the namespace-wide or the global default Sidecar.",
              type: "array",
              items: {
                $ref:
                  "#/components/schemas/istio.networking.v1beta1.IstioEgressListener",
              },
            },
            outboundTrafficPolicy: {
              $ref:
                "#/components/schemas/istio.networking.v1beta1.OutboundTrafficPolicy",
            },
            localhost: {
              $ref: "#/components/schemas/istio.networking.v1beta1.Localhost",
            },
          },
        },
        "istio.networking.v1beta1.IstioIngressListener": {
          description:
            "`IstioIngressListener` specifies the properties of an inbound traffic listener on the sidecar proxy attached to a workload instance.",
          type: "object",
          properties: {
            port: {
              $ref: "#/components/schemas/istio.networking.v1beta1.Port",
            },
            bind: {
              description:
                "The IP to which the listener should be bound. Must be in the format `x.x.x.x`. Unix domain socket addresses are not allowed in the bind field for ingress listeners. If omitted, Istio will automatically configure the defaults based on imported services and the workload instances to which this configuration is applied to.",
              type: "string",
              format: "string",
            },
            defaultEndpoint: {
              description:
                "The loopback IP endpoint or Unix domain socket to which traffic should be forwarded to. This configuration can be used to redirect traffic arriving at the bind `IP:Port` on the sidecar to a `localhost:port` or Unix domain socket where the application workload instance is listening for connections. Format should be `127.0.0.1:PORT` or `unix:///path/to/socket`",
              type: "string",
              format: "string",
            },
            captureMode: {
              $ref: "#/components/schemas/istio.networking.v1beta1.CaptureMode",
            },
            localhostClientTls: {
              $ref:
                "#/components/schemas/istio.networking.v1beta1.ClientTLSSettings",
            },
          },
        },
        "istio.networking.v1beta1.IstioEgressListener": {
          description:
            "`IstioEgressListener` specifies the properties of an outbound traffic listener on the sidecar proxy attached to a workload instance.",
          type: "object",
          properties: {
            port: {
              $ref: "#/components/schemas/istio.networking.v1beta1.Port",
            },
            bind: {
              description:
                "The IP or the Unix domain socket to which the listener should be bound to. Port MUST be specified if bind is not empty. Format: `x.x.x.x` or `unix:///path/to/uds` or `unix://@foobar` (Linux abstract namespace). If omitted, Istio will automatically configure the defaults based on imported services, the workload instances to which this configuration is applied to and the captureMode. If captureMode is `NONE`, bind will default to 127.0.0.1.",
              type: "string",
              format: "string",
            },
            hosts: {
              description:
                "One or more service hosts exposed by the listener in `namespace/dnsName` format. Services in the specified namespace matching `dnsName` will be exposed. The corresponding service can be a service in the service registry (e.g., a Kubernetes or cloud foundry service) or a service specified using a `ServiceEntry` or `VirtualService` configuration. Any associated `DestinationRule` in the same namespace will also be used.",
              type: "array",
              items: {
                type: "string",
                format: "string",
              },
            },
            captureMode: {
              $ref: "#/components/schemas/istio.networking.v1beta1.CaptureMode",
            },
            localhostServerTls: {
              $ref:
                "#/components/schemas/istio.networking.v1beta1.ServerTLSSettings",
            },
          },
        },
        "istio.networking.v1beta1.OutboundTrafficPolicy": {
          description:
            "`OutboundTrafficPolicy` sets the default behavior of the sidecar for handling outbound traffic from the application. If your application uses one or more external services that are not known apriori, setting the policy to `ALLOW_ANY` will cause the sidecars to route any unknown traffic originating from the application to its requested destination. Users are strongly encouraged to use `ServiceEntry` configurations to explicitly declare any external dependencies, instead of using `ALLOW_ANY`, so that traffic to these services can be monitored.",
          type: "object",
          properties: {
            mode: {
              $ref:
                "#/components/schemas/istio.networking.v1beta1.OutboundTrafficPolicy.Mode",
            },
            egressProxy: {
              $ref: "#/components/schemas/istio.networking.v1beta1.Destination",
            },
          },
        },
        "istio.networking.v1beta1.Localhost": {
          description:
            "`Localhost` describes the sidecar settings related to the communication between the sidecar and the workload it is attached to in a Kubernetes Pod or a VM. These settings apply by default to all ingress and egress listeners in a sidecar unless overridden.",
          type: "object",
          properties: {
            clientTls: {
              $ref:
                "#/components/schemas/istio.networking.v1beta1.ClientTLSSettings",
            },
            serverTls: {
              $ref:
                "#/components/schemas/istio.networking.v1beta1.ServerTLSSettings",
            },
          },
        },
        "istio.networking.v1beta1.CaptureMode": {
          description:
            "`CaptureMode` describes how traffic to a listener is expected to be captured. Applicable only when the listener is bound to an IP.",
          type: "string",
          enum: ["DEFAULT", "IPTABLES", "NONE"],
        },
        "istio.networking.v1beta1.OutboundTrafficPolicy.Mode": {
          type: "string",
          enum: ["REGISTRY_ONLY", "ALLOW_ANY"],
        },
        "istio.networking.v1beta1.Destination": {
          description:
            "Destination indicates the network addressable service to which the request/connection will be sent after processing a routing rule. The destination.host should unambiguously refer to a service in the service registry. Istio's service registry is composed of all the services found in the platform's service registry (e.g., Kubernetes services, Consul services), as well as services declared through the [ServiceEntry](https://istio.io/docs/reference/config/networking/service-entry/#ServiceEntry) resource.",
          type: "object",
          properties: {
            host: {
              description:
                "The name of a service from the service registry. Service names are looked up from the platform's service registry (e.g., Kubernetes services, Consul services, etc.) and from the hosts declared by [ServiceEntry](https://istio.io/docs/reference/config/networking/service-entry/#ServiceEntry). Traffic forwarded to destinations that are not found in either of the two, will be dropped.",
              type: "string",
              format: "string",
            },
            port: {
              $ref:
                "#/components/schemas/istio.networking.v1beta1.PortSelector",
            },
            subset: {
              description:
                "The name of a subset within the service. Applicable only to services within the mesh. The subset must be defined in a corresponding DestinationRule.",
              type: "string",
              format: "string",
            },
          },
        },
      },
    },
  },
  {
    openapi: "3.0.0",
    info: {
      title: "Configuration affecting service registry.",
      version: "v1beta1",
    },
    components: {
      schemas: {
        "istio.networking.v1beta1.Port": {
          description:
            "Port describes the properties of a specific port of a service.",
          type: "object",
          properties: {
            number: {
              description: "A valid non-negative integer port number.",
              type: "integer",
            },
            name: {
              description: "Label assigned to the port.",
              type: "string",
              format: "string",
            },
            protocol: {
              description:
                "The protocol exposed on the port. MUST BE one of HTTP|HTTPS|GRPC|HTTP2|MONGO|TCP|TLS. TLS implies the connection will be routed based on the SNI header to the destination without terminating the TLS connection.",
              type: "string",
              format: "string",
            },
          },
        },
        "istio.networking.v1beta1.ServiceEntry": {
          description:
            "ServiceEntry enables adding additional entries into Istio's internal service registry.",
          type: "object",
          properties: {
            exportTo: {
              description:
                "A list of namespaces to which this service is exported. Exporting a service allows it to be used by sidecars, gateways and virtual services defined in other namespaces. This feature provides a mechanism for service owners and mesh administrators to control the visibility of services across namespace boundaries.",
              type: "array",
              items: {
                type: "string",
                format: "string",
              },
            },
            subjectAltNames: {
              description:
                "If specified, the proxy will verify that the server certificate's subject alternate name matches one of the specified values.",
              type: "array",
              items: {
                type: "string",
                format: "string",
              },
            },
            hosts: {
              description:
                "The hosts associated with the ServiceEntry. Could be a DNS name with wildcard prefix.",
              type: "array",
              items: {
                type: "string",
                format: "string",
              },
            },
            addresses: {
              description:
                "The virtual IP addresses associated with the service. Could be CIDR prefix. For HTTP traffic, generated route configurations will include http route domains for both the `addresses` and `hosts` field values and the destination will be identified based on the HTTP Host/Authority header. If one or more IP addresses are specified, the incoming traffic will be identified as belonging to this service if the destination IP matches the IP/CIDRs specified in the addresses field. If the Addresses field is empty, traffic will be identified solely based on the destination port. In such scenarios, the port on which the service is being accessed must not be shared by any other service in the mesh. In other words, the sidecar will behave as a simple TCP proxy, forwarding incoming traffic on a specified port to the specified destination endpoint IP/host. Unix domain socket addresses are not supported in this field.",
              type: "array",
              items: {
                type: "string",
                format: "string",
              },
            },
            ports: {
              description:
                "The ports associated with the external service. If the Endpoints are Unix domain socket addresses, there must be exactly one port.",
              type: "array",
              items: {
                $ref: "#/components/schemas/istio.networking.v1beta1.Port",
              },
            },
            location: {
              $ref:
                "#/components/schemas/istio.networking.v1beta1.ServiceEntry.Location",
            },
            resolution: {
              $ref:
                "#/components/schemas/istio.networking.v1beta1.ServiceEntry.Resolution",
            },
            endpoints: {
              description:
                "One or more endpoints associated with the service. Only one of `endpoints` or `workloadSelector` can be specified.",
              type: "array",
              items: {
                $ref:
                  "#/components/schemas/istio.networking.v1beta1.WorkloadEntry",
              },
            },
            workloadSelector: {
              $ref:
                "#/components/schemas/istio.networking.v1beta1.WorkloadSelector",
            },
          },
        },
        "istio.networking.v1beta1.ServiceEntry.Location": {
          description:
            "Location specifies whether the service is part of Istio mesh or outside the mesh. Location determines the behavior of several features, such as service-to-service mTLS authentication, policy enforcement, etc. When communicating with services outside the mesh, Istio's mTLS authentication is disabled, and policy enforcement is performed on the client-side as opposed to server-side.",
          type: "string",
          enum: ["MESH_EXTERNAL", "MESH_INTERNAL"],
        },
        "istio.networking.v1beta1.ServiceEntry.Resolution": {
          description:
            "Resolution determines how the proxy will resolve the IP addresses of the network endpoints associated with the service, so that it can route to one of them. The resolution mode specified here has no impact on how the application resolves the IP address associated with the service. The application may still have to use DNS to resolve the service to an IP so that the outbound traffic can be captured by the Proxy. Alternatively, for HTTP services, the application could directly communicate with the proxy (e.g., by setting HTTP_PROXY) to talk to these services.",
          type: "string",
          enum: ["NONE", "STATIC", "DNS"],
        },
        "istio.networking.v1beta1.WorkloadEntry": {
          description:
            "WorkloadEntry enables specifying the properties of a single non-Kubernetes workload such a VM or a bare metal services that can be referred to by service entries.",
          type: "object",
          properties: {
            labels: {
              description: "One or more labels associated with the endpoint.",
              type: "object",
              additionalProperties: {
                type: "string",
                format: "string",
              },
            },
            ports: {
              description:
                "Set of ports associated with the endpoint. The ports must be associated with a port name that was declared as part of the service. Do not use for `unix://` addresses.",
              type: "object",
              additionalProperties: {
                type: "integer",
              },
            },
            weight: {
              description:
                "The load balancing weight associated with the endpoint. Endpoints with higher weights will receive proportionally higher traffic.",
              type: "integer",
            },
            address: {
              description:
                "Address associated with the network endpoint without the port. Domain names can be used if and only if the resolution is set to DNS, and must be fully-qualified without wildcards. Use the form unix:///absolute/path/to/socket for Unix domain socket endpoints.",
              type: "string",
              format: "string",
            },
            network: {
              description:
                "Network enables Istio to group endpoints resident in the same L3 domain/network. All endpoints in the same network are assumed to be directly reachable from one another. When endpoints in different networks cannot reach each other directly, an Istio Gateway can be used to establish connectivity (usually using the `AUTO_PASSTHROUGH` mode in a Gateway Server). This is an advanced configuration used typically for spanning an Istio mesh over multiple clusters.",
              type: "string",
              format: "string",
            },
            locality: {
              description:
                'The locality associated with the endpoint. A locality corresponds to a failure domain (e.g., country/region/zone). Arbitrary failure domain hierarchies can be represented by separating each encapsulating failure domain by /. For example, the locality of an an endpoint in US, in US-East-1 region, within availability zone az-1, in data center rack r11 can be represented as us/us-east-1/az-1/r11. Istio will configure the sidecar to route to endpoints within the same locality as the sidecar. If none of the endpoints in the locality are available, endpoints parent locality (but within the same network ID) will be chosen. For example, if there are two endpoints in same network (networkID "n1"), say e1 with locality us/us-east-1/az-1/r11 and e2 with locality us/us-east-1/az-2/r12, a sidecar from us/us-east-1/az-1/r11 locality will prefer e1 from the same locality over e2 from a different locality. Endpoint e2 could be the IP associated with a gateway (that bridges networks n1 and n2), or the IP associated with a standard service endpoint.',
              type: "string",
              format: "string",
            },
            serviceAccount: {
              description:
                "The service account associated with the workload if a sidecar is present in the workload. The service account must be present in the same namespace as the configuration ( WorkloadEntry or a ServiceEntry)",
              type: "string",
              format: "string",
            },
          },
        },
        "istio.networking.v1beta1.WorkloadSelector": {
          description:
            "`WorkloadSelector` specifies the criteria used to determine if the `Gateway`, `Sidecar`, or `EnvoyFilter` configuration can be applied to a proxy. The matching criteria includes the metadata associated with a proxy, workload instance info such as labels attached to the pod/VM, or any other info that the proxy provides to Istio during the initial handshake. If multiple conditions are specified, all conditions need to match in order for the workload instance to be selected. Currently, only label based selection mechanism is supported.",
          type: "object",
          properties: {
            labels: {
              description:
                "One or more labels that indicate a specific set of pods/VMs on which this `Sidecar` configuration should be applied. The scope of label search is restricted to the configuration namespace in which the the resource is present.",
              type: "object",
              additionalProperties: {
                type: "string",
                format: "string",
              },
            },
          },
        },
      },
    },
  },
  {
    openapi: "3.0.0",
    info: {
      title: "Configuration affecting edge load balancer.",
      version: "v1beta1",
    },
    components: {
      schemas: {
        "istio.networking.v1beta1.Gateway": {
          description:
            "Gateway describes a load balancer operating at the edge of the mesh receiving incoming or outgoing HTTP/TCP connections.",
          type: "object",
          properties: {
            servers: {
              description: "A list of server specifications.",
              type: "array",
              items: {
                $ref: "#/components/schemas/istio.networking.v1beta1.Server",
              },
            },
            selector: {
              description:
                "One or more labels that indicate a specific set of pods/VMs on which this gateway configuration should be applied. The scope of label search is restricted to the configuration namespace in which the the resource is present. In other words, the Gateway resource must reside in the same namespace as the gateway workload instance. If selector is nil, the Gateway will be applied to all workloads.",
              type: "object",
              additionalProperties: {
                type: "string",
                format: "string",
              },
            },
          },
        },
        "istio.networking.v1beta1.Server": {
          description:
            "`Server` describes the properties of the proxy on a given load balancer port. For example,",
          type: "object",
          properties: {
            name: {
              description:
                "An optional name of the server, when set must be unique across all servers. This will be used for variety of purposes like prefixing stats generated with this name etc.",
              type: "string",
              format: "string",
            },
            tls: {
              $ref:
                "#/components/schemas/istio.networking.v1beta1.ServerTLSSettings",
            },
            port: {
              $ref: "#/components/schemas/istio.networking.v1beta1.Port",
            },
            bind: {
              description:
                "The ip or the Unix domain socket to which the listener should be bound to. Format: `x.x.x.x` or `unix:///path/to/uds` or `unix://@foobar` (Linux abstract namespace). When using Unix domain sockets, the port number should be 0.",
              type: "string",
              format: "string",
            },
            hosts: {
              description:
                "One or more hosts exposed by this gateway. While typically applicable to HTTP services, it can also be used for TCP services using TLS with SNI. A host is specified as a `dnsName` with an optional `namespace/` prefix. The `dnsName` should be specified using FQDN format, optionally including a wildcard character in the left-most component (e.g., `prod/*.example.com`). Set the `dnsName` to `*` to select all `VirtualService` hosts from the specified namespace (e.g.,`prod/*`).",
              type: "array",
              items: {
                type: "string",
                format: "string",
              },
            },
            defaultEndpoint: {
              description:
                "The loopback IP endpoint or Unix domain socket to which traffic should be forwarded to by default. Format should be `127.0.0.1:PORT` or `unix:///path/to/socket` or `unix://@foobar` (Linux abstract namespace). NOT IMPLEMENTED. $hide_from_docs",
              type: "string",
              format: "string",
            },
          },
        },
        "istio.networking.v1beta1.Port": {
          description:
            "Port describes the properties of a specific port of a service.",
          type: "object",
          properties: {
            number: {
              description: "A valid non-negative integer port number.",
              type: "integer",
            },
            name: {
              description: "Label assigned to the port.",
              type: "string",
              format: "string",
            },
            protocol: {
              description:
                "The protocol exposed on the port. MUST BE one of HTTP|HTTPS|GRPC|HTTP2|MONGO|TCP|TLS. TLS implies the connection will be routed based on the SNI header to the destination without terminating the TLS connection.",
              type: "string",
              format: "string",
            },
          },
        },
        "istio.networking.v1beta1.ServerTLSSettings": {
          type: "object",
          properties: {
            mode: {
              $ref:
                "#/components/schemas/istio.networking.v1beta1.ServerTLSSettings.TLSmode",
            },
            privateKey: {
              description:
                "REQUIRED if mode is `SIMPLE` or `MUTUAL`. The path to the file holding the server's private key.",
              type: "string",
              format: "string",
            },
            caCertificates: {
              description:
                "REQUIRED if mode is `MUTUAL`. The path to a file containing certificate authority certificates to use in verifying a presented client side certificate.",
              type: "string",
              format: "string",
            },
            credentialName: {
              description:
                "For gateways running on Kubernetes, the name of the secret that holds the TLS certs including the CA certificates. Applicable only on Kubernetes, and only if the dynamic credential fetching feature is enabled in the proxy by setting `ISTIO_META_USER_SDS` metadata variable. The secret (of type `generic`) should contain the following keys and values: `key: \u003cprivateKey\u003e`, `cert: \u003cserverCert\u003e`, `cacert: \u003cCACertificate\u003e`. Secret of type tls for server certificates along with ca.crt key for CA certificates is also supported. Only one of server certificates and CA certificate or credentialName can be specified.",
              type: "string",
              format: "string",
            },
            subjectAltNames: {
              description:
                "A list of alternate names to verify the subject identity in the certificate presented by the client.",
              type: "array",
              items: {
                type: "string",
                format: "string",
              },
            },
            httpsRedirect: {
              description:
                "If set to true, the load balancer will send a 301 redirect for all http connections, asking the clients to use HTTPS.",
              type: "boolean",
            },
            serverCertificate: {
              description:
                "REQUIRED if mode is `SIMPLE` or `MUTUAL`. The path to the file holding the server-side TLS certificate to use.",
              type: "string",
              format: "string",
            },
            verifyCertificateSpki: {
              description:
                "An optional list of base64-encoded SHA-256 hashes of the SKPIs of authorized client certificates. Note: When both verify_certificate_hash and verify_certificate_spki are specified, a hash matching either value will result in the certificate being accepted.",
              type: "array",
              items: {
                type: "string",
                format: "string",
              },
            },
            verifyCertificateHash: {
              description:
                "An optional list of hex-encoded SHA-256 hashes of the authorized client certificates. Both simple and colon separated formats are acceptable. Note: When both verify_certificate_hash and verify_certificate_spki are specified, a hash matching either value will result in the certificate being accepted.",
              type: "array",
              items: {
                type: "string",
                format: "string",
              },
            },
            minProtocolVersion: {
              $ref:
                "#/components/schemas/istio.networking.v1beta1.ServerTLSSettings.TLSProtocol",
            },
            maxProtocolVersion: {
              $ref:
                "#/components/schemas/istio.networking.v1beta1.ServerTLSSettings.TLSProtocol",
            },
            cipherSuites: {
              description:
                "Optional: If specified, only support the specified cipher list. Otherwise default to the default cipher list supported by Envoy.",
              type: "array",
              items: {
                type: "string",
                format: "string",
              },
            },
          },
        },
        "istio.networking.v1beta1.ServerTLSSettings.TLSmode": {
          description: "TLS modes enforced by the proxy",
          type: "string",
          enum: [
            "PASSTHROUGH",
            "SIMPLE",
            "MUTUAL",
            "AUTO_PASSTHROUGH",
            "ISTIO_MUTUAL",
          ],
        },
        "istio.networking.v1beta1.ServerTLSSettings.TLSProtocol": {
          description: "TLS protocol versions.",
          type: "string",
          enum: ["TLS_AUTO", "TLSV1_0", "TLSV1_1", "TLSV1_2", "TLSV1_3"],
        },
      },
    },
  },
  {
    openapi: "3.0.0",
    info: {
      title: "Configuration affecting VMs onboarded into the mesh.",
      version: "v1beta1",
    },
    components: {
      schemas: {
        "istio.networking.v1beta1.WorkloadEntry": {
          description:
            "WorkloadEntry enables specifying the properties of a single non-Kubernetes workload such a VM or a bare metal services that can be referred to by service entries.",
          type: "object",
          properties: {
            labels: {
              description: "One or more labels associated with the endpoint.",
              type: "object",
              additionalProperties: {
                type: "string",
                format: "string",
              },
            },
            ports: {
              description:
                "Set of ports associated with the endpoint. The ports must be associated with a port name that was declared as part of the service. Do not use for `unix://` addresses.",
              type: "object",
              additionalProperties: {
                type: "integer",
              },
            },
            weight: {
              description:
                "The load balancing weight associated with the endpoint. Endpoints with higher weights will receive proportionally higher traffic.",
              type: "integer",
            },
            address: {
              description:
                "Address associated with the network endpoint without the port. Domain names can be used if and only if the resolution is set to DNS, and must be fully-qualified without wildcards. Use the form unix:///absolute/path/to/socket for Unix domain socket endpoints.",
              type: "string",
              format: "string",
            },
            network: {
              description:
                "Network enables Istio to group endpoints resident in the same L3 domain/network. All endpoints in the same network are assumed to be directly reachable from one another. When endpoints in different networks cannot reach each other directly, an Istio Gateway can be used to establish connectivity (usually using the `AUTO_PASSTHROUGH` mode in a Gateway Server). This is an advanced configuration used typically for spanning an Istio mesh over multiple clusters.",
              type: "string",
              format: "string",
            },
            locality: {
              description:
                'The locality associated with the endpoint. A locality corresponds to a failure domain (e.g., country/region/zone). Arbitrary failure domain hierarchies can be represented by separating each encapsulating failure domain by /. For example, the locality of an an endpoint in US, in US-East-1 region, within availability zone az-1, in data center rack r11 can be represented as us/us-east-1/az-1/r11. Istio will configure the sidecar to route to endpoints within the same locality as the sidecar. If none of the endpoints in the locality are available, endpoints parent locality (but within the same network ID) will be chosen. For example, if there are two endpoints in same network (networkID "n1"), say e1 with locality us/us-east-1/az-1/r11 and e2 with locality us/us-east-1/az-2/r12, a sidecar from us/us-east-1/az-1/r11 locality will prefer e1 from the same locality over e2 from a different locality. Endpoint e2 could be the IP associated with a gateway (that bridges networks n1 and n2), or the IP associated with a standard service endpoint.',
              type: "string",
              format: "string",
            },
            serviceAccount: {
              description:
                "The service account associated with the workload if a sidecar is present in the workload. The service account must be present in the same namespace as the configuration ( WorkloadEntry or a ServiceEntry)",
              type: "string",
              format: "string",
            },
          },
        },
      },
    },
  },
  {
    openapi: "3.0.0",
    info: {
      title: "Configuration affecting label/content routing, sni routing, etc.",
      version: "v1beta1",
    },
    components: {
      schemas: {
        "istio.networking.v1beta1.PortSelector": {
          description:
            "PortSelector specifies the number of a port to be used for matching or selection for final routing.",
          type: "object",
          properties: {
            number: {
              description: "Valid port number",
              type: "integer",
            },
          },
        },
        "istio.networking.v1beta1.Destination": {
          description:
            "Destination indicates the network addressable service to which the request/connection will be sent after processing a routing rule. The destination.host should unambiguously refer to a service in the service registry. Istio's service registry is composed of all the services found in the platform's service registry (e.g., Kubernetes services, Consul services), as well as services declared through the [ServiceEntry](https://istio.io/docs/reference/config/networking/service-entry/#ServiceEntry) resource.",
          type: "object",
          properties: {
            host: {
              description:
                "The name of a service from the service registry. Service names are looked up from the platform's service registry (e.g., Kubernetes services, Consul services, etc.) and from the hosts declared by [ServiceEntry](https://istio.io/docs/reference/config/networking/service-entry/#ServiceEntry). Traffic forwarded to destinations that are not found in either of the two, will be dropped.",
              type: "string",
              format: "string",
            },
            port: {
              $ref:
                "#/components/schemas/istio.networking.v1beta1.PortSelector",
            },
            subset: {
              description:
                "The name of a subset within the service. Applicable only to services within the mesh. The subset must be defined in a corresponding DestinationRule.",
              type: "string",
              format: "string",
            },
          },
        },
        "istio.networking.v1beta1.VirtualService": {
          description: "Configuration affecting traffic routing.",
          type: "object",
          properties: {
            exportTo: {
              description:
                "A list of namespaces to which this virtual service is exported. Exporting a virtual service allows it to be used by sidecars and gateways defined in other namespaces. This feature provides a mechanism for service owners and mesh administrators to control the visibility of virtual services across namespace boundaries.",
              type: "array",
              items: {
                type: "string",
                format: "string",
              },
            },
            tls: {
              description:
                "An ordered list of route rule for non-terminated TLS \u0026 HTTPS traffic. Routing is typically performed using the SNI value presented by the ClientHello message. TLS routes will be applied to platform service ports named 'https-*', 'tls-*', unterminated gateway ports using HTTPS/TLS protocols (i.e. with \"passthrough\" TLS mode) and service entry ports using HTTPS/TLS protocols. The first rule matching an incoming request is used. NOTE: Traffic 'https-*' or 'tls-*' ports without associated virtual service will be treated as opaque TCP traffic.",
              type: "array",
              items: {
                $ref: "#/components/schemas/istio.networking.v1beta1.TLSRoute",
              },
            },
            tcp: {
              description:
                "An ordered list of route rules for opaque TCP traffic. TCP routes will be applied to any port that is not a HTTP or TLS port. The first rule matching an incoming request is used.",
              type: "array",
              items: {
                $ref: "#/components/schemas/istio.networking.v1beta1.TCPRoute",
              },
            },
            http: {
              description:
                "An ordered list of route rules for HTTP traffic. HTTP routes will be applied to platform service ports named 'http-*'/'http2-*'/'grpc-*', gateway ports with protocol HTTP/HTTP2/GRPC/ TLS-terminated-HTTPS and service entry ports using HTTP/HTTP2/GRPC protocols. The first rule matching an incoming request is used.",
              type: "array",
              items: {
                $ref: "#/components/schemas/istio.networking.v1beta1.HTTPRoute",
              },
            },
            hosts: {
              description:
                "The destination hosts to which traffic is being sent. Could be a DNS name with wildcard prefix or an IP address. Depending on the platform, short-names can also be used instead of a FQDN (i.e. has no dots in the name). In such a scenario, the FQDN of the host would be derived based on the underlying platform.",
              type: "array",
              items: {
                type: "string",
                format: "string",
              },
            },
            gateways: {
              description:
                "The names of gateways and sidecars that should apply these routes. Gateways in other namespaces may be referred to by `\u003cgateway namespace\u003e/\u003cgateway name\u003e`; specifying a gateway with no namespace qualifier is the same as specifying the VirtualService's namespace. A single VirtualService is used for sidecars inside the mesh as well as for one or more gateways. The selection condition imposed by this field can be overridden using the source field in the match conditions of protocol-specific routes. The reserved word `mesh` is used to imply all the sidecars in the mesh. When this field is omitted, the default gateway (`mesh`) will be used, which would apply the rule to all sidecars in the mesh. If a list of gateway names is provided, the rules will apply only to the gateways. To apply the rules to both gateways and sidecars, specify `mesh` as one of the gateway names.",
              type: "array",
              items: {
                type: "string",
                format: "string",
              },
            },
          },
        },
        "istio.networking.v1beta1.HTTPRoute": {
          description:
            "Describes match conditions and actions for routing HTTP/1.1, HTTP2, and gRPC traffic. See VirtualService for usage examples.",
          type: "object",
          properties: {
            name: {
              description:
                "The name assigned to the route for debugging purposes. The route's name will be concatenated with the match's name and will be logged in the access logs for requests matching this route/match.",
              type: "string",
              format: "string",
            },
            match: {
              description:
                "Match conditions to be satisfied for the rule to be activated. All conditions inside a single match block have AND semantics, while the list of match blocks have OR semantics. The rule is matched if any one of the match blocks succeed.",
              type: "array",
              items: {
                $ref:
                  "#/components/schemas/istio.networking.v1beta1.HTTPMatchRequest",
              },
            },
            route: {
              description:
                "A HTTP rule can either redirect or forward (default) traffic. The forwarding target can be one of several versions of a service (see glossary in beginning of document). Weights associated with the service version determine the proportion of traffic it receives.",
              type: "array",
              items: {
                $ref:
                  "#/components/schemas/istio.networking.v1beta1.HTTPRouteDestination",
              },
            },
            redirect: {
              $ref:
                "#/components/schemas/istio.networking.v1beta1.HTTPRedirect",
            },
            delegate: {
              $ref: "#/components/schemas/istio.networking.v1beta1.Delegate",
            },
            rewrite: {
              $ref: "#/components/schemas/istio.networking.v1beta1.HTTPRewrite",
            },
            timeout: {
              description: "Timeout for HTTP requests.",
              type: "string",
            },
            retries: {
              $ref: "#/components/schemas/istio.networking.v1beta1.HTTPRetry",
            },
            fault: {
              $ref:
                "#/components/schemas/istio.networking.v1beta1.HTTPFaultInjection",
            },
            mirror: {
              $ref: "#/components/schemas/istio.networking.v1beta1.Destination",
            },
            mirrorPercent: {
              description:
                "Percentage of the traffic to be mirrored by the `mirror` field. Use of integer `mirror_percent` value is deprecated. Use the double `mirror_percentage` field instead",
              type: "integer",
              deprecated: true,
              nullable: true,
            },
            mirrorPercentage: {
              $ref: "#/components/schemas/istio.networking.v1beta1.Percent",
            },
            corsPolicy: {
              $ref: "#/components/schemas/istio.networking.v1beta1.CorsPolicy",
            },
            headers: {
              $ref: "#/components/schemas/istio.networking.v1beta1.Headers",
            },
          },
        },
        "istio.networking.v1beta1.TLSRoute": {
          description:
            'Describes match conditions and actions for routing unterminated TLS traffic (TLS/HTTPS) The following routing rule forwards unterminated TLS traffic arriving at port 443 of gateway called "mygateway" to internal services in the mesh based on the SNI value.',
          type: "object",
          properties: {
            match: {
              description:
                "Match conditions to be satisfied for the rule to be activated. All conditions inside a single match block have AND semantics, while the list of match blocks have OR semantics. The rule is matched if any one of the match blocks succeed.",
              type: "array",
              items: {
                $ref:
                  "#/components/schemas/istio.networking.v1beta1.TLSMatchAttributes",
              },
            },
            route: {
              description:
                "The destination to which the connection should be forwarded to.",
              type: "array",
              items: {
                $ref:
                  "#/components/schemas/istio.networking.v1beta1.RouteDestination",
              },
            },
          },
        },
        "istio.networking.v1beta1.TCPRoute": {
          description:
            "Describes match conditions and actions for routing TCP traffic. The following routing rule forwards traffic arriving at port 27017 for mongo.prod.svc.cluster.local to another Mongo server on port 5555.",
          type: "object",
          properties: {
            match: {
              description:
                "Match conditions to be satisfied for the rule to be activated. All conditions inside a single match block have AND semantics, while the list of match blocks have OR semantics. The rule is matched if any one of the match blocks succeed.",
              type: "array",
              items: {
                $ref:
                  "#/components/schemas/istio.networking.v1beta1.L4MatchAttributes",
              },
            },
            route: {
              description:
                "The destination to which the connection should be forwarded to.",
              type: "array",
              items: {
                $ref:
                  "#/components/schemas/istio.networking.v1beta1.RouteDestination",
              },
            },
          },
        },
        "istio.networking.v1beta1.HTTPMatchRequest": {
          description:
            "HttpMatchRequest specifies a set of criterion to be met in order for the rule to be applied to the HTTP request. For example, the following restricts the rule to match only requests where the URL path starts with /ratings/v2/ and the request contains a custom `end-user` header with value `jason`.",
          type: "object",
          properties: {
            name: {
              description:
                "The name assigned to a match. The match's name will be concatenated with the parent route's name and will be logged in the access logs for requests matching this route.",
              type: "string",
              format: "string",
            },
            method: {
              $ref: "#/components/schemas/istio.networking.v1beta1.StringMatch",
            },
            port: {
              description:
                "Specifies the ports on the host that is being addressed. Many services only expose a single port or label ports with the protocols they support, in these cases it is not required to explicitly select the port.",
              type: "integer",
            },
            gateways: {
              description:
                "Names of gateways where the rule should be applied. Gateway names in the top-level `gateways` field of the VirtualService (if any) are overridden. The gateway match is independent of sourceLabels.",
              type: "array",
              items: {
                type: "string",
                format: "string",
              },
            },
            headers: {
              description:
                "The header keys must be lowercase and use hyphen as the separator, e.g. _x-request-id_.",
              type: "object",
              additionalProperties: {
                $ref:
                  "#/components/schemas/istio.networking.v1beta1.StringMatch",
              },
            },
            uri: {
              $ref: "#/components/schemas/istio.networking.v1beta1.StringMatch",
            },
            scheme: {
              $ref: "#/components/schemas/istio.networking.v1beta1.StringMatch",
            },
            authority: {
              $ref: "#/components/schemas/istio.networking.v1beta1.StringMatch",
            },
            sourceLabels: {
              description:
                "One or more labels that constrain the applicability of a rule to workloads with the given labels. If the VirtualService has a list of gateways specified in the top-level `gateways` field, it must include the reserved gateway `mesh` for this field to be applicable.",
              type: "object",
              additionalProperties: {
                type: "string",
                format: "string",
              },
            },
            queryParams: {
              description: "Query parameters for matching.",
              type: "object",
              additionalProperties: {
                $ref:
                  "#/components/schemas/istio.networking.v1beta1.StringMatch",
              },
            },
            ignoreUriCase: {
              description:
                "Flag to specify whether the URI matching should be case-insensitive.",
              type: "boolean",
            },
            withoutHeaders: {
              description:
                "withoutHeader has the same syntax with the header, but has opposite meaning. If a header is matched with a matching rule among withoutHeader, the traffic becomes not matched one.",
              type: "object",
              additionalProperties: {
                $ref:
                  "#/components/schemas/istio.networking.v1beta1.StringMatch",
              },
            },
            sourceNamespace: {
              description:
                "Source namespace constraining the applicability of a rule to workloads in that namespace. If the VirtualService has a list of gateways specified in the top-level `gateways` field, it must include the reserved gateway `mesh` for this field to be applicable.",
              type: "string",
              format: "string",
            },
          },
        },
        "istio.networking.v1beta1.HTTPRouteDestination": {
          description:
            'Each routing rule is associated with one or more service versions (see glossary in beginning of document). Weights associated with the version determine the proportion of traffic it receives. For example, the following rule will route 25% of traffic for the "reviews" service to instances with the "v2" tag and the remaining traffic (i.e., 75%) to "v1".',
          type: "object",
          properties: {
            headers: {
              $ref: "#/components/schemas/istio.networking.v1beta1.Headers",
            },
            destination: {
              $ref: "#/components/schemas/istio.networking.v1beta1.Destination",
            },
            weight: {
              description:
                "The proportion of traffic to be forwarded to the service version. (0-100). Sum of weights across destinations SHOULD BE == 100. If there is only one destination in a rule, the weight value is assumed to be 100.",
              type: "integer",
              format: "int32",
            },
          },
        },
        "istio.networking.v1beta1.HTTPRedirect": {
          description:
            "HTTPRedirect can be used to send a 301 redirect response to the caller, where the Authority/Host and the URI in the response can be swapped with the specified values. For example, the following rule redirects requests for /v1/getProductRatings API on the ratings service to /v1/bookRatings provided by the bookratings service.",
          type: "object",
          properties: {
            uri: {
              description:
                "On a redirect, overwrite the Path portion of the URL with this value. Note that the entire path will be replaced, irrespective of the request URI being matched as an exact path or prefix.",
              type: "string",
              format: "string",
            },
            authority: {
              description:
                "On a redirect, overwrite the Authority/Host portion of the URL with this value.",
              type: "string",
              format: "string",
            },
            redirectCode: {
              description:
                "On a redirect, Specifies the HTTP status code to use in the redirect response. The default response code is MOVED_PERMANENTLY (301).",
              type: "integer",
            },
          },
        },
        "istio.networking.v1beta1.Delegate": {
          description:
            "Describes the delegate VirtualService. The following routing rules forward the traffic to `/productpage` by a delegate VirtualService named `productpage`, forward the traffic to `/reviews` by a delegate VirtualService named `reviews`.",
          type: "object",
          properties: {
            name: {
              description:
                "Name specifies the name of the delegate VirtualService.",
              type: "string",
              format: "string",
            },
            namespace: {
              description:
                "Namespace specifies the namespace where the delegate VirtualService resides. By default, it is same to the root's.",
              type: "string",
              format: "string",
            },
          },
        },
        "istio.networking.v1beta1.HTTPRewrite": {
          description:
            "HTTPRewrite can be used to rewrite specific parts of a HTTP request before forwarding the request to the destination. Rewrite primitive can be used only with HTTPRouteDestination. The following example demonstrates how to rewrite the URL prefix for api call (/ratings) to ratings service before making the actual API call.",
          type: "object",
          properties: {
            uri: {
              description:
                "rewrite the path (or the prefix) portion of the URI with this value. If the original URI was matched based on prefix, the value provided in this field will replace the corresponding matched prefix.",
              type: "string",
              format: "string",
            },
            authority: {
              description: "rewrite the Authority/Host header with this value.",
              type: "string",
              format: "string",
            },
          },
        },
        "istio.networking.v1beta1.HTTPRetry": {
          description:
            "Describes the retry policy to use when a HTTP request fails. For example, the following rule sets the maximum number of retries to 3 when calling ratings:v1 service, with a 2s timeout per retry attempt.",
          type: "object",
          properties: {
            attempts: {
              description:
                "Number of retries for a given request. The interval between retries will be determined automatically (25ms+). Actual number of retries attempted depends on the request `timeout` of the [HTTP route](https://istio.io/docs/reference/config/networking/virtual-service/#HTTPRoute).",
              type: "integer",
              format: "int32",
            },
            perTryTimeout: {
              description:
                "Timeout per retry attempt for a given request. format: 1h/1m/1s/1ms. MUST BE \u003e=1ms.",
              type: "string",
            },
            retryOn: {
              description:
                "Specifies the conditions under which retry takes place. One or more policies can be specified using a ‘,’ delimited list. See the [retry policies](https://www.envoyproxy.io/docs/envoy/latest/configuration/http/http_filters/router_filter#x-envoy-retry-on) and [gRPC retry policies](https://www.envoyproxy.io/docs/envoy/latest/configuration/http/http_filters/router_filter#x-envoy-retry-grpc-on) for more details.",
              type: "string",
              format: "string",
            },
            retryRemoteLocalities: {
              description:
                "Flag to specify whether the retries should retry to other localities. See the [retry plugin configuration](https://www.envoyproxy.io/docs/envoy/latest/intro/arch_overview/http/http_connection_management#retry-plugin-configuration) for more details.",
              type: "boolean",
              nullable: true,
            },
          },
        },
        "istio.networking.v1beta1.HTTPFaultInjection": {
          description:
            "HTTPFaultInjection can be used to specify one or more faults to inject while forwarding HTTP requests to the destination specified in a route. Fault specification is part of a VirtualService rule. Faults include aborting the Http request from downstream service, and/or delaying proxying of requests. A fault rule MUST HAVE delay or abort or both.",
          type: "object",
          properties: {
            delay: {
              $ref:
                "#/components/schemas/istio.networking.v1beta1.HTTPFaultInjection.Delay",
            },
            abort: {
              $ref:
                "#/components/schemas/istio.networking.v1beta1.HTTPFaultInjection.Abort",
            },
          },
        },
        "istio.networking.v1beta1.Percent": {
          description:
            "Percent specifies a percentage in the range of [0.0, 100.0].",
          type: "object",
          properties: {
            value: {
              type: "number",
              format: "double",
            },
          },
        },
        "istio.networking.v1beta1.CorsPolicy": {
          description:
            "Describes the Cross-Origin Resource Sharing (CORS) policy, for a given service. Refer to [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/Access_control_CORS) for further details about cross origin resource sharing. For example, the following rule restricts cross origin requests to those originating from example.com domain using HTTP POST/GET, and sets the `Access-Control-Allow-Credentials` header to false. In addition, it only exposes `X-Foo-bar` header and sets an expiry period of 1 day.",
          type: "object",
          properties: {
            allowOrigin: {
              description:
                "The list of origins that are allowed to perform CORS requests. The content will be serialized into the Access-Control-Allow-Origin header. Wildcard * will allow all origins. $hide_from_docs",
              type: "array",
              items: {
                type: "string",
                format: "string",
              },
              deprecated: true,
            },
            allowOrigins: {
              description:
                "String patterns that match allowed origins. An origin is allowed if any of the string matchers match. If a match is found, then the outgoing Access-Control-Allow-Origin would be set to the origin as provided by the client.",
              type: "array",
              items: {
                $ref:
                  "#/components/schemas/istio.networking.v1beta1.StringMatch",
              },
            },
            allowMethods: {
              description:
                "List of HTTP methods allowed to access the resource. The content will be serialized into the Access-Control-Allow-Methods header.",
              type: "array",
              items: {
                type: "string",
                format: "string",
              },
            },
            allowHeaders: {
              description:
                "List of HTTP headers that can be used when requesting the resource. Serialized to Access-Control-Allow-Headers header.",
              type: "array",
              items: {
                type: "string",
                format: "string",
              },
            },
            exposeHeaders: {
              description:
                "A white list of HTTP headers that the browsers are allowed to access. Serialized into Access-Control-Expose-Headers header.",
              type: "array",
              items: {
                type: "string",
                format: "string",
              },
            },
            maxAge: {
              description:
                "Specifies how long the results of a preflight request can be cached. Translates to the `Access-Control-Max-Age` header.",
              type: "string",
            },
            allowCredentials: {
              description:
                "Indicates whether the caller is allowed to send the actual request (not the preflight) using credentials. Translates to `Access-Control-Allow-Credentials` header.",
              type: "boolean",
              nullable: true,
            },
          },
        },
        "istio.networking.v1beta1.Headers": {
          description:
            "Message headers can be manipulated when Envoy forwards requests to, or responses from, a destination service. Header manipulation rules can be specified for a specific route destination or for all destinations. The following VirtualService adds a `test` header with the value `true` to requests that are routed to any `reviews` service destination. It also romoves the `foo` response header, but only from responses coming from the `v1` subset (version) of the `reviews` service.",
          type: "object",
          properties: {
            response: {
              $ref:
                "#/components/schemas/istio.networking.v1beta1.Headers.HeaderOperations",
            },
            request: {
              $ref:
                "#/components/schemas/istio.networking.v1beta1.Headers.HeaderOperations",
            },
          },
        },
        "istio.networking.v1beta1.Headers.HeaderOperations": {
          description:
            "HeaderOperations Describes the header manipulations to apply",
          type: "object",
          properties: {
            set: {
              description:
                "Overwrite the headers specified by key with the given values",
              type: "object",
              additionalProperties: {
                type: "string",
                format: "string",
              },
            },
            add: {
              description:
                "Append the given values to the headers specified by keys (will create a comma-separated list of values)",
              type: "object",
              additionalProperties: {
                type: "string",
                format: "string",
              },
            },
            remove: {
              description: "Remove a the specified headers",
              type: "array",
              items: {
                type: "string",
                format: "string",
              },
            },
          },
        },
        "istio.networking.v1beta1.TLSMatchAttributes": {
          description: "TLS connection match attributes.",
          type: "object",
          properties: {
            port: {
              description:
                "Specifies the port on the host that is being addressed. Many services only expose a single port or label ports with the protocols they support, in these cases it is not required to explicitly select the port.",
              type: "integer",
            },
            gateways: {
              description:
                "Names of gateways where the rule should be applied. Gateway names in the top-level `gateways` field of the VirtualService (if any) are overridden. The gateway match is independent of sourceLabels.",
              type: "array",
              items: {
                type: "string",
                format: "string",
              },
            },
            sourceLabels: {
              description:
                "One or more labels that constrain the applicability of a rule to workloads with the given labels. If the VirtualService has a list of gateways specified in the top-level `gateways` field, it should include the reserved gateway `mesh` in order for this field to be applicable.",
              type: "object",
              additionalProperties: {
                type: "string",
                format: "string",
              },
            },
            sourceNamespace: {
              description:
                "Source namespace constraining the applicability of a rule to workloads in that namespace. If the VirtualService has a list of gateways specified in the top-level `gateways` field, it must include the reserved gateway `mesh` for this field to be applicable.",
              type: "string",
              format: "string",
            },
            destinationSubnets: {
              description:
                "IPv4 or IPv6 ip addresses of destination with optional subnet. E.g., a.b.c.d/xx form or just a.b.c.d.",
              type: "array",
              items: {
                type: "string",
                format: "string",
              },
            },
            sniHosts: {
              description:
                "SNI (server name indicator) to match on. Wildcard prefixes can be used in the SNI value, e.g., *.com will match foo.example.com as well as example.com. An SNI value must be a subset (i.e., fall within the domain) of the corresponding virtual serivce's hosts.",
              type: "array",
              items: {
                type: "string",
                format: "string",
              },
            },
          },
        },
        "istio.networking.v1beta1.RouteDestination": {
          description: "L4 routing rule weighted destination.",
          type: "object",
          properties: {
            destination: {
              $ref: "#/components/schemas/istio.networking.v1beta1.Destination",
            },
            weight: {
              description:
                "The proportion of traffic to be forwarded to the service version. If there is only one destination in a rule, all traffic will be routed to it irrespective of the weight.",
              type: "integer",
              format: "int32",
            },
          },
        },
        "istio.networking.v1beta1.L4MatchAttributes": {
          description:
            "L4 connection match attributes. Note that L4 connection matching support is incomplete.",
          type: "object",
          properties: {
            port: {
              description:
                "Specifies the port on the host that is being addressed. Many services only expose a single port or label ports with the protocols they support, in these cases it is not required to explicitly select the port.",
              type: "integer",
            },
            gateways: {
              description:
                "Names of gateways where the rule should be applied. Gateway names in the top-level `gateways` field of the VirtualService (if any) are overridden. The gateway match is independent of sourceLabels.",
              type: "array",
              items: {
                type: "string",
                format: "string",
              },
            },
            sourceLabels: {
              description:
                "One or more labels that constrain the applicability of a rule to workloads with the given labels. If the VirtualService has a list of gateways specified in the top-level `gateways` field, it should include the reserved gateway `mesh` in order for this field to be applicable.",
              type: "object",
              additionalProperties: {
                type: "string",
                format: "string",
              },
            },
            sourceNamespace: {
              description:
                "Source namespace constraining the applicability of a rule to workloads in that namespace. If the VirtualService has a list of gateways specified in the top-level `gateways` field, it must include the reserved gateway `mesh` for this field to be applicable.",
              type: "string",
              format: "string",
            },
            destinationSubnets: {
              description:
                "IPv4 or IPv6 ip addresses of destination with optional subnet. E.g., a.b.c.d/xx form or just a.b.c.d.",
              type: "array",
              items: {
                type: "string",
                format: "string",
              },
            },
            sourceSubnet: {
              description:
                "IPv4 or IPv6 ip address of source with optional subnet. E.g., a.b.c.d/xx form or just a.b.c.d $hide_from_docs",
              type: "string",
              format: "string",
            },
          },
        },
        "istio.networking.v1beta1.StringMatch": {
          description:
            "Describes how to match a given string in HTTP headers. Match is case-sensitive.",
          type: "object",
          oneOf: [
            {
              not: {
                anyOf: [
                  {
                    required: ["exact"],
                    properties: {
                      exact: {
                        description: "exact string match",
                        type: "string",
                        format: "string",
                      },
                    },
                  },
                  {
                    required: ["prefix"],
                    properties: {
                      prefix: {
                        description: "prefix-based match",
                        type: "string",
                        format: "string",
                      },
                    },
                  },
                  {
                    required: ["regex"],
                    properties: {
                      regex: {
                        description:
                          "RE2 style regex-based match (https://github.com/google/re2/wiki/Syntax).",
                        type: "string",
                        format: "string",
                      },
                    },
                  },
                ],
              },
            },
            {
              required: ["exact"],
              properties: {
                exact: {
                  description: "exact string match",
                  type: "string",
                  format: "string",
                },
              },
            },
            {
              required: ["prefix"],
              properties: {
                prefix: {
                  description: "prefix-based match",
                  type: "string",
                  format: "string",
                },
              },
            },
            {
              required: ["regex"],
              properties: {
                regex: {
                  description:
                    "RE2 style regex-based match (https://github.com/google/re2/wiki/Syntax).",
                  type: "string",
                  format: "string",
                },
              },
            },
          ],
        },
        "istio.networking.v1beta1.HTTPFaultInjection.Delay": {
          description:
            'Delay specification is used to inject latency into the request forwarding path. The following example will introduce a 5 second delay in 1 out of every 1000 requests to the "v1" version of the "reviews" service from all pods with label env: prod',
          type: "object",
          properties: {
            percent: {
              description:
                "Percentage of requests on which the delay will be injected (0-100). Use of integer `percent` value is deprecated. Use the double `percentage` field instead.",
              type: "integer",
              format: "int32",
              deprecated: true,
            },
            percentage: {
              $ref: "#/components/schemas/istio.networking.v1beta1.Percent",
            },
          },
          oneOf: [
            {
              not: {
                anyOf: [
                  {
                    required: ["fixedDelay"],
                    properties: {
                      fixedDelay: {
                        description:
                          "Add a fixed delay before forwarding the request. Format: 1h/1m/1s/1ms. MUST be \u003e=1ms.",
                        type: "string",
                      },
                    },
                  },
                  {
                    required: ["exponentialDelay"],
                    properties: {
                      exponentialDelay: {
                        type: "string",
                      },
                    },
                  },
                ],
              },
            },
            {
              required: ["fixedDelay"],
              properties: {
                fixedDelay: {
                  description:
                    "Add a fixed delay before forwarding the request. Format: 1h/1m/1s/1ms. MUST be \u003e=1ms.",
                  type: "string",
                },
              },
            },
            {
              required: ["exponentialDelay"],
              properties: {
                exponentialDelay: {
                  type: "string",
                },
              },
            },
          ],
        },
        "istio.networking.v1beta1.HTTPFaultInjection.Abort": {
          description:
            'Abort specification is used to prematurely abort a request with a pre-specified error code. The following example will return an HTTP 400 error code for 1 out of every 1000 requests to the "ratings" service "v1".',
          type: "object",
          properties: {
            percentage: {
              $ref: "#/components/schemas/istio.networking.v1beta1.Percent",
            },
          },
          oneOf: [
            {
              not: {
                anyOf: [
                  {
                    required: ["httpStatus"],
                    properties: {
                      httpStatus: {
                        description:
                          "HTTP status code to use to abort the Http request.",
                        type: "integer",
                        format: "int32",
                      },
                    },
                  },
                  {
                    required: ["grpcStatus"],
                    properties: {
                      grpcStatus: {
                        type: "string",
                        format: "string",
                      },
                    },
                  },
                  {
                    required: ["http2Error"],
                    properties: {
                      http2Error: {
                        type: "string",
                        format: "string",
                      },
                    },
                  },
                ],
              },
            },
            {
              required: ["httpStatus"],
              properties: {
                httpStatus: {
                  description:
                    "HTTP status code to use to abort the Http request.",
                  type: "integer",
                  format: "int32",
                },
              },
            },
            {
              required: ["grpcStatus"],
              properties: {
                grpcStatus: {
                  type: "string",
                  format: "string",
                },
              },
            },
            {
              required: ["http2Error"],
              properties: {
                http2Error: {
                  type: "string",
                  format: "string",
                },
              },
            },
          ],
        },
      },
    },
  },
  {
    openapi: "3.0.0",
    info: {
      title: "Configuration affecting load balancing, outlier detection, etc.",
      version: "v1beta1",
    },
    components: {
      schemas: {
        "istio.networking.v1beta1.DestinationRule": {
          description:
            "DestinationRule defines policies that apply to traffic intended for a service after routing has occurred.",
          type: "object",
          properties: {
            host: {
              description:
                "The name of a service from the service registry. Service names are looked up from the platform's service registry (e.g., Kubernetes services, Consul services, etc.) and from the hosts declared by [ServiceEntries](https://istio.io/docs/reference/config/networking/service-entry/#ServiceEntry). Rules defined for services that do not exist in the service registry will be ignored.",
              type: "string",
              format: "string",
            },
            trafficPolicy: {
              $ref:
                "#/components/schemas/istio.networking.v1beta1.TrafficPolicy",
            },
            subsets: {
              description:
                "One or more named sets that represent individual versions of a service. Traffic policies can be overridden at subset level.",
              type: "array",
              items: {
                $ref: "#/components/schemas/istio.networking.v1beta1.Subset",
              },
            },
            exportTo: {
              description:
                "A list of namespaces to which this destination rule is exported. The resolution of a destination rule to apply to a service occurs in the context of a hierarchy of namespaces. Exporting a destination rule allows it to be included in the resolution hierarchy for services in other namespaces. This feature provides a mechanism for service owners and mesh administrators to control the visibility of destination rules across namespace boundaries.",
              type: "array",
              items: {
                type: "string",
                format: "string",
              },
            },
          },
        },
        "istio.networking.v1beta1.TrafficPolicy": {
          description:
            "Traffic policies to apply for a specific destination, across all destination ports. See DestinationRule for examples.",
          type: "object",
          properties: {
            loadBalancer: {
              $ref:
                "#/components/schemas/istio.networking.v1beta1.LoadBalancerSettings",
            },
            connectionPool: {
              $ref:
                "#/components/schemas/istio.networking.v1beta1.ConnectionPoolSettings",
            },
            outlierDetection: {
              $ref:
                "#/components/schemas/istio.networking.v1beta1.OutlierDetection",
            },
            tls: {
              $ref:
                "#/components/schemas/istio.networking.v1beta1.ClientTLSSettings",
            },
            portLevelSettings: {
              description:
                "Traffic policies specific to individual ports. Note that port level settings will override the destination-level settings. Traffic settings specified at the destination-level will not be inherited when overridden by port-level settings, i.e. default values will be applied to fields omitted in port-level traffic policies.",
              type: "array",
              items: {
                $ref:
                  "#/components/schemas/istio.networking.v1beta1.TrafficPolicy.PortTrafficPolicy",
              },
            },
          },
        },
        "istio.networking.v1beta1.Subset": {
          description:
            "A subset of endpoints of a service. Subsets can be used for scenarios like A/B testing, or routing to a specific version of a service. Refer to [VirtualService](https://istio.io/docs/reference/config/networking/virtual-service/#VirtualService) documentation for examples of using subsets in these scenarios. In addition, traffic policies defined at the service-level can be overridden at a subset-level. The following rule uses a round robin load balancing policy for all traffic going to a subset named testversion that is composed of endpoints (e.g., pods) with labels (version:v3).",
          type: "object",
          properties: {
            name: {
              description:
                "Name of the subset. The service name and the subset name can be used for traffic splitting in a route rule.",
              type: "string",
              format: "string",
            },
            trafficPolicy: {
              $ref:
                "#/components/schemas/istio.networking.v1beta1.TrafficPolicy",
            },
            labels: {
              description:
                "Labels apply a filter over the endpoints of a service in the service registry. See route rules for examples of usage.",
              type: "object",
              additionalProperties: {
                type: "string",
                format: "string",
              },
            },
          },
        },
        "istio.networking.v1beta1.LoadBalancerSettings": {
          description:
            "Load balancing policies to apply for a specific destination. See Envoy's load balancing [documentation](https://www.envoyproxy.io/docs/envoy/latest/intro/arch_overview/upstream/load_balancing/load_balancing) for more details.",
          type: "object",
          properties: {
            localityLbSetting: {
              $ref:
                "#/components/schemas/istio.networking.v1beta1.LocalityLoadBalancerSetting",
            },
          },
          oneOf: [
            {
              not: {
                anyOf: [
                  {
                    required: ["simple"],
                    properties: {
                      simple: {
                        $ref:
                          "#/components/schemas/istio.networking.v1beta1.LoadBalancerSettings.SimpleLB",
                      },
                    },
                  },
                  {
                    required: ["consistentHash"],
                    properties: {
                      consistentHash: {
                        $ref:
                          "#/components/schemas/istio.networking.v1beta1.LoadBalancerSettings.ConsistentHashLB",
                      },
                    },
                  },
                ],
              },
            },
            {
              required: ["simple"],
              properties: {
                simple: {
                  $ref:
                    "#/components/schemas/istio.networking.v1beta1.LoadBalancerSettings.SimpleLB",
                },
              },
            },
            {
              required: ["consistentHash"],
              properties: {
                consistentHash: {
                  $ref:
                    "#/components/schemas/istio.networking.v1beta1.LoadBalancerSettings.ConsistentHashLB",
                },
              },
            },
          ],
        },
        "istio.networking.v1beta1.ConnectionPoolSettings": {
          description:
            "Connection pool settings for an upstream host. The settings apply to each individual host in the upstream service. See Envoy's [circuit breaker](https://www.envoyproxy.io/docs/envoy/latest/intro/arch_overview/upstream/circuit_breaking) for more details. Connection pool settings can be applied at the TCP level as well as at HTTP level.",
          type: "object",
          properties: {
            tcp: {
              $ref:
                "#/components/schemas/istio.networking.v1beta1.ConnectionPoolSettings.TCPSettings",
            },
            http: {
              $ref:
                "#/components/schemas/istio.networking.v1beta1.ConnectionPoolSettings.HTTPSettings",
            },
          },
        },
        "istio.networking.v1beta1.OutlierDetection": {
          description:
            "A Circuit breaker implementation that tracks the status of each individual host in the upstream service. Applicable to both HTTP and TCP services. For HTTP services, hosts that continually return 5xx errors for API calls are ejected from the pool for a pre-defined period of time. For TCP services, connection timeouts or connection failures to a given host counts as an error when measuring the consecutive errors metric. See Envoy's [outlier detection](https://www.envoyproxy.io/docs/envoy/latest/intro/arch_overview/upstream/outlier) for more details.",
          type: "object",
          properties: {
            interval: {
              description:
                "Time interval between ejection sweep analysis. format: 1h/1m/1s/1ms. MUST BE \u003e=1ms. Default is 10s.",
              type: "string",
            },
            consecutiveErrors: {
              description:
                "Number of errors before a host is ejected from the connection pool. Defaults to 5. When the upstream host is accessed over HTTP, a 502, 503, or 504 return code qualifies as an error. When the upstream host is accessed over an opaque TCP connection, connect timeouts and connection error/failure events qualify as an error. $hide_from_docs",
              type: "integer",
              format: "int32",
              deprecated: true,
            },
            consecutiveGatewayErrors: {
              description:
                "Number of gateway errors before a host is ejected from the connection pool. When the upstream host is accessed over HTTP, a 502, 503, or 504 return code qualifies as a gateway error. When the upstream host is accessed over an opaque TCP connection, connect timeouts and connection error/failure events qualify as a gateway error. This feature is disabled by default or when set to the value 0.",
              type: "integer",
              nullable: true,
            },
            consecutive5xxErrors: {
              description:
                "Number of 5xx errors before a host is ejected from the connection pool. When the upstream host is accessed over an opaque TCP connection, connect timeouts, connection error/failure and request failure events qualify as a 5xx error. This feature defaults to 5 but can be disabled by setting the value to 0.",
              type: "integer",
              nullable: true,
            },
            baseEjectionTime: {
              description:
                "Minimum ejection duration. A host will remain ejected for a period equal to the product of minimum ejection duration and the number of times the host has been ejected. This technique allows the system to automatically increase the ejection period for unhealthy upstream servers. format: 1h/1m/1s/1ms. MUST BE \u003e=1ms. Default is 30s.",
              type: "string",
            },
            maxEjectionPercent: {
              description:
                "Maximum % of hosts in the load balancing pool for the upstream service that can be ejected. Defaults to 10%.",
              type: "integer",
              format: "int32",
            },
            minHealthPercent: {
              description:
                "Outlier detection will be enabled as long as the associated load balancing pool has at least min_health_percent hosts in healthy mode. When the percentage of healthy hosts in the load balancing pool drops below this threshold, outlier detection will be disabled and the proxy will load balance across all hosts in the pool (healthy and unhealthy). The threshold can be disabled by setting it to 0%. The default is 0% as it's not typically applicable in k8s environments with few pods per service.",
              type: "integer",
              format: "int32",
            },
          },
        },
        "istio.networking.v1beta1.ClientTLSSettings": {
          description:
            "SSL/TLS related settings for upstream connections. See Envoy's [TLS context](https://www.envoyproxy.io/docs/envoy/latest/api-v2/api/v2/auth/cert.proto.html) for more details. These settings are common to both HTTP and TCP upstreams.",
          type: "object",
          properties: {
            mode: {
              $ref:
                "#/components/schemas/istio.networking.v1beta1.ClientTLSSettings.TLSmode",
            },
            clientCertificate: {
              description:
                "REQUIRED if mode is `MUTUAL`. The path to the file holding the client-side TLS certificate to use. Should be empty if mode is `ISTIO_MUTUAL`.",
              type: "string",
              format: "string",
            },
            privateKey: {
              description:
                "REQUIRED if mode is `MUTUAL`. The path to the file holding the client's private key. Should be empty if mode is `ISTIO_MUTUAL`.",
              type: "string",
              format: "string",
            },
            caCertificates: {
              description:
                "OPTIONAL: The path to the file containing certificate authority certificates to use in verifying a presented server certificate. If omitted, the proxy will not verify the server's certificate. Should be empty if mode is `ISTIO_MUTUAL`.",
              type: "string",
              format: "string",
            },
            credentialName: {
              description:
                "The name of the secret that holds the TLS certs for the client including the CA certificates. Applicable only on Kubernetes. Secret must exist in the same namespace with the proxy using the certificates. The secret (of type `generic`)should contain the following keys and values: `key: \u003cprivateKey\u003e`, `cert: \u003cserverCert\u003e`, `cacert: \u003cCACertificate\u003e`. Secret of type tls for client certificates along with ca.crt key for CA certificates is also supported. Only one of client certificates and CA certificate or credentialName can be specified.",
              type: "string",
              format: "string",
            },
            subjectAltNames: {
              description:
                "A list of alternate names to verify the subject identity in the certificate. If specified, the proxy will verify that the server certificate's subject alt name matches one of the specified values. If specified, this list overrides the value of subject_alt_names from the ServiceEntry.",
              type: "array",
              items: {
                type: "string",
                format: "string",
              },
            },
            sni: {
              description:
                "SNI string to present to the server during TLS handshake.",
              type: "string",
              format: "string",
            },
          },
        },
        "istio.networking.v1beta1.TrafficPolicy.PortTrafficPolicy": {
          description:
            "Traffic policies that apply to specific ports of the service",
          type: "object",
          properties: {
            loadBalancer: {
              $ref:
                "#/components/schemas/istio.networking.v1beta1.LoadBalancerSettings",
            },
            connectionPool: {
              $ref:
                "#/components/schemas/istio.networking.v1beta1.ConnectionPoolSettings",
            },
            outlierDetection: {
              $ref:
                "#/components/schemas/istio.networking.v1beta1.OutlierDetection",
            },
            tls: {
              $ref:
                "#/components/schemas/istio.networking.v1beta1.ClientTLSSettings",
            },
            port: {
              $ref:
                "#/components/schemas/istio.networking.v1beta1.PortSelector",
            },
          },
        },
        "istio.networking.v1beta1.PortSelector": {
          description:
            "PortSelector specifies the number of a port to be used for matching or selection for final routing.",
          type: "object",
          properties: {
            number: {
              description: "Valid port number",
              type: "integer",
            },
          },
        },
        "istio.networking.v1beta1.LocalityLoadBalancerSetting": {
          description:
            "Locality-weighted load balancing allows administrators to control the distribution of traffic to endpoints based on the localities of where the traffic originates and where it will terminate. These localities are specified using arbitrary labels that designate a hierarchy of localities in {region}/{zone}/{sub-zone} form. For additional detail refer to [Locality Weight](https://www.envoyproxy.io/docs/envoy/latest/intro/arch_overview/upstream/load_balancing/locality_weight) The following example shows how to setup locality weights mesh-wide.",
          type: "object",
          properties: {
            distribute: {
              description:
                "Optional: only one of distribute or failover can be set. Explicitly specify loadbalancing weight across different zones and geographical locations. Refer to [Locality weighted load balancing](https://www.envoyproxy.io/docs/envoy/latest/intro/arch_overview/upstream/load_balancing/locality_weight) If empty, the locality weight is set according to the endpoints number within it.",
              type: "array",
              items: {
                $ref:
                  "#/components/schemas/istio.networking.v1beta1.LocalityLoadBalancerSetting.Distribute",
              },
            },
            failover: {
              description:
                "Optional: only failover or distribute can be set. Explicitly specify the region traffic will land on when endpoints in local region becomes unhealthy. Should be used together with OutlierDetection to detect unhealthy endpoints. Note: if no OutlierDetection specified, this will not take effect.",
              type: "array",
              items: {
                $ref:
                  "#/components/schemas/istio.networking.v1beta1.LocalityLoadBalancerSetting.Failover",
              },
            },
            enabled: {
              description:
                "enable locality load balancing, this is DestinationRule-level and will override mesh wide settings in entirety. e.g. true means that turn on locality load balancing for this DestinationRule no matter what mesh wide settings is.",
              type: "boolean",
              nullable: true,
            },
          },
        },
        "istio.networking.v1beta1.LoadBalancerSettings.SimpleLB": {
          description:
            "Standard load balancing algorithms that require no tuning.",
          type: "string",
          enum: ["ROUND_ROBIN", "LEAST_CONN", "RANDOM", "PASSTHROUGH"],
        },
        "istio.networking.v1beta1.LoadBalancerSettings.ConsistentHashLB": {
          description:
            "Consistent Hash-based load balancing can be used to provide soft session affinity based on HTTP headers, cookies or other properties. This load balancing policy is applicable only for HTTP connections. The affinity to a particular destination host will be lost when one or more hosts are added/removed from the destination service.",
          type: "object",
          properties: {
            minimumRingSize: {
              description:
                "The minimum number of virtual nodes to use for the hash ring. Defaults to 1024. Larger ring sizes result in more granular load distributions. If the number of hosts in the load balancing pool is larger than the ring size, each host will be assigned a single virtual node.",
              type: "integer",
            },
          },
          oneOf: [
            {
              not: {
                anyOf: [
                  {
                    required: ["httpHeaderName"],
                    properties: {
                      httpHeaderName: {
                        description: "Hash based on a specific HTTP header.",
                        type: "string",
                        format: "string",
                      },
                    },
                  },
                  {
                    required: ["httpCookie"],
                    properties: {
                      httpCookie: {
                        $ref:
                          "#/components/schemas/istio.networking.v1beta1.LoadBalancerSettings.ConsistentHashLB.HTTPCookie",
                      },
                    },
                  },
                  {
                    required: ["useSourceIp"],
                    properties: {
                      useSourceIp: {
                        description: "Hash based on the source IP address.",
                        type: "boolean",
                      },
                    },
                  },
                  {
                    required: ["httpQueryParameterName"],
                    properties: {
                      httpQueryParameterName: {
                        description:
                          "Hash based on a specific HTTP query parameter.",
                        type: "string",
                        format: "string",
                      },
                    },
                  },
                ],
              },
            },
            {
              required: ["httpHeaderName"],
              properties: {
                httpHeaderName: {
                  description: "Hash based on a specific HTTP header.",
                  type: "string",
                  format: "string",
                },
              },
            },
            {
              required: ["httpCookie"],
              properties: {
                httpCookie: {
                  $ref:
                    "#/components/schemas/istio.networking.v1beta1.LoadBalancerSettings.ConsistentHashLB.HTTPCookie",
                },
              },
            },
            {
              required: ["useSourceIp"],
              properties: {
                useSourceIp: {
                  description: "Hash based on the source IP address.",
                  type: "boolean",
                },
              },
            },
            {
              required: ["httpQueryParameterName"],
              properties: {
                httpQueryParameterName: {
                  description: "Hash based on a specific HTTP query parameter.",
                  type: "string",
                  format: "string",
                },
              },
            },
          ],
        },
        "istio.networking.v1beta1.LoadBalancerSettings.ConsistentHashLB.HTTPCookie": {
          description:
            "Describes a HTTP cookie that will be used as the hash key for the Consistent Hash load balancer. If the cookie is not present, it will be generated.",
          type: "object",
          properties: {
            path: {
              description: "Path to set for the cookie.",
              type: "string",
              format: "string",
            },
            name: {
              description: "Name of the cookie.",
              type: "string",
              format: "string",
            },
            ttl: {
              description: "Lifetime of the cookie.",
              type: "string",
            },
          },
        },
        "istio.networking.v1beta1.ConnectionPoolSettings.TCPSettings": {
          description:
            "Settings common to both HTTP and TCP upstream connections.",
          type: "object",
          properties: {
            maxConnections: {
              description:
                "Maximum number of HTTP1 /TCP connections to a destination host. Default 2^32-1.",
              type: "integer",
              format: "int32",
            },
            connectTimeout: {
              description: "TCP connection timeout.",
              type: "string",
            },
            tcpKeepalive: {
              $ref:
                "#/components/schemas/istio.networking.v1beta1.ConnectionPoolSettings.TCPSettings.TcpKeepalive",
            },
          },
        },
        "istio.networking.v1beta1.ConnectionPoolSettings.HTTPSettings": {
          description: "Settings applicable to HTTP1.1/HTTP2/GRPC connections.",
          type: "object",
          properties: {
            http1MaxPendingRequests: {
              description:
                "Maximum number of pending HTTP requests to a destination. Default 2^32-1.",
              type: "integer",
              format: "int32",
            },
            http2MaxRequests: {
              description:
                "Maximum number of requests to a backend. Default 2^32-1.",
              type: "integer",
              format: "int32",
            },
            maxRequestsPerConnection: {
              description:
                'Maximum number of requests per connection to a backend. Setting this parameter to 1 disables keep alive. Default 0, meaning "unlimited", up to 2^29.',
              type: "integer",
              format: "int32",
            },
            maxRetries: {
              description:
                "Maximum number of retries that can be outstanding to all hosts in a cluster at a given time. Defaults to 2^32-1.",
              type: "integer",
              format: "int32",
            },
            idleTimeout: {
              description:
                "The idle timeout for upstream connection pool connections. The idle timeout is defined as the period in which there are no active requests. If not set, the default is 1 hour. When the idle timeout is reached the connection will be closed. Note that request based timeouts mean that HTTP/2 PINGs will not keep the connection alive. Applies to both HTTP1.1 and HTTP2 connections.",
              type: "string",
            },
            h2UpgradePolicy: {
              $ref:
                "#/components/schemas/istio.networking.v1beta1.ConnectionPoolSettings.HTTPSettings.H2UpgradePolicy",
            },
          },
        },
        "istio.networking.v1beta1.ConnectionPoolSettings.TCPSettings.TcpKeepalive": {
          description: "TCP keepalive.",
          type: "object",
          properties: {
            time: {
              description:
                "The time duration a connection needs to be idle before keep-alive probes start being sent. Default is to use the OS level configuration (unless overridden, Linux defaults to 7200s (ie 2 hours.)",
              type: "string",
            },
            probes: {
              description:
                "Maximum number of keepalive probes to send without response before deciding the connection is dead. Default is to use the OS level configuration (unless overridden, Linux defaults to 9.)",
              type: "integer",
            },
            interval: {
              description:
                "The time duration between keep-alive probes. Default is to use the OS level configuration (unless overridden, Linux defaults to 75s.)",
              type: "string",
            },
          },
        },
        "istio.networking.v1beta1.ConnectionPoolSettings.HTTPSettings.H2UpgradePolicy": {
          description: "Policy for upgrading http1.1 connections to http2.",
          type: "string",
          enum: ["DEFAULT", "DO_NOT_UPGRADE", "UPGRADE"],
        },
        "istio.networking.v1beta1.ClientTLSSettings.TLSmode": {
          description: "TLS connection mode",
          type: "string",
          enum: ["DISABLE", "SIMPLE", "MUTUAL", "ISTIO_MUTUAL"],
        },
        "istio.networking.v1beta1.LocalityLoadBalancerSetting.Distribute": {
          description:
            "Describes how traffic originating in the 'from' zone or sub-zone is distributed over a set of 'to' zones. Syntax for specifying a zone is {region}/{zone}/{sub-zone} and terminal wildcards are allowed on any segment of the specification. Examples: * - matches all localities us-west/* - all zones and sub-zones within the us-west region us-west/zone-1/* - all sub-zones within us-west/zone-1",
          type: "object",
          properties: {
            from: {
              description:
                "Originating locality, '/' separated, e.g. 'region/zone/sub_zone'.",
              type: "string",
              format: "string",
            },
            to: {
              description:
                "Map of upstream localities to traffic distribution weights. The sum of all weights should be == 100. Any locality not assigned a weight will receive no traffic.",
              type: "object",
              additionalProperties: {
                type: "integer",
              },
            },
          },
        },
        "istio.networking.v1beta1.LocalityLoadBalancerSetting.Failover": {
          description:
            "Specify the traffic failover policy across regions. Since zone and sub-zone failover is supported by default this only needs to be specified for regions when the operator needs to constrain traffic failover so that the default behavior of failing over to any endpoint globally does not apply. This is useful when failing over traffic across regions would not improve service health or may need to be restricted for other reasons like regulatory controls.",
          type: "object",
          properties: {
            from: {
              description: "Originating region.",
              type: "string",
              format: "string",
            },
            to: {
              description:
                "Destination region the traffic will fail over to when endpoints in the 'from' region becomes unhealthy.",
              type: "string",
              format: "string",
            },
          },
        },
      },
    },
  },
  {
    openapi: "3.0.0",
    info: {
      title: "Definition of a workload selector.",
      version: "v1beta1",
    },
    components: {
      schemas: {
        "istio.type.v1beta1.WorkloadSelector": {
          description:
            "WorkloadSelector specifies the criteria used to determine if a policy can be applied to a proxy. The matching criteria includes the metadata associated with a proxy, workload instance info such as labels attached to the pod/VM, or any other info that the proxy provides to Istio during the initial handshake. If multiple conditions are specified, all conditions need to match in order for the workload instance to be selected. Currently, only label based selection mechanism is supported.",
          type: "object",
          properties: {
            matchLabels: {
              description:
                "One or more labels that indicate a specific set of pods/VMs on which a policy should be applied. The scope of label search is restricted to the configuration namespace in which the resource is present.",
              type: "object",
              additionalProperties: {
                type: "string",
                format: "string",
              },
            },
          },
        },
      },
    },
  },
  {
    openapi: "3.0.0",
    info: {
      title: "Configuration affecting the service mesh as a whole.",
      version: "v1alpha1",
    },
    components: {
      schemas: {
        "istio.mesh.v1alpha1.MeshConfig": {
          description:
            "MeshConfig defines mesh-wide variables shared by all Envoy instances in the Istio service mesh.",
          type: "object",
          properties: {
            localityLbSetting: {
              $ref:
                "#/components/schemas/istio.networking.v1alpha3.LocalityLoadBalancerSetting",
            },
            connectTimeout: {
              description:
                "Connection timeout used by Envoy. (MUST BE \u003e=1ms)",
              type: "string",
            },
            tcpKeepalive: {
              $ref:
                "#/components/schemas/istio.networking.v1alpha3.ConnectionPoolSettings.TCPSettings.TcpKeepalive",
            },
            h2UpgradePolicy: {
              $ref:
                "#/components/schemas/istio.mesh.v1alpha1.MeshConfig.H2UpgradePolicy",
            },
            outboundTrafficPolicy: {
              $ref:
                "#/components/schemas/istio.mesh.v1alpha1.MeshConfig.OutboundTrafficPolicy",
            },
            mixerCheckServer: {
              description:
                "Address of the server that will be used by the proxies for policy check calls. By using different names for mixerCheckServer and mixerReportServer, it is possible to have one set of Mixer servers handle policy check calls while another set of Mixer servers handle telemetry calls.",
              type: "string",
              format: "string",
              deprecated: true,
            },
            mixerReportServer: {
              description:
                "Address of the server that will be used by the proxies for policy report calls.",
              type: "string",
              format: "string",
              deprecated: true,
            },
            disablePolicyChecks: {
              description:
                "Disable policy checks by the Mixer service. Default is false, i.e. Mixer policy check is enabled by default.",
              type: "boolean",
              deprecated: true,
            },
            disableMixerHttpReports: {
              description:
                "Disable telemetry reporting by the Mixer service for HTTP traffic. Default is false (telemetry reporting via Mixer is enabled). This option provides a transition path for Istio extensibility v2.",
              type: "boolean",
              deprecated: true,
            },
            policyCheckFailOpen: {
              description:
                "Allow all traffic in cases when the Mixer policy service cannot be reached. Default is false which means the traffic is denied when the client is unable to connect to Mixer.",
              type: "boolean",
              deprecated: true,
            },
            sidecarToTelemetrySessionAffinity: {
              description:
                "Enable session affinity for Envoy Mixer reports so that calls from a proxy will always target the same Mixer instance.",
              type: "boolean",
              deprecated: true,
            },
            proxyListenPort: {
              description:
                "Port on which Envoy should listen for incoming connections from other services.",
              type: "integer",
              format: "int32",
            },
            proxyHttpPort: {
              description:
                "Port on which Envoy should listen for HTTP PROXY requests if set.",
              type: "integer",
              format: "int32",
            },
            protocolDetectionTimeout: {
              description:
                "Automatic protocol detection uses a set of heuristics to determine whether the connection is using TLS or not (on the server side), as well as the application protocol being used (e.g., http vs tcp). These heuristics rely on the client sending the first bits of data. For server first protocols like MySQL, MongoDB, etc., Envoy will timeout on the protocol detection after the specified period, defaulting to non mTLS plain TCP traffic. Set this field to tweak the period that Envoy will wait for the client to send the first bits of data. (MUST BE \u003e=1ms or 0s to disable)",
              type: "string",
            },
            ingressClass: {
              description:
                'Class of ingress resources to be processed by Istio ingress controller. This corresponds to the value of "kubernetes.io/ingress.class" annotation.',
              type: "string",
              format: "string",
            },
            ingressService: {
              description:
                "Name of the Kubernetes service used for the istio ingress controller.",
              type: "string",
              format: "string",
            },
            ingressControllerMode: {
              $ref:
                "#/components/schemas/istio.mesh.v1alpha1.MeshConfig.IngressControllerMode",
            },
            ingressSelector: {
              description:
                "Defines which gateway deployment to use as the Ingress controller. This field corresponds to the Gateway.selector field, and will be set as `istio: INGRESS_SELECTOR`. By default, `ingressgateway` is used, which will select the default IngressGateway as it has the `istio: ingressgateway` labels. It is recommended that this is the same value as ingress_service.",
              type: "string",
              format: "string",
            },
            authPolicy: {
              $ref:
                "#/components/schemas/istio.mesh.v1alpha1.MeshConfig.AuthPolicy",
              deprecated: true,
            },
            rdsRefreshDelay: {
              type: "string",
              deprecated: true,
            },
            enableTracing: {
              description:
                "Flag to control generation of trace spans and request IDs. Requires a trace span collector defined in the proxy configuration.",
              type: "boolean",
            },
            accessLogFile: {
              description:
                "File address for the proxy access log (e.g. /dev/stdout). Empty value disables access logging.",
              type: "string",
              format: "string",
            },
            accessLogFormat: {
              description:
                "Format for the proxy access log Empty value results in proxy's default access log format",
              type: "string",
              format: "string",
            },
            accessLogEncoding: {
              $ref:
                "#/components/schemas/istio.mesh.v1alpha1.MeshConfig.AccessLogEncoding",
            },
            enableEnvoyAccessLogService: {
              description:
                "This flag enables Envoy's gRPC Access Log Service. See [Access Log Service](https://www.envoyproxy.io/docs/envoy/latest/api-v2/config/accesslog/v2/als.proto) for details about Envoy's gRPC Access Log Service API.",
              type: "boolean",
            },
            defaultConfig: {
              $ref: "#/components/schemas/istio.mesh.v1alpha1.ProxyConfig",
            },
            mixerAddress: {
              type: "string",
              format: "string",
              deprecated: true,
            },
            enableClientSidePolicyCheck: {
              description: "Enables client side policy checks.",
              type: "boolean",
            },
            sdsUdsPath: {
              description:
                "Unix Domain Socket through which Envoy communicates with NodeAgent SDS to get key/cert for mTLS. Use secret-mount files instead of SDS if set to empty. @deprecated - istio agent will detect and send the path to envoy.",
              type: "string",
              format: "string",
              deprecated: true,
            },
            sdsRefreshDelay: {
              type: "string",
              deprecated: true,
            },
            configSources: {
              description:
                "ConfigSource describes a source of configuration data for networking rules, and other Istio configuration artifacts. Multiple data sources can be configured for a single control plane.",
              type: "array",
              items: {
                $ref: "#/components/schemas/istio.mesh.v1alpha1.ConfigSource",
              },
            },
            enableAutoMtls: {
              description:
                "This flag is used to enable mutual TLS automatically for service to service communication within the mesh, default true. If set to true, and a given service does not have a corresponding DestinationRule configured, or its DestinationRule does not have ClientTLSSettings specified, Istio configures client side TLS configuration appropriately. More specifically, If the upstream authentication policy is in STRICT mode, use Istio provisioned certificate for mutual TLS to connect to upstream. If upstream service is in plain text mode, use plain text. If the upstream authentication policy is in PERMISSIVE mode, Istio configures clients to use mutual TLS when server sides are capable of accepting mutual TLS traffic. If service DestinationRule exists and has ClientTLSSettings specified, that is always used instead.",
              type: "boolean",
              nullable: true,
            },
            enableSdsTokenMount: {
              description:
                "This flag is used by secret discovery service(SDS). If set to true ([prerequisite](https://kubernetes.io/docs/concepts/storage/volumes/#projected)), Istio will inject volumes mount for Kubernetes service account trustworthy JWT(which is available with Kubernetes 1.12 or higher), so that the Kubernetes API server mounts Kubernetes service account trustworthy JWT to the Envoy container, which will be used to request key/cert eventually. This isn't supported for non-Kubernetes cases.",
              type: "boolean",
            },
            sdsUseK8sSaJwt: {
              description:
                "This flag is used by secret discovery service(SDS). If set to true, Envoy will fetch a normal Kubernetes service account JWT from '/var/run/secrets/kubernetes.io/serviceaccount/token' (https://kubernetes.io/docs/tasks/access-application-cluster/access-cluster/#accessing-the-api-from-a-pod) and pass to sds server, which will be used to request key/cert eventually. If both enable_sds_token_mount and sds_use_k8s_sa_jwt are set to true, enable_sds_token_mount(trustworthy jwt) takes precedence. This isn't supported for non-k8s case.",
              type: "boolean",
            },
            trustDomain: {
              description:
                "The trust domain corresponds to the trust root of a system. Refer to [SPIFFE-ID](https://github.com/spiffe/spiffe/blob/master/standards/SPIFFE-ID.md#21-trust-domain)",
              type: "string",
              format: "string",
            },
            trustDomainAliases: {
              description:
                'The trust domain aliases represent the aliases of `trust_domain`. For example, if we have ```yaml trustDomain: td1 trustDomainAliases: ["td2", "td3"] ``` Any service with the identity `td1/ns/foo/sa/a-service-account`, `td2/ns/foo/sa/a-service-account`, or `td3/ns/foo/sa/a-service-account` will be treated the same in the Istio mesh.',
              type: "array",
              items: {
                type: "string",
                format: "string",
              },
            },
            defaultServiceExportTo: {
              description:
                "The default value for the ServiceEntry.export_to field and services imported through container registry integrations, e.g. this applies to Kubernetes Service resources. The value is a list of namespace names and reserved namespace aliases. The allowed namespace aliases are: * - All Namespaces . - Current Namespace ~ - No Namespace",
              type: "array",
              items: {
                type: "string",
                format: "string",
              },
            },
            defaultVirtualServiceExportTo: {
              description:
                "The default value for the VirtualService.export_to field. Has the same syntax as 'default_service_export_to'.",
              type: "array",
              items: {
                type: "string",
                format: "string",
              },
            },
            defaultDestinationRuleExportTo: {
              description:
                "The default value for the DestinationRule.export_to field. Has the same syntax as 'default_service_export_to'.",
              type: "array",
              items: {
                type: "string",
                format: "string",
              },
            },
            rootNamespace: {
              description:
                "The namespace to treat as the administrative root namespace for Istio configuration. When processing a leaf namespace Istio will search for declarations in that namespace first and if none are found it will search in the root namespace. Any matching declaration found in the root namespace is processed as if it were declared in the leaf namespace.",
              type: "string",
              format: "string",
            },
            dnsRefreshRate: {
              description:
                "Configures DNS refresh rate for Envoy clusters of type STRICT_DNS",
              type: "string",
            },
            disableReportBatch: {
              description: "The flag to disable report batch.",
              type: "boolean",
              deprecated: true,
            },
            reportBatchMaxEntries: {
              description:
                "When disable_report_batch is false, this value specifies the maximum number of requests that are batched in report. If left unspecified, the default value of report_batch_max_entries == 0 will use the hardcoded defaults of istio::mixerclient::ReportOptions.",
              type: "integer",
              deprecated: true,
            },
            reportBatchMaxTime: {
              description:
                "When disable_report_batch is false, this value specifies the maximum elapsed time a batched report will be sent after a user request is processed. If left unspecified, the default report_batch_max_time == 0 will use the hardcoded defaults of istio::mixerclient::ReportOptions.",
              type: "string",
              deprecated: true,
            },
            inboundClusterStatName: {
              description:
                "Name to be used while emitting statistics for inbound clusters. The same pattern is used while computing stat prefix for network filters like TCP and Redis. By default, Istio emits statistics with the pattern `inbound|\u003cport\u003e|\u003cport-name\u003e|\u003cservice-FQDN\u003e`. For example `inbound|7443|grpc-reviews|reviews.prod.svc.cluster.local`. This can be used to override that pattern.",
              type: "string",
              format: "string",
            },
            outboundClusterStatName: {
              description:
                "Name to be used while emitting statistics for outbound clusters. The same pattern is used while computing stat prefix for network filters like TCP and Redis. By default, Istio emits statistics with the pattern `outbound|\u003cport\u003e|\u003csubsetname\u003e|\u003cservice-FQDN\u003e`. For example `outbound|8080|v2|reviews.prod.svc.cluster.local`. This can be used to override that pattern.",
              type: "string",
              format: "string",
            },
            certificates: {
              description: "Configure the provision of certificates.",
              type: "array",
              items: {
                $ref: "#/components/schemas/istio.mesh.v1alpha1.Certificate",
              },
            },
            thriftConfig: {
              $ref:
                "#/components/schemas/istio.mesh.v1alpha1.MeshConfig.ThriftConfig",
            },
            serviceSettings: {
              description: "Settings to be applied to select services.",
              type: "array",
              items: {
                $ref:
                  "#/components/schemas/istio.mesh.v1alpha1.MeshConfig.ServiceSettings",
              },
            },
            enablePrometheusMerge: {
              description:
                'If enabled, Istio agent will merge metrics exposed by the application with metrics from Envoy and Istio agent. The sidecar injection will replace `prometheus.io` annotations present on the pod and redirect them towards Istio agent, which will then merge metrics of from the application with Istio metrics. This relies on the annotations `prometheus.io/scrape`, `prometheus.io/port`, and `prometheus.io/path` annotations. If you are running a separately managed Envoy with an Istio sidecar, this may cause issues, as the metrics will collide. In this case, it is recommended to disable aggregation on that deployment with the `prometheus.istio.io/merge-metrics: "false"` annotation. If not specified, this will be enabled by default.',
              type: "boolean",
              nullable: true,
            },
          },
        },
        "istio.mesh.v1alpha1.MeshConfig.IngressControllerMode": {
          type: "string",
          enum: ["UNSPECIFIED", "OFF", "DEFAULT", "STRICT"],
        },
        "istio.mesh.v1alpha1.MeshConfig.AuthPolicy": {
          type: "string",
          enum: ["NONE", "MUTUAL_TLS"],
        },
        "istio.mesh.v1alpha1.MeshConfig.AccessLogEncoding": {
          type: "string",
          enum: ["TEXT", "JSON"],
        },
        "istio.mesh.v1alpha1.ProxyConfig": {
          description:
            "ProxyConfig defines variables for individual Envoy instances.",
          type: "object",
          properties: {
            configPath: {
              description:
                "Path to the generated configuration file directory. Proxy agent generates the actual configuration and stores it in this directory.",
              type: "string",
              format: "string",
            },
            binaryPath: {
              description: "Path to the proxy binary",
              type: "string",
              format: "string",
            },
            serviceCluster: {
              description:
                "Service cluster defines the name for the service_cluster that is shared by all Envoy instances. This setting corresponds to _--service-cluster_ flag in Envoy. In a typical Envoy deployment, the _service-cluster_ flag is used to identify the caller, for source-based routing scenarios.",
              type: "string",
              format: "string",
            },
            drainDuration: {
              description:
                "The time in seconds that Envoy will drain connections during a hot restart. MUST be \u003e=1s (e.g., _1s/1m/1h_)",
              type: "string",
            },
            parentShutdownDuration: {
              description:
                "The time in seconds that Envoy will wait before shutting down the parent process during a hot restart. MUST be \u003e=1s (e.g., _1s/1m/1h_). MUST BE greater than _drain_duration_ parameter.",
              type: "string",
            },
            discoveryAddress: {
              description:
                "Address of the discovery service exposing xDS with mTLS connection. The inject configuration may override this value.",
              type: "string",
              format: "string",
            },
            discoveryRefreshDelay: {
              type: "string",
              deprecated: true,
            },
            zipkinAddress: {
              description:
                "Address of the Zipkin service (e.g. _zipkin:9411_). DEPRECATED: Use [tracing][istio.mesh.v1alpha1.ProxyConfig.tracing] instead.",
              type: "string",
              format: "string",
              deprecated: true,
            },
            statsdUdpAddress: {
              description:
                "IP Address and Port of a statsd UDP listener (e.g. _10.75.241.127:9125_).",
              type: "string",
              format: "string",
            },
            envoyMetricsServiceAddress: {
              type: "string",
              format: "string",
              deprecated: true,
            },
            proxyAdminPort: {
              description:
                "Port on which Envoy should listen for administrative commands.",
              type: "integer",
              format: "int32",
            },
            availabilityZone: {
              type: "string",
              format: "string",
              deprecated: true,
            },
            controlPlaneAuthPolicy: {
              $ref:
                "#/components/schemas/istio.mesh.v1alpha1.AuthenticationPolicy",
            },
            customConfigFile: {
              description:
                "File path of custom proxy configuration, currently used by proxies in front of Mixer and Pilot.",
              type: "string",
              format: "string",
            },
            statNameLength: {
              description:
                "Maximum length of name field in Envoy's metrics. The length of the name field is determined by the length of a name field in a service and the set of labels that comprise a particular version of the service. The default value is set to 189 characters. Envoy's internal metrics take up 67 characters, for a total of 256 character name per metric. Increase the value of this field if you find that the metrics from Envoys are truncated.",
              type: "integer",
              format: "int32",
            },
            concurrency: {
              description:
                "The number of worker threads to run. If unset, this will be automatically determined based on CPU requests/limits. If set to 0, all cores on the machine will be used.",
              type: "integer",
              nullable: true,
            },
            proxyBootstrapTemplatePath: {
              description: "Path to the proxy bootstrap template file",
              type: "string",
              format: "string",
            },
            interceptionMode: {
              $ref:
                "#/components/schemas/istio.mesh.v1alpha1.ProxyConfig.InboundInterceptionMode",
            },
            tracing: {
              $ref: "#/components/schemas/istio.mesh.v1alpha1.Tracing",
            },
            sds: {
              $ref: "#/components/schemas/istio.mesh.v1alpha1.SDS",
            },
            envoyAccessLogService: {
              $ref: "#/components/schemas/istio.mesh.v1alpha1.RemoteService",
            },
            envoyMetricsService: {
              $ref: "#/components/schemas/istio.mesh.v1alpha1.RemoteService",
            },
            proxyMetadata: {
              description:
                "Additional env variables for the proxy. Names starting with ISTIO_META_ will be included in the generated bootstrap and sent to the XDS server.",
              type: "object",
              additionalProperties: {
                type: "string",
                format: "string",
              },
            },
            statusPort: {
              description:
                "Port on which the agent should listen for administrative commands such as readiness probe.",
              type: "integer",
              format: "int32",
            },
            extraStatTags: {
              description:
                "An additional list of tags to extract from the in-proxy Istio telemetry. These extra tags can be added by configuring the telemetry extension. Each additional tag needs to be present in this list. Extra tags emitted by the telemetry extensions must be listed here so that they can be processed and exposed as Prometheus metrics.",
              type: "array",
              items: {
                type: "string",
                format: "string",
              },
            },
            gatewayTopology: {
              $ref: "#/components/schemas/istio.mesh.v1alpha1.Topology",
            },
            terminationDrainDuration: {
              description:
                "The amount of time allowed for connections to complete on proxy shutdown. On receiving SIGTERM or SIGINT, istio-agent tells the active Envoy to start draining, preventing any new connections and allowing existing connections to complete. It then sleeps for the termination_drain_duration and then kills any remaining active Envoy processes. If not set, a default of 5s will be applied.",
              type: "string",
            },
            meshId: {
              description:
                "The unique identifier for the [service mesh](https://istio.io/latest/docs/reference/glossary/#service-mesh) All control planes running in the same service mesh should specify the same mesh ID. Mesh ID is used to label telemetry reports for cases where telemetry from multiple meshes is mixed together.",
              type: "integer",
              format: "int32",
            },
          },
        },
        "istio.mesh.v1alpha1.MeshConfig.OutboundTrafficPolicy": {
          type: "object",
          properties: {
            mode: {
              $ref:
                "#/components/schemas/istio.mesh.v1alpha1.MeshConfig.OutboundTrafficPolicy.Mode",
            },
          },
        },
        "istio.mesh.v1alpha1.ConfigSource": {
          description:
            "ConfigSource describes information about a configuration store inside a mesh. A single control plane instance can interact with one or more data sources.",
          type: "object",
          properties: {
            address: {
              description:
                "Address of the server implementing the Istio Mesh Configuration protocol (MCP). Can be IP address or a fully qualified DNS name. Use fs:/// to specify a file-based backend with absolute path to the directory.",
              type: "string",
              format: "string",
            },
            tlsSettings: {
              $ref:
                "#/components/schemas/istio.networking.v1alpha3.ClientTLSSettings",
            },
            subscribedResources: {
              description:
                "Describes the source of configuration, if nothing is specified default is MCP",
              type: "array",
              items: {
                $ref: "#/components/schemas/istio.mesh.v1alpha1.Resource",
              },
            },
          },
        },
        "istio.mesh.v1alpha1.MeshConfig.H2UpgradePolicy": {
          description:
            "Default Policy for upgrading http1.1 connections to http2.",
          type: "string",
          enum: ["DO_NOT_UPGRADE", "UPGRADE"],
        },
        "istio.mesh.v1alpha1.Certificate": {
          description:
            "Certificate configures the provision of a certificate and its key. Example 1: key and cert stored in a secret { secretName: galley-cert secretNamespace: istio-system dnsNames: - galley.istio-system.svc - galley.mydomain.com } Example 2: key and cert stored in a directory { dnsNames: - pilot.istio-system - pilot.istio-system.svc - pilot.mydomain.com }",
          type: "object",
          properties: {
            secretName: {
              description:
                "Name of the secret the certificate and its key will be stored into. If it is empty, it will not be stored into a secret. Instead, the certificate and its key will be stored into a hard-coded directory.",
              type: "string",
              format: "string",
            },
            dnsNames: {
              description:
                "The DNS names for the certificate. A certificate may contain multiple DNS names.",
              type: "array",
              items: {
                type: "string",
                format: "string",
              },
            },
          },
        },
        "istio.mesh.v1alpha1.MeshConfig.ThriftConfig": {
          type: "object",
          properties: {
            rateLimitUrl: {
              description:
                "Specify thrift rate limit service URL. If pilot has thrift protocol support enabled, this will enable the rate limit service for destinations that have matching rate limit configurations.",
              type: "string",
              format: "string",
            },
            rateLimitTimeout: {
              description:
                "Specify thrift rate limit service timeout, in milliseconds. Default is 50ms",
              type: "string",
            },
          },
        },
        "istio.mesh.v1alpha1.MeshConfig.ServiceSettings": {
          description: "Settings to be applied to select services.",
          type: "object",
          properties: {
            hosts: {
              description:
                "The services to which the Settings should be applied. Services are selected using the hostname matching rules used by DestinationRule.",
              type: "array",
              items: {
                type: "string",
                format: "string",
              },
            },
            settings: {
              $ref:
                "#/components/schemas/istio.mesh.v1alpha1.MeshConfig.ServiceSettings.Settings",
            },
          },
        },
        "istio.mesh.v1alpha1.MeshConfig.OutboundTrafficPolicy.Mode": {
          type: "string",
          enum: ["REGISTRY_ONLY", "ALLOW_ANY"],
        },
        "istio.mesh.v1alpha1.MeshConfig.ServiceSettings.Settings": {
          description: "Settings for the selected services.",
          type: "object",
          properties: {
            clusterLocal: {
              description:
                "If true, specifies that the client and service endpoints must reside in the same cluster. By default, in multi-cluster deployments, the Istio control plane assumes all service endpoints to be reachable from any client in any of the clusters which are part of the mesh. This configuration option limits the set of service endpoints visible to a client to be cluster scoped.",
              type: "boolean",
            },
          },
        },
        "istio.mesh.v1alpha1.Resource": {
          description: "Resource describes the source of configuration",
          type: "string",
          enum: ["SERVICE_REGISTRY"],
        },
        "istio.mesh.v1alpha1.Network": {
          description:
            "Network provides information about the endpoints in a routable L3 network. A single routable L3 network can have one or more service registries. Note that the network has no relation to the locality of the endpoint. The endpoint locality will be obtained from the service registry.",
          type: "object",
          properties: {
            endpoints: {
              description:
                "The list of endpoints in the network (obtained through the constituent service registries or from CIDR ranges). All endpoints in the network are directly accessible to one another.",
              type: "array",
              items: {
                $ref:
                  "#/components/schemas/istio.mesh.v1alpha1.Network.NetworkEndpoints",
              },
            },
            gateways: {
              description: "Set of gateways associated with the network.",
              type: "array",
              items: {
                $ref:
                  "#/components/schemas/istio.mesh.v1alpha1.Network.IstioNetworkGateway",
              },
            },
          },
        },
        "istio.mesh.v1alpha1.Network.NetworkEndpoints": {
          description:
            "NetworkEndpoints describes how the network associated with an endpoint should be inferred. An endpoint will be assigned to a network based on the following rules: 1. Implicitly: If the registry explicitly provides information about the network to which the endpoint belongs to. In some cases, its possible to indicate the network associated with the endpoint by adding the `ISTIO_META_NETWORK` environment variable to the sidecar.",
          type: "object",
          oneOf: [
            {
              not: {
                anyOf: [
                  {
                    required: ["fromCidr"],
                    properties: {
                      fromCidr: {
                        description:
                          "A CIDR range for the set of endpoints in this network. The CIDR ranges for endpoints from different networks must not overlap.",
                        type: "string",
                        format: "string",
                      },
                    },
                  },
                  {
                    required: ["fromRegistry"],
                    properties: {
                      fromRegistry: {
                        description:
                          "Add all endpoints from the specified registry into this network. The names of the registries should correspond to the kubeconfig file name inside the secret that was used to configure the registry (Kubernetes multicluster) or supplied by MCP server.",
                        type: "string",
                        format: "string",
                      },
                    },
                  },
                ],
              },
            },
            {
              required: ["fromCidr"],
              properties: {
                fromCidr: {
                  description:
                    "A CIDR range for the set of endpoints in this network. The CIDR ranges for endpoints from different networks must not overlap.",
                  type: "string",
                  format: "string",
                },
              },
            },
            {
              required: ["fromRegistry"],
              properties: {
                fromRegistry: {
                  description:
                    "Add all endpoints from the specified registry into this network. The names of the registries should correspond to the kubeconfig file name inside the secret that was used to configure the registry (Kubernetes multicluster) or supplied by MCP server.",
                  type: "string",
                  format: "string",
                },
              },
            },
          ],
        },
        "istio.mesh.v1alpha1.Network.IstioNetworkGateway": {
          description:
            "The gateway associated with this network. Traffic from remote networks will arrive at the specified gateway:port. All incoming traffic must use mTLS.",
          type: "object",
          properties: {
            port: {
              description: "The port associated with the gateway.",
              type: "integer",
            },
            locality: {
              description:
                "The locality associated with an explicitly specified gateway (i.e. ip)",
              type: "string",
              format: "string",
            },
          },
          oneOf: [
            {
              not: {
                anyOf: [
                  {
                    required: ["registryServiceName"],
                    properties: {
                      registryServiceName: {
                        description:
                          "A fully qualified domain name of the gateway service. Pilot will lookup the service from the service registries in the network and obtain the endpoint IPs of the gateway from the service registry. Note that while the service name is a fully qualified domain name, it need not be resolvable outside the orchestration platform for the registry. e.g., this could be istio-ingressgateway.istio-system.svc.cluster.local.",
                        type: "string",
                        format: "string",
                      },
                    },
                  },
                  {
                    required: ["address"],
                    properties: {
                      address: {
                        description:
                          "IP address or externally resolvable DNS address associated with the gateway.",
                        type: "string",
                        format: "string",
                      },
                    },
                  },
                ],
              },
            },
            {
              required: ["registryServiceName"],
              properties: {
                registryServiceName: {
                  description:
                    "A fully qualified domain name of the gateway service. Pilot will lookup the service from the service registries in the network and obtain the endpoint IPs of the gateway from the service registry. Note that while the service name is a fully qualified domain name, it need not be resolvable outside the orchestration platform for the registry. e.g., this could be istio-ingressgateway.istio-system.svc.cluster.local.",
                  type: "string",
                  format: "string",
                },
              },
            },
            {
              required: ["address"],
              properties: {
                address: {
                  description:
                    "IP address or externally resolvable DNS address associated with the gateway.",
                  type: "string",
                  format: "string",
                },
              },
            },
          ],
        },
        "istio.mesh.v1alpha1.MeshNetworks": {
          description:
            "MeshNetworks (config map) provides information about the set of networks inside a mesh and how to route to endpoints in each network. For example",
          type: "object",
          properties: {
            networks: {
              description:
                "The set of networks inside this mesh. Each network should have a unique name and information about how to infer the endpoints in the network as well as the gateways associated with the network.",
              type: "object",
              additionalProperties: {
                $ref: "#/components/schemas/istio.mesh.v1alpha1.Network",
              },
            },
          },
        },
        "istio.mesh.v1alpha1.AuthenticationPolicy": {
          description:
            "AuthenticationPolicy defines authentication policy. It can be set for different scopes (mesh, service …), and the most narrow scope with non-INHERIT value will be used. Mesh policy cannot be INHERIT.",
          type: "string",
          enum: ["NONE", "MUTUAL_TLS", "INHERIT"],
        },
        "istio.mesh.v1alpha1.Tracing": {
          description:
            "Tracing defines configuration for the tracing performed by Envoy instances.",
          type: "object",
          properties: {
            tlsSettings: {
              $ref:
                "#/components/schemas/istio.networking.v1alpha3.ClientTLSSettings",
            },
            customTags: {
              description:
                "Configures the custom tags to be added to active span by all proxies (i.e. sidecars and gateways). The key represents the name of the tag. Ex: ```yaml custom_tags: new_tag_name: header: name: custom-http-header-name default_value: defaulted-value-from-custom-header ``` $hide_from_docs",
              type: "object",
              additionalProperties: {
                $ref:
                  "#/components/schemas/istio.mesh.v1alpha1.Tracing.CustomTag",
              },
            },
            maxPathTagLength: {
              description:
                "Configures the maximum length of the request path to extract and include in the HttpUrl tag. Used to truncate length request paths to meet the needs of tracing backend. If not set, then a length of 256 will be used. $hide_from_docs",
              type: "integer",
            },
            sampling: {
              description:
                "The percentage of requests (0.0 - 100.0) that will be randomly selected for trace generation, if not requested by the client or not forced. Default is 100. $hide_from_docs",
              type: "number",
              format: "double",
            },
          },
          oneOf: [
            {
              not: {
                anyOf: [
                  {
                    required: ["zipkin"],
                    properties: {
                      zipkin: {
                        $ref:
                          "#/components/schemas/istio.mesh.v1alpha1.Tracing.Zipkin",
                      },
                    },
                  },
                  {
                    required: ["lightstep"],
                    properties: {
                      lightstep: {
                        $ref:
                          "#/components/schemas/istio.mesh.v1alpha1.Tracing.Lightstep",
                      },
                    },
                  },
                  {
                    required: ["datadog"],
                    properties: {
                      datadog: {
                        $ref:
                          "#/components/schemas/istio.mesh.v1alpha1.Tracing.Datadog",
                      },
                    },
                  },
                  {
                    required: ["stackdriver"],
                    properties: {
                      stackdriver: {
                        $ref:
                          "#/components/schemas/istio.mesh.v1alpha1.Tracing.Stackdriver",
                      },
                    },
                  },
                ],
              },
            },
            {
              required: ["zipkin"],
              properties: {
                zipkin: {
                  $ref:
                    "#/components/schemas/istio.mesh.v1alpha1.Tracing.Zipkin",
                },
              },
            },
            {
              required: ["lightstep"],
              properties: {
                lightstep: {
                  $ref:
                    "#/components/schemas/istio.mesh.v1alpha1.Tracing.Lightstep",
                },
              },
            },
            {
              required: ["datadog"],
              properties: {
                datadog: {
                  $ref:
                    "#/components/schemas/istio.mesh.v1alpha1.Tracing.Datadog",
                },
              },
            },
            {
              required: ["stackdriver"],
              properties: {
                stackdriver: {
                  $ref:
                    "#/components/schemas/istio.mesh.v1alpha1.Tracing.Stackdriver",
                },
              },
            },
          ],
        },
        "istio.mesh.v1alpha1.Tracing.CustomTag": {
          description:
            "Configure custom tags that will be added to any active span. Tags can be generated via literals, environment variables or an incoming request header. $hide_from_docs",
          type: "object",
          oneOf: [
            {
              not: {
                anyOf: [
                  {
                    required: ["literal"],
                    properties: {
                      literal: {
                        $ref:
                          "#/components/schemas/istio.mesh.v1alpha1.Tracing.Literal",
                      },
                    },
                  },
                  {
                    required: ["environment"],
                    properties: {
                      environment: {
                        $ref:
                          "#/components/schemas/istio.mesh.v1alpha1.Tracing.Environment",
                      },
                    },
                  },
                  {
                    required: ["header"],
                    properties: {
                      header: {
                        $ref:
                          "#/components/schemas/istio.mesh.v1alpha1.Tracing.RequestHeader",
                      },
                    },
                  },
                ],
              },
            },
            {
              required: ["literal"],
              properties: {
                literal: {
                  $ref:
                    "#/components/schemas/istio.mesh.v1alpha1.Tracing.Literal",
                },
              },
            },
            {
              required: ["environment"],
              properties: {
                environment: {
                  $ref:
                    "#/components/schemas/istio.mesh.v1alpha1.Tracing.Environment",
                },
              },
            },
            {
              required: ["header"],
              properties: {
                header: {
                  $ref:
                    "#/components/schemas/istio.mesh.v1alpha1.Tracing.RequestHeader",
                },
              },
            },
          ],
        },
        "istio.mesh.v1alpha1.Tracing.Zipkin": {
          description: "Zipkin defines configuration for a Zipkin tracer.",
          type: "object",
          properties: {
            address: {
              description:
                "Address of the Zipkin service (e.g. _zipkin:9411_).",
              type: "string",
              format: "string",
            },
          },
        },
        "istio.mesh.v1alpha1.Tracing.Lightstep": {
          description: "Defines configuration for a Lightstep tracer.",
          type: "object",
          properties: {
            address: {
              description: "Address of the Lightstep Satellite pool.",
              type: "string",
              format: "string",
            },
            accessToken: {
              description: "The Lightstep access token.",
              type: "string",
              format: "string",
            },
          },
        },
        "istio.mesh.v1alpha1.Tracing.Datadog": {
          description: "Datadog defines configuration for a Datadog tracer.",
          type: "object",
          properties: {
            address: {
              description: "Address of the Datadog Agent.",
              type: "string",
              format: "string",
            },
          },
        },
        "istio.mesh.v1alpha1.Tracing.Stackdriver": {
          description:
            "Stackdriver defines configuration for a Stackdriver tracer. See [Opencensus trace config](https://github.com/census-instrumentation/opencensus-proto/blob/master/src/opencensus/proto/trace/v1/trace_config.proto) for details.",
          type: "object",
          properties: {
            debug: {
              description:
                "debug enables trace output to stdout. $hide_from_docs",
              type: "boolean",
            },
            maxNumberOfAttributes: {
              description:
                "The global default max number of attributes per span. default is 200. $hide_from_docs",
              type: "integer",
              nullable: true,
            },
            maxNumberOfAnnotations: {
              description:
                "The global default max number of annotation events per span. default is 200. $hide_from_docs",
              type: "integer",
              nullable: true,
            },
            maxNumberOfMessageEvents: {
              description:
                "The global default max number of message events per span. default is 200. $hide_from_docs",
              type: "integer",
              nullable: true,
            },
          },
        },
        "istio.mesh.v1alpha1.Tracing.Literal": {
          description:
            "Literal type represents a static value. $hide_from_docs",
          type: "object",
          properties: {
            value: {
              description:
                "Static literal value used to populate the tag value.",
              type: "string",
              format: "string",
            },
          },
        },
        "istio.mesh.v1alpha1.Tracing.Environment": {
          description:
            "Environment is the proxy's environment variable to be used for populating the custom span tag. $hide_from_docs",
          type: "object",
          properties: {
            name: {
              description:
                "Name of the environment variable used to populate the tag's value",
              type: "string",
              format: "string",
            },
            defaultValue: {
              description:
                "When the environment variable is not found, the tag's value will be populated with this default value if specified, otherwise the tag will not be populated.",
              type: "string",
              format: "string",
            },
          },
        },
        "istio.mesh.v1alpha1.Tracing.RequestHeader": {
          description:
            "RequestHeader is the HTTP request header which will be used to populate the span tag. A default value can be configured if the header does not exist. $hide_from_docs",
          type: "object",
          properties: {
            name: {
              description:
                "HTTP header name used to obtain the value from to populate the tag value.",
              type: "string",
              format: "string",
            },
            defaultValue: {
              description:
                "Default value to be used for the tag when the named HTTP header does not exist. The tag will be skipped if no default value is provided.",
              type: "string",
              format: "string",
            },
          },
        },
        "istio.mesh.v1alpha1.SDS": {
          description:
            "SDS defines secret discovery service(SDS) configuration to be used by the proxy. For workload, its values are set in sidecar injector(passed as arguments to istio-proxy container). For pilot/mixer, it's passed as arguments to istio-proxy container in pilot/mixer deployment yaml files directly.",
          type: "object",
          properties: {
            enabled: {
              description: "True if SDS is enabled.",
              type: "boolean",
            },
            k8sSaJwtPath: {
              description: "Path of k8s service account JWT path.",
              type: "string",
              format: "string",
            },
          },
        },
        "istio.mesh.v1alpha1.Topology": {
          description:
            "Topology describes the configuration for relative location of a proxy with respect to intermediate trusted proxies and the client. These settings control how the client attributes are retrieved from the incoming traffic by the gateway proxy and propagated to the upstream services in the cluster.",
          type: "object",
          properties: {
            numTrustedProxies: {
              description:
                "Number of trusted proxies deployed in front of the Istio gateway proxy. When this option is set to value N greater than zero, the trusted client address is assumed to be the Nth address from the right end of the X-Forwarded-For (XFF) header from the incoming request. If the X-Forwarded-For (XFF) header is missing or has fewer than N addresses, the gateway proxy falls back to using the immediate downstream connection's source address as the trusted client address. Note that the gateway proxy will append the downstream connection's source address to the X-Forwarded-For (XFF) address and set the X-Envoy-External-Address header to the trusted client address before forwarding it to the upstream services in the cluster. The default value of num_trusted_proxies is 0. See [Envoy XFF] (https://www.envoyproxy.io/docs/envoy/latest/configuration/http/http_conn_man/headers#config-http-conn-man-headers-x-forwarded-for) header handling for more details.",
              type: "integer",
            },
            forwardClientCertDetails: {
              $ref:
                "#/components/schemas/istio.mesh.v1alpha1.Topology.ForwardClientCertDetails",
            },
          },
        },
        "istio.mesh.v1alpha1.Topology.ForwardClientCertDetails": {
          description:
            "ForwardClientCertDetails controls how the x-forwarded-client-cert (XFCC) header is handled by the gateway proxy. See [Envoy XFCC](https://www.envoyproxy.io/docs/envoy/latest/api-v2/config/filter/network/http_connection_manager/v2/http_connection_manager.proto#envoy-api-enum-config-filter-network-http-connection-manager-v2-httpconnectionmanager-forwardclientcertdetails) header handling for more details.",
          type: "string",
          enum: [
            "UNDEFINED",
            "SANITIZE",
            "FORWARD_ONLY",
            "APPEND_FORWARD",
            "SANITIZE_SET",
            "ALWAYS_FORWARD_ONLY",
          ],
        },
        "istio.mesh.v1alpha1.ProxyConfig.InboundInterceptionMode": {
          description:
            "The mode used to redirect inbound traffic to Envoy. This setting has no effect on outbound traffic: iptables REDIRECT is always used for outbound connections.",
          type: "string",
          enum: ["REDIRECT", "TPROXY"],
        },
        "istio.mesh.v1alpha1.RemoteService": {
          type: "object",
          properties: {
            tcpKeepalive: {
              $ref:
                "#/components/schemas/istio.networking.v1alpha3.ConnectionPoolSettings.TCPSettings.TcpKeepalive",
            },
            address: {
              description:
                "Address of a remove service used for various purposes (access log receiver, metrics receiver, etc.). Can be IP address or a fully qualified DNS name.",
              type: "string",
              format: "string",
            },
            tlsSettings: {
              $ref:
                "#/components/schemas/istio.networking.v1alpha3.ClientTLSSettings",
            },
          },
        },
        "istio.networking.v1alpha3.ClientTLSSettings": {
          description:
            "Use the tls_settings to specify the tls mode to use. If the remote service uses Istio mutual TLS and shares the root CA with Pilot, specify the TLS mode as `ISTIO_MUTUAL`.",
          type: "object",
          properties: {
            mode: {
              $ref:
                "#/components/schemas/istio.networking.v1alpha3.ClientTLSSettings.TLSmode",
            },
            clientCertificate: {
              description:
                "REQUIRED if mode is `MUTUAL`. The path to the file holding the client-side TLS certificate to use. Should be empty if mode is `ISTIO_MUTUAL`.",
              type: "string",
              format: "string",
            },
            privateKey: {
              description:
                "REQUIRED if mode is `MUTUAL`. The path to the file holding the client's private key. Should be empty if mode is `ISTIO_MUTUAL`.",
              type: "string",
              format: "string",
            },
            caCertificates: {
              description:
                "OPTIONAL: The path to the file containing certificate authority certificates to use in verifying a presented server certificate. If omitted, the proxy will not verify the server's certificate. Should be empty if mode is `ISTIO_MUTUAL`.",
              type: "string",
              format: "string",
            },
            credentialName: {
              description:
                "The name of the secret that holds the TLS certs for the client including the CA certificates. Applicable only on Kubernetes. Secret must exist in the same namespace with the proxy using the certificates. The secret (of type `generic`)should contain the following keys and values: `key: \u003cprivateKey\u003e`, `cert: \u003cserverCert\u003e`, `cacert: \u003cCACertificate\u003e`. Secret of type tls for client certificates along with ca.crt key for CA certificates is also supported. Only one of client certificates and CA certificate or credentialName can be specified.",
              type: "string",
              format: "string",
            },
            subjectAltNames: {
              description:
                "A list of alternate names to verify the subject identity in the certificate. If specified, the proxy will verify that the server certificate's subject alt name matches one of the specified values. If specified, this list overrides the value of subject_alt_names from the ServiceEntry.",
              type: "array",
              items: {
                type: "string",
                format: "string",
              },
            },
            sni: {
              description:
                "SNI string to present to the server during TLS handshake.",
              type: "string",
              format: "string",
            },
          },
        },
        "istio.networking.v1alpha3.ConnectionPoolSettings.TCPSettings.TcpKeepalive": {
          description:
            "If set then set SO_KEEPALIVE on the socket to enable TCP Keepalives.",
          type: "object",
          properties: {
            time: {
              description:
                "The time duration a connection needs to be idle before keep-alive probes start being sent. Default is to use the OS level configuration (unless overridden, Linux defaults to 7200s (ie 2 hours.)",
              type: "string",
            },
            probes: {
              description:
                "Maximum number of keepalive probes to send without response before deciding the connection is dead. Default is to use the OS level configuration (unless overridden, Linux defaults to 9.)",
              type: "integer",
            },
            interval: {
              description:
                "The time duration between keep-alive probes. Default is to use the OS level configuration (unless overridden, Linux defaults to 75s.)",
              type: "string",
            },
          },
        },
        "istio.networking.v1alpha3.LocalityLoadBalancerSetting": {
          description:
            "Locality based load balancing distribution or failover settings.",
          type: "object",
          properties: {
            distribute: {
              description:
                "Optional: only one of distribute or failover can be set. Explicitly specify loadbalancing weight across different zones and geographical locations. Refer to [Locality weighted load balancing](https://www.envoyproxy.io/docs/envoy/latest/intro/arch_overview/upstream/load_balancing/locality_weight) If empty, the locality weight is set according to the endpoints number within it.",
              type: "array",
              items: {
                $ref:
                  "#/components/schemas/istio.networking.v1alpha3.LocalityLoadBalancerSetting.Distribute",
              },
            },
            failover: {
              description:
                "Optional: only failover or distribute can be set. Explicitly specify the region traffic will land on when endpoints in local region becomes unhealthy. Should be used together with OutlierDetection to detect unhealthy endpoints. Note: if no OutlierDetection specified, this will not take effect.",
              type: "array",
              items: {
                $ref:
                  "#/components/schemas/istio.networking.v1alpha3.LocalityLoadBalancerSetting.Failover",
              },
            },
            enabled: {
              description:
                "enable locality load balancing, this is DestinationRule-level and will override mesh wide settings in entirety. e.g. true means that turn on locality load balancing for this DestinationRule no matter what mesh wide settings is.",
              type: "boolean",
              nullable: true,
            },
          },
        },
        "istio.networking.v1alpha3.ClientTLSSettings.TLSmode": {
          description:
            "Indicates whether connections to this port should be secured using TLS. The value of this field determines how TLS is enforced.",
          type: "string",
          enum: ["DISABLE", "SIMPLE", "MUTUAL", "ISTIO_MUTUAL"],
        },
        "istio.networking.v1alpha3.LocalityLoadBalancerSetting.Distribute": {
          type: "object",
          properties: {
            from: {
              description:
                "Originating locality, '/' separated, e.g. 'region/zone/sub_zone'.",
              type: "string",
              format: "string",
            },
            to: {
              description:
                "Map of upstream localities to traffic distribution weights. The sum of all weights should be == 100. Any locality not assigned a weight will receive no traffic.",
              type: "object",
              additionalProperties: {
                type: "integer",
              },
            },
          },
        },
        "istio.networking.v1alpha3.LocalityLoadBalancerSetting.Failover": {
          type: "object",
          properties: {
            from: {
              description: "Originating region.",
              type: "string",
              format: "string",
            },
            to: {
              description:
                "Destination region the traffic will fail over to when endpoints in the 'from' region becomes unhealthy.",
              type: "string",
              format: "string",
            },
          },
        },
      },
    },
  },
  {
    openapi: "3.0.0",
    info: {
      title: "",
      version: "v1alpha1",
    },
    components: {
      schemas: {
        "istio.authentication.v1alpha1.StringMatch": {
          description:
            "Describes how to match a given string. Match is case-sensitive.",
          type: "object",
          oneOf: [
            {
              not: {
                anyOf: [
                  {
                    required: ["exact"],
                    properties: {
                      exact: {
                        description: "exact string match.",
                        type: "string",
                        format: "string",
                      },
                    },
                  },
                  {
                    required: ["prefix"],
                    properties: {
                      prefix: {
                        description: "prefix-based match.",
                        type: "string",
                        format: "string",
                      },
                    },
                  },
                  {
                    required: ["suffix"],
                    properties: {
                      suffix: {
                        description: "suffix-based match.",
                        type: "string",
                        format: "string",
                      },
                    },
                  },
                  {
                    required: ["regex"],
                    properties: {
                      regex: {
                        description:
                          "RE2 style regex-based match (https://github.com/google/re2/wiki/Syntax).",
                        type: "string",
                        format: "string",
                      },
                    },
                  },
                ],
              },
            },
            {
              required: ["exact"],
              properties: {
                exact: {
                  description: "exact string match.",
                  type: "string",
                  format: "string",
                },
              },
            },
            {
              required: ["prefix"],
              properties: {
                prefix: {
                  description: "prefix-based match.",
                  type: "string",
                  format: "string",
                },
              },
            },
            {
              required: ["suffix"],
              properties: {
                suffix: {
                  description: "suffix-based match.",
                  type: "string",
                  format: "string",
                },
              },
            },
            {
              required: ["regex"],
              properties: {
                regex: {
                  description:
                    "RE2 style regex-based match (https://github.com/google/re2/wiki/Syntax).",
                  type: "string",
                  format: "string",
                },
              },
            },
          ],
        },
        "istio.authentication.v1alpha1.MutualTls": {
          description:
            "Deprecated. Please use security/v1beta1/PeerAuthentication instead. TLS authentication params.",
          type: "object",
          properties: {
            allowTls: {
              description:
                "Deprecated. Please use mode = PERMISSIVE instead. If set, will translate to `TLS_PERMISSIVE` mode. Set this flag to true to allow regular TLS (i.e without client x509 certificate). If request carries client certificate, identity will be extracted and used (set to peer identity). Otherwise, peer identity will be left unset. When the flag is false (default), request must have client certificate.",
              type: "boolean",
              deprecated: true,
            },
            mode: {
              $ref:
                "#/components/schemas/istio.authentication.v1alpha1.MutualTls.Mode",
            },
          },
        },
        "istio.authentication.v1alpha1.MutualTls.Mode": {
          description: "Defines the acceptable connection TLS mode.",
          type: "string",
          enum: ["STRICT", "PERMISSIVE"],
        },
        "istio.authentication.v1alpha1.Jwt": {
          description:
            "Deprecated. Please use security/v1beta1/RequestAuthentication instead. JSON Web Token (JWT) token format for authentication as defined by [RFC 7519](https://tools.ietf.org/html/rfc7519). See [OAuth 2.0](https://tools.ietf.org/html/rfc6749) and [OIDC 1.0](http://openid.net/connect) for how this is used in the whole authentication flow.",
          type: "object",
          properties: {
            issuer: {
              description:
                "Identifies the issuer that issued the JWT. See [issuer](https://tools.ietf.org/html/rfc7519#section-4.1.1) Usually a URL or an email address.",
              type: "string",
              format: "string",
            },
            audiences: {
              description:
                "The list of JWT [audiences](https://tools.ietf.org/html/rfc7519#section-4.1.3). that are allowed to access. A JWT containing any of these audiences will be accepted.",
              type: "array",
              items: {
                type: "string",
                format: "string",
              },
            },
            jwksUri: {
              description:
                "URL of the provider's public key set to validate signature of the JWT. See [OpenID Discovery](https://openid.net/specs/openid-connect-discovery-1_0.html#ProviderMetadata).",
              type: "string",
              format: "string",
            },
            jwks: {
              description:
                "JSON Web Key Set of public keys to validate signature of the JWT. See https://auth0.com/docs/jwks.",
              type: "string",
              format: "string",
            },
            jwtHeaders: {
              description:
                "JWT is sent in a request header. `header` represents the header name.",
              type: "array",
              items: {
                type: "string",
                format: "string",
              },
            },
            jwtParams: {
              description:
                "JWT is sent in a query parameter. `query` represents the query parameter name.",
              type: "array",
              items: {
                type: "string",
                format: "string",
              },
            },
            triggerRules: {
              description:
                "List of trigger rules to decide if this JWT should be used to validate the request. The JWT validation happens if any one of the rules matched. If the list is not empty and none of the rules matched, authentication will skip the JWT validation. Leave this empty to always trigger the JWT validation.",
              type: "array",
              items: {
                $ref:
                  "#/components/schemas/istio.authentication.v1alpha1.Jwt.TriggerRule",
              },
            },
          },
        },
        "istio.authentication.v1alpha1.Jwt.TriggerRule": {
          description:
            "Trigger rule to match against a request. The trigger rule is satisfied if and only if both rules, excluded_paths and include_paths are satisfied.",
          type: "object",
          properties: {
            excludedPaths: {
              description:
                "List of paths to be excluded from the request. The rule is satisfied if request path does not match to any of the path in this list.",
              type: "array",
              items: {
                $ref:
                  "#/components/schemas/istio.authentication.v1alpha1.StringMatch",
              },
            },
            includedPaths: {
              description:
                "List of paths that the request must include. If the list is not empty, the rule is satisfied if request path matches at least one of the path in the list. If the list is empty, the rule is ignored, in other words the rule is always satisfied.",
              type: "array",
              items: {
                $ref:
                  "#/components/schemas/istio.authentication.v1alpha1.StringMatch",
              },
            },
          },
        },
        "istio.authentication.v1alpha1.PeerAuthenticationMethod": {
          description:
            'Deprecated. Please use security/v1beta1/PeerAuthentication instead. PeerAuthenticationMethod defines one particular type of authentication. Only mTLS is supported at the moment. The type can be progammatically determine by checking the type of the "params" field.',
          type: "object",
          oneOf: [
            {
              not: {
                anyOf: [
                  {
                    required: ["mtls"],
                    properties: {
                      mtls: {
                        $ref:
                          "#/components/schemas/istio.authentication.v1alpha1.MutualTls",
                      },
                    },
                  },
                  {
                    required: ["jwt"],
                    properties: {
                      jwt: {
                        $ref:
                          "#/components/schemas/istio.authentication.v1alpha1.Jwt",
                        deprecated: true,
                      },
                    },
                  },
                ],
              },
            },
            {
              required: ["mtls"],
              properties: {
                mtls: {
                  $ref:
                    "#/components/schemas/istio.authentication.v1alpha1.MutualTls",
                },
              },
            },
            {
              required: ["jwt"],
              properties: {
                jwt: {
                  $ref:
                    "#/components/schemas/istio.authentication.v1alpha1.Jwt",
                  deprecated: true,
                },
              },
            },
          ],
        },
        "istio.authentication.v1alpha1.OriginAuthenticationMethod": {
          description:
            "Deprecated. Please use security/v1beta1/RequestAuthentication instead. OriginAuthenticationMethod defines authentication method/params for origin authentication. Origin could be end-user, device, delegate service etc. Currently, only JWT is supported for origin authentication.",
          type: "object",
          properties: {
            jwt: {
              $ref: "#/components/schemas/istio.authentication.v1alpha1.Jwt",
            },
          },
        },
        "istio.authentication.v1alpha1.PrincipalBinding": {
          description:
            "Deprecated. When using security/v1beta1/RequestAuthentication, the request principal always comes from request authentication (i.e JWT). Associates authentication with request principal.",
          type: "string",
          enum: ["USE_PEER", "USE_ORIGIN"],
        },
        "istio.authentication.v1alpha1.Policy": {
          description:
            "Policy defines what authentication methods can be accepted on workload(s), and if authenticated, which method/certificate will set the request principal (i.e request.auth.principal attribute).",
          type: "object",
          properties: {
            targets: {
              description:
                "Deprecated. Only mesh-level and namespace-level policies are supported. List rules to select workloads that the policy should be applied on. If empty, policy will be used on all workloads in the same namespace.",
              type: "array",
              items: {
                $ref:
                  "#/components/schemas/istio.authentication.v1alpha1.TargetSelector",
              },
              deprecated: true,
            },
            peers: {
              description:
                "Deprecated. Please use security/v1beta1/PeerAuthentication instead. List of authentication methods that can be used for peer authentication. They will be evaluated in order; the first validate one will be used to set peer identity (source.user) and other peer attributes. If none of these methods pass, request will be rejected with authentication failed error (401). Leave the list empty if peer authentication is not required",
              type: "array",
              items: {
                $ref:
                  "#/components/schemas/istio.authentication.v1alpha1.PeerAuthenticationMethod",
              },
            },
            peerIsOptional: {
              description:
                "Deprecated. Should set mTLS to PERMISSIVE instead. Set this flag to true to accept request (for peer authentication perspective), even when none of the peer authentication methods defined above satisfied. Typically, this is used to delay the rejection decision to next layer (e.g authorization). This flag is ignored if no authentication defined for peer (peers field is empty).",
              type: "boolean",
              deprecated: true,
            },
            origins: {
              description:
                "Deprecated. Please use security/v1beta1/RequestAuthentication instead. List of authentication methods that can be used for origin authentication. Similar to peers, these will be evaluated in order; the first validate one will be used to set origin identity and attributes (i.e request.auth.user, request.auth.issuer etc). If none of these methods pass, request will be rejected with authentication failed error (401). A method may be skipped, depends on its trigger rule. If all of these methods are skipped, origin authentication will be ignored, as if it is not defined. Leave the list empty if origin authentication is not required.",
              type: "array",
              items: {
                $ref:
                  "#/components/schemas/istio.authentication.v1alpha1.OriginAuthenticationMethod",
              },
              deprecated: true,
            },
            originIsOptional: {
              description:
                "Deprecated. Please use security/v1beta1/RequestAuthentication instead. Set this flag to true to accept request (for origin authentication perspective), even when none of the origin authentication methods defined above satisfied. Typically, this is used to delay the rejection decision to next layer (e.g authorization). This flag is ignored if no authentication defined for origin (origins field is empty).",
              type: "boolean",
              deprecated: true,
            },
            principalBinding: {
              $ref:
                "#/components/schemas/istio.authentication.v1alpha1.PrincipalBinding",
              deprecated: true,
            },
          },
        },
        "istio.authentication.v1alpha1.TargetSelector": {
          description:
            "Deprecated. Only support mesh and namespace level policy in the future. TargetSelector defines a matching rule to a workload. A workload is selected if it is associated with the service name and service port(s) specified in the selector rule.",
          type: "object",
          properties: {
            name: {
              description:
                "The name must be a short name from the service registry. The fully qualified domain name will be resolved in a platform specific manner.",
              type: "string",
              format: "string",
            },
            ports: {
              description:
                "Specifies the ports. Note that this is the port(s) exposed by the service, not workload instance ports. For example, if a service is defined as below, then `8000` should be used, not `9000`. ```yaml kind: Service metadata: ... spec: ports: - name: http port: 8000 targetPort: 9000 selector: app: backend ``` Leave empty to match all ports that are exposed.",
              type: "array",
              items: {
                $ref:
                  "#/components/schemas/istio.authentication.v1alpha1.PortSelector",
              },
            },
          },
        },
        "istio.authentication.v1alpha1.PortSelector": {
          description:
            "Deprecated. Only support mesh and namespace level policy in the future. PortSelector specifies the name or number of a port to be used for matching targets for authentication policy. This is copied from networking API to avoid dependency.",
          type: "object",
          oneOf: [
            {
              not: {
                anyOf: [
                  {
                    required: ["number"],
                    properties: {
                      number: {
                        description: "Valid port number",
                        type: "integer",
                      },
                    },
                  },
                  {
                    required: ["name"],
                    properties: {
                      name: {
                        description: "Port name",
                        type: "string",
                        format: "string",
                      },
                    },
                  },
                ],
              },
            },
            {
              required: ["number"],
              properties: {
                number: {
                  description: "Valid port number",
                  type: "integer",
                },
              },
            },
            {
              required: ["name"],
              properties: {
                name: {
                  description: "Port name",
                  type: "string",
                  format: "string",
                },
              },
            },
          ],
        },
      },
    },
  },
  {
    openapi: "3.0.0",
    info: {
      title:
        "Describes the rules used to configure Mixer's policy and telemetry features.",
      version: "v1beta1",
    },
    components: {
      schemas: {
        "istio.policy.v1beta1.Duration": {
          description:
            "An instance field of type Duration denotes that the expression for the field must evaluate to [ValueType.DURATION][istio.policy.v1beta1.ValueType.DURATION]",
          type: "object",
          properties: {
            value: {
              description: "Duration encoded as google.protobuf.Duration.",
              type: "string",
            },
          },
        },
        "istio.policy.v1beta1.Value": {
          description:
            'An instance field of type Value denotes that the expression for the field is of dynamic type and can evaluate to any [ValueType][istio.policy.v1beta1.ValueType] enum values. For example, when authoring an instance configuration for a template that has a field `data` of type `istio.policy.v1beta1.Value`, both of the following expressions are valid `data: source.ip | ip("0.0.0.0")`, `data: request.id | ""`; the resulting type is either ValueType.IP_ADDRESS or ValueType.STRING for the two cases respectively.',
          type: "object",
          oneOf: [
            {
              not: {
                anyOf: [
                  {
                    required: ["stringValue"],
                    properties: {
                      stringValue: {
                        description: "Used for values of type STRING",
                        type: "string",
                        format: "string",
                      },
                    },
                  },
                  {
                    required: ["int64Value"],
                    properties: {
                      int64Value: {
                        description: "Used for values of type INT64",
                        type: "integer",
                        format: "int64",
                      },
                    },
                  },
                  {
                    required: ["doubleValue"],
                    properties: {
                      doubleValue: {
                        description: "Used for values of type DOUBLE",
                        type: "number",
                        format: "double",
                      },
                    },
                  },
                  {
                    required: ["boolValue"],
                    properties: {
                      boolValue: {
                        description: "Used for values of type BOOL",
                        type: "boolean",
                      },
                    },
                  },
                  {
                    required: ["ipAddressValue"],
                    properties: {
                      ipAddressValue: {
                        $ref:
                          "#/components/schemas/istio.policy.v1beta1.IPAddress",
                      },
                    },
                  },
                  {
                    required: ["timestampValue"],
                    properties: {
                      timestampValue: {
                        $ref:
                          "#/components/schemas/istio.policy.v1beta1.TimeStamp",
                      },
                    },
                  },
                  {
                    required: ["durationValue"],
                    properties: {
                      durationValue: {
                        $ref:
                          "#/components/schemas/istio.policy.v1beta1.Duration",
                      },
                    },
                  },
                  {
                    required: ["emailAddressValue"],
                    properties: {
                      emailAddressValue: {
                        $ref:
                          "#/components/schemas/istio.policy.v1beta1.EmailAddress",
                      },
                    },
                  },
                  {
                    required: ["dnsNameValue"],
                    properties: {
                      dnsNameValue: {
                        $ref:
                          "#/components/schemas/istio.policy.v1beta1.DNSName",
                      },
                    },
                  },
                  {
                    required: ["uriValue"],
                    properties: {
                      uriValue: {
                        $ref: "#/components/schemas/istio.policy.v1beta1.Uri",
                      },
                    },
                  },
                  {
                    required: ["stringMapValue"],
                    properties: {
                      stringMapValue: {
                        $ref:
                          "#/components/schemas/istio.policy.v1beta1.StringMap",
                      },
                    },
                  },
                ],
              },
            },
            {
              required: ["stringValue"],
              properties: {
                stringValue: {
                  description: "Used for values of type STRING",
                  type: "string",
                  format: "string",
                },
              },
            },
            {
              required: ["int64Value"],
              properties: {
                int64Value: {
                  description: "Used for values of type INT64",
                  type: "integer",
                  format: "int64",
                },
              },
            },
            {
              required: ["doubleValue"],
              properties: {
                doubleValue: {
                  description: "Used for values of type DOUBLE",
                  type: "number",
                  format: "double",
                },
              },
            },
            {
              required: ["boolValue"],
              properties: {
                boolValue: {
                  description: "Used for values of type BOOL",
                  type: "boolean",
                },
              },
            },
            {
              required: ["ipAddressValue"],
              properties: {
                ipAddressValue: {
                  $ref: "#/components/schemas/istio.policy.v1beta1.IPAddress",
                },
              },
            },
            {
              required: ["timestampValue"],
              properties: {
                timestampValue: {
                  $ref: "#/components/schemas/istio.policy.v1beta1.TimeStamp",
                },
              },
            },
            {
              required: ["durationValue"],
              properties: {
                durationValue: {
                  $ref: "#/components/schemas/istio.policy.v1beta1.Duration",
                },
              },
            },
            {
              required: ["emailAddressValue"],
              properties: {
                emailAddressValue: {
                  $ref:
                    "#/components/schemas/istio.policy.v1beta1.EmailAddress",
                },
              },
            },
            {
              required: ["dnsNameValue"],
              properties: {
                dnsNameValue: {
                  $ref: "#/components/schemas/istio.policy.v1beta1.DNSName",
                },
              },
            },
            {
              required: ["uriValue"],
              properties: {
                uriValue: {
                  $ref: "#/components/schemas/istio.policy.v1beta1.Uri",
                },
              },
            },
            {
              required: ["stringMapValue"],
              properties: {
                stringMapValue: {
                  $ref: "#/components/schemas/istio.policy.v1beta1.StringMap",
                },
              },
            },
          ],
        },
        "istio.policy.v1beta1.AttributeManifest": {
          description:
            "AttributeManifest describes a set of Attributes produced by some component of an Istio deployment.",
          type: "object",
          properties: {
            name: {
              description:
                "Name of the component producing these attributes. This can be the proxy (with the canonical name `istio-proxy`) or the name of an `attributes` kind adapter in Mixer.",
              type: "string",
              format: "string",
            },
            revision: {
              description: "The revision of this document. Assigned by server.",
              type: "string",
              format: "string",
            },
            attributes: {
              description:
                "The set of attributes this Istio component will be responsible for producing at runtime. We map from attribute name to the attribute's specification. The name of an attribute, which is how attributes are referred to in aspect configuration, must conform to: Name = IDENT { SEPARATOR IDENT };",
              type: "object",
              additionalProperties: {
                $ref:
                  "#/components/schemas/istio.policy.v1beta1.AttributeManifest.AttributeInfo",
              },
            },
          },
        },
        "istio.policy.v1beta1.AttributeManifest.AttributeInfo": {
          description:
            "AttributeInfo describes the schema of an Istio `Attribute`.",
          type: "object",
          properties: {
            description: {
              description:
                "A human-readable description of the attribute's purpose.",
              type: "string",
              format: "string",
            },
            valueType: {
              $ref: "#/components/schemas/istio.policy.v1beta1.ValueType",
            },
          },
        },
        "istio.policy.v1beta1.ValueType": {
          description:
            "ValueType describes the types that values in the Istio system can take. These are used to describe the type of Attributes at run time, describe the type of the result of evaluating an expression, and to describe the runtime type of fields of other descriptors.",
          type: "string",
          enum: [
            "VALUE_TYPE_UNSPECIFIED",
            "STRING",
            "INT64",
            "DOUBLE",
            "BOOL",
            "TIMESTAMP",
            "IP_ADDRESS",
            "EMAIL_ADDRESS",
            "URI",
            "DNS_NAME",
            "DURATION",
            "STRING_MAP",
          ],
        },
        "istio.policy.v1beta1.Rule": {
          description:
            "A Rule is a selector and a set of intentions to be executed when the selector is `true`",
          type: "object",
          properties: {
            match: {
              description:
                "Match is an attribute based predicate. When Mixer receives a request it evaluates the match expression and executes all the associated `actions` if the match evaluates to true.",
              type: "string",
              format: "string",
            },
            actions: {
              description:
                "The actions that will be executed when match evaluates to `true`.",
              type: "array",
              items: {
                $ref: "#/components/schemas/istio.policy.v1beta1.Action",
              },
            },
            requestHeaderOperations: {
              description:
                "Templatized operations on the request headers using values produced by the rule actions. Require the check action result to be OK.",
              type: "array",
              items: {
                $ref:
                  "#/components/schemas/istio.policy.v1beta1.Rule.HeaderOperationTemplate",
              },
            },
            responseHeaderOperations: {
              description:
                "Templatized operations on the response headers using values produced by the rule actions. Require the check action result to be OK.",
              type: "array",
              items: {
                $ref:
                  "#/components/schemas/istio.policy.v1beta1.Rule.HeaderOperationTemplate",
              },
            },
            sampling: {
              $ref: "#/components/schemas/istio.policy.v1beta1.Sampling",
            },
          },
        },
        "istio.policy.v1beta1.Action": {
          description:
            "Action describes which [Handler][istio.policy.v1beta1.Handler] to invoke and what data to pass to it for processing.",
          type: "object",
          properties: {
            name: {
              description: "A handle to refer to the results of the action.",
              type: "string",
              format: "string",
            },
            handler: {
              description:
                "Fully qualified name of the handler to invoke. Must match the `name` of a [Handler][istio.policy.v1beta1.Handler.name].",
              type: "string",
              format: "string",
            },
            instances: {
              description:
                "Each value must match the fully qualified name of the [Instance][istio.policy.v1beta1.Instance.name]s. Referenced instances are evaluated by resolving the attributes/literals for all the fields. The constructed objects are then passed to the `handler` referenced within this action.",
              type: "array",
              items: {
                type: "string",
                format: "string",
              },
            },
          },
        },
        "istio.policy.v1beta1.Rule.HeaderOperationTemplate": {
          description:
            "A template for an HTTP header manipulation. Values in the template are expressions that may reference action outputs by name. For example, if an action `x` produces an output with a field `f`, then the header value expressions may use attribute `x.output.f` to reference the field value: ```yaml request_header_operations: - name: x-istio-header values: - x.output.f ```",
          type: "object",
          properties: {
            name: {
              description: "Header name literal value.",
              type: "string",
              format: "string",
            },
            values: {
              description: "Header value expressions.",
              type: "array",
              items: {
                type: "string",
                format: "string",
              },
            },
            operation: {
              $ref:
                "#/components/schemas/istio.policy.v1beta1.Rule.HeaderOperationTemplate.Operation",
            },
          },
        },
        "istio.policy.v1beta1.Sampling": {
          description:
            "Sampling provides configuration of sampling strategies for Rule actions. Multiple sampling strategies are supported. When multiple strategies are configured, a request must be selected by all configured sampling strategies.",
          type: "object",
          properties: {
            random: {
              $ref: "#/components/schemas/istio.policy.v1beta1.RandomSampling",
            },
            rateLimit: {
              $ref:
                "#/components/schemas/istio.policy.v1beta1.RateLimitSampling",
            },
          },
        },
        "istio.policy.v1beta1.Rule.HeaderOperationTemplate.Operation": {
          description: "Header operation type.",
          type: "string",
          enum: ["REPLACE", "REMOVE", "APPEND"],
        },
        "istio.policy.v1beta1.Instance": {
          description:
            "An Instance tells Mixer how to create instances for particular template.",
          type: "object",
          properties: {
            name: {
              description: "The name of this instance",
              type: "string",
              format: "string",
            },
            compiledTemplate: {
              description:
                "The name of the compiled in template this instance creates instances for. For referencing non compiled-in templates, use the `template` field instead.",
              type: "string",
              format: "string",
            },
            template: {
              description:
                "The name of the template this instance creates instances for. For referencing compiled-in templates, use the `compiled_template` field instead.",
              type: "string",
              format: "string",
            },
            params: {
              description:
                "Depends on referenced template. Struct representation of a proto defined by the template; this varies depending on the value of field `template`.",
              type: "object",
            },
            attributeBindings: {
              description:
                'Defines attribute bindings to map the output of attribute-producing adapters back into the attribute space. The variable `output` refers to the output template instance produced by the adapter. The following example derives `source.namespace` from `source.uid` in the context of Kubernetes: ```yaml params: # Pass the required attribute data to the adapter source_uid: source.uid | "" attribute_bindings: # Fill the new attributes from the adapter produced output source.namespace: output.source_namespace ```',
              type: "object",
              additionalProperties: {
                type: "string",
                format: "string",
              },
            },
          },
        },
        "istio.policy.v1beta1.Handler": {
          description:
            "Handler allows the operator to configure a specific adapter implementation. Each adapter implementation defines its own `params` proto.",
          type: "object",
          properties: {
            name: {
              description:
                "Must be unique in the entire Mixer configuration. Used by [Actions][istio.policy.v1beta1.Action.handler] to refer to this handler.",
              type: "string",
              format: "string",
            },
            params: {
              description:
                "Depends on adapter implementation. Struct representation of a proto defined by the adapter implementation; this varies depending on the value of field `adapter`.",
              type: "object",
            },
            compiledAdapter: {
              description:
                "The name of the compiled in adapter this handler instantiates. For referencing non compiled-in adapters, use the `adapter` field instead.",
              type: "string",
              format: "string",
            },
            adapter: {
              description:
                "The name of a specific adapter implementation. For referencing compiled-in adapters, use the `compiled_adapter` field instead.",
              type: "string",
              format: "string",
            },
            connection: {
              $ref: "#/components/schemas/istio.policy.v1beta1.Connection",
            },
          },
        },
        "istio.policy.v1beta1.Connection": {
          description:
            "Connection allows the operator to specify the endpoint for out-of-process infrastructure backend. Connection is part of the handler custom resource and is specified alongside adapter specific configuration.",
          type: "object",
          properties: {
            address: {
              description: "The address of the backend.",
              type: "string",
              format: "string",
            },
            timeout: {
              description: "Timeout for remote calls to the backend.",
              type: "string",
            },
            authentication: {
              $ref: "#/components/schemas/istio.policy.v1beta1.Authentication",
            },
          },
        },
        "istio.policy.v1beta1.Authentication": {
          description:
            "Authentication allows the operator to specify the authentication of connections to out-of-process infrastructure backend.",
          type: "object",
          oneOf: [
            {
              not: {
                anyOf: [
                  {
                    required: ["tls"],
                    properties: {
                      tls: {
                        $ref: "#/components/schemas/istio.policy.v1beta1.Tls",
                      },
                    },
                  },
                  {
                    required: ["mutual"],
                    properties: {
                      mutual: {
                        $ref:
                          "#/components/schemas/istio.policy.v1beta1.Mutual",
                      },
                    },
                  },
                ],
              },
            },
            {
              required: ["tls"],
              properties: {
                tls: {
                  $ref: "#/components/schemas/istio.policy.v1beta1.Tls",
                },
              },
            },
            {
              required: ["mutual"],
              properties: {
                mutual: {
                  $ref: "#/components/schemas/istio.policy.v1beta1.Mutual",
                },
              },
            },
          ],
        },
        "istio.policy.v1beta1.RandomSampling": {
          description:
            "RandomSampling will filter based on the comparison of a randomly-generated value against the threshold provided.",
          type: "object",
          properties: {
            attributeExpression: {
              description:
                "Specifies an attribute expression to use to override the numerator in the `percent_sampled` field. If this value is set, but no value is found OR if that value is not a numeric value, then the derived sampling rate will be 0 (meaning no `Action`s are executed for a `Rule`).",
              type: "string",
              format: "string",
            },
            percentSampled: {
              $ref:
                "#/components/schemas/istio.policy.v1beta1.FractionalPercent",
            },
            useIndependentRandomness: {
              description:
                "By default sampling will be based on the value of the request header `x-request-id`. This behavior will cause consistent sampling across `Rule`s and for the full trace of a request through a mesh (across hosts). If that value is not present and/or `use_independent_randomness` is set to true, the sampling will be done based on the value of attribute specified in `attribute_epxression`. If that attribute does not exist, the system will behave as if the sampling rate was 0 (meaning no `Action`s are executed for a `Rule`).",
              type: "boolean",
            },
          },
        },
        "istio.policy.v1beta1.RateLimitSampling": {
          description:
            "RateLimitSampling provides the ability to limit the number of Rule action executions that occur over a period of time.",
          type: "object",
          properties: {
            samplingDuration: {
              description: "Window in which to enforce the sampling rate.",
              type: "string",
            },
            maxUnsampledEntries: {
              description:
                "Number of entries to allow during the `sampling_duration` before sampling is enforced.",
              type: "integer",
              format: "int64",
            },
            samplingRate: {
              description:
                "The rate at which to sample entries once the unsampled limit has been reached. Sampling will be enforced as 1 per every `sampling_rate` entries allowed.",
              type: "integer",
              format: "int64",
            },
          },
        },
        "istio.policy.v1beta1.FractionalPercent": {
          description:
            "A fractional percentage is used in cases in which for performance reasons performing floating point to integer conversions during randomness calculations is undesirable. The message includes both a numerator and denominator that together determine the final fractional value.",
          type: "object",
          properties: {
            numerator: {
              description: "Specifies the numerator. Defaults to 0.",
              type: "integer",
            },
            denominator: {
              $ref:
                "#/components/schemas/istio.policy.v1beta1.FractionalPercent.DenominatorType",
            },
          },
        },
        "istio.policy.v1beta1.FractionalPercent.DenominatorType": {
          description:
            "Fraction percentages support several fixed denominator values.",
          type: "string",
          enum: ["HUNDRED", "TEN_THOUSAND"],
        },
        "istio.policy.v1beta1.Tls": {
          description:
            "Tls let operator specify client authentication setting when TLS is used for connection to the backend.",
          type: "object",
          properties: {
            caCertificates: {
              description:
                "The path to the file holding additional CA certificates to well known public certs.",
              type: "string",
              format: "string",
            },
            serverName: {
              description:
                "Used to configure mixer TLS client to verify the hostname on the returned certificates. It is also included in the client's handshake to support SNI.",
              type: "string",
              format: "string",
            },
          },
          allOf: [
            {
              oneOf: [
                {
                  not: {
                    anyOf: [
                      {
                        required: ["tokenPath"],
                        properties: {
                          tokenPath: {
                            description:
                              "The path to the file holding the auth token (password, jwt token, api key, etc).",
                            type: "string",
                            format: "string",
                          },
                        },
                      },
                      {
                        required: ["oauth"],
                        properties: {
                          oauth: {
                            $ref:
                              "#/components/schemas/istio.policy.v1beta1.OAuth",
                          },
                        },
                      },
                    ],
                  },
                },
                {
                  required: ["tokenPath"],
                  properties: {
                    tokenPath: {
                      description:
                        "The path to the file holding the auth token (password, jwt token, api key, etc).",
                      type: "string",
                      format: "string",
                    },
                  },
                },
                {
                  required: ["oauth"],
                  properties: {
                    oauth: {
                      $ref: "#/components/schemas/istio.policy.v1beta1.OAuth",
                    },
                  },
                },
              ],
            },
            {
              oneOf: [
                {
                  not: {
                    anyOf: [
                      {
                        required: ["authHeader"],
                        properties: {
                          authHeader: {
                            $ref:
                              "#/components/schemas/istio.policy.v1beta1.Tls.AuthHeader",
                          },
                        },
                      },
                      {
                        required: ["customHeader"],
                        properties: {
                          customHeader: {
                            description:
                              "Customized header key to hold access token, e.g. x-api-key. Token will be passed as what it is.",
                            type: "string",
                            format: "string",
                          },
                        },
                      },
                    ],
                  },
                },
                {
                  required: ["authHeader"],
                  properties: {
                    authHeader: {
                      $ref:
                        "#/components/schemas/istio.policy.v1beta1.Tls.AuthHeader",
                    },
                  },
                },
                {
                  required: ["customHeader"],
                  properties: {
                    customHeader: {
                      description:
                        "Customized header key to hold access token, e.g. x-api-key. Token will be passed as what it is.",
                      type: "string",
                      format: "string",
                    },
                  },
                },
              ],
            },
          ],
        },
        "istio.policy.v1beta1.Mutual": {
          description:
            "Mutual let operator specify TLS configuration for Mixer as client if mutual TLS is used to secure connection to adapter backend.",
          type: "object",
          properties: {
            caCertificates: {
              description:
                "The path to the file holding additional CA certificates that are needed to verify the presented adapter certificates. By default Mixer should already include Istio CA certificates and system certificates in cert pool.",
              type: "string",
              format: "string",
            },
            serverName: {
              description:
                "Used to configure mixer mutual TLS client to supply server name for SNI. It is not used to verify the hostname of the peer certificate, since Istio verifies whitelisted SAN fields in mutual TLS.",
              type: "string",
              format: "string",
            },
            privateKey: {
              description:
                "The path to the file holding the private key for mutual TLS. If omitted, the default Mixer private key will be used.",
              type: "string",
              format: "string",
            },
            clientCertificate: {
              description:
                "The path to the file holding client certificate for mutual TLS. If omitted, the default Mixer certificates will be used.",
              type: "string",
              format: "string",
            },
          },
        },
        "istio.policy.v1beta1.OAuth": {
          description:
            "OAuth let operator specify config to fetch access token via oauth when using TLS for connection to the backend.",
          type: "object",
          properties: {
            clientId: {
              description: "OAuth client id for mixer.",
              type: "string",
              format: "string",
            },
            clientSecret: {
              description:
                "The path to the file holding the client secret for oauth.",
              type: "string",
              format: "string",
            },
            tokenUrl: {
              description: "The Resource server's token endpoint URL.",
              type: "string",
              format: "string",
            },
            scopes: {
              description: "List of requested permissions.",
              type: "array",
              items: {
                type: "string",
                format: "string",
              },
            },
            endpointParams: {
              description:
                "Additional parameters for requests to the token endpoint.",
              type: "object",
              additionalProperties: {
                type: "string",
                format: "string",
              },
            },
          },
        },
        "istio.policy.v1beta1.Tls.AuthHeader": {
          description:
            "AuthHeader specifies how to pass access token with authorization header.",
          type: "string",
          enum: ["PLAIN", "BEARER"],
        },
        "istio.policy.v1beta1.DirectHttpResponse": {
          description:
            "Direct HTTP response for a client-facing error message which can be attached to an RPC error.",
          type: "object",
          properties: {
            body: {
              description: "HTTP response body.",
              type: "string",
              format: "string",
            },
            code: {
              $ref: "#/components/schemas/istio.policy.v1beta1.HttpStatusCode",
            },
            headers: {
              description: "HTTP response headers.",
              type: "object",
              additionalProperties: {
                type: "string",
                format: "string",
              },
            },
          },
        },
        "istio.policy.v1beta1.HttpStatusCode": {
          description:
            "HTTP response codes. For more details: http://www.iana.org/assignments/http-status-codes/http-status-codes.xhtml",
          type: "string",
          enum: [
            "Empty",
            "Continue",
            "OK",
            "Created",
            "Accepted",
            "NonAuthoritativeInformation",
            "NoContent",
            "ResetContent",
            "PartialContent",
            "MultiStatus",
            "AlreadyReported",
            "IMUsed",
            "MultipleChoices",
            "MovedPermanently",
            "Found",
            "SeeOther",
            "NotModified",
            "UseProxy",
            "TemporaryRedirect",
            "PermanentRedirect",
            "BadRequest",
            "Unauthorized",
            "PaymentRequired",
            "Forbidden",
            "NotFound",
            "MethodNotAllowed",
            "NotAcceptable",
            "ProxyAuthenticationRequired",
            "RequestTimeout",
            "Conflict",
            "Gone",
            "LengthRequired",
            "PreconditionFailed",
            "PayloadTooLarge",
            "URITooLong",
            "UnsupportedMediaType",
            "RangeNotSatisfiable",
            "ExpectationFailed",
            "MisdirectedRequest",
            "UnprocessableEntity",
            "Locked",
            "FailedDependency",
            "UpgradeRequired",
            "PreconditionRequired",
            "TooManyRequests",
            "RequestHeaderFieldsTooLarge",
            "InternalServerError",
            "NotImplemented",
            "BadGateway",
            "ServiceUnavailable",
            "GatewayTimeout",
            "HTTPVersionNotSupported",
            "VariantAlsoNegotiates",
            "InsufficientStorage",
            "LoopDetected",
            "NotExtended",
            "NetworkAuthenticationRequired",
          ],
        },
        "istio.policy.v1beta1.IPAddress": {
          description:
            "An instance field of type IPAddress denotes that the expression for the field must evaluate to [ValueType.IP_ADDRESS][istio.policy.v1beta1.ValueType.IP_ADDRESS]",
          type: "object",
          properties: {
            value: {
              description: "IPAddress encoded as bytes.",
              type: "string",
              format: "binary",
            },
          },
        },
        "istio.policy.v1beta1.TimeStamp": {
          description:
            "An instance field of type TimeStamp denotes that the expression for the field must evaluate to [ValueType.TIMESTAMP][istio.policy.v1beta1.ValueType.TIMESTAMP]",
          type: "object",
          properties: {
            value: {
              description: "TimeStamp encoded as google.protobuf.Timestamp.",
              type: "string",
              format: "dateTime",
            },
          },
        },
        "istio.policy.v1beta1.EmailAddress": {
          description:
            "DO NOT USE !! Under Development An instance field of type EmailAddress denotes that the expression for the field must evaluate to [ValueType.EMAIL_ADDRESS][istio.policy.v1beta1.ValueType.EMAIL_ADDRESS]",
          type: "object",
          properties: {
            value: {
              description: "EmailAddress encoded as string.",
              type: "string",
              format: "string",
            },
          },
        },
        "istio.policy.v1beta1.DNSName": {
          description:
            "An instance field of type DNSName denotes that the expression for the field must evaluate to [ValueType.DNS_NAME][istio.policy.v1beta1.ValueType.DNS_NAME]",
          type: "object",
          properties: {
            value: {
              description: "DNSName encoded as string.",
              type: "string",
              format: "string",
            },
          },
        },
        "istio.policy.v1beta1.Uri": {
          description:
            "DO NOT USE !! Under Development An instance field of type Uri denotes that the expression for the field must evaluate to [ValueType.URI][istio.policy.v1beta1.ValueType.URI]",
          type: "object",
          properties: {
            value: {
              description: "Uri encoded as string.",
              type: "string",
              format: "string",
            },
          },
        },
        "istio.policy.v1beta1.StringMap": {
          description:
            "An instance field of type StringMap denotes that the expression for the field must evaluate to [ValueType.STRING_MAP][istio.policy.v1beta1.ValueType.STRING_MAP]",
          type: "object",
          properties: {
            value: {
              description: "StringMap encoded as a map of strings",
              type: "object",
              additionalProperties: {
                type: "string",
                format: "string",
              },
            },
          },
        },
      },
    },
  },
  {
    openapi: "3.0.0",
    info: {
      title: "Configuration for access control on workloads.",
      version: "v1beta1",
    },
    components: {
      schemas: {
        "istio.security.v1beta1.AuthorizationPolicy": {
          description:
            "AuthorizationPolicy enables access control on workloads.",
          type: "object",
          properties: {
            selector: {
              $ref: "#/components/schemas/istio.type.v1beta1.WorkloadSelector",
            },
            rules: {
              description:
                "Optional. A list of rules to match the request. A match occurs when at least one rule matches the request.",
              type: "array",
              items: {
                $ref: "#/components/schemas/istio.security.v1beta1.Rule",
              },
            },
            action: {
              $ref:
                "#/components/schemas/istio.security.v1beta1.AuthorizationPolicy.Action",
            },
          },
        },
        "istio.security.v1beta1.Rule": {
          description:
            "Rule matches requests from a list of sources that perform a list of operations subject to a list of conditions. A match occurs when at least one source, operation and condition matches the request. An empty rule is always matched.",
          type: "object",
          properties: {
            from: {
              description: "Optional. from specifies the source of a request.",
              type: "array",
              items: {
                $ref: "#/components/schemas/istio.security.v1beta1.Rule.From",
              },
            },
            to: {
              description: "Optional. to specifies the operation of a request.",
              type: "array",
              items: {
                $ref: "#/components/schemas/istio.security.v1beta1.Rule.To",
              },
            },
            when: {
              description:
                "Optional. when specifies a list of additional conditions of a request.",
              type: "array",
              items: {
                $ref: "#/components/schemas/istio.security.v1beta1.Condition",
              },
            },
          },
        },
        "istio.security.v1beta1.AuthorizationPolicy.Action": {
          description: "Action specifies the operation to take.",
          type: "string",
          enum: ["ALLOW", "DENY"],
        },
        "istio.security.v1beta1.Rule.From": {
          description: "From includes a list or sources.",
          type: "object",
          properties: {
            source: {
              $ref: "#/components/schemas/istio.security.v1beta1.Source",
            },
          },
        },
        "istio.security.v1beta1.Rule.To": {
          description: "To includes a list or operations.",
          type: "object",
          properties: {
            operation: {
              $ref: "#/components/schemas/istio.security.v1beta1.Operation",
            },
          },
        },
        "istio.security.v1beta1.Condition": {
          description: "Condition specifies additional required attributes.",
          type: "object",
          properties: {
            key: {
              description:
                "The name of an Istio attribute. See the [full list of supported attributes](https://istio.io/docs/reference/config/security/conditions/).",
              type: "string",
              format: "string",
            },
            values: {
              description:
                "Optional. A list of allowed values for the attribute. Note: at least one of values or not_values must be set.",
              type: "array",
              items: {
                type: "string",
                format: "string",
              },
            },
            notValues: {
              description:
                "Optional. A list of negative match of values for the attribute. Note: at least one of values or not_values must be set.",
              type: "array",
              items: {
                type: "string",
                format: "string",
              },
            },
          },
        },
        "istio.security.v1beta1.Source": {
          description:
            "Source specifies the source identities of a request. Fields in the source are ANDed together.",
          type: "object",
          properties: {
            principals: {
              description:
                'Optional. A list of source peer identities (i.e. service account), which matches to the "source.principal" attribute. This field requires mTLS enabled.',
              type: "array",
              items: {
                type: "string",
                format: "string",
              },
            },
            notPrincipals: {
              description:
                "Optional. A list of negative match of source peer identities.",
              type: "array",
              items: {
                type: "string",
                format: "string",
              },
            },
            requestPrincipals: {
              description:
                'Optional. A list of request identities (i.e. "iss/sub" claims), which matches to the "request.auth.principal" attribute.',
              type: "array",
              items: {
                type: "string",
                format: "string",
              },
            },
            notRequestPrincipals: {
              description:
                "Optional. A list of negative match of request identities.",
              type: "array",
              items: {
                type: "string",
                format: "string",
              },
            },
            namespaces: {
              description:
                'Optional. A list of namespaces, which matches to the "source.namespace" attribute. This field requires mTLS enabled.',
              type: "array",
              items: {
                type: "string",
                format: "string",
              },
            },
            notNamespaces: {
              description: "Optional. A list of negative match of namespaces.",
              type: "array",
              items: {
                type: "string",
                format: "string",
              },
            },
            ipBlocks: {
              description:
                'Optional. A list of IP blocks, which matches to the "source.ip" attribute. Single IP (e.g. "1.2.3.4") and CIDR (e.g. "1.2.3.0/24") are supported.',
              type: "array",
              items: {
                type: "string",
                format: "string",
              },
            },
            notIpBlocks: {
              description: "Optional. A list of negative match of IP blocks.",
              type: "array",
              items: {
                type: "string",
                format: "string",
              },
            },
          },
        },
        "istio.security.v1beta1.Operation": {
          description:
            "Operation specifies the operations of a request. Fields in the operation are ANDed together.",
          type: "object",
          properties: {
            hosts: {
              description:
                'Optional. A list of hosts, which matches to the "request.host" attribute.',
              type: "array",
              items: {
                type: "string",
                format: "string",
              },
            },
            notHosts: {
              description: "Optional. A list of negative match of hosts.",
              type: "array",
              items: {
                type: "string",
                format: "string",
              },
            },
            ports: {
              description:
                'Optional. A list of ports, which matches to the "destination.port" attribute.',
              type: "array",
              items: {
                type: "string",
                format: "string",
              },
            },
            notPorts: {
              description: "Optional. A list of negative match of ports.",
              type: "array",
              items: {
                type: "string",
                format: "string",
              },
            },
            methods: {
              description:
                'Optional. A list of methods, which matches to the "request.method" attribute. For gRPC service, this will always be "POST".',
              type: "array",
              items: {
                type: "string",
                format: "string",
              },
            },
            notMethods: {
              description: "Optional. A list of negative match of methods.",
              type: "array",
              items: {
                type: "string",
                format: "string",
              },
            },
            paths: {
              description:
                'Optional. A list of paths, which matches to the "request.url_path" attribute. For gRPC service, this will be the fully-qualified name in the form of "/package.service/method".',
              type: "array",
              items: {
                type: "string",
                format: "string",
              },
            },
            notPaths: {
              description: "Optional. A list of negative match of paths.",
              type: "array",
              items: {
                type: "string",
                format: "string",
              },
            },
          },
        },
        "istio.type.v1beta1.WorkloadSelector": {
          description:
            "The selector determines the workloads to apply the RequestAuthentication on. If not set, the policy will be applied to all workloads in the same namespace as the policy.",
          type: "object",
          properties: {
            matchLabels: {
              description:
                "One or more labels that indicate a specific set of pods/VMs on which a policy should be applied. The scope of label search is restricted to the configuration namespace in which the resource is present.",
              type: "object",
              additionalProperties: {
                type: "string",
                format: "string",
              },
            },
          },
        },
      },
    },
  },
  {
    openapi: "3.0.0",
    info: {
      title: "Configuration to validate JWT.",
      version: "v1beta1",
    },
    components: {
      schemas: {
        "istio.security.v1beta1.JWTRule": {
          description:
            "JSON Web Token (JWT) token format for authentication as defined by [RFC 7519](https://tools.ietf.org/html/rfc7519). See [OAuth 2.0](https://tools.ietf.org/html/rfc6749) and [OIDC 1.0](http://openid.net/connect) for how this is used in the whole authentication flow.",
          type: "object",
          properties: {
            issuer: {
              description:
                "Identifies the issuer that issued the JWT. See [issuer](https://tools.ietf.org/html/rfc7519#section-4.1.1) A JWT with different `iss` claim will be rejected.",
              type: "string",
              format: "string",
            },
            audiences: {
              description:
                "The list of JWT [audiences](https://tools.ietf.org/html/rfc7519#section-4.1.3). that are allowed to access. A JWT containing any of these audiences will be accepted.",
              type: "array",
              items: {
                type: "string",
                format: "string",
              },
            },
            jwksUri: {
              description:
                "URL of the provider's public key set to validate signature of the JWT. See [OpenID Discovery](https://openid.net/specs/openid-connect-discovery-1_0.html#ProviderMetadata).",
              type: "string",
              format: "string",
            },
            jwks: {
              description:
                "JSON Web Key Set of public keys to validate signature of the JWT. See https://auth0.com/docs/jwks.",
              type: "string",
              format: "string",
            },
            fromHeaders: {
              description:
                'List of header locations from which JWT is expected. For example, below is the location spec if JWT is expected to be found in `x-jwt-assertion` header, and have "Bearer " prefix: ``` fromHeaders: - name: x-jwt-assertion prefix: "Bearer " ```',
              type: "array",
              items: {
                $ref: "#/components/schemas/istio.security.v1beta1.JWTHeader",
              },
            },
            fromParams: {
              description:
                'List of query parameters from which JWT is expected. For example, if JWT is provided via query parameter `my_token` (e.g /path?my_token=\u003cJWT\u003e), the config is: ``` fromParams: - "my_token" ```',
              type: "array",
              items: {
                type: "string",
                format: "string",
              },
            },
            outputPayloadToHeader: {
              description:
                "This field specifies the header name to output a successfully verified JWT payload to the backend. The forwarded data is `base64_encoded(jwt_payload_in_JSON)`. If it is not specified, the payload will not be emitted.",
              type: "string",
              format: "string",
            },
            forwardOriginalToken: {
              description:
                "If set to true, the orginal token will be kept for the ustream request. Default is false.",
              type: "boolean",
            },
          },
        },
        "istio.security.v1beta1.JWTHeader": {
          description:
            "This message specifies a header location to extract JWT token.",
          type: "object",
          properties: {
            name: {
              description: "The HTTP header name.",
              type: "string",
              format: "string",
            },
            prefix: {
              description:
                'The prefix that should be stripped before decoding the token. For example, for "Authorization: Bearer \u003ctoken\u003e", prefix="Bearer " with a space at the end. If the header doesn\'t have this exact prefix, it is considerred invalid.',
              type: "string",
              format: "string",
            },
          },
        },
      },
    },
  },
  {
    openapi: "3.0.0",
    info: {
      title: "Request authentication configuration for workloads.",
      version: "v1beta1",
    },
    components: {
      schemas: {
        "istio.security.v1beta1.JWTRule": {
          description:
            "JSON Web Token (JWT) token format for authentication as defined by [RFC 7519](https://tools.ietf.org/html/rfc7519). See [OAuth 2.0](https://tools.ietf.org/html/rfc6749) and [OIDC 1.0](http://openid.net/connect) for how this is used in the whole authentication flow.",
          type: "object",
          properties: {
            issuer: {
              description:
                "Identifies the issuer that issued the JWT. See [issuer](https://tools.ietf.org/html/rfc7519#section-4.1.1) A JWT with different `iss` claim will be rejected.",
              type: "string",
              format: "string",
            },
            audiences: {
              description:
                "The list of JWT [audiences](https://tools.ietf.org/html/rfc7519#section-4.1.3). that are allowed to access. A JWT containing any of these audiences will be accepted.",
              type: "array",
              items: {
                type: "string",
                format: "string",
              },
            },
            jwksUri: {
              description:
                "URL of the provider's public key set to validate signature of the JWT. See [OpenID Discovery](https://openid.net/specs/openid-connect-discovery-1_0.html#ProviderMetadata).",
              type: "string",
              format: "string",
            },
            jwks: {
              description:
                "JSON Web Key Set of public keys to validate signature of the JWT. See https://auth0.com/docs/jwks.",
              type: "string",
              format: "string",
            },
            fromHeaders: {
              description:
                'List of header locations from which JWT is expected. For example, below is the location spec if JWT is expected to be found in `x-jwt-assertion` header, and have "Bearer " prefix: ``` fromHeaders: - name: x-jwt-assertion prefix: "Bearer " ```',
              type: "array",
              items: {
                $ref: "#/components/schemas/istio.security.v1beta1.JWTHeader",
              },
            },
            fromParams: {
              description:
                'List of query parameters from which JWT is expected. For example, if JWT is provided via query parameter `my_token` (e.g /path?my_token=\u003cJWT\u003e), the config is: ``` fromParams: - "my_token" ```',
              type: "array",
              items: {
                type: "string",
                format: "string",
              },
            },
            outputPayloadToHeader: {
              description:
                "This field specifies the header name to output a successfully verified JWT payload to the backend. The forwarded data is `base64_encoded(jwt_payload_in_JSON)`. If it is not specified, the payload will not be emitted.",
              type: "string",
              format: "string",
            },
            forwardOriginalToken: {
              description:
                "If set to true, the orginal token will be kept for the ustream request. Default is false.",
              type: "boolean",
            },
          },
        },
        "istio.security.v1beta1.JWTHeader": {
          description:
            "This message specifies a header location to extract JWT token.",
          type: "object",
          properties: {
            name: {
              description: "The HTTP header name.",
              type: "string",
              format: "string",
            },
            prefix: {
              description:
                'The prefix that should be stripped before decoding the token. For example, for "Authorization: Bearer \u003ctoken\u003e", prefix="Bearer " with a space at the end. If the header doesn\'t have this exact prefix, it is considerred invalid.',
              type: "string",
              format: "string",
            },
          },
        },
        "istio.security.v1beta1.RequestAuthentication": {
          description:
            "RequestAuthentication defines what request authentication methods are supported by a workload. If will reject a request if the request contains invalid authentication information, based on the configured authentication rules. A request that does not contain any authentication credentials will be accepted but will not have any authenticated identity. To restrict access to authenticated requests only, this should be accompanied by an authorization rule. Examples: - Require JWT for all request for workloads that have label `app:httpbin`",
          type: "object",
          properties: {
            selector: {
              $ref: "#/components/schemas/istio.type.v1beta1.WorkloadSelector",
            },
            jwtRules: {
              description:
                "Define the list of JWTs that can be validated at the selected workloads' proxy. A valid token will be used to extract the authenticated identity. Each rule will be activated only when a token is presented at the location recorgnized by the rule. The token will be validated based on the JWT rule config. If validation fails, the request will be rejected. Note: if more than one token is presented (at different locations), the output principal is nondeterministic.",
              type: "array",
              items: {
                $ref: "#/components/schemas/istio.security.v1beta1.JWTRule",
              },
            },
          },
        },
        "istio.type.v1beta1.WorkloadSelector": {
          description:
            "The selector determines the workloads to apply the RequestAuthentication on. If not set, the policy will be applied to all workloads in the same namespace as the policy.",
          type: "object",
          properties: {
            matchLabels: {
              description:
                "One or more labels that indicate a specific set of pods/VMs on which a policy should be applied. The scope of label search is restricted to the configuration namespace in which the resource is present.",
              type: "object",
              additionalProperties: {
                type: "string",
                format: "string",
              },
            },
          },
        },
      },
    },
  },
  {
    openapi: "3.0.0",
    info: {
      title: "Peer authentication configuration for workloads.",
      version: "v1beta1",
    },
    components: {
      schemas: {
        "istio.security.v1beta1.PeerAuthentication": {
          description:
            "PeerAuthentication defines how traffic will be tunneled (or not) to the sidecar.",
          type: "object",
          properties: {
            selector: {
              $ref: "#/components/schemas/istio.type.v1beta1.WorkloadSelector",
            },
            mtls: {
              $ref:
                "#/components/schemas/istio.security.v1beta1.PeerAuthentication.MutualTLS",
            },
            portLevelMtls: {
              description: "Port specific mutual TLS settings.",
              type: "object",
              additionalProperties: {
                $ref:
                  "#/components/schemas/istio.security.v1beta1.PeerAuthentication.MutualTLS",
              },
            },
          },
        },
        "istio.security.v1beta1.PeerAuthentication.MutualTLS": {
          description: "Mutual TLS settings.",
          type: "object",
          properties: {
            mode: {
              $ref:
                "#/components/schemas/istio.security.v1beta1.PeerAuthentication.MutualTLS.Mode",
            },
          },
        },
        "istio.security.v1beta1.PeerAuthentication.MutualTLS.Mode": {
          type: "string",
          enum: ["UNSET", "DISABLE", "PERMISSIVE", "STRICT"],
        },
        "istio.type.v1beta1.WorkloadSelector": {
          description:
            "The selector determines the workloads to apply the RequestAuthentication on. If not set, the policy will be applied to all workloads in the same namespace as the policy.",
          type: "object",
          properties: {
            matchLabels: {
              description:
                "One or more labels that indicate a specific set of pods/VMs on which a policy should be applied. The scope of label search is restricted to the configuration namespace in which the resource is present.",
              type: "object",
              additionalProperties: {
                type: "string",
                format: "string",
              },
            },
          },
        },
      },
    },
  },
  {
    openapi: "3.0.0",
    info: {
      title:
        "This package defines the Mixer API that the sidecar proxy uses to perform precondition checks, manage quotas, and report telemetry.",
      version: "v1",
    },
    components: {
      schemas: {
        "istio.mixer.v1.Attributes": {
          description:
            "Attributes represents a set of typed name/value pairs. Many of Mixer's API either consume and/or return attributes.",
          type: "object",
          properties: {
            attributes: {
              description: "A map of attribute name to its value.",
              type: "object",
              additionalProperties: {
                $ref:
                  "#/components/schemas/istio.mixer.v1.Attributes.AttributeValue",
              },
            },
          },
        },
        "istio.mixer.v1.Attributes.AttributeValue": {
          description: "Specifies one attribute value with different type.",
          type: "object",
          oneOf: [
            {
              not: {
                anyOf: [
                  {
                    required: ["stringValue"],
                    properties: {
                      stringValue: {
                        description:
                          "Used for values of type STRING, DNS_NAME, EMAIL_ADDRESS, and URI",
                        type: "string",
                        format: "string",
                      },
                    },
                  },
                  {
                    required: ["int64Value"],
                    properties: {
                      int64Value: {
                        description: "Used for values of type INT64",
                        type: "integer",
                        format: "int64",
                      },
                    },
                  },
                  {
                    required: ["doubleValue"],
                    properties: {
                      doubleValue: {
                        description: "Used for values of type DOUBLE",
                        type: "number",
                        format: "double",
                      },
                    },
                  },
                  {
                    required: ["boolValue"],
                    properties: {
                      boolValue: {
                        description: "Used for values of type BOOL",
                        type: "boolean",
                      },
                    },
                  },
                  {
                    required: ["bytesValue"],
                    properties: {
                      bytesValue: {
                        description: "Used for values of type BYTES",
                        type: "string",
                        format: "binary",
                      },
                    },
                  },
                  {
                    required: ["timestampValue"],
                    properties: {
                      timestampValue: {
                        description: "Used for values of type TIMESTAMP",
                        type: "string",
                        format: "dateTime",
                      },
                    },
                  },
                  {
                    required: ["durationValue"],
                    properties: {
                      durationValue: {
                        description: "Used for values of type DURATION",
                        type: "string",
                      },
                    },
                  },
                  {
                    required: ["stringMapValue"],
                    properties: {
                      stringMapValue: {
                        $ref:
                          "#/components/schemas/istio.mixer.v1.Attributes.StringMap",
                      },
                    },
                  },
                ],
              },
            },
            {
              required: ["stringValue"],
              properties: {
                stringValue: {
                  description:
                    "Used for values of type STRING, DNS_NAME, EMAIL_ADDRESS, and URI",
                  type: "string",
                  format: "string",
                },
              },
            },
            {
              required: ["int64Value"],
              properties: {
                int64Value: {
                  description: "Used for values of type INT64",
                  type: "integer",
                  format: "int64",
                },
              },
            },
            {
              required: ["doubleValue"],
              properties: {
                doubleValue: {
                  description: "Used for values of type DOUBLE",
                  type: "number",
                  format: "double",
                },
              },
            },
            {
              required: ["boolValue"],
              properties: {
                boolValue: {
                  description: "Used for values of type BOOL",
                  type: "boolean",
                },
              },
            },
            {
              required: ["bytesValue"],
              properties: {
                bytesValue: {
                  description: "Used for values of type BYTES",
                  type: "string",
                  format: "binary",
                },
              },
            },
            {
              required: ["timestampValue"],
              properties: {
                timestampValue: {
                  description: "Used for values of type TIMESTAMP",
                  type: "string",
                  format: "dateTime",
                },
              },
            },
            {
              required: ["durationValue"],
              properties: {
                durationValue: {
                  description: "Used for values of type DURATION",
                  type: "string",
                },
              },
            },
            {
              required: ["stringMapValue"],
              properties: {
                stringMapValue: {
                  $ref:
                    "#/components/schemas/istio.mixer.v1.Attributes.StringMap",
                },
              },
            },
          ],
        },
        "istio.mixer.v1.Attributes.StringMap": {
          description: "Defines a string map.",
          type: "object",
          properties: {
            entries: {
              description: "Holds a set of name/value pairs.",
              type: "object",
              additionalProperties: {
                type: "string",
                format: "string",
              },
            },
          },
        },
        "istio.mixer.v1.CompressedAttributes": {
          description:
            "Defines a list of attributes in compressed format optimized for transport. Within this message, strings are referenced using integer indices into one of two string dictionaries. Positive integers index into the global deployment-wide dictionary, whereas negative integers index into the message-level dictionary instead. The message-level dictionary is carried by the `words` field of this message, the deployment-wide dictionary is determined via configuration.",
          type: "object",
          properties: {
            strings: {
              description:
                "Holds attributes of type STRING, DNS_NAME, EMAIL_ADDRESS, URI",
              type: "object",
              additionalProperties: {
                type: "integer",
                format: "int32",
              },
            },
            bytes: {
              description: "Holds attributes of type BYTES",
              type: "object",
              additionalProperties: {
                type: "string",
                format: "binary",
              },
            },
            words: {
              description: "The message-level dictionary.",
              type: "array",
              items: {
                type: "string",
                format: "string",
              },
            },
            int64s: {
              description: "Holds attributes of type INT64",
              type: "object",
              additionalProperties: {
                type: "integer",
                format: "int64",
              },
            },
            doubles: {
              description: "Holds attributes of type DOUBLE",
              type: "object",
              additionalProperties: {
                type: "number",
                format: "double",
              },
            },
            bools: {
              description: "Holds attributes of type BOOL",
              type: "object",
              additionalProperties: {
                type: "boolean",
              },
            },
            timestamps: {
              description: "Holds attributes of type TIMESTAMP",
              type: "object",
              additionalProperties: {
                type: "string",
                format: "dateTime",
              },
            },
            durations: {
              description: "Holds attributes of type DURATION",
              type: "object",
              additionalProperties: {
                type: "string",
              },
            },
            stringMaps: {
              description: "Holds attributes of type STRING_MAP",
              type: "object",
              additionalProperties: {
                $ref: "#/components/schemas/istio.mixer.v1.StringMap",
              },
            },
          },
        },
        "istio.mixer.v1.StringMap": {
          description:
            "A map of string to string. The keys and values in this map are dictionary indices (see the [Attributes][istio.mixer.v1.CompressedAttributes] message for an explanation)",
          type: "object",
          properties: {
            entries: {
              description: "Holds a set of name/value pairs.",
              type: "object",
              additionalProperties: {
                type: "integer",
                format: "int32",
              },
            },
          },
        },
        "istio.mixer.v1.CheckRequest": {
          description:
            "Used to get a thumbs-up/thumbs-down before performing an action.",
          type: "object",
          properties: {
            attributes: {
              $ref: "#/components/schemas/istio.mixer.v1.CompressedAttributes",
            },
            globalWordCount: {
              description:
                "The number of words in the global dictionary, used with to populate the attributes. This value is used as a quick way to determine whether the client is using a dictionary that the server understands.",
              type: "integer",
            },
            deduplicationId: {
              description:
                "Used for deduplicating `Check` calls in the case of failed RPCs and retries. This should be a UUID per call, where the same UUID is used for retries of the same call.",
              type: "string",
              format: "string",
            },
            quotas: {
              description: "The individual quotas to allocate",
              type: "object",
              additionalProperties: {
                $ref:
                  "#/components/schemas/istio.mixer.v1.CheckRequest.QuotaParams",
              },
            },
          },
        },
        "istio.mixer.v1.CheckRequest.QuotaParams": {
          description: "parameters for a quota allocation",
          type: "object",
          properties: {
            amount: {
              description: "Amount of quota to allocate",
              type: "integer",
              format: "int64",
            },
            bestEffort: {
              description:
                "When true, supports returning less quota than what was requested.",
              type: "boolean",
            },
          },
        },
        "istio.mixer.v1.CheckResponse": {
          description: "The response generated by the Check method.",
          type: "object",
          properties: {
            quotas: {
              description:
                "The resulting quota, one entry per requested quota.",
              type: "object",
              additionalProperties: {
                $ref:
                  "#/components/schemas/istio.mixer.v1.CheckResponse.QuotaResult",
              },
            },
            precondition: {
              $ref:
                "#/components/schemas/istio.mixer.v1.CheckResponse.PreconditionResult",
            },
          },
        },
        "istio.mixer.v1.CheckResponse.PreconditionResult": {
          description: "Expresses the result of a precondition check.",
          type: "object",
          properties: {
            status: {
              $ref: "#/components/schemas/google.rpc.Status",
            },
            validDuration: {
              description:
                "The amount of time for which this result can be considered valid.",
              type: "string",
            },
            validUseCount: {
              description:
                "The number of uses for which this result can be considered valid.",
              type: "integer",
              format: "int32",
            },
            referencedAttributes: {
              $ref: "#/components/schemas/istio.mixer.v1.ReferencedAttributes",
            },
            routeDirective: {
              $ref: "#/components/schemas/istio.mixer.v1.RouteDirective",
            },
          },
        },
        "istio.mixer.v1.CheckResponse.QuotaResult": {
          description: "Expresses the result of a quota allocation.",
          type: "object",
          properties: {
            status: {
              $ref: "#/components/schemas/google.rpc.Status",
            },
            validDuration: {
              description:
                "The amount of time for which this result can be considered valid.",
              type: "string",
            },
            referencedAttributes: {
              $ref: "#/components/schemas/istio.mixer.v1.ReferencedAttributes",
            },
            grantedAmount: {
              description:
                "The amount of granted quota. When `QuotaParams.best_effort` is true, this will be \u003e= 0. If `QuotaParams.best_effort` is false, this will be either 0 or \u003e= `QuotaParams.amount`.",
              type: "integer",
              format: "int64",
            },
          },
        },
        "istio.mixer.v1.ReferencedAttributes": {
          description:
            "Describes the attributes that were used to determine the response. This can be used to construct a response cache.",
          type: "object",
          properties: {
            words: {
              description:
                "The message-level dictionary. Refer to [CompressedAttributes][istio.mixer.v1.CompressedAttributes] for information on using dictionaries.",
              type: "array",
              items: {
                type: "string",
                format: "string",
              },
            },
            attributeMatches: {
              description: "Describes a set of attributes.",
              type: "array",
              items: {
                $ref:
                  "#/components/schemas/istio.mixer.v1.ReferencedAttributes.AttributeMatch",
              },
            },
          },
        },
        "istio.mixer.v1.RouteDirective": {
          description:
            "Expresses the routing manipulation actions to be performed on behalf of Mixer in response to a precondition check.",
          type: "object",
          properties: {
            requestHeaderOperations: {
              description: "Operations on the request headers.",
              type: "array",
              items: {
                $ref: "#/components/schemas/istio.mixer.v1.HeaderOperation",
              },
            },
            responseHeaderOperations: {
              description: "Operations on the response headers.",
              type: "array",
              items: {
                $ref: "#/components/schemas/istio.mixer.v1.HeaderOperation",
              },
            },
            directResponseCode: {
              description:
                "If set, enables a direct response without proxying the request to the routing destination. Required to be a value in the 2xx or 3xx range.",
              type: "integer",
            },
            directResponseBody: {
              description:
                "Supplies the response body for the direct response. If this setting is omitted, no body is included in the generated response.",
              type: "string",
              format: "string",
            },
          },
        },
        "istio.mixer.v1.ReferencedAttributes.AttributeMatch": {
          description: "Describes a single attribute match.",
          type: "object",
          properties: {
            name: {
              description:
                "The name of the attribute. This is a dictionary index encoded in a manner identical to all strings in the [CompressedAttributes][istio.mixer.v1.CompressedAttributes] message.",
              type: "integer",
              format: "int32",
            },
            condition: {
              $ref:
                "#/components/schemas/istio.mixer.v1.ReferencedAttributes.Condition",
            },
            regex: {
              description:
                "If a REGEX condition is provided for a STRING_MAP attribute, clients should use the regex value to match against map keys. RE2 style regex-based match (https://github.com/google/re2/wiki/Syntax).",
              type: "string",
              format: "string",
            },
            mapKey: {
              description:
                "A key in a STRING_MAP. When multiple keys from a STRING_MAP attribute were referenced, there will be multiple AttributeMatch messages with different map_key values. Values for map_key SHOULD be ignored for attributes that are not STRING_MAP.",
              type: "integer",
              format: "int32",
            },
          },
        },
        "istio.mixer.v1.ReferencedAttributes.Condition": {
          description: "How an attribute's value was matched",
          type: "string",
          enum: ["CONDITION_UNSPECIFIED", "ABSENCE", "EXACT", "REGEX"],
        },
        "istio.mixer.v1.HeaderOperation": {
          description:
            'Operation on HTTP headers to replace, append, or remove a header. Header names are normalized to lower-case with dashes, e.g. "x-request-id". Pseudo-headers ":path", ":authority", and ":method" are supported to modify the request headers.',
          type: "object",
          properties: {
            name: {
              description: "Header name.",
              type: "string",
              format: "string",
            },
            value: {
              description: "Header value.",
              type: "string",
              format: "string",
            },
            operation: {
              $ref:
                "#/components/schemas/istio.mixer.v1.HeaderOperation.Operation",
            },
          },
        },
        "istio.mixer.v1.HeaderOperation.Operation": {
          description: "Operation type.",
          type: "string",
          enum: ["REPLACE", "REMOVE", "APPEND"],
        },
        "istio.mixer.v1.ReportRequest": {
          description:
            "Used to report telemetry after performing one or more actions.",
          type: "object",
          properties: {
            attributes: {
              description: "next value: 5",
              type: "array",
              items: {
                $ref:
                  "#/components/schemas/istio.mixer.v1.CompressedAttributes",
              },
            },
            globalWordCount: {
              description:
                "The number of words in the global dictionary. To detect global dictionary out of sync between client and server.",
              type: "integer",
            },
            repeatedAttributesSemantics: {
              $ref:
                "#/components/schemas/istio.mixer.v1.ReportRequest.RepeatedAttributesSemantics",
            },
            defaultWords: {
              description:
                "The default message-level dictionary for all the attributes. Individual attribute messages can have their own dictionaries, but if they don't then this set of words, if it is provided, is used instead.",
              type: "array",
              items: {
                type: "string",
                format: "string",
              },
            },
          },
        },
        "istio.mixer.v1.ReportRequest.RepeatedAttributesSemantics": {
          description:
            "Used to signal how the sets of compressed attributes should be reconstituted server-side.",
          type: "string",
          enum: ["DELTA_ENCODING", "INDEPENDENT_ENCODING"],
        },
        "istio.mixer.v1.ReportResponse": {
          description: "Used to carry responses to telemetry reports",
          type: "object",
        },
        "google.rpc.Status": {
          description:
            "A status code of OK indicates quota was fetched successfully. Any other code indicates error in fetching quota.",
          type: "object",
          properties: {
            code: {
              description:
                "The status code, which should be an enum value of [google.rpc.Code][google.rpc.Code].",
              type: "integer",
              format: "int32",
            },
            message: {
              description:
                "A developer-facing error message, which should be in English. Any user-facing error message should be localized and sent in the [google.rpc.Status.details][google.rpc.Status.details] field, or localized by the client.",
              type: "string",
              format: "string",
            },
            details: {
              description:
                "A list of messages that carry the error details. There is a common set of message types for APIs to use.",
              type: "array",
              items: {
                type: "object",
                required: ["@type"],
                properties: {
                  "@type": {
                    description:
                      'A URL/resource name that uniquely identifies the type of the serialized protocol buffer message. This string must contain at least one "/" character. The last segment of the URL\'s path must represent the fully qualified name of the type (as in `type.googleapis.com/google.protobuf.Duration`). The name should be in a canonical form (e.g., leading "." is not accepted). The remaining fields of this object correspond to fields of the proto messsage. If the embedded message is well-known and has a custom JSON representation, that representation is assigned to the \'value\' field.',
                    type: "string",
                    format: "string",
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  {
    openapi: "3.0.0",
    info: {
      title: "Configuration state for the Mixer client library.",
      version: "client",
    },
    components: {
      schemas: {
        "istio.mixer.v1.config.client.HTTPAPISpec": {
          description:
            "HTTPAPISpec defines the canonical configuration for generating API-related attributes from HTTP requests based on the method and uri templated path matches. It is sufficient for defining the API surface of a service for the purposes of API attribute generation. It is not intended to represent auth, quota, documentation, or other information commonly found in other API specifications, e.g. OpenAPI.",
          type: "object",
          properties: {
            attributes: {
              $ref: "#/components/schemas/istio.mixer.v1.Attributes",
            },
            patterns: {
              description: "List of HTTP patterns to match.",
              type: "array",
              items: {
                $ref:
                  "#/components/schemas/istio.mixer.v1.config.client.HTTPAPISpecPattern",
              },
            },
            apiKeys: {
              description:
                "List of APIKey that describes how to extract an API-KEY from an HTTP request. The first API-Key match found in the list is used, i.e. 'OR' semantics.",
              type: "array",
              items: {
                $ref:
                  "#/components/schemas/istio.mixer.v1.config.client.APIKey",
              },
            },
          },
        },
        "istio.mixer.v1.config.client.HTTPAPISpecPattern": {
          description:
            "HTTPAPISpecPattern defines a single pattern to match against incoming HTTP requests. The per-pattern list of attributes is generated if both the http_method and uri_template match. In addition, the top-level list of attributes in the HTTPAPISpec is also generated.",
          type: "object",
          properties: {
            attributes: {
              $ref: "#/components/schemas/istio.mixer.v1.Attributes",
            },
            httpMethod: {
              description:
                "HTTP request method to match against as defined by [rfc7231](https://tools.ietf.org/html/rfc7231#page-21). For example: GET, HEAD, POST, PUT, DELETE.",
              type: "string",
              format: "string",
            },
          },
          oneOf: [
            {
              not: {
                anyOf: [
                  {
                    required: ["uriTemplate"],
                    properties: {
                      uriTemplate: {
                        description:
                          "URI template to match against as defined by [rfc6570](https://tools.ietf.org/html/rfc6570). For example, the following are valid URI templates: /pets /pets/{id} /dictionary/{term:1}/{term} /search{?q*,lang}",
                        type: "string",
                        format: "string",
                      },
                    },
                  },
                  {
                    required: ["regex"],
                    properties: {
                      regex: {
                        description:
                          "RE2 style regex-based match (https://github.com/google/re2/wiki/Syntax)",
                        type: "string",
                        format: "string",
                      },
                    },
                  },
                ],
              },
            },
            {
              required: ["uriTemplate"],
              properties: {
                uriTemplate: {
                  description:
                    "URI template to match against as defined by [rfc6570](https://tools.ietf.org/html/rfc6570). For example, the following are valid URI templates: /pets /pets/{id} /dictionary/{term:1}/{term} /search{?q*,lang}",
                  type: "string",
                  format: "string",
                },
              },
            },
            {
              required: ["regex"],
              properties: {
                regex: {
                  description:
                    "RE2 style regex-based match (https://github.com/google/re2/wiki/Syntax)",
                  type: "string",
                  format: "string",
                },
              },
            },
          ],
        },
        "istio.mixer.v1.config.client.APIKey": {
          description:
            "APIKey defines the explicit configuration for generating the `request.api_key` attribute from HTTP requests.",
          type: "object",
          oneOf: [
            {
              not: {
                anyOf: [
                  {
                    required: ["query"],
                    properties: {
                      query: {
                        description:
                          "API Key is sent as a query parameter. `query` represents the query string parameter name.",
                        type: "string",
                        format: "string",
                      },
                    },
                  },
                  {
                    required: ["header"],
                    properties: {
                      header: {
                        description:
                          "API key is sent in a request header. `header` represents the header name.",
                        type: "string",
                        format: "string",
                      },
                    },
                  },
                  {
                    required: ["cookie"],
                    properties: {
                      cookie: {
                        description:
                          "API key is sent in a [cookie](https://swagger.io/docs/specification/authentication/cookie-authentication),",
                        type: "string",
                        format: "string",
                      },
                    },
                  },
                ],
              },
            },
            {
              required: ["query"],
              properties: {
                query: {
                  description:
                    "API Key is sent as a query parameter. `query` represents the query string parameter name.",
                  type: "string",
                  format: "string",
                },
              },
            },
            {
              required: ["header"],
              properties: {
                header: {
                  description:
                    "API key is sent in a request header. `header` represents the header name.",
                  type: "string",
                  format: "string",
                },
              },
            },
            {
              required: ["cookie"],
              properties: {
                cookie: {
                  description:
                    "API key is sent in a [cookie](https://swagger.io/docs/specification/authentication/cookie-authentication),",
                  type: "string",
                  format: "string",
                },
              },
            },
          ],
        },
        "istio.mixer.v1.config.client.HTTPAPISpecReference": {
          description:
            "HTTPAPISpecReference defines a reference to an HTTPAPISpec. This is typically used for establishing bindings between an HTTPAPISpec and an IstioService. For example, the following defines an HTTPAPISpecReference for service `foo` in namespace `bar`.",
          type: "object",
          properties: {
            name: {
              description:
                "The short name of the HTTPAPISpec. This is the resource name defined by the metadata name field.",
              type: "string",
              format: "string",
            },
            namespace: {
              description:
                "Optional namespace of the HTTPAPISpec. Defaults to the encompassing HTTPAPISpecBinding's metadata namespace field.",
              type: "string",
              format: "string",
            },
          },
        },
        "istio.mixer.v1.config.client.HTTPAPISpecBinding": {
          description:
            "HTTPAPISpecBinding defines the binding between HTTPAPISpecs and one or more IstioService. For example, the following establishes a binding between the HTTPAPISpec `petstore` and service `foo` in namespace `bar`.",
          type: "object",
          properties: {
            services: {
              description:
                "One or more services to map the listed HTTPAPISpec onto.",
              type: "array",
              items: {
                $ref:
                  "#/components/schemas/istio.mixer.v1.config.client.IstioService",
              },
            },
            apiSpecs: {
              description:
                "One or more HTTPAPISpec references that should be mapped to the specified service(s). The aggregate collection of match conditions defined in the HTTPAPISpecs should not overlap.",
              type: "array",
              items: {
                $ref:
                  "#/components/schemas/istio.mixer.v1.config.client.HTTPAPISpecReference",
              },
            },
          },
        },
        "istio.mixer.v1.config.client.IstioService": {
          description:
            'IstioService identifies a service and optionally service version. The FQDN of the service is composed from the name, namespace, and implementation-specific domain suffix (e.g. on Kubernetes, "reviews" + "default" + "svc.cluster.local" -\u003e "reviews.default.svc.cluster.local").',
          type: "object",
          properties: {
            name: {
              description: 'The short name of the service such as "foo".',
              type: "string",
              format: "string",
            },
            namespace: {
              description:
                "Optional namespace of the service. Defaults to value of metadata namespace field.",
              type: "string",
              format: "string",
            },
            domain: {
              description:
                "Domain suffix used to construct the service FQDN in implementations that support such specification.",
              type: "string",
              format: "string",
            },
            service: {
              description: "The service FQDN.",
              type: "string",
              format: "string",
            },
            labels: {
              description:
                "Optional one or more labels that uniquely identify the service version.",
              type: "object",
              additionalProperties: {
                type: "string",
                format: "string",
              },
            },
          },
        },
        "istio.mixer.v1.config.client.NetworkFailPolicy": {
          description:
            "Specifies the behavior when the client is unable to connect to Mixer.",
          type: "object",
          properties: {
            policy: {
              $ref:
                "#/components/schemas/istio.mixer.v1.config.client.NetworkFailPolicy.FailPolicy",
            },
            maxRetry: {
              description: "Max retries on transport error.",
              type: "integer",
            },
            baseRetryWait: {
              description:
                "Base time to wait between retries. Will be adjusted by exponential backoff and jitter.",
              type: "string",
            },
            maxRetryWait: {
              description: "Max time to wait between retries.",
              type: "string",
            },
          },
        },
        "istio.mixer.v1.config.client.NetworkFailPolicy.FailPolicy": {
          description: "Describes the policy.",
          type: "string",
          enum: ["FAIL_OPEN", "FAIL_CLOSE"],
        },
        "istio.mixer.v1.config.client.ServiceConfig": {
          description: "Defines the per-service client configuration.",
          type: "object",
          properties: {
            disableCheckCalls: {
              description: "If true, do not call Mixer Check.",
              type: "boolean",
            },
            disableReportCalls: {
              description: "If true, do not call Mixer Report.",
              type: "boolean",
            },
            mixerAttributes: {
              $ref: "#/components/schemas/istio.mixer.v1.Attributes",
            },
            httpApiSpec: {
              description:
                "HTTP API specifications to generate API attributes.",
              type: "array",
              items: {
                $ref:
                  "#/components/schemas/istio.mixer.v1.config.client.HTTPAPISpec",
              },
            },
            quotaSpec: {
              description:
                "Quota specifications to generate quota requirements.",
              type: "array",
              items: {
                $ref:
                  "#/components/schemas/istio.mixer.v1.config.client.QuotaSpec",
              },
            },
            networkFailPolicy: {
              $ref:
                "#/components/schemas/istio.mixer.v1.config.client.NetworkFailPolicy",
            },
            forwardAttributes: {
              $ref: "#/components/schemas/istio.mixer.v1.Attributes",
            },
          },
        },
        "istio.mixer.v1.config.client.QuotaSpec": {
          description: "Determines the quotas used for individual requests.",
          type: "object",
          properties: {
            rules: {
              description: "A list of Quota rules.",
              type: "array",
              items: {
                $ref:
                  "#/components/schemas/istio.mixer.v1.config.client.QuotaRule",
              },
            },
          },
        },
        "istio.mixer.v1.config.client.TransportConfig": {
          description: "Defines the transport config on how to call Mixer.",
          type: "object",
          properties: {
            networkFailPolicy: {
              $ref:
                "#/components/schemas/istio.mixer.v1.config.client.NetworkFailPolicy",
            },
            disableCheckCache: {
              description: "The flag to disable check cache.",
              type: "boolean",
            },
            disableQuotaCache: {
              description: "The flag to disable quota cache.",
              type: "boolean",
            },
            disableReportBatch: {
              description: "The flag to disable report batch.",
              type: "boolean",
            },
            statsUpdateInterval: {
              description:
                "Specify refresh interval to write Mixer client statistics to Envoy share memory. If not specified, the interval is 10 seconds.",
              type: "string",
            },
            checkCluster: {
              description:
                'Name of the cluster that will forward check calls to a pool of mixer servers. Defaults to "mixer_server". By using different names for checkCluster and reportCluster, it is possible to have one set of Mixer servers handle check calls, while another set of Mixer servers handle report calls.',
              type: "string",
              format: "string",
            },
            reportCluster: {
              description:
                'Name of the cluster that will forward report calls to a pool of mixer servers. Defaults to "mixer_server". By using different names for checkCluster and reportCluster, it is possible to have one set of Mixer servers handle check calls, while another set of Mixer servers handle report calls.',
              type: "string",
              format: "string",
            },
            attributesForMixerProxy: {
              $ref: "#/components/schemas/istio.mixer.v1.Attributes",
            },
            reportBatchMaxEntries: {
              description:
                "When disable_report_batch is false, this value specifies the maximum number of requests that are batched in report. If left unspecified, the default value of report_batch_max_entries == 0 will use the hardcoded defaults of istio::mixerclient::ReportOptions.",
              type: "integer",
            },
            reportBatchMaxTime: {
              description:
                "When disable_report_batch is false, this value specifies the maximum elapsed time a batched report will be sent after a user request is processed. If left unspecified, the default report_batch_max_time == 0 will use the hardcoded defaults of istio::mixerclient::ReportOptions.",
              type: "string",
            },
          },
        },
        "istio.mixer.v1.config.client.HttpClientConfig": {
          description: "Defines the client config for HTTP.",
          type: "object",
          properties: {
            mixerAttributes: {
              $ref: "#/components/schemas/istio.mixer.v1.Attributes",
            },
            forwardAttributes: {
              $ref: "#/components/schemas/istio.mixer.v1.Attributes",
            },
            transport: {
              $ref:
                "#/components/schemas/istio.mixer.v1.config.client.TransportConfig",
            },
            serviceConfigs: {
              description:
                "Map of control configuration indexed by destination.service. This is used to support per-service configuration for cases where a mixerclient serves multiple services.",
              type: "object",
              additionalProperties: {
                $ref:
                  "#/components/schemas/istio.mixer.v1.config.client.ServiceConfig",
              },
            },
            defaultDestinationService: {
              description:
                "Default destination service name if none was specified in the client request.",
              type: "string",
              format: "string",
            },
            ignoreForwardedAttributes: {
              description:
                'Whether or not to use attributes forwarded in the request headers to create the attribute bag to send to mixer. For intra-mesh traffic, this should be set to "false". For ingress/egress gateways, this should be set to "true".',
              type: "boolean",
            },
          },
        },
        "istio.mixer.v1.config.client.TcpClientConfig": {
          description: "Defines the client config for TCP.",
          type: "object",
          properties: {
            disableCheckCalls: {
              description: "If set to true, disables Mixer check calls.",
              type: "boolean",
            },
            disableReportCalls: {
              description: "If set to true, disables Mixer check calls.",
              type: "boolean",
            },
            mixerAttributes: {
              $ref: "#/components/schemas/istio.mixer.v1.Attributes",
            },
            transport: {
              $ref:
                "#/components/schemas/istio.mixer.v1.config.client.TransportConfig",
            },
            connectionQuotaSpec: {
              $ref:
                "#/components/schemas/istio.mixer.v1.config.client.QuotaSpec",
            },
            reportInterval: {
              description:
                "Specify report interval to send periodical reports for long TCP connections. If not specified, the interval is 10 seconds. This interval should not be less than 1 second, otherwise it will be reset to 1 second.",
              type: "string",
            },
          },
        },
        "istio.mixer.v1.config.client.QuotaRule": {
          description:
            "Specifies a rule with list of matches and list of quotas. If any clause matched, the list of quotas will be used.",
          type: "object",
          properties: {
            quotas: {
              description: "The list of quotas to charge.",
              type: "array",
              items: {
                $ref: "#/components/schemas/istio.mixer.v1.config.client.Quota",
              },
            },
            match: {
              description:
                "If empty, match all request. If any of match is true, it is matched.",
              type: "array",
              items: {
                $ref:
                  "#/components/schemas/istio.mixer.v1.config.client.AttributeMatch",
              },
            },
          },
        },
        "istio.mixer.v1.config.client.AttributeMatch": {
          description: "Specifies a match clause to match Istio attributes",
          type: "object",
          properties: {
            clause: {
              description:
                "Map of attribute names to StringMatch type. Each map element specifies one condition to match.",
              type: "object",
              additionalProperties: {
                $ref:
                  "#/components/schemas/istio.mixer.v1.config.client.StringMatch",
              },
            },
          },
        },
        "istio.mixer.v1.config.client.Quota": {
          description: "Specifies a quota to use with quota name and amount.",
          type: "object",
          properties: {
            quota: {
              description: "The quota name to charge",
              type: "string",
              format: "string",
            },
            charge: {
              description: "The quota amount to charge",
              type: "integer",
              format: "int32",
            },
          },
        },
        "istio.mixer.v1.config.client.StringMatch": {
          description:
            "Describes how to match a given string in HTTP headers. Match is case-sensitive.",
          type: "object",
          oneOf: [
            {
              not: {
                anyOf: [
                  {
                    required: ["exact"],
                    properties: {
                      exact: {
                        description: "exact string match",
                        type: "string",
                        format: "string",
                      },
                    },
                  },
                  {
                    required: ["prefix"],
                    properties: {
                      prefix: {
                        description: "prefix-based match",
                        type: "string",
                        format: "string",
                      },
                    },
                  },
                  {
                    required: ["regex"],
                    properties: {
                      regex: {
                        description:
                          "RE2 style regex-based match (https://github.com/google/re2/wiki/Syntax).",
                        type: "string",
                        format: "string",
                      },
                    },
                  },
                ],
              },
            },
            {
              required: ["exact"],
              properties: {
                exact: {
                  description: "exact string match",
                  type: "string",
                  format: "string",
                },
              },
            },
            {
              required: ["prefix"],
              properties: {
                prefix: {
                  description: "prefix-based match",
                  type: "string",
                  format: "string",
                },
              },
            },
            {
              required: ["regex"],
              properties: {
                regex: {
                  description:
                    "RE2 style regex-based match (https://github.com/google/re2/wiki/Syntax).",
                  type: "string",
                  format: "string",
                },
              },
            },
          ],
        },
        "istio.mixer.v1.config.client.QuotaSpecBinding": {
          description:
            "QuotaSpecBinding defines the binding between QuotaSpecs and one or more IstioService.",
          type: "object",
          properties: {
            services: {
              description:
                "One or more services to map the listed QuotaSpec onto.",
              type: "array",
              items: {
                $ref:
                  "#/components/schemas/istio.mixer.v1.config.client.IstioService",
              },
            },
            quotaSpecs: {
              description:
                "One or more QuotaSpec references that should be mapped to the specified service(s). The aggregate collection of match conditions defined in the QuotaSpecs should not overlap.",
              type: "array",
              items: {
                $ref:
                  "#/components/schemas/istio.mixer.v1.config.client.QuotaSpecBinding.QuotaSpecReference",
              },
            },
          },
        },
        "istio.mixer.v1.config.client.QuotaSpecBinding.QuotaSpecReference": {
          description:
            "QuotaSpecReference uniquely identifies the QuotaSpec used in the Binding.",
          type: "object",
          properties: {
            name: {
              description:
                "The short name of the QuotaSpec. This is the resource name defined by the metadata name field.",
              type: "string",
              format: "string",
            },
            namespace: {
              description:
                "Optional namespace of the QuotaSpec. Defaults to the value of the metadata namespace field.",
              type: "string",
              format: "string",
            },
          },
        },
        "istio.mixer.v1.Attributes": {
          description:
            'Default attributes to send to Mixer in both Check and Report. This typically includes "destination.ip" and "destination.uid" attributes.',
          type: "object",
          properties: {
            attributes: {
              description: "A map of attribute name to its value.",
              type: "object",
              additionalProperties: {
                $ref:
                  "#/components/schemas/istio.mixer.v1.Attributes.AttributeValue",
              },
            },
          },
        },
        "istio.mixer.v1.Attributes.AttributeValue": {
          type: "object",
          oneOf: [
            {
              not: {
                anyOf: [
                  {
                    required: ["stringValue"],
                    properties: {
                      stringValue: {
                        description:
                          "Used for values of type STRING, DNS_NAME, EMAIL_ADDRESS, and URI",
                        type: "string",
                        format: "string",
                      },
                    },
                  },
                  {
                    required: ["int64Value"],
                    properties: {
                      int64Value: {
                        description: "Used for values of type INT64",
                        type: "integer",
                        format: "int64",
                      },
                    },
                  },
                  {
                    required: ["doubleValue"],
                    properties: {
                      doubleValue: {
                        description: "Used for values of type DOUBLE",
                        type: "number",
                        format: "double",
                      },
                    },
                  },
                  {
                    required: ["boolValue"],
                    properties: {
                      boolValue: {
                        description: "Used for values of type BOOL",
                        type: "boolean",
                      },
                    },
                  },
                  {
                    required: ["bytesValue"],
                    properties: {
                      bytesValue: {
                        description: "Used for values of type BYTES",
                        type: "string",
                        format: "binary",
                      },
                    },
                  },
                  {
                    required: ["timestampValue"],
                    properties: {
                      timestampValue: {
                        description: "Used for values of type TIMESTAMP",
                        type: "string",
                        format: "dateTime",
                      },
                    },
                  },
                  {
                    required: ["durationValue"],
                    properties: {
                      durationValue: {
                        description: "Used for values of type DURATION",
                        type: "string",
                      },
                    },
                  },
                  {
                    required: ["stringMapValue"],
                    properties: {
                      stringMapValue: {
                        $ref:
                          "#/components/schemas/istio.mixer.v1.Attributes.StringMap",
                      },
                    },
                  },
                ],
              },
            },
            {
              required: ["stringValue"],
              properties: {
                stringValue: {
                  description:
                    "Used for values of type STRING, DNS_NAME, EMAIL_ADDRESS, and URI",
                  type: "string",
                  format: "string",
                },
              },
            },
            {
              required: ["int64Value"],
              properties: {
                int64Value: {
                  description: "Used for values of type INT64",
                  type: "integer",
                  format: "int64",
                },
              },
            },
            {
              required: ["doubleValue"],
              properties: {
                doubleValue: {
                  description: "Used for values of type DOUBLE",
                  type: "number",
                  format: "double",
                },
              },
            },
            {
              required: ["boolValue"],
              properties: {
                boolValue: {
                  description: "Used for values of type BOOL",
                  type: "boolean",
                },
              },
            },
            {
              required: ["bytesValue"],
              properties: {
                bytesValue: {
                  description: "Used for values of type BYTES",
                  type: "string",
                  format: "binary",
                },
              },
            },
            {
              required: ["timestampValue"],
              properties: {
                timestampValue: {
                  description: "Used for values of type TIMESTAMP",
                  type: "string",
                  format: "dateTime",
                },
              },
            },
            {
              required: ["durationValue"],
              properties: {
                durationValue: {
                  description: "Used for values of type DURATION",
                  type: "string",
                },
              },
            },
            {
              required: ["stringMapValue"],
              properties: {
                stringMapValue: {
                  $ref:
                    "#/components/schemas/istio.mixer.v1.Attributes.StringMap",
                },
              },
            },
          ],
        },
        "istio.mixer.v1.Attributes.StringMap": {
          description: "Used for values of type STRING_MAP",
          type: "object",
          properties: {
            entries: {
              description: "Holds a set of name/value pairs.",
              type: "object",
              additionalProperties: {
                type: "string",
                format: "string",
              },
            },
          },
        },
      },
    },
  },
  {
    openapi: "3.0.0",
    info: {
      title: "Definitions used to create adapters and templates.",
      version: "v1beta1",
    },
    components: {
      schemas: {
        "istio.mixer.adapter.model.v1beta1.CheckResult": {
          description: "Expresses the result of a precondition check.",
          type: "object",
          properties: {
            status: {
              $ref: "#/components/schemas/google.rpc.Status",
            },
            validDuration: {
              description:
                "The amount of time for which this result can be considered valid.",
              type: "string",
            },
            validUseCount: {
              description:
                "The number of uses for which this result can be considered valid.",
              type: "integer",
              format: "int32",
            },
          },
        },
        "istio.mixer.adapter.model.v1beta1.TemplateVariety": {
          description:
            "The available varieties of templates, controlling the semantics of what an adapter does with each instance.",
          type: "string",
          enum: [
            "TEMPLATE_VARIETY_CHECK",
            "TEMPLATE_VARIETY_REPORT",
            "TEMPLATE_VARIETY_QUOTA",
            "TEMPLATE_VARIETY_ATTRIBUTE_GENERATOR",
            "TEMPLATE_VARIETY_CHECK_WITH_OUTPUT",
          ],
        },
        "istio.mixer.adapter.model.v1beta1.Info": {
          description:
            "Info describes an adapter or a backend that wants to provide telemetry and policy functionality to Mixer as an out of process adapter.",
          type: "object",
          properties: {
            name: {
              description:
                "Name of the adapter. It must be an RFC 1035 compatible DNS label matching the `^[a-z]([-a-z0-9]*[a-z0-9])?$` regular expression. Name is used in Istio configuration, therefore it should be descriptive but short. example: denier Vendor adapters should use a vendor prefix. example: mycompany-denier",
              type: "string",
              format: "string",
            },
            description: {
              description: "User-friendly description of the adapter.",
              type: "string",
              format: "string",
            },
            templates: {
              description: "Names of the templates the adapter supports.",
              type: "array",
              items: {
                type: "string",
                format: "string",
              },
            },
            config: {
              description:
                "Base64 encoded proto descriptor of the adapter configuration.",
              type: "string",
              format: "string",
            },
            sessionBased: {
              description:
                "True if backend has implemented the [InfrastructureBackend](https://github.com/istio/api/blob/master/mixer/adapter/model/v1beta1/infrastructure_backend.proto) service; false otherwise.",
              type: "boolean",
            },
          },
        },
        "istio.mixer.adapter.model.v1beta1.CreateSessionRequest": {
          description: "Request message for `CreateSession` method.",
          type: "object",
          properties: {
            adapterConfig: {
              description: "Adapter specific configuration.",
              type: "object",
              required: ["@type"],
              properties: {
                "@type": {
                  description:
                    'A URL/resource name that uniquely identifies the type of the serialized protocol buffer message. This string must contain at least one "/" character. The last segment of the URL\'s path must represent the fully qualified name of the type (as in `type.googleapis.com/google.protobuf.Duration`). The name should be in a canonical form (e.g., leading "." is not accepted). The remaining fields of this object correspond to fields of the proto messsage. If the embedded message is well-known and has a custom JSON representation, that representation is assigned to the \'value\' field.',
                  type: "string",
                  format: "string",
                },
              },
            },
            inferredTypes: {
              description:
                "Map of instance names to their template-specific inferred type.",
              type: "object",
              additionalProperties: {
                type: "object",
                required: ["@type"],
                properties: {
                  "@type": {
                    description:
                      'A URL/resource name that uniquely identifies the type of the serialized protocol buffer message. This string must contain at least one "/" character. The last segment of the URL\'s path must represent the fully qualified name of the type (as in `type.googleapis.com/google.protobuf.Duration`). The name should be in a canonical form (e.g., leading "." is not accepted). The remaining fields of this object correspond to fields of the proto messsage. If the embedded message is well-known and has a custom JSON representation, that representation is assigned to the \'value\' field.',
                    type: "string",
                    format: "string",
                  },
                },
              },
            },
          },
        },
        "istio.mixer.adapter.model.v1beta1.CreateSessionResponse": {
          description: "Response message for `CreateSession` method.",
          type: "object",
          properties: {
            status: {
              $ref: "#/components/schemas/google.rpc.Status",
            },
            sessionId: {
              description: "Id of the created session.",
              type: "string",
              format: "string",
            },
          },
        },
        "istio.mixer.adapter.model.v1beta1.ValidateRequest": {
          description: "Request message for `Validate` method.",
          type: "object",
          properties: {
            adapterConfig: {
              description: "Adapter specific configuration.",
              type: "object",
              required: ["@type"],
              properties: {
                "@type": {
                  description:
                    'A URL/resource name that uniquely identifies the type of the serialized protocol buffer message. This string must contain at least one "/" character. The last segment of the URL\'s path must represent the fully qualified name of the type (as in `type.googleapis.com/google.protobuf.Duration`). The name should be in a canonical form (e.g., leading "." is not accepted). The remaining fields of this object correspond to fields of the proto messsage. If the embedded message is well-known and has a custom JSON representation, that representation is assigned to the \'value\' field.',
                  type: "string",
                  format: "string",
                },
              },
            },
            inferredTypes: {
              description:
                "Map of instance names to their template-specific inferred type.",
              type: "object",
              additionalProperties: {
                type: "object",
                required: ["@type"],
                properties: {
                  "@type": {
                    description:
                      'A URL/resource name that uniquely identifies the type of the serialized protocol buffer message. This string must contain at least one "/" character. The last segment of the URL\'s path must represent the fully qualified name of the type (as in `type.googleapis.com/google.protobuf.Duration`). The name should be in a canonical form (e.g., leading "." is not accepted). The remaining fields of this object correspond to fields of the proto messsage. If the embedded message is well-known and has a custom JSON representation, that representation is assigned to the \'value\' field.',
                    type: "string",
                    format: "string",
                  },
                },
              },
            },
          },
        },
        "istio.mixer.adapter.model.v1beta1.ValidateResponse": {
          description: "Response message for `Validate` method.",
          type: "object",
          properties: {
            status: {
              $ref: "#/components/schemas/google.rpc.Status",
            },
          },
        },
        "istio.mixer.adapter.model.v1beta1.CloseSessionRequest": {
          description: "Request message for `CloseSession` method.",
          type: "object",
          properties: {
            sessionId: {
              description: "Id of the session to be closed.",
              type: "string",
              format: "string",
            },
          },
        },
        "istio.mixer.adapter.model.v1beta1.CloseSessionResponse": {
          description: "Response message for `CloseSession` method.",
          type: "object",
          properties: {
            status: {
              $ref: "#/components/schemas/google.rpc.Status",
            },
          },
        },
        "istio.mixer.adapter.model.v1beta1.QuotaRequest": {
          description: "Expresses the quota allocation request.",
          type: "object",
          properties: {
            quotas: {
              description: "The individual quotas to allocate",
              type: "object",
              additionalProperties: {
                $ref:
                  "#/components/schemas/istio.mixer.adapter.model.v1beta1.QuotaRequest.QuotaParams",
              },
            },
          },
        },
        "istio.mixer.adapter.model.v1beta1.QuotaRequest.QuotaParams": {
          description: "parameters for a quota allocation",
          type: "object",
          properties: {
            amount: {
              description: "Amount of quota to allocate",
              type: "integer",
              format: "int64",
            },
            bestEffort: {
              description:
                "When true, supports returning less quota than what was requested.",
              type: "boolean",
            },
          },
        },
        "istio.mixer.adapter.model.v1beta1.QuotaResult": {
          description: "Expresses the result of multiple quota allocations.",
          type: "object",
          properties: {
            quotas: {
              description:
                "The resulting quota, one entry per requested quota.",
              type: "object",
              additionalProperties: {
                $ref:
                  "#/components/schemas/istio.mixer.adapter.model.v1beta1.QuotaResult.Result",
              },
            },
          },
        },
        "istio.mixer.adapter.model.v1beta1.QuotaResult.Result": {
          description: "Expresses the result of a quota allocation.",
          type: "object",
          properties: {
            status: {
              $ref: "#/components/schemas/google.rpc.Status",
            },
            validDuration: {
              description:
                "The amount of time for which this result can be considered valid.",
              type: "string",
            },
            grantedAmount: {
              description:
                "The amount of granted quota. When `QuotaParams.best_effort` is true, this will be \u003e= 0. If `QuotaParams.best_effort` is false, this will be either 0 or \u003e= `QuotaParams.amount`.",
              type: "integer",
              format: "int64",
            },
          },
        },
        "istio.mixer.adapter.model.v1beta1.ReportResult": {
          description: "Expresses the result of a report call.",
          type: "object",
        },
        "istio.mixer.adapter.model.v1beta1.Template": {
          description: "Template provides the details of a Mixer template.",
          type: "object",
          properties: {
            descriptor: {
              description: "Base64 encoded proto descriptor of the template.",
              type: "string",
              format: "string",
            },
          },
        },
        "google.rpc.Status": {
          description:
            "A status code of OK indicates quota was fetched successfully. Any other code indicates error in fetching quota.",
          type: "object",
          properties: {
            code: {
              description:
                "The status code, which should be an enum value of [google.rpc.Code][google.rpc.Code].",
              type: "integer",
              format: "int32",
            },
            message: {
              description:
                "A developer-facing error message, which should be in English. Any user-facing error message should be localized and sent in the [google.rpc.Status.details][google.rpc.Status.details] field, or localized by the client.",
              type: "string",
              format: "string",
            },
            details: {
              description:
                "A list of messages that carry the error details. There is a common set of message types for APIs to use.",
              type: "array",
              items: {
                type: "object",
                required: ["@type"],
                properties: {
                  "@type": {
                    description:
                      'A URL/resource name that uniquely identifies the type of the serialized protocol buffer message. This string must contain at least one "/" character. The last segment of the URL\'s path must represent the fully qualified name of the type (as in `type.googleapis.com/google.protobuf.Duration`). The name should be in a canonical form (e.g., leading "." is not accepted). The remaining fields of this object correspond to fields of the proto messsage. If the embedded message is well-known and has a custom JSON representation, that representation is assigned to the \'value\' field.',
                    type: "string",
                    format: "string",
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  {
    openapi: "3.0.0",
    info: {
      title:
        "This package defines the common, core types used by the Mesh Configuration Protocol.",
      version: "v1alpha1",
    },
    components: {
      schemas: {
        "istio.mcp.v1alpha1.SinkNode": {
          description:
            "Identifies a specific MCP sink node instance. The node identifier is presented to the resource source, which may use this identifier to distinguish per sink configuration for serving. This information is not authoritative. Authoritative identity should come from the underlying transport layer (e.g. rpc credentials).",
          type: "object",
          properties: {
            id: {
              description: "An opaque identifier for the MCP node.",
              type: "string",
              format: "string",
            },
            annotations: {
              description: "Opaque annotations extending the node identifier.",
              type: "object",
              additionalProperties: {
                type: "string",
                format: "string",
              },
            },
          },
        },
        "istio.mcp.v1alpha1.MeshConfigRequest": {
          description:
            "A MeshConfigRequest requests a set of versioned resources of the same type for a given client.",
          type: "object",
          properties: {
            versionInfo: {
              description:
                "The version_info provided in the request messages will be the version_info received with the most recent successfully processed response or empty on the first request. It is expected that no new request is sent after a response is received until the client instance is ready to ACK/NACK the new configuration. ACK/NACK takes place by returning the new API config version as applied or the previous API config version respectively. Each type_url (see below) has an independent version associated with it.",
              type: "string",
              format: "string",
            },
            sinkNode: {
              $ref: "#/components/schemas/istio.mcp.v1alpha1.SinkNode",
            },
            typeUrl: {
              description:
                'Type of the resource that is being requested, e.g. "type.googleapis.com/istio.io.networking.v1alpha3.VirtualService".',
              type: "string",
              format: "string",
            },
            responseNonce: {
              description:
                "The nonce corresponding to MeshConfigResponse being ACK/NACKed. See above discussion on version_info and the MeshConfigResponse nonce comment. This may be empty if no nonce is available, e.g. at startup.",
              type: "string",
              format: "string",
            },
            errorDetail: {
              $ref: "#/components/schemas/google.rpc.Status",
            },
          },
        },
        "istio.mcp.v1alpha1.MeshConfigResponse": {
          description:
            "A MeshConfigResponse delivers a set of versioned resources of the same type in response to a MeshConfigRequest.",
          type: "object",
          properties: {
            versionInfo: {
              description: "The version of the response data.",
              type: "string",
              format: "string",
            },
            typeUrl: {
              description:
                "Type URL for resources wrapped in the provided resources(s). This must be consistent with the type_url in the wrapper messages if resources is non-empty.",
              type: "string",
              format: "string",
            },
            resources: {
              description:
                "The response resources wrapped in the common MCP *Resource* message.",
              type: "array",
              items: {
                $ref: "#/components/schemas/istio.mcp.v1alpha1.Resource",
              },
            },
            nonce: {
              description:
                "The nonce provides a way to explicitly ack a specific MeshConfigResponse in a following MeshConfigRequest. Additional messages may have been sent by client to the management server for the previous version on the stream prior to this MeshConfigResponse, that were unprocessed at response send time. The nonce allows the management server to ignore any further MeshConfigRequests for the previous version until a MeshConfigRequest bearing the nonce.",
              type: "string",
              format: "string",
            },
          },
        },
        "istio.mcp.v1alpha1.Resource": {
          description:
            "Resource as transferred via the Mesh Configuration Protocol. Each resource is made up of common metadata, and a type-specific resource payload.",
          type: "object",
          properties: {
            body: {
              description: "The primary payload for the resource.",
              type: "object",
              required: ["@type"],
              properties: {
                "@type": {
                  description:
                    'A URL/resource name that uniquely identifies the type of the serialized protocol buffer message. This string must contain at least one "/" character. The last segment of the URL\'s path must represent the fully qualified name of the type (as in `type.googleapis.com/google.protobuf.Duration`). The name should be in a canonical form (e.g., leading "." is not accepted). The remaining fields of this object correspond to fields of the proto messsage. If the embedded message is well-known and has a custom JSON representation, that representation is assigned to the \'value\' field.',
                  type: "string",
                  format: "string",
                },
              },
            },
            metadata: {
              $ref: "#/components/schemas/istio.mcp.v1alpha1.Metadata",
            },
          },
        },
        "istio.mcp.v1alpha1.IncrementalMeshConfigRequest": {
          description:
            "IncrementalMeshConfigRequest are be sent in 2 situations: 1. Initial message in a MCP bidirectional gRPC stream.",
          type: "object",
          properties: {
            sinkNode: {
              $ref: "#/components/schemas/istio.mcp.v1alpha1.SinkNode",
            },
            typeUrl: {
              description:
                'Type of the resource that is being requested, e.g. "type.googleapis.com/istio.io.networking.v1alpha3.VirtualService".',
              type: "string",
              format: "string",
            },
            responseNonce: {
              description:
                "When the IncrementalMeshConfigRequest is a ACK or NACK message in response to a previous IncrementalMeshConfigResponse, the response_nonce must be the nonce in the IncrementalMeshConfigResponse. Otherwise response_nonce must be omitted.",
              type: "string",
              format: "string",
            },
            errorDetail: {
              $ref: "#/components/schemas/google.rpc.Status",
            },
            initialResourceVersions: {
              description:
                "When the IncrementalMeshConfigRequest is the first in a stream, the initial_resource_versions must be populated. Otherwise, initial_resource_versions must be omitted. The keys are the resources names of the MCP resources known to the MCP client. The values in the map are the associated resource level version info.",
              type: "object",
              additionalProperties: {
                type: "string",
                format: "string",
              },
            },
          },
        },
        "istio.mcp.v1alpha1.IncrementalMeshConfigResponse": {
          description:
            "IncrementalMeshConfigResponses do not need to include a full snapshot of the tracked resources. Instead they are a diff to the state of a MCP client. Per resource versions allow servers and clients to track state at the resource granularity. An MCP incremental session is always in the context of a gRPC bidirectional stream. This allows the MCP server to keep track of the state of MCP clients connected to it.",
          type: "object",
          properties: {
            resources: {
              description:
                "The response resources wrapped in the common MCP *Resource* message. These are typed resources that match the type url in the IncrementalMeshConfigRequest.",
              type: "array",
              items: {
                $ref: "#/components/schemas/istio.mcp.v1alpha1.Resource",
              },
            },
            nonce: {
              description:
                "The nonce provides a way for IncrementalMeshConfigRequests to uniquely reference an IncrementalMeshConfigResponse. The nonce is required.",
              type: "string",
              format: "string",
            },
            systemVersionInfo: {
              description:
                "The version of the response data (used for debugging).",
              type: "string",
              format: "string",
            },
            removedResources: {
              description:
                "Resources names of resources that have be deleted and to be removed from the MCP Client. Removed resources for missing resources can be ignored.",
              type: "array",
              items: {
                type: "string",
                format: "string",
              },
            },
          },
        },
        "istio.mcp.v1alpha1.RequestResources": {
          description:
            "A RequestResource can be sent in two situations: Initial message in an MCP bidirectional change stream as an ACK or NACK response to a previous Resources. In this case the response_nonce is set to the nonce value in the Resources. ACK/NACK is determined by the presence of error_detail.",
          type: "object",
          properties: {
            sinkNode: {
              $ref: "#/components/schemas/istio.mcp.v1alpha1.SinkNode",
            },
            responseNonce: {
              description:
                "When the RequestResources is an ACK or NACK message in response to a previous RequestResources, the response_nonce must be the nonce in the RequestResources. Otherwise response_nonce must be omitted.",
              type: "string",
              format: "string",
            },
            errorDetail: {
              $ref: "#/components/schemas/google.rpc.Status",
            },
            initialResourceVersions: {
              description:
                "When the RequestResources is the first in a stream, the initial_resource_versions must be populated. Otherwise, initial_resource_versions must be omitted. The keys are the resources names of the MCP resources known to the MCP client. The values in the map are the associated resource level version info.",
              type: "object",
              additionalProperties: {
                type: "string",
                format: "string",
              },
            },
            collection: {
              description:
                "Type of resource collection that is being requested, e.g.",
              type: "string",
              format: "string",
            },
            incremental: {
              description:
                "Request an incremental update for the specified collection. The source may choose to honor this request or ignore and and provide a full-state update in the corresponding `Resource` response.",
              type: "boolean",
            },
          },
        },
        "istio.mcp.v1alpha1.Resources": {
          description:
            "Resources do not need to include a full snapshot of the tracked resources. Instead they are a diff to the state of a MCP client. Per resource versions allow sources and sinks to track state at the resource granularity. An MCP incremental session is always in the context of a gRPC bidirectional stream. This allows the MCP source to keep track of the state of MCP sink connected to it.",
          type: "object",
          properties: {
            resources: {
              description:
                "The response resources wrapped in the common MCP *Resource* message. These are typed resources that match the type url in the RequestResources message.",
              type: "array",
              items: {
                $ref: "#/components/schemas/istio.mcp.v1alpha1.Resource",
              },
            },
            nonce: {
              description:
                "Required. The nonce provides a way for RequestChange to uniquely reference a RequestResources.",
              type: "string",
              format: "string",
            },
            systemVersionInfo: {
              description:
                "The version of the response data (used for debugging).",
              type: "string",
              format: "string",
            },
            removedResources: {
              description:
                "Names of resources that have been deleted and to be removed from the MCP sink node. Removed resources for missing resources can be ignored.",
              type: "array",
              items: {
                type: "string",
                format: "string",
              },
            },
            collection: {
              description:
                "Type of resource collection that is being requested, e.g.",
              type: "string",
              format: "string",
            },
            incremental: {
              description:
                "This resource response is an incremental update. The source should only send incremental updates if the sink requested them.",
              type: "boolean",
            },
          },
        },
        "istio.mcp.v1alpha1.Metadata": {
          description:
            "Metadata information that all resources within the Mesh Configuration Protocol must have.",
          type: "object",
          properties: {
            name: {
              description:
                "Fully qualified name of the resource. Unique in context of a collection.",
              type: "string",
              format: "string",
            },
            annotations: {
              description:
                "Map of string keys and values that can be used by source and sink to communicate arbitrary metadata about this resource.",
              type: "object",
              additionalProperties: {
                type: "string",
                format: "string",
              },
            },
            createTime: {
              description: "The creation timestamp of the resource.",
              type: "string",
              format: "dateTime",
            },
            version: {
              description:
                "Resource version. This is used to determine when resources change across resource updates. It should be treated as opaque by consumers/sinks.",
              type: "string",
              format: "string",
            },
            labels: {
              description:
                "Map of string keys and values that can be used to organize and categorize resources within a collection.",
              type: "object",
              additionalProperties: {
                type: "string",
                format: "string",
              },
            },
          },
        },
        "google.rpc.Status": {
          description:
            "This is populated when the previously received resources could not be applied The *message* field in *error_details* provides the source internal error related to the failure.",
          type: "object",
          properties: {
            code: {
              description:
                "The status code, which should be an enum value of [google.rpc.Code][google.rpc.Code].",
              type: "integer",
              format: "int32",
            },
            message: {
              description:
                "A developer-facing error message, which should be in English. Any user-facing error message should be localized and sent in the [google.rpc.Status.details][google.rpc.Status.details] field, or localized by the client.",
              type: "string",
              format: "string",
            },
            details: {
              description:
                "A list of messages that carry the error details. There is a common set of message types for APIs to use.",
              type: "array",
              items: {
                type: "object",
                required: ["@type"],
                properties: {
                  "@type": {
                    description:
                      'A URL/resource name that uniquely identifies the type of the serialized protocol buffer message. This string must contain at least one "/" character. The last segment of the URL\'s path must represent the fully qualified name of the type (as in `type.googleapis.com/google.protobuf.Duration`). The name should be in a canonical form (e.g., leading "." is not accepted). The remaining fields of this object correspond to fields of the proto messsage. If the embedded message is well-known and has a custom JSON representation, that representation is assigned to the \'value\' field.',
                    type: "string",
                    format: "string",
                  },
                },
              },
            },
          },
        },
      },
    },
  },
];

const transformKey = k => {
	const bits = k.split(/\./g);
	return `/${bits[bits.length - 1]}-${bits[1]}-${bits[2]}.json`.toLowerCase();
}
const pathsToSchemas = schemas.reduce((agg,s) => {
	Object.keys(s.components.schemas).forEach(k => agg[transformKey(k)] = {
		components: { schemas: s.components.schemas[k] }});
	return agg;
}, {});
module.exports = pathsToSchemas;

/***/ }),

/***/ 7810:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

// Note: These are not official or complete. I've basically just made them up based on documentation.
// They are good enough for now but will probably need to be updated/expanded. 
// Hopefully people start publishing OpenAPI schemas soon.

const { objectMeta } = __webpack_require__(3040);
const entityRule = {
  type: "object",
  properties: {
    nets: {
      type: ["array", "null"],
    },
    notNets: {
      type: ["array", "null"],
    },
    selector: { type: "string" },
    notSelector: { type: "string" },
    namespaceSelector: { type: "string" },
    ports: {
      type: ["array", "null"],
    },
    notPorts: {
      type: ["array", "null"],
    },
    serviceAccounts: {
      names: {
        type: ["array", "null"],
      },
      selector: { type: "string" },
    },
  },
};
const rule = {
  type: "object",
  properties: {
    action: {
      type: "string",
    },
    metadata: { annotations: {} },
    protocol: {
      type: "string",
    },
    notProtocol: {
      type: "string",
    },
    icmp: {
      type: "object",
    },
    notIcmp: {
      type: "object",
    },
    ipVersion: {
      type: "integer",
    },
    destination: entityRule,
    source: entityRule,
  },
};
module.exports = {
  "/networkpolicy-crd-v1.json": {
    $schema: "http://json-schema.org/draft-04/schema#",
    type: "object",
    properties: {
      apiVersion: {
        type: "string",
      },
      kind: {
        type: "string",
      },
      metadata: objectMeta,
      spec: {
        type: "object",
        properties: {
          selector: {
            type: "string",
          },
          order: {
            type: "number",
          },
          serviceAccountSelector: {
            type: "object",
          },
          types: {
            type: "array",
            items: [],
          },
          ingress: {
            type: ["array", "null"],
            items: [rule],
          },
          egress: {
            type: ["array", "null"],
            items: [rule],
          },
        },
      },
    },
    required: ["apiVersion", "kind", "metadata", "spec"],
  },
};


/***/ }),

/***/ 216:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

// Note: These are not official or complete. I've basically just made them up based on documentation.
// They are good enough for now but will probably need to be updated/expanded.
// Hopefully people start publishing OpenAPI schemas soon.

const { objectMeta } = __webpack_require__(3040);

module.exports = {
  "/sealedsecret-bitnami-v1alpha1.json": {
    $schema: "http://json-schema.org/draft-04/schema#",
    type: "object",
    properties: {
      apiVersion: {
        type: "string",
      },
      kind: {
        type: "string",
      },
      metadata: objectMeta,
      spec: {
        type: "object",
        properties: {
          encryptedData: {
            type: "object",
          },
          template: {
            type: "object",
            properties: {
              metadata: objectMeta,
              type: {
                type: "string",
              },
            },
            required: ["metadata", "type"],
          },
        },
        required: ["encryptedData"],
      },
    },
    required: ["apiVersion", "kind", "metadata", "spec"],
  },
};


/***/ }),

/***/ 2925:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const http = __webpack_require__(8605);
const https = __webpack_require__(7211);
const schemas = __webpack_require__(5225);
const URL = __webpack_require__(8835).URL; // https://stackoverflow.com/questions/52566578/url-is-not-defined-in-node-js/52566656

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


/***/ }),

/***/ 7549:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.customValidation = exports.cleanUpYaml = exports.checkSecrets = exports.removeKustomizeValues = void 0;
const simplifyRam = (input) => {
    var _a, _b, _c;
    const units = 'kmgtp';
    const inNum = parseInt(((_a = input.match(/^\d+/)) === null || _a === void 0 ? void 0 : _a.shift()) || '0');
    const inUnit = (_c = (_b = input.toLowerCase().match(/\D+$/)) === null || _b === void 0 ? void 0 : _b.shift()) === null || _c === void 0 ? void 0 : _c.trim();
    let num = inNum;
    let unit = inUnit;
    if (!inNum || !inUnit) {
        return input;
    }
    let unitIndex = units.indexOf(inUnit[0]);
    if (unitIndex === -1) {
        return input;
    }
    const divisor = inUnit.endsWith('i') ? 1000 : 1024;
    while (num % divisor === 0) {
        unitIndex++;
        num /= divisor;
    }
    unit =
        units[unitIndex].toUpperCase() +
            (inUnit.length > 1 ? inUnit.substr(1) : '');
    return num + unit;
};
const cleanElem = (log) => (elem, path) => {
    if ((/\/(creationtimestamp|subresources|webhooks)$/.test(path) &&
        elem.value === null) ||
        (/\/(subresources|labels|annotations|status|ports)$/.test(path) &&
            (elem.value === null ||
                elem.value.items == null ||
                elem.value.items.length === 0))) {
        log(`${path}\t\t: Removed`);
        return true;
    }
    if (elem.value.type === 'PLAIN') {
        if (path.endsWith('/limits/cpu') || path.endsWith('/requests/cpu')) {
            if (typeof elem.value.value === 'number') {
                elem.value.value = elem.value.value.toString();
            }
            else {
                const newVal = elem.value.value.replace(/000m/, '');
                if (elem.value.value !== newVal) {
                    log(`${path}\t\t: Changed from "${elem.value.value}" to "${newVal}"`);
                    elem.value.value = newVal;
                }
            }
        }
        if (path.endsWith('/limits/memory') || path.endsWith('/requests/memory')) {
            const newVal = simplifyRam(elem.value.value);
            if (elem.value.value !== newVal) {
                log(`${path}\t\t: Changed from "${elem.value.value}" to "${newVal}"`);
                elem.value.value = newVal;
            }
        }
    }
    return false;
};
const descendInToProps = (func, elem, path, parentNode) => {
    if (!elem) {
        return;
    }
    let curPath = path;
    if (elem.key && elem.key.value) {
        curPath = path + '/' + elem.key.value;
        const remove = func(elem, curPath.toLowerCase().trim());
        if (remove) {
            parentNode.delete(elem.key.value);
            return;
        }
    }
    const children = elem.items || (elem.value && elem.value.items);
    if (children) {
        children.map((e) => descendInToProps(func, e, curPath, elem.value));
    }
};
const removeKustomizeValues = (docs, logger) => docs.filter(d => {
    const toRemove = d.get('apiVersion') === 'kustomize.config.k8s.io/v1' &&
        d.get('kind') === 'Values';
    if (toRemove) {
        logger === null || logger === void 0 ? void 0 : logger.log(`Removing ${d.getIn(['metadata', 'namespace'])}/${d.getIn([
            'metadata',
            'name'
        ])}`);
    }
    return !toRemove;
});
exports.removeKustomizeValues = removeKustomizeValues;
const disjunctiveIntersectSecrets = (x, y) => x.filter(s => !!!y.find(a => a.namespace === s.namespace && a.name === s.name));
const checkSecrets = (docs, allowedSecrets, logger) => {
    const secrets = docs
        .filter(d => d.get('kind') === 'Secret')
        .map(s => s.get('metadata'))
        .map(m => ({ name: m.get('name'), namespace: m.get('namespace') }));
    if (secrets.length > allowedSecrets.length) {
        throw new Error(`Found ${secrets.length} secrets but only ${allowedSecrets.length} are allowed`);
    }
    logger === null || logger === void 0 ? void 0 : logger.log('Found secrets: ' + secrets.map(s => s.namespace + '/' + s.name).join(', '));
    logger === null || logger === void 0 ? void 0 : logger.log("Didn't find allowed secrets: " +
        disjunctiveIntersectSecrets(allowedSecrets, secrets)
            .map(s => s.namespace + '/' + s.name)
            .join(', '));
    const invalidSecrets = disjunctiveIntersectSecrets(secrets, allowedSecrets);
    if (invalidSecrets.length > 0) {
        throw new Error(`Invalid secrets: ${invalidSecrets
            .map(s => s.namespace + '/' + s.name)
            .join(', ')}`);
    }
};
exports.checkSecrets = checkSecrets;
const cleanUpYaml = (doc, logger) => {
    let modified = false;
    descendInToProps(cleanElem(s => {
        modified = true;
        logger === null || logger === void 0 ? void 0 : logger.log(s);
    }), doc.contents, '', doc);
    return { doc, modified };
};
exports.cleanUpYaml = cleanUpYaml;
const customValidation = (input, customValidation, logger) => {
    logger === null || logger === void 0 ? void 0 : logger.log(JSON.stringify(customValidation, null, 2));
    return customValidation
        .filter(v => {
        const m = v.regex.exec(input);
        const fail = !!m !== v.expected;
        logger === null || logger === void 0 ? void 0 : logger.log(`${v.regex.source}	:${m ? 'Matched' : 'Not matched'}	${fail ? 'Fail ' : 'Pass'} "${m && m}"`);
        return fail;
    })
        .map(v => v.message);
};
exports.customValidation = customValidation;


/***/ }),

/***/ 6144:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const core = __importStar(__webpack_require__(2186));
const yaml_1 = __importDefault(__webpack_require__(3552));
const logger_1 = __webpack_require__(4636);
const kustomize_1 = __importDefault(__webpack_require__(701));
const cleanYaml_1 = __webpack_require__(7549);
const validation_1 = __importDefault(__webpack_require__(6722));
const setup_1 = __webpack_require__(8429);
const outputs_1 = __webpack_require__(1698);
const utils_1 = __webpack_require__(1314);
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    const isAction = !!process.env.GITHUB_EVENT_NAME;
    const logger = isAction ? logger_1.buildActionLogger() : logger_1.buildConsoleLogger();
    if (!isAction) {
        logger.warn('Not running as action because GITHUB_WORKFLOW env var is not set');
    }
    try {
        const settings = setup_1.getSettings(isAction);
        output(logger, settings.verbose, 'Parsing and validating settings');
        if (settings.verbose) {
            console.log(yaml_1.default.stringify(settings));
        }
        yield setup_1.validateSettings(settings);
        output(logger, settings.verbose, 'Validating environment (binaries, plugin path etc)');
        yield setup_1.validateEnvironment(settings.requiredBins, settings.verbose ? logger : undefined);
        const { yaml, errors } = yield getYaml(settings, logger);
        if (settings.outputActions && settings.outputActions.length) {
            output(logger, settings.verbose, 'Running output actions');
            yield outputs_1.runActions(yaml, errors, settings, logger);
        }
        if (errors.length) {
            throw new Error('Invalid yaml:\n' + errors.join('\n'));
        }
        logger.log('Finished');
    }
    catch (error) {
        console.log(error);
        logger.error(error.message);
        if (isAction) {
            core.setFailed(error.message || 'Failed');
        }
        else {
            process.exit(1);
        }
    }
});
const output = (logger, verbose, msg) => {
    if (!verbose) {
        logger.log(msg);
        return;
    }
    logger.log('\n\n' + utils_1.makeBox(msg));
};
const getYaml = (settings, logger) => __awaiter(void 0, void 0, void 0, function* () {
    output(logger, settings.verbose, 'Running kustomize');
    const resources = yield kustomize_1.default(settings.kustomizePath, settings.extraResources, logger, settings.kustomizeArgs);
    output(logger, settings.verbose, 'Removing superfluous kustomize resources');
    const docs = cleanYaml_1.removeKustomizeValues(resources, settings.verbose ? logger : undefined);
    output(logger, settings.verbose, 'Cleaning up YAML');
    const { cleanedDocs, modified } = docs.reduce((a, d) => {
        const { doc, modified } = cleanYaml_1.cleanUpYaml(d, settings.verbose ? logger : undefined);
        a.cleanedDocs.push(doc);
        a.modified = a.modified || modified;
        return a;
    }, { cleanedDocs: [], modified: false });
    if (!modified && settings.verbose) {
        logger.log('No changes required');
    }
    output(logger, settings.verbose, 'Checking for unencrypted secrets');
    cleanYaml_1.checkSecrets(cleanedDocs, settings.allowedSecrets, logger);
    const yaml = cleanedDocs.join(''); // The docs retain their --- when parsed
    let errors = [];
    if (settings.validateWithKubeVal) {
        output(logger, settings.verbose, 'Validating YAML');
        errors = yield validation_1.default(yaml, logger);
    }
    if (settings.customValidation.length) {
        output(logger, settings.verbose, 'Running customValidation tests');
        errors = errors.concat(cleanYaml_1.customValidation(yaml, settings.customValidation, settings.verbose ? logger : undefined));
    }
    return { yaml, errors: errors.filter(e => e !== undefined) };
});
main();


/***/ }),

/***/ 701:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const child_process_1 = __webpack_require__(3129);
const fs_1 = __importDefault(__webpack_require__(5747));
const path_1 = __importDefault(__webpack_require__(5622));
const tmp_1 = __importDefault(__webpack_require__(8517));
const yaml_1 = __importDefault(__webpack_require__(3552));
const runKustomize = (rootPath, logger, kustomizeArgs, binPath) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((res, rej) => {
        const args = ['build', rootPath, ...kustomizeArgs.split(/\ +/g)];
        logger.log('Running: ' + [binPath || 'kustomize', ...args].join(' '));
        child_process_1.execFile(binPath || 'kustomize', args, (err, stdOut, stdErr) => {
            if (stdErr && stdErr.length) {
                logger.error(stdErr);
            }
            if (err) {
                logger.error(err);
                return rej({ err, stdOut, stdErr });
            }
            res({ stdOut, stdErr });
        });
    });
});
const prepDirectory = (rootPath, extraResources = []) => __awaiter(void 0, void 0, void 0, function* () {
    yield validatePaths(rootPath, extraResources);
    const { dir, cleanUp } = yield new Promise((res, rej) => tmp_1.default.dir({ unsafeCleanup: true }, (err, dir, cleanUp) => err ? rej(err) : res({ dir, cleanUp })));
    yield Promise.all([
        ...referenceFiles(dir, rootPath, extraResources),
        createKustomization(dir, extraResources)
    ]);
    return { dir, cleanUp };
});
const validatePaths = (rootPath, extraResources) => __awaiter(void 0, void 0, void 0, function* () {
    const stats = yield fs_1.default.promises.stat(rootPath);
    if (!stats.isDirectory()) {
        throw new Error(rootPath + ' is not a directory');
    }
    yield Promise.all(extraResources.map(p => fs_1.default.promises.stat(p).then(stats => {
        if (stats.isDirectory()) {
            throw new Error(p + ' is a directory');
        }
    })));
});
const referenceFiles = (dir, rootPath, extraResources) => extraResources
    .map(p => fs_1.default.promises.copyFile(p, path_1.default.join(dir, path_1.default.basename(p))))
    .concat(fs_1.default.promises.symlink(rootPath, path_1.default.join(dir, 'root')));
const createKustomization = (dir, extraResources) => fs_1.default.promises.writeFile(path_1.default.join(dir, 'kustomization.yaml'), `
bases:
- root
resources:
${extraResources.map(p => '- ' + path_1.default.basename(p)).join('\n')}
`);
exports.default = (path, extraResources = [], logger, kustomizeArgs, binPath) => __awaiter(void 0, void 0, void 0, function* () {
    const { dir: tmpPath, cleanUp } = yield prepDirectory(path, extraResources);
    const { stdOut, stdErr } = yield runKustomize(tmpPath, logger, kustomizeArgs, binPath);
    if (stdErr != '') {
        throw new Error(stdErr);
    }
    cleanUp();
    return yaml_1.default.parseAllDocuments(stdOut, { prettyErrors: true });
});


/***/ }),

/***/ 4636:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.buildTestLogger = exports.buildConsoleLogger = exports.buildActionLogger = void 0;
const core = __importStar(__webpack_require__(2186));
const buildActionLogger = () => ({
    log: (msg) => core.info(msg),
    warn: (msg) => core.warning(msg),
    error: (msg) => core.error(msg)
});
exports.buildActionLogger = buildActionLogger;
const buildConsoleLogger = () => ({
    log: (msg) => console.log(msg),
    warn: (msg) => console.warn(msg),
    error: (msg) => console.error(msg)
});
exports.buildConsoleLogger = buildConsoleLogger;
const buildTestLogger = (logs, warnings, errors) => ({
    log: (msg) => logs === null || logs === void 0 ? void 0 : logs.push(msg),
    warn: (msg) => warnings === null || warnings === void 0 ? void 0 : warnings.push(msg),
    error: (msg) => errors === null || errors === void 0 ? void 0 : errors.push(msg)
});
exports.buildTestLogger = buildTestLogger;


/***/ }),

/***/ 1698:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.parseActions = exports.runActions = exports.FileOutputAction = exports.VariableOutputAction = exports.LoggerOutputAction = void 0;
const core = __importStar(__webpack_require__(2186));
const path_1 = __importDefault(__webpack_require__(5622));
const fs_1 = __webpack_require__(5747);
const utils_1 = __webpack_require__(1314);
class LoggerOutputAction {
    constructor() {
        this.type = 'LoggerOutputAction';
        this.logErrors = true;
        this.logYaml = true;
    }
    invoke(yaml, errors, settings, logger) {
        if (this.logYaml) {
            logger.log(yaml);
        }
        if (this.logErrors) {
            errors.forEach(logger.error);
        }
        return Promise.resolve();
    }
}
exports.LoggerOutputAction = LoggerOutputAction;
class VariableOutputAction {
    constructor() {
        this.type = 'VariableOutputAction';
        this.outputVariableName = 'output';
        this.errorsVariableName = 'errors';
    }
    invoke(yaml, errors, settings, logger) {
        if (this.outputVariableName) {
            core.setOutput(this.outputVariableName, yaml);
            if (settings.verbose) {
                logger.log(`Wrote ${yaml.length} chars to ${this.outputVariableName}`);
            }
        }
        if (this.errorsVariableName) {
            core.setOutput(this.errorsVariableName, errors);
            if (settings.verbose) {
                logger.log(`Wrote ${errors.length} errors to ${this.errorsVariableName}`);
            }
        }
        return Promise.resolve();
    }
}
exports.VariableOutputAction = VariableOutputAction;
class FileOutputAction {
    constructor() {
        this.type = 'FileOutputAction';
        this.createDirIfMissing = true;
        this.fileOpenFlags = 'w';
        this.dontOutputIfErrored = true;
    }
    invoke(yaml, errors, settings, logger) {
        return new Promise((res, rej) => {
            if (this.dontOutputIfErrored && errors.length) {
                return res();
            }
            const workspaceDir = utils_1.getWorkspaceRoot();
            const getPath = (p) => path_1.default.isAbsolute(p) ? p : path_1.default.join(workspaceDir, p);
            const fileName = getPath(utils_1.resolveEnvVars(this.fileName));
            const writeToFile = () => {
                const str = fs_1.createWriteStream(fileName, {
                    flags: this.fileOpenFlags,
                    autoClose: true
                });
                str.on('error', rej);
                str.write(yaml, err => (err ? rej(err) : str.end(res)));
            };
            if (this.createDirIfMissing) {
                fs_1.promises
                    .mkdir(path_1.default.dirname(fileName), { recursive: true })
                    .catch(rej)
                    .then(writeToFile);
            }
            else {
                writeToFile();
            }
            if (settings.verbose) {
                logger.log(`Wrote ${yaml.length} chars to file ${fileName}`);
            }
        });
    }
}
exports.FileOutputAction = FileOutputAction;
const runActions = (yaml, errors, settings, logger) => __awaiter(void 0, void 0, void 0, function* () {
    const actions = settings.outputActions;
    for (let i = 0; i < actions.length; i++) {
        if (settings.verbose) {
            logger.log('Invoking ' + actions[i].type);
        }
        yield actions[i].invoke(yaml, errors, settings, logger);
    }
});
exports.runActions = runActions;
const parseActions = (json, typeMappings) => {
    const types = typeMappings || {
        LoggerOutputAction: LoggerOutputAction,
        VariableOutputAction: VariableOutputAction,
        FileOutputAction: FileOutputAction
    };
    const actions = JSON.parse(json).map((i) => {
        if (Object.keys(types).indexOf(i.type) === -1) {
            throw new Error('cant find output action ' + i.type);
        }
        const target = new types[i.type]();
        for (const key in i) {
            target[key] = i[key];
        }
        return target;
    });
    return actions;
};
exports.parseActions = parseActions;


/***/ }),

/***/ 8429:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.defaultKustomizeArgs = exports.validateSettings = exports.getSettings = exports.parseCustomValidation = exports.parseAllowedSecrets = exports.createKustomizeFolder = exports.validateEnvironment = void 0;
const utils_1 = __webpack_require__(1314);
const core = __importStar(__webpack_require__(2186));
const dotenv_1 = __importDefault(__webpack_require__(2437));
const fs_1 = __importDefault(__webpack_require__(5747));
const path_1 = __importDefault(__webpack_require__(5622));
const outputs_1 = __webpack_require__(1698);
const validateEnvironment = (required = ['kustomize', 'kubeval', 'helm'], logger) => __awaiter(void 0, void 0, void 0, function* () {
    return Promise.all(required
        .map(b => new Promise((res, rej) => {
        utils_1.getBinPath(b).then(path => {
            if (path) {
                logger === null || logger === void 0 ? void 0 : logger.log('Found ' + b + ' at ' + path);
                res(undefined);
            }
            else {
                rej(b + ' is required');
            }
        });
    }))
        .concat(exports.createKustomizeFolder()));
});
exports.validateEnvironment = validateEnvironment;
const createKustomizeFolder = () => new Promise(r => {
    let dir;
    if (process.env['KUSTOMIZE_PLUGIN_HOME']) {
        dir = process.env['KUSTOMIZE_PLUGIN_HOME'];
    }
    else if (process.env['XDG_CONFIG_HOME']) {
        dir = path_1.default.join(process.env['XDG_CONFIG_HOME'], 'kustomize', 'plugin');
    }
    else {
        dir = path_1.default.join(process.env['HOME'], 'kustomize', 'plugin');
    }
    fs_1.default.promises.mkdir(dir, { recursive: true }).finally(r);
});
exports.createKustomizeFolder = createKustomizeFolder;
const parseAllowedSecrets = (secretString) => secretString
    .split(/,/g)
    .map(s => s.trim().toLowerCase())
    .filter(i => i.indexOf('/') > -1)
    .map(i => ({ namespace: i.split(/\//)[0], name: i.split(/\//)[1] }));
exports.parseAllowedSecrets = parseAllowedSecrets;
const parseCustomValidation = (customValidation) => customValidation
    ? customValidation
        .split(/(?<!\\)\n/g)
        .map(i => i.split(/\|/g))
        .map(i => {
        if (i.length >= 3) {
            const parseRx = (str) => {
                const rx = /(^[^\/].*[^\/]$)|^\/(.*)\/([igmsuy]*)$/; // Parse "this" "/this/" or "/this/ig"
                const match = rx.exec(str);
                if (!match) {
                    throw new Error('Invalid regex: ' + str);
                }
                return match[1]
                    ? new RegExp(match[1])
                    : new RegExp(match[2], match[3]);
            };
            return {
                message: i.shift(),
                expected: i.shift().toLowerCase() === 'true',
                regex: parseRx(i.join('|'))
            };
        }
        throw new Error('Invalid custom validation rule "' + i + '": ' + JSON.stringify(i));
    })
    : [];
exports.parseCustomValidation = parseCustomValidation;
const getSettings = (isAction) => {
    if (!isAction) {
        dotenv_1.default.config();
    }
    const getRequiredFromEnv = (name) => {
        const val = process.env[name];
        if (val === undefined) {
            throw new Error(`${name} is required`);
        }
        return val;
    };
    const getFromEnv = (name) => process.env[name];
    const getSetting = (actionSettingName, envVarName, required = false) => isAction
        ? core.getInput(actionSettingName, { required: required })
        : (required ? getRequiredFromEnv : getFromEnv)(envVarName);
    const kustomizePath = getSetting('kustomize-path', 'KUSTOMIZE_PATH', true);
    const outputActions = getSetting('output-actions', 'OUTPUT_ACTIONS', true);
    const extraResources = getSetting('extra-resources', 'EXTRA_RESOURCES');
    const customValidation = getSetting('custom-validation-rules', 'CUSTOM_VALIDATION_RULES', false);
    const allowedSecrets = getSetting('allowed-secrets', 'ALLOWED_SECRETS');
    const requiredBins = getSetting('required-bins', 'REQUIRED_BINS');
    const verbose = getSetting('verbose', 'VERBOSE');
    const validateWithKubeVal = getSetting('validate-with-kubeval', 'VALIDATE_WITH_KUBEVAL');
    const kustomizeArgs = getSetting('kustomize-args', 'KUSTOMIZE_ARGS');
    const workspaceDir = utils_1.getWorkspaceRoot();
    const getPath = (p) => path_1.default.isAbsolute(p) ? p : path_1.default.join(workspaceDir, p);
    const defaultActions = `[
      { type: "LoggerOutputAction", logErrors: true, logYaml: false },
      {
        type: "VariableOutputAction",
        outputVariableName: "output",
        errorsVariableName: "errors",
      }
    ]
    `;
    return {
        kustomizePath: getPath(utils_1.resolveEnvVars(kustomizePath || '.')),
        outputActions: outputs_1.parseActions(outputActions || defaultActions),
        extraResources: extraResources
            ? utils_1.resolveEnvVars(extraResources)
                .split(',')
                .map(s => s.trim())
                .map(getPath)
            : [],
        customValidation: exports.parseCustomValidation(customValidation),
        allowedSecrets: exports.parseAllowedSecrets(utils_1.resolveEnvVars(allowedSecrets || '')),
        verbose: utils_1.resolveEnvVars(verbose || '').toLowerCase() === 'true',
        requiredBins: requiredBins
            ? utils_1.resolveEnvVars(requiredBins)
                .split(/,/g)
                .map(s => s.trim())
            : ['kustomize', 'kubeval', 'helm'],
        kustomizeArgs: utils_1.resolveEnvVars(kustomizeArgs || exports.defaultKustomizeArgs),
        validateWithKubeVal: utils_1.resolveEnvVars(validateWithKubeVal || '').toLowerCase() === 'true'
    };
};
exports.getSettings = getSettings;
const statFile = (p) => __awaiter(void 0, void 0, void 0, function* () {
    return fs_1.default.promises.stat(p).then(r => {
        if (!r.isFile()) {
            throw new Error(p + ' is not a file');
        }
    });
});
const statDir = (p) => __awaiter(void 0, void 0, void 0, function* () {
    return fs_1.default.promises.stat(p).then(r => {
        if (!r.isDirectory()) {
            throw new Error(p + ' is not a directory');
        }
    });
});
const validateSettings = (settings) => Promise.all([
    statDir(settings.kustomizePath).then(() => statFile(path_1.default.join(settings.kustomizePath, 'kustomization.yaml'))),
    ...(settings.extraResources || []).map(statFile)
]);
exports.validateSettings = validateSettings;
exports.defaultKustomizeArgs = '--enable_alpha_plugins';


/***/ }),

/***/ 1314:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.makeBox = exports.mockedCwd = exports.getWorkspaceRoot = exports.getBinPath = exports.resolveEnvVars = void 0;
const fs_1 = __importDefault(__webpack_require__(5747));
const path_1 = __importDefault(__webpack_require__(5622));
const resolveEnvVars = (str) => str
    ? str.replace(/(?<!\\)\$([A-Z_]+[A-Z0-9_]*)|(?<!\\)\${([A-Z0-9_]*)}/gi, (_, a, b) => process.env[a || b] || '')
    : '';
exports.resolveEnvVars = resolveEnvVars;
const getBinPath = (bin) => new Promise(res => {
    const possPaths = (process.env.PATH || '')
        .replace(/["]+/g, '')
        .split(path_1.default.delimiter)
        .map(p => (process.env.PATHEXT || '')
        .split(path_1.default.delimiter)
        .map(ext => path_1.default.join(p, bin + ext)));
    const paths = [].concat(...possPaths);
    let pathCount = paths.length;
    paths.map(p => fs_1.default.exists(p, (exists) => {
        pathCount--;
        if (exists) {
            return res(p);
        }
        if (pathCount === 0) {
            res(undefined);
        }
    }));
});
exports.getBinPath = getBinPath;
const getWorkspaceRoot = () => {
    const getParentGitDir = (parsed) => fs_1.default.existsSync(path_1.default.join(parsed.dir, parsed.name, '.git'))
        ? path_1.default.join(parsed.dir, parsed.name)
        : (parsed.dir !== parsed.root &&
            getParentGitDir(path_1.default.parse(parsed.dir))) ||
            undefined;
    return (process.env['GITHUB_WORKSPACE'] ||
        getParentGitDir(path_1.default.parse(exports.mockedCwd())) ||
        exports.mockedCwd());
};
exports.getWorkspaceRoot = getWorkspaceRoot;
let curDirName = __dirname;
const mockedCwd = (newDir) => {
    if (newDir) {
        curDirName = newDir;
    }
    return curDirName;
};
exports.mockedCwd = mockedCwd;
const makeBox = (title, minLen = 40, maxLen = 80, xPadding = 3, yPadding = 1) => {
    const tl = '\u2554', h = '\u2550', tr = '\u2557', v = '\u2551', bl = '\u255A', br = '\u255D';
    const wrap = (s, w) => s.split(/\s+/g).reduce((a, i) => {
        if (a.length === 0 || a[a.length - 1].length + i.length + 1 > w) {
            a.push('');
        }
        a[a.length - 1] += i + ' ';
        return a;
    }, []);
    const range = (n) => Array.from(Array(n).keys());
    const lines = wrap(title, maxLen);
    const width = lines.reduce((a, i) => (i.length > a ? i.length : a), minLen);
    const top = tl.padEnd(width + xPadding * 2, h) + tr;
    const empty = v.padEnd(width + xPadding * 2, ' ') + v;
    const text = lines.map(line => v.padEnd(xPadding, ' ') +
        (''.padEnd(Math.floor(width - line.length) / 2) + line).padEnd(width, ' ') +
        ''.padEnd(xPadding, ' ') +
        v);
    const bottom = bl.padEnd(width + xPadding * 2, h) + br;
    return [
        top,
        ...range(yPadding).map(_ => empty),
        ...text,
        ...range(yPadding).map(_ => empty),
        bottom
    ].join('\n');
};
exports.makeBox = makeBox;


/***/ }),

/***/ 6722:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const tmp_1 = __importDefault(__webpack_require__(8517));
const child_process_1 = __webpack_require__(3129);
const fs_1 = __importDefault(__webpack_require__(5747));
const server_1 = __importDefault(__webpack_require__(2925));
const runKubeVal = (path, port, logger, kubeValBin) => new Promise((res, rej) => {
    child_process_1.execFile(kubeValBin || 'kubeval', ['--strict', '--schema-location', 'http://localhost:' + port, path], (err, stdOut, stdErr) => {
        logger.log(stdOut);
        if (stdErr && stdErr.length) {
            logger.error(stdErr);
        }
        if (err) {
            return rej({ err, stdOut, stdErr });
        }
        res({ stdOut, stdErr });
    });
});
const getErrors = (text) => text
    .split(/\n/g)
    .map(line => (line.match(/^(WARN|ERR)\s/) ? line : undefined))
    .filter(err => err !== undefined && err.length > 0);
const main = (yaml, logger, kubeValBin) => __awaiter(void 0, void 0, void 0, function* () {
    const port = 1025 + (Math.floor(Math.random() * 100000) % (65535 - 1025));
    const stop = yield server_1.default.start(port);
    const { name: tmpYaml } = tmp_1.default.fileSync();
    yield fs_1.default.promises.writeFile(tmpYaml, yaml);
    let retVal;
    try {
        retVal = yield runKubeVal(tmpYaml, port, logger, kubeValBin);
    }
    catch (errData) {
        if (errData instanceof Error) {
            logger.error(errData);
            throw errData;
        }
        retVal = errData;
    }
    yield stop();
    const { stdOut, stdErr, err } = retVal;
    const errors = getErrors(stdOut + '\n' + stdErr);
    errors.forEach(e => logger.error(e || 'undefined'));
    if (err) {
        logger.error(err);
        if (errors.length === 0) {
            throw err;
        }
    }
    return errors;
});
exports.default = main;


/***/ }),

/***/ 2357:
/***/ ((module) => {

"use strict";
module.exports = require("assert");;

/***/ }),

/***/ 3129:
/***/ ((module) => {

"use strict";
module.exports = require("child_process");;

/***/ }),

/***/ 6417:
/***/ ((module) => {

"use strict";
module.exports = require("crypto");;

/***/ }),

/***/ 8614:
/***/ ((module) => {

"use strict";
module.exports = require("events");;

/***/ }),

/***/ 5747:
/***/ ((module) => {

"use strict";
module.exports = require("fs");;

/***/ }),

/***/ 8605:
/***/ ((module) => {

"use strict";
module.exports = require("http");;

/***/ }),

/***/ 7211:
/***/ ((module) => {

"use strict";
module.exports = require("https");;

/***/ }),

/***/ 2087:
/***/ ((module) => {

"use strict";
module.exports = require("os");;

/***/ }),

/***/ 5622:
/***/ ((module) => {

"use strict";
module.exports = require("path");;

/***/ }),

/***/ 8835:
/***/ ((module) => {

"use strict";
module.exports = require("url");;

/***/ }),

/***/ 1669:
/***/ ((module) => {

"use strict";
module.exports = require("util");;

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		if(__webpack_module_cache__[moduleId]) {
/******/ 			return __webpack_module_cache__[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		var threw = true;
/******/ 		try {
/******/ 			__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete __webpack_module_cache__[moduleId];
/******/ 		}
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat */
/******/ 	
/******/ 	__webpack_require__.ab = __dirname + "/";/************************************************************************/
/******/ 	// module exports must be returned from runtime so entry inlining is disabled
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(6144);
/******/ })()
;
//# sourceMappingURL=index.js.map