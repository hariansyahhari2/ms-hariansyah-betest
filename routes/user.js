const express = require('express');
const router = express.Router();
const userServices = require('../services/user')
const verifyToken = require('../services/verifyToken')

router.get('/all', verifyToken, userServices.getAll)
router.get('/getByAccountNumber/:accountNumber', verifyToken, userServices.getByAccountNumber)
router.get('/getByIdentityNumber/:identityNumber', verifyToken, userServices.getByIdentityNumber)
router.get('/me', verifyToken, userServices.getMyInfo)
router.post('/register', userServices.register)
router.put('/update', verifyToken, userServices.update)
router.delete('/delete', verifyToken, userServices.delete)

module.exports = router;
