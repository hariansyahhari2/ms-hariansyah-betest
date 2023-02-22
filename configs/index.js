const bodyParser = require('body-parser');
const cors = require('cors');
const responseTime = require('response-time');

const { healthcheckDelay, connectors: { homeConnector } } = require('../env.configs');

const indexRouter = require('../routes');
const userRouter = require('../routes/user');
const responseMessage = require('../responses/responseMessage');
const errorMessages = require('../constants/exceptions');

require('../configs/redis');

const initApp = (app) => {
  app.use(bodyParser())
  app.use(cors());
  app.use(responseTime())
  initRoutes(app);

  setInterval(() => { // hit the server simultaneously to prevent server going idle
    homeConnector({
      method: 'GET',
      uri: '/ping'
    })
  }, healthcheckDelay);
}

const initRoutes = (app) => {
  app.use('/', indexRouter);
  app.use('/', userRouter);

  app.use(function(req, res, next) {
    res.status(errorMessages.PATH_NOT_FOUND.code).send(responseMessage.error(res.statusCode, errorMessages.PATH_NOT_FOUND.message));
  });

}

module.exports = initApp
