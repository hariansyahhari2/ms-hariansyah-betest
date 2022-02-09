const badRequestCode = 400
const unauthorizedCode = 401
const forbiddenCode = 403
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

const EMAIL_OR_PASSWORD_INVALID = {
    code: unauthorizedCode,
    message: 'Email or Password invalid'
}

module.exports = {
    USER_EXIST,
    EMAIL_EXIST,
    ACCOUNT_NUMBER_EXIST,
    IDENTITY_NUMBER_EXIST,
    USER_NOT_FOUND,
    EMAIL_OR_PASSWORD_INVALID
}
