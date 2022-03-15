const jwt = require('jsonwebtoken')
const ResponseMessage = require('../responses/ResponseMessage')
const errorMessage = require('../constants/exceptions')

const verifyToken = (req, res, next) => {
    const token = req.header('Authorization')
    if(!token) {
        return res.status(errorMessage.ACCESS_DENIED.code).send(
            ResponseMessage.error(res.statusCode, errorMessage.ACCESS_DENIED.message)
        );
    }
    try {
        req.user = jwt.verify(token, process.env.SECRET_KEY);
        next();

    }catch(err){
        res.status(errorMessage.INVALID_TOKEN.code).send(
            ResponseMessage.error(res.statusCode, errorMessage.INVALID_TOKEN.message)
        )
    }
}

module.exports = verifyToken;
