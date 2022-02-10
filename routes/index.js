const express = require('express');
const router = express.Router();
const userServices = require('../services/user')

router.get('/', function (req, res, next) {
    res.status(301).redirect("https://documenter.getpostman.com/view/10433449/TVzNKKqH");
})
router.post('/authenticate', userServices.authenticate);

module.exports = router;
