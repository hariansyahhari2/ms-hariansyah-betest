const mongoose = require('mongoose');

const {
  dbCollections: {
    userCollection
  }
} = require('../env.configs');

const { Schema } = mongoose;

const userSchema = new Schema({
  userName: { type: String, required: true, unique: true },
  emailAddress: { type: String, required: true, unique: true },
  accountNumber: { type: String, required: true, unique: true },
  identityNumber: { type: String, required: true, unique: true },
  password: { type: String, required: true }
}, { timestamps: true });

const UserRepository = mongoose.model(userCollection, userSchema);

const find = async (filter, opts) => {
  return UserRepository.find(filter, opts);
};

const findOne = async (filter, opts) => {
  try {
    const { _doc: result } = await UserRepository.findOne(filter, opts);

    return result;
  } catch (e) {
    return null;
  }
};

const insertOne = async (payload) => {
  const { _doc: result } = await UserRepository.create(payload);

  return result;
};

const findOneAndUpdate = async (filter, payload, opts) => {
  const { _doc: result } = await UserRepository.findOneAndUpdate(
    filter,
    {
      $set: payload
    },
    opts
  );

  return result;
};

const exists = async (filter) => {
  return UserRepository.exists(filter);
};

const remove = async (filter) => {
  return UserRepository.remove(filter);
};

module.exports = {
  find,
  findOne,
  insertOne,
  findOneAndUpdate,
  exists,
  remove
}
