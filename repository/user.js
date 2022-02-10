const User = require('../models/User.js')

exports.findById = async (id) => {
    return User.findById(id);
}

exports.findAllUser = async (filter) => {
    return User.find(filter);
}

exports.findUser = async (filter) => {
    return User.findOne(filter);
}

exports.save = async (user) => {
    return user.save();
}

exports.findByIdAndUpdate = async (id, user) => {
    return User.findByIdAndUpdate(id, user);
}

exports.deleteByIdAndUpdate = async (id, user) => {
    user.deleted = Date.now();
    return User.findByIdAndUpdate(id, user);
}
