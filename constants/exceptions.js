const badRequestCode = 400;
const unauthorizedCode = 401;
const notFoundCode = 404;
const internalServerErrorCode = 500;

const BAD_REQUEST = {
  code: badRequestCode,
  message: 'Bad Request'
};

const PATH_NOT_FOUND = {
  code: notFoundCode,
  message: 'Path Not Found'
};

const USER_EXISTS = {
  code: badRequestCode,
  message: 'User already exists'
};

const USER_NOT_FOUND = {
  code: notFoundCode,
  message: 'User Not Found'
};

const PASSWORD_INVALID = {
  code: unauthorizedCode,
  message: 'Password invalid'
};

const ACCESS_DENIED = {
  code: unauthorizedCode,
  message: 'Access Denied!'
};

const INVALID_TOKEN = {
  code: unauthorizedCode,
  message: 'Invalid Token!'
};

const STARTS_WITH_BEARER = {
  code: unauthorizedCode,
  message: 'Auth token must starts with Bearer'
};

const INTERNAL_SERVER_ERROR = {
  code: internalServerErrorCode,
  message: 'Internal Server Error'
}

module.exports = {
  BAD_REQUEST,
  PATH_NOT_FOUND,
  USER_EXISTS,
  ACCESS_DENIED,
  INVALID_TOKEN,
  USER_NOT_FOUND,
  PASSWORD_INVALID,
  STARTS_WITH_BEARER,
  INTERNAL_SERVER_ERROR
};
