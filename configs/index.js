const bodyParser = require('body-parser')
const cors = require('cors')
const indexRouter = require('../routes')
const userRouter = require('../routes/user')
const ResponseMessage = require('../responses/ResponseMessage')
const errorMessages = require('../constants/exceptions')

const init = (app) => {
    app.use(bodyParser())
    app.use(cors());
    initRoutes(app);
}

const initRoutes = (app) => {
    app.use('/', indexRouter);
    app.use('/user', userRouter);

    app.use(function(req, res, next) {
        res.status(errorMessages.PATH_NOT_FOUND.code).send(ResponseMessage.error(res.statusCode, errorMessages.PATH_NOT_FOUND.message));
    });

}

module.exports = init
