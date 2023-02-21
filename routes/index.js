const express = require('express');
const router = express.Router();

const { documentationUrl } = require('../env.configs');
const ResponseMessage = require('../responses/ResponseMessage');

const homePageService = (req, res) => {
  res.status(301).redirect(documentationUrl);
}

router.get(
  '/',
  homePageService
)

router.get('/ping', async (req, res) => {
  res.send(ResponseMessage.ok('pong'))
});

module.exports = router;
