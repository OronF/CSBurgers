const User = require('../models/user');

const getAll = async() => {
    return await User.find({});
}

const createUser = async (newUser) => {
    const user = new User({
        fname: newUser.fname,
        lname: newUser.lname,
        orders: newUser.orders,
        phoneNumber: newUser.phoneNumber,
        password: newUser.password,
        is_Manager: newUser.is_Manager
    });

    if (newUser.currentOrder) {
        user.currentOrder = newUser.currentOrder;
    }

    return await user.save();
}

const searchUser = async(id) => {
    return await User.findById(id);
}

const deleteUser = async (id) => {
    const user = await searchUser(id);

    if (!user) {
        return null;
    }

    await user.deleteOne();

    return user;
}

const updateUser = async (newUser) => {
    const user = await searchUser(newUser.id);

    if (!user) {
        return null;
    }

    user.fname = newUser.fname;
    user.lname = newUser.lname;
    user.orders = newUser.orders;
    user.phoneNumber = newUser.phoneNumber;
    user.password = newUser.password;
    user.is_Manager = newUser.is_Manager;

    if (newUser.currentOrder) {
        user.currentOrder = newUser.currentOrder;
    }

    await user.save()
    return user;
}

const searchForLogIn = async (fname, password, phoneNumber) => {
    if (!fname) {
        return null;
    }

    if (!password) {
        return null;
    }

    if (!phoneNumber) {
        return null;
    }

    return await User.findOne({fname, password, phoneNumber});
}

const getAllManagers = async (is_Manager) => {
    return await User.find({is_Manager});
}

module.exports = {
    getAll,
    create: createUser,
    delete: deleteUser,
    update: updateUser,
    search: searchUser,
    searchForLogIn,
    getAllManagers
}