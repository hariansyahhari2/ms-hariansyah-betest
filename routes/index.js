const express = require('express');
const router = express.Router();
const userServices = require('../services/user')
const ResponseMessage = require('../responses/ResponseMessage')

router.get('/', function (req, res, next) {
    res.status(301).redirect("https://documenter.getpostman.com/view/10433449/UVeMGNJo");
})
router.get('/ping', function (req, res, next) {
    res.send(ResponseMessage.ok('pong'))
})
router.post('/authenticate', function (req, res, next) {
    userServices.authenticate(req, res)
});

module.exports = router;
