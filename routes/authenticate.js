const express = require('express');
const router = express.Router();
const userServices = require('../services/user')

router.post('/authenticate', userServices.authenticate)

module.exports = router;
