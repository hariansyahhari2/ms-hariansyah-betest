const bodyParser = require('body-parser')
const cors = require('cors')
const authenticateRouter = require('../routes/authenticate')
const userRouter = require('../routes/user')
const ResponseMessage = require('../responses/ResponseMessage')

const init = (app) => {
    app.use(bodyParser())
    app.use(cors())
    initRoutes(app)

    console.log(`Server running in port ${process.env.PORT}`)
}

const initRoutes = (app) => {
    app.use('/', authenticateRouter);
    app.use('/user', userRouter);

    app.use(function(req, res, next) {
        res.send(ResponseMessage.error(404, 'PATH NOT FOUND'));
    });

}

module.exports = init
