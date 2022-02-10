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
            .min(0)
            .required(),
        identityNumber: Joi.number()
            .integer()
            .min(0)
            .required(),
        password: Joi.string()
            .min(6)
            .required()
    });

    return schema.validate(data);
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
    });

    return schema.validate(data);
}

exports.authenticateValidation = (data) => {
    const schema = Joi.object({
        emailAddress: Joi.string()
            .email()
            .required(),
        password: Joi.string()
            .min(6)
            .required()
    });

    return schema.validate(data);
}

exports.deleteUser = (data) => {
    const schema = Joi.object({
        password: Joi.string()
            .min(6)
            .required()
    });

    return schema.validate(data);
}

exports.validateNumber = (data) => {
    try {
        return data.match(/^[0-9]+$/);
    } catch (err) {
        return false;
    }
}
