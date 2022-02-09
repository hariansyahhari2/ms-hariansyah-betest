const jwt = require('jsonwebtoken')
const ResponseMessage = require('../responses/ResponseMessage')

const verifyToken = (req, res, next) => {
    const token = req.header('Authorization')
    if(!token) return res.status(400).json({
        status: res.statusCode,
        message: 'Access Denied, Use Authorization token in header request! '
    })
    try {
        req.user = jwt.verify(token, process.env.SECRET_KEY)
        next()

    }catch(err){
        res.status(400).send(
            ResponseMessage.error(res.statusCode, 'Invalid Token !')
        )
    }
}

module.exports = verifyToken
