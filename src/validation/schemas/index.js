const azureIdentity = require("./azureIdentity");
const azureIdentityBinding = require("./azureIdentityBinding");
const azureIdentityException = require("./azureIdentityException");
const sealedSecrets = require("./sealedSecrets");
const networkPolicy = require("./networkPolicy");
const customResourceDefinition = require("./customResourceDefinition");
const istio = require("./istio");

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
