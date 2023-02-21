const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const ResponseMessage = require('../responses/ResponseMessage');
const { exceptions: errorMessages, sensitiveData } = require('../constants');
const userRepository = require('../repositories/userRepository');

const getMyInfo = async (req, res) => {
  const { userName } = res.credentials;

  const user = await userRepository.findOne(
    { userName },
    sensitiveData
  );

  if (user === null) {
    return res.status(errorMessages.USER_NOT_FOUND.code).send(
      ResponseMessage.error(res.statusCode, errorMessages.USER_NOT_FOUND.message)
    );
  }

  return res.send(ResponseMessage.ok(user));
};

const getByAccountNumber = async (req, res) => {
  const { accountNumber } = req.params;

  const user = await userRepository.findOne(
    { accountNumber },
    sensitiveData
  );

  if (user === null) {
    return res.status(errorMessages.USER_NOT_FOUND.code).send(
      ResponseMessage.error(res.statusCode, errorMessages.USER_NOT_FOUND.message)
    );
  }

  return res.send(ResponseMessage.ok(user));
};

const getByIdentityNumber = async (req, res) => {
  const { identityNumber } = req.params;

  const user = await userRepository.findOne(
    { identityNumber },
    sensitiveData
  );

  if (user === null) {
    return res.status(errorMessages.USER_NOT_FOUND.code).send(
      ResponseMessage.error(res.statusCode, errorMessages.USER_NOT_FOUND.message)
    );
  }

  return res.send(ResponseMessage.ok(user));
};

const getAll = async (req, res) => {
  const users = await userRepository.find(
    { },
    sensitiveData
  );

  return res.send(ResponseMessage.ok(users));
}

const register = async (req, res) => {
  const {
    userName
  } = req.body;

  let isExist = await userRepository.exists({ userName });
  if(isExist) {
    return res.status(errorMessages.USER_EXISTS.code).send(
      ResponseMessage.error(res.statusCode, errorMessages.USER_EXISTS.message)
    );
  }

  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(req.body.password, salt);

  const user = {
    ...req.body,
    password: hashPassword
  };

  try {
    const saveUser = await userRepository.insertOne(user);

    delete saveUser.password;

    return res.send(ResponseMessage.ok(saveUser));
  } catch (e) {
    return res.status(errorMessages.BAD_REQUEST.code).send(
      ResponseMessage.error(res.statusCode, e.message)
    );
  }
}

const update = async (req, res)  => {
  const { credentials } = res;

  const [
    user
  ] = await Promise.all([
    userRepository.findOne({ userName: credentials.userName })
  ]);

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

  delete req.body.password;

  try {
    const savedUser = await userRepository.findOneAndUpdate(
      { userName: credentials.userName },
      { ...req.body },
      {
        projection: sensitiveData,
        returnDocument: 'after'
      }
    );

    res.send(ResponseMessage.ok(savedUser));
  } catch (e) {
    return res.status(errorMessages.BAD_REQUEST.code).send(
      ResponseMessage.error(res.statusCode, e.message)
    );
  }
}

const deleteUser = async (req, res) => {
  const { userName: userNameTokenPayload } = res.credentials
  const { userName } = req.params;

  if (userNameTokenPayload !== userName) {
    return res.status(errorMessages.ACCESS_DENIED.code).send(
      ResponseMessage.error(res.statusCode, errorMessages.ACCESS_DENIED.message)
    )
  }

  await userRepository.remove({ userName });

  return res.send(ResponseMessage.ok({ success: true }));
}

const authenticate = async (req, res) => {
  const { userName, password } = req.body;

  const user = await userRepository.findOne({ userName });
  if(!user) {
    return res.status(errorMessages.USER_NOT_FOUND.code).send(
      ResponseMessage.error(res.statusCode, errorMessages.USER_NOT_FOUND.message)
    );
  }

  const validPwd = await bcrypt.compare(password, user.password);
  if(!validPwd) {
    return res.status(errorMessages.PASSWORD_INVALID.code).send(
      ResponseMessage.error(res.statusCode, errorMessages.PASSWORD_INVALID.message)
    );
  }

  const token = jwt.sign({ _id: user._id, userName: user.userName }, process.env.SECRET_KEY);
  res.send(ResponseMessage.ok({ token }));
};

module.exports = {
  getMyInfo,
  getByAccountNumber,
  getByIdentityNumber,
  getAll,
  register,
  update,
  deleteUser,
  authenticate,
}
