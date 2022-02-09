const User = require('../models/User.js')
const ResponseMessage = require('../responses/ResponseMessage')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs');
const Properties = require('../tools/Properties');
const errorMessages = require('../constants/exceptions')
const Validations = require('../tools/Validations');

exports.getAll = async (req, res) => {
    let users = await User.find({ deleted: null })
    res.send(ResponseMessage.ok(Properties.hideSensitiveDataList(users)))
}

exports.register = async (req, res) => {
    const { error } = Validations.registerValidation(req.body)

    if(error) {
        return res.status(400).send(
            ResponseMessage.error(res.statusCode, error.details[0].message)
        )
    }

    let isExist = await User.findOne({ emailAddress: req.body.emailAddress})
    if(isExist) {
        return res.status(errorMessages.EMAIL_EXIST.code).send(
            ResponseMessage.error(res.statusCode, errorMessages.EMAIL_EXIST.message)
        )
    }
    isExist = await User.findOne({accountNumber: req.body.accountNumber})
    if(isExist) {
        return res.status(400).send(
            ResponseMessage.error(res.statusCode, 'Account Number Already Used !')
        )
    }
    isExist = await User.findOne({identityNumber: req.body.identityNumber})
    if(isExist) {
        return res.status(400).send(
            ResponseMessage.error(res.statusCode, 'Identity Number Already Used !')
        )
    }

    const salt = await bcrypt.genSalt(10)
    const hashPassword = await bcrypt.hash(req.body.password, salt)

    const user = new User({
        userName: req.body.userName,
        emailAddress: req.body.emailAddress,
        identityNumber: req.body.identityNumber,
        accountNumber: req.body.accountNumber,
        password: hashPassword
    })

    try {
        const saveUser = await user.save()
        res.send(ResponseMessage.ok(
            Properties.hideSensitiveData(saveUser)
        ))
    }catch(err){
        res.status(400).send(
            ResponseMessage.error(res.statusCode, err)
        )
    }
}

exports.update = async (req, res)  => {
    try {
        const token = req.header('Authorization')
        const payload = jwt.decode(token)
        const user = await User.findById(payload._id)

        const validPwd = await bcrypt.compare(req.body.password, user.password)
        if(!validPwd) {
            return res.status(errorMessages.EMAIL_OR_PASSWORD_INVALID.code).send(
                ResponseMessage.error(res.statusCode, errorMessages.EMAIL_OR_PASSWORD_INVALID.message)
            )
        }

        let isExist = await User.findOne({ emailAddress: req.body.emailAddress})
        if(isExist && isExist._id.toString() !== payload._id) {
            return res.status(errorMessages.EMAIL_EXIST.code).send(
                ResponseMessage.error(res.statusCode, errorMessages.EMAIL_EXIST.message)
            )
        }
        isExist = await User.findOne({accountNumber: req.body.accountNumber})
        if(isExist && isExist._id.toString() !== payload._id) {
            return res.status(errorMessages.ACCOUNT_NUMBER_EXIST.code).send(
                ResponseMessage.error(res.statusCode, errorMessages.ACCOUNT_NUMBER_EXIST.message)
            )
        }
        isExist = await User.findOne({identityNumber: req.body.identityNumber})
        if(isExist && isExist._id.toString() !== payload._id) {
            return res.status(errorMessages.IDENTITY_NUMBER_EXIST.code).send(
                ResponseMessage.error(res.statusCode, errorMessages.IDENTITY_NUMBER_EXIST.message)
            )
        }

        user.userName = req.body.userName
        user.emailAddress = req.body.emailAddress
        user.identityNumber = req.body.identityNumber
        user.accountNumber = req.body.accountNumber
        const savedUser = await User.findByIdAndUpdate(user._id, user)
        res.send(savedUser)

    } catch (err) {
        res.status(errorMessages.USER_NOT_FOUND.code).send(
            ResponseMessage.error(res.statusCode, errorMessages.USER_NOT_FOUND.message)
        )
    }
}


exports.delete = async (req, res) => {

    const { error } = Validations.authenticateValidation(req.body)
    if (error) {
        return res.status(400).send(
            ResponseMessage.error(res.statusCode, error.details[0].message)
        )
    }

    let user = await User.findOne({email: req.body.emailAddress, deleted: null})
    if(!user) {
        return res.status(errorMessages.EMAIL_OR_PASSWORD_INVALID.code).send(
            ResponseMessage.error(res.statusCode, errorMessages.EMAIL_OR_PASSWORD_INVALID.message)
        )
    }

    const validPwd = await bcrypt.compare(req.body.password, user.password)
    if(!validPwd) {
        return res.status(errorMessages.EMAIL_OR_PASSWORD_INVALID.code).send(
            ResponseMessage.error(res.statusCode, errorMessages.EMAIL_OR_PASSWORD_INVALID.message)
        )
    }

    user.deleted = Date.now()
    const savedUser = await User.findByIdAndUpdate(user._id, user)
    res.send(savedUser)

}

exports.authenticate = async (req, res) => {

    const { error } = Validations.authenticateValidation(req.body)
    if (error) {
        return res.status(400).send(
            ResponseMessage.error(res.statusCode, error.details[0].message)
        )
    }

    let user = await User.findOne({email: req.body.emailAddress, deleted: null})
    if(!user) {
        return res.status(errorMessages.EMAIL_OR_PASSWORD_INVALID.code).send(
            ResponseMessage.error(res.statusCode, errorMessages.EMAIL_OR_PASSWORD_INVALID.message)
        )
    }

    const validPwd = await bcrypt.compare(req.body.password, user.password)
    if(!validPwd) {
        return res.status(errorMessages.EMAIL_OR_PASSWORD_INVALID.code).send(
            ResponseMessage.error(res.statusCode, errorMessages.EMAIL_OR_PASSWORD_INVALID.message)
        )
    }

    const token = jwt.sign({ _id: user._id }, process.env.SECRET_KEY)
    res.send(ResponseMessage.auth(token))
}

exports.getByAccountNumber = async (req, res) => {
    Validations.validateNumber(res, req.params.accountNumber)
    const user = await User.findOne({ accountNumber: req.params.accountNumber, deleted: null })
    if (!user) {
        return res.status(errorMessages.USER_NOT_FOUND.code).send(
            ResponseMessage.error(res.statusCode, errorMessages.USER_NOT_FOUND.message)
        )
    }
    res.send(ResponseMessage.ok(
        Properties.hideSensitiveData(user)
    ))
}

exports.getByIdentityNumber = async (req, res) => {
    Validations.validateNumber(res, req.params.identityNumber)
    const user = await User.findOne({ identityNumber: req.params.identityNumber, deleted: null })
    if (!user) {
        return res.status(errorMessages.USER_NOT_FOUND.code).send(
            ResponseMessage.error(res.statusCode, errorMessages.USER_NOT_FOUND.message)
        )
    }
    res.send(ResponseMessage.ok(
        Properties.hideSensitiveData(user)
    ))
}

exports.getMyInfo = async (req, res) => {

    try {
        const token = req.header('Authorization')
        const payload = jwt.decode(token)
        const user = await User.findById(payload._id)
        res.send(ResponseMessage.ok(Properties.hideSensitiveData(user)))
    } catch (err) {
        res.status(errorMessages.USER_NOT_FOUND.code).send(
            ResponseMessage.error(res.statusCode, errorMessages.USER_NOT_FOUND.message)
        )
    }
}
