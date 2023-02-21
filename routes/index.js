const express = require('express');
const router = express.Router();

const { documentationUrl } = require('../env.configs');
const responseMessage = require('../responses/responseMessage');

const homePageService = (req, res) => {
  res.status(301).redirect(documentationUrl);
}

router.get(
  '/',
  homePageService
)

router.get('/ping', async (req, res) => {
  res.send(responseMessage.ok('pong'))
});

module.exports = router;
