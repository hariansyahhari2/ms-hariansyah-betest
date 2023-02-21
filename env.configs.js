require('dotenv/config');

const connectorProtocol = process.env.CONNECTOR_PROTOCOL;

const connector = require(connectorProtocol);
const homeBaseUrl = process.env.HOME_BASE_URL;

module.exports = {
  servicePort: process.env.PORT || '3000',
  connectors: {
    homeConnector: ({method, uri}) => {
      connector[method.toLowerCase()](`${connectorProtocol}://${homeBaseUrl}${uri}`)
    }
  },
  documentationUrl: process.env.DOCUMENTATION_URL,
  healthcheckDelay: process.env.HEALTHCHECK_DELAY,
  dbConnection: process.env.DB_CONNECTION,
  dbName: process.env.DB_NAME,
  redisHost: process.env.REDIS_HOST,
  redisPort: process.env.REDIS_PORT,
  redisPassword: process.env.REDIS_PASSWORD,
  redisTTL: process.env.REDIS_TTL,
  secretKey: process.env.SECRET_KEY,
  dbCollections: {
    userCollection: process.env.DB_COLLECTION_USER
  }
};
