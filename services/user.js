const User = require('../models/User.js')
const ResponseMessage = require('../responses/ResponseMessage')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs');
const Properties = require('../tools/Properties');
const errorMessages = require('../constants/exceptions')
const repository = require('../repository/user')
const Validations = require('../tools/Validations');
const Redis = require('../configs/redis')

exports.getAll = async (req, res) => {
    const redisKey = 'list';

    Redis.get(redisKey, async function (err, value) {
        if (value) {
            console.log('from redis')
            const users = JSON.parse(value);
            return res.send(ResponseMessage.ok(Properties.hideSensitiveDataList(users)));
        } else {
            console.log('from db')
            const users = await repository.findAllUser({ deleted: null });
            await Redis.set(redisKey, JSON.stringify(users), function (err, value) {
                if (err) {
                    console.log(err)
                }
            })
            return res.send(ResponseMessage.ok(Properties.hideSensitiveDataList(users)));
        }
    });
}

exports.register = async (req, res) => {
    const { error } = Validations.registerValidation(req.body);

    if(error) {
        return res.status(400).send(
            ResponseMessage.error(res.statusCode, error.details[0].message)
        );
    }

    let isExist = await repository.findUser({ emailAddress: req.body.emailAddress });
    if(isExist) {
        return res.status(errorMessages.EMAIL_EXIST.code).send(
            ResponseMessage.error(res.statusCode, errorMessages.EMAIL_EXIST.message)
        );
    }
    isExist = await repository.findUser({ accountNumber: req.body.accountNumber });
    if(isExist) {
        return res.status(errorMessages.ACCOUNT_NUMBER_EXIST.code).send(
            ResponseMessage.error(res.statusCode, errorMessages.ACCOUNT_NUMBER_EXIST.message)
        );
    }
    isExist = await repository.findUser({ identityNumber: req.body.identityNumber });
    if(isExist) {
        return res.status(errorMessages.IDENTITY_NUMBER_EXIST.code).send(
            ResponseMessage.error(res.statusCode, errorMessages.IDENTITY_NUMBER_EXIST.message)
        );
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt);

    const user = new User({
        userName: req.body.userName,
        emailAddress: req.body.emailAddress,
        identityNumber: req.body.identityNumber,
        accountNumber: req.body.accountNumber,
        password: hashPassword
    });

    try {
        const saveUser = await repository.save(user);
        Redis.del('list', function (err, success) {
            console.log(success)
        })
        await Redis.set(saveUser._id.toString(), JSON.stringify(saveUser), function (err, value) {
            if (err) {
                console.log(err)
            }
        })
        res.send(ResponseMessage.ok(
            Properties.hideSensitiveData(saveUser)
        ));
    }catch(err){
        res.status(400).send(
            ResponseMessage.error(res.statusCode, err)
        );
    }
}

exports.update = async (req, res)  => {
    const token = req.header('Authorization');
    const payload = jwt.decode(token);
    const user = await repository.findById(payload._id);

    if (!user) {
        return res.status(errorMessages.ACCESS_DENIED.code).send(
            ResponseMessage.error(res.statusCode, errorMessages.ACCESS_DENIED.message)
        )
    }

    const validPwd = await bcrypt.compare(req.body.password, user.password);
    if(!validPwd) {
        return res.status(errorMessages.PASSWORD_INVALID.code).send(
            ResponseMessage.error(res.statusCode, errorMessages.PASSWORD_INVALID.message)
        );
    }

    let isExist = await repository.findUser({ emailAddress: req.body.emailAddress});
    if(isExist && isExist._id.toString() !== payload._id) {
        return res.status(errorMessages.EMAIL_EXIST.code).send(
            ResponseMessage.error(res.statusCode, errorMessages.EMAIL_EXIST.message)
        );
    }
    isExist = await repository.findUser({accountNumber: req.body.accountNumber});
    if(isExist && isExist._id.toString() !== payload._id) {
        return res.status(errorMessages.ACCOUNT_NUMBER_EXIST.code).send(
            ResponseMessage.error(res.statusCode, errorMessages.ACCOUNT_NUMBER_EXIST.message)
        );
    }
    isExist = await repository.findUser({identityNumber: req.body.identityNumber});
    if(isExist && isExist._id.toString() !== payload._id) {
        return res.status(errorMessages.IDENTITY_NUMBER_EXIST.code).send(
            ResponseMessage.error(res.statusCode, errorMessages.IDENTITY_NUMBER_EXIST.message)
        );
    }

    user.userName = req.body.userName;
    user.emailAddress = req.body.emailAddress;
    user.identityNumber = req.body.identityNumber;
    user.accountNumber = req.body.accountNumber;
    const savedUser = await repository.findByIdAndUpdate(user._id, user);

    flushRedis(user)
    res.send(ResponseMessage.ok(
        Properties.hideSensitiveData(savedUser)
    ));
}


exports.delete = async (req, res) => {

    const { error } = Validations.deleteUser(req.body);
    if (error) {
        return res.status(400).send(
            ResponseMessage.error(res.statusCode, error.details[0].message)
        );
    }

    let user = await repository.findUser({
        $and: [
            { email: req.body.emailAddress },
            { deleted: null }
        ]
    });
    if(!user) {
        return res.status(errorMessages.EMAIL_INVALID.code).send(
            ResponseMessage.error(res.statusCode, errorMessages.EMAIL_INVALID.message)
        );
    }

    const validPwd = await bcrypt.compare(req.body.password, user.password);
    if(!validPwd) {
        return res.status(errorMessages.PASSWORD_INVALID.code).send(
            ResponseMessage.error(res.statusCode, errorMessages.PASSWORD_INVALID.message)
        );
    }

    user.deleted = Date.now();
    const savedUser = await repository.findByIdAndUpdate(user._id, user);

    flushRedis(user)
    res.send(ResponseMessage.ok(
        Properties.hideSensitiveData(savedUser)
    ));
}

