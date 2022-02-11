const bodyParser = require('body-parser')
const cors = require('cors')
const indexRouter = require('../routes')
const userRouter = require('../routes/user')
const ResponseMessage = require('../responses/ResponseMessage')
const errorMessages = require('../constants/exceptions')
const responseTime = require('response-time')
const Redis = require('../configs/redis')
const http = require("http");

const init = (app) => {
    app.use(bodyParser())
    app.use(cors());
    app.use(responseTime())
    initRoutes(app);
    setInterval(function() {
        console.log('test')
        http.get("https://ms-hariansyah-betest.herokuapp.com/");
    }, 300000);
}

const initRoutes = (app) => {
    app.use('/', indexRouter);
    app.use('/user', userRouter);

    app.use(function(req, res, next) {
        res.status(errorMessages.PATH_NOT_FOUND.code).send(ResponseMessage.error(res.statusCode, errorMessages.PATH_NOT_FOUND.message));
    });

}

module.exports = init
