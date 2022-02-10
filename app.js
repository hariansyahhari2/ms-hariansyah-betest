const express = require('express');
const mongo = require('./configs/mongo')
const init = require('./configs');

require('dotenv/config')

const app = express();

init(app);
mongo.init();

module.exports = app;
