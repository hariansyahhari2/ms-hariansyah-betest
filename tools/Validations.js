const Joi = require('@hapi/joi')
const ResponseMessage = require('../responses/ResponseMessage')

exports.registerValidation = (data) => {
    const schema = Joi.object({
        userName: Joi.string()
            .required(),
        emailAddress: Joi.string()
            .email()
            .required(),
        accountNumber: Joi.number()
            .integer()
            .min(0),
        identityNumber: Joi.number()
            .integer()
            .min(0),
        password: Joi.string()
            .min(6)
            .required()
    })

    return schema.validate(data)
}

exports.updateValidation = (data) => {
    const schema = Joi.object({
        userName: Joi.string()
            .required(),
        emailAddress: Joi.string()
            .email()
            .required(),
        accountNumber: Joi.number()
            .integer()
            .min(0),
        identityNumber: Joi.number()
            .integer()
            .min(0),
        password: Joi.string()
            .min(6)
            .required()
    })

    return schema.validate(data)
}

exports.authenticateValidation = (data) => {
    const schema = Joi.object({
        emailAddress: Joi.string()
            .email()
            .required(),
        password: Joi.string()
            .min(6)
            .required()
    })

    return schema.validate(data)
}

exports.validateNumber = (res, data) => {
    const isNumber = data.match(/^[0-9]+$/)
    if (!isNumber) {
        return res.status(400).send(ResponseMessage.error(res.statusCode, 'Bad Request'))
    }
}