exports.authenticate = async (req, res) => {

    const { error } = Validations.authenticateValidation(req.body);
    if (error) {
        return res.status(400).send(
            ResponseMessage.error(res.statusCode, error.details[0].message)
        );
    }

    var user = await repository.findUser({
        $and: [
            { emailAddress: req.body.emailAddress },
            { deleted: null }
        ]
    });
    if(!user) {
        return res.status(errorMessages.EMAIL_INVALID.code).send(
            ResponseMessage.error(res.statusCode, errorMessages.EMAIL_INVALID.message)
        );
    }

    const validPwd = await bcrypt.compare(req.body.password, user.password);
    if(!validPwd) {
        return res.status(errorMessages.PASSWORD_INVALID.code).send(
            ResponseMessage.error(res.statusCode, errorMessages.PASSWORD_INVALID.message)
        );
    }

    const token = jwt.sign({ _id: user._id }, process.env.SECRET_KEY);
    res.send(ResponseMessage.auth(token));
}

exports.getByAccountNumber = async (req, res) => {
    if (!Validations.validateNumber(req.params.accountNumber)) {
        return res.status(errorMessages.BAD_REQUEST.code).send(ResponseMessage.error(res.statusCode, errorMessages.BAD_REQUEST.message))
    }

    Redis.get(`account-${req.params.accountNumber}`, async function (err, value) {
        if (value) {
            console.log('from redis')
            const user = JSON.parse(value)
            return res.send(ResponseMessage.ok(Properties.hideSensitiveData(user)));
        } else {
            console.log('from db')

            const user = await repository.findUser({
                $and: [
                    { accountNumber: req.params.accountNumber },
                    { deleted: null }
                ]
            });
            if (!user) {
                return res.status(errorMessages.USER_NOT_FOUND.code).send(
                    ResponseMessage.error(res.statusCode, errorMessages.USER_NOT_FOUND.message)
                );
            }

            await Redis.set(`account-${req.params.accountNumber}`, JSON.stringify(user), function (err, value) {
                if (err) {
                    console.log(err)
                }
            })
            return res.send(ResponseMessage.ok(Properties.hideSensitiveData(user)));
        }
    });
}

exports.getByIdentityNumber = async (req, res) => {
    if (!Validations.validateNumber(req.params.identityNumber)) {
        return res.status(errorMessages.BAD_REQUEST.code).send(ResponseMessage.error(res.statusCode, errorMessages.BAD_REQUEST.message))
    }


    Redis.get(`identity-${req.params.identityNumber}`, async function (err, value) {
        if (value) {
            console.log('from redis')
            const user = JSON.parse(value)
            return res.send(ResponseMessage.ok(Properties.hideSensitiveData(user)));
        } else {
            console.log('from db')

            const user = await repository.findUser({
                $and: [
                    { identityNumber: req.params.identityNumber },
                    { deleted: null }
                ]
            });
            if (!user) {
                return res.status(errorMessages.USER_NOT_FOUND.code).send(
                    ResponseMessage.error(res.statusCode, errorMessages.USER_NOT_FOUND.message)
                );
            }

            await Redis.set(`identity-${req.params.identityNumber}`, JSON.stringify(user), function (err, value) {
                if (err) {
                    console.log(err)
                }
            })
            return res.send(ResponseMessage.ok(Properties.hideSensitiveData(user)));
        }
    });
}

exports.getMyInfo = async (req, res) => {

    try {
        const token = req.header('Authorization');
        const payload = jwt.decode(token);

        Redis.get(payload._id, async function (err, value) {
            if (value) {
                console.log('from redis')
                const user = JSON.parse(value);
                return res.send(ResponseMessage.ok(Properties.hideSensitiveData(user)));
            } else {
                console.log('from db')
                const user = await repository.findById(payload._id);
                if (user === null) {
                    return res.status(errorMessages.USER_NOT_FOUND.code).send(
                        ResponseMessage.error(res.statusCode, errorMessages.USER_NOT_FOUND.message)
                    );
                }
                await Redis.set(payload._id, JSON.stringify(user), function (err, value) {
                    if (err) {
                        console.log(err)
                    }
                })
                return res.send(ResponseMessage.ok(Properties.hideSensitiveData(user)));
            }
        });
    } catch (err) {
        console.log(err)
        res.status(errorMessages.USER_NOT_FOUND.code).send(
            ResponseMessage.error(res.statusCode, errorMessages.USER_NOT_FOUND.message)
        );
    }
}

const flushRedis = (user) => {
    Redis.del('list', function (err, success) {
        if (!err) {
            console.log('success flush redish list')
        }
    })
    Redis.del(user._id.toString(), function (err, success) {
        if (!err) {
            console.log('success flush redis id')
        }
    })
    Redis.del(`account-${user.accountNumber}`, function (err, success) {
        if (!err) {
            console.log('success flush redis account number')
        }
    })
    Redis.del(`identity-${user.identityNumber}`, function (err, success) {
        if (!err) {
            console.log('success flush redis identity number')
        }
    })
}
