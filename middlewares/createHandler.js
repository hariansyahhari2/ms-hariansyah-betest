const ResponseMessage = require('../responses/responseMessage');
const errorMessage = require('../constants/exceptions');

const createHandler = (handler) => {
  return async (req, res, next) => {
    try {
      return handler(req, res, next);
    } catch (error) {
      return res.status(errorMessage.INTERNAL_SERVER_ERROR.code).send(
        ResponseMessage.error(res.statusCode, errorMessage.INTERNAL_SERVER_ERROR.message, error.message)
      )
    }
  };
}

module.exports = createHandler;
