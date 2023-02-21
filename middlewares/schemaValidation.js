const ResponseMessage = require("../responses/responseMessage");
const schemaValidation = (validation) => {
  return async (req, res, next) => {
    const {
      headers: validateHeaders,
      query: validateQuery,
      params: validateParams,
      body: validateBody
    } = validation;

    const errors = {};

    if (validateHeaders) {
      const { error } = validateHeaders(req.headers);
      if (error) {
        Object.assign(errors, {
          headers: error.message
        });
      }
    }

    if (validateQuery) {
      const { error } = validateQuery(req.query);
      if (error) {
        Object.assign(errors, {
          query: error.message
        });
      }
    }

    if (validateParams) {
      const { error } = validateParams(req.params);
      if (error) {
        Object.assign(errors, {
          params: error.message
        });
      }
    }

    if (validateBody) {
      const { error } = validateBody(req.body);
      if (error) {
        Object.assign(errors, {
          body: error.message
        });
      }
    }

    if (Object.keys(errors).length === 0) {
      return next();
    }

    return res.status(404).send(
      ResponseMessage.badRequest(errors)
    );
  };
}

module.exports = schemaValidation;
