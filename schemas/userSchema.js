const Joi = require("@hapi/joi");

exports.registerUserSchema = (data) => {
  const schema = Joi.object({
    userName: Joi.string()
      .required(),
    emailAddress: Joi.string()
      .required(),
    accountNumber: Joi.string()
      .required(),
    identityNumber: Joi.string()
      .required(),
    password: Joi.string()
      .min(6)
      .required()
  });

  return schema.validate(data);
};

exports.updateUserSchema = (data) => {
  const schema = Joi.object({
    emailAddress: Joi.string(),
    accountNumber: Joi.string(),
    identityNumber: Joi.string(),
    password: Joi.string()
      .min(6)
      .required()
  });

  return schema.validate(data);
};

exports.authenticateUserSchema = (data) => {
  const schema = Joi.object({
    userName: Joi.string()
      .required(),
    password: Joi.string()
      .min(6)
      .required()
  });

  return schema.validate(data);
}
