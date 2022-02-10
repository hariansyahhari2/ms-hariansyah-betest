const bodyParser = require('body-parser')
const cors = require('cors')
const indexRouter = require('../routes')
const userRouter = require('../routes/user')
const ResponseMessage = require('../responses/ResponseMessage')

const init = (app) => {
    app.use(bodyParser())
    app.use(cors());
    initRoutes(app);
}

const initRoutes = (app) => {
    app.use('/', indexRouter);
    app.use('/user', userRouter);

    app.use(function(req, res, next) {
        res.statusCode(404).send(ResponseMessage.error(404, 'PATH NOT FOUND'));
    });

}

module.exports = init
