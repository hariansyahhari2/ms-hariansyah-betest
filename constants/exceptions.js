const badRequestCode = 400
const unauthorizedCode = 401
const notFoundCode = 404

const USER_EXIST = {
    code: badRequestCode,
    message: 'User already exists'
}

const EMAIL_EXIST = {
    code: badRequestCode,
    message: 'Email already exists'
}

const ACCOUNT_NUMBER_EXIST = {
    code: badRequestCode,
    message: 'Account number already exists'
}

const IDENTITY_NUMBER_EXIST = {
    code: badRequestCode,
    message: 'Identity Number already exists'
}

const USER_NOT_FOUND = {
    code: notFoundCode,
    message: 'User Not Found'
}

const EMAIL_INVALID = {
    code: unauthorizedCode,
    message: 'Email Not Found in Database'
}

const PASSWORD_INVALID = {
    code: unauthorizedCode,
    message: 'Password invalid'
}

const ACCESS_DENIED = {
    code: unauthorizedCode,
    message: 'Access Denied, Use Authorization token in header request!'
}

const INVALID_TOKEN = {
    code: unauthorizedCode,
    message: 'Invalid Token !'
}

module.exports = {
    USER_EXIST,
    EMAIL_EXIST,
    ACCOUNT_NUMBER_EXIST,
    IDENTITY_NUMBER_EXIST,
    ACCESS_DENIED,
    INVALID_TOKEN,
    USER_NOT_FOUND,
    EMAIL_INVALID,
    PASSWORD_INVALID
}
