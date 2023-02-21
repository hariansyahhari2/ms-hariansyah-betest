const jwt = require('jsonwebtoken');

const {
  secretKey
} = require('../env.configs');
const responseMessage = require('../responses/responseMessage');
const errorMessage = require('../constants/exceptions');

const authMiddleware = (req, res, next) => {
  const rawToken = req.header('Authorization');
  const splitToken = rawToken ? rawToken.split(' ') : [];

  if (splitToken[0] !== 'Bearer') {
    return res.status(errorMessage.INVALID_TOKEN.code).send(
      responseMessage.error(res.statusCode, errorMessage.INVALID_TOKEN.message)
    )
  }
  const token = splitToken[1];

  if(!token) {
    return res.status(errorMessage.ACCESS_DENIED.code).send(
      responseMessage.error(res.statusCode, errorMessage.ACCESS_DENIED.message)
    );
  }
  try {
    req.user = jwt.verify(token, secretKey);
    res.credentials = jwt.decode(token);
    next();
  }catch(err){
    res.status(errorMessage.INVALID_TOKEN.code).send(
      responseMessage.error(res.statusCode, errorMessage.INVALID_TOKEN.message)
    )
  }
}

module.exports = authMiddleware;
