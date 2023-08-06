const UserService = require('../services/user');

const getAllUsers = async (req,res) => {
    const Users = await UserService.getAll();
    res.json(Users);
}

const createUser = async (req,res) => {
    const tmp = {
        fname: req.body.fname,
        lname: req.body.lname,
        orders: req.body.orders,
        phoneNumber: req.body.phoneNumber,
        password: req.body.password,
        is_Manager: req.body.is_Manager
    }

    if (req.body.currentOrder) {
        tmp.currentOrder = req.body.currentOrder;
    }

    const newUser = await UserService.create(tmp);
    res.json(newUser);
}

const updateUser = async (req,res) => {
    if (!req.body.fname) {
        res.status(400).json({message:'The new fname to the user is required'});
    }

    if (!req.body.lname) {
        res.status(400).json({message:'The new lname to the user is required'});
    }

    if (!req.body.orders) {
        res.status(400).json({message:'The new order to the user is required'});
    }

    if (!req.body.phoneNumber) {
        res.status(400).json({message:'The new phoneNumber to the user is required'});
    }

    if (!req.body.password) {
        res.status(400).json({message:'The new password to the user is required'});
    }

    if (!req.body.is_Manager) {
        res.status(400).json({message:'The new is_Manager to the user is required'});
    }

    const newUser = {
        fname: req.body.fname,
        lname: req.body.lname,
        orders: req.body.orders,
        phoneNumber: req.body.phoneNumber,
        password: req.body.password,
        is_Manager: req.body.is_Manager
    }

    if (req.body.currentOrder) {
        tmp.currentOrder = req.body.currentOrder;
    }

    const user = await UserService.update(newUser);
    if (!user) {
        return res.status(404).json({errors:['User not found']});
    }

    res.json(user);
};


const deleteUser = async (req,res) => {
    const user = await UserService.delete(req.params.id);

    if (!user) {
        return res.status(404).json({errors:['User not found']});
    }

    res.send();
}

const searchUser = async (req,res) => {
    const user = await UserService.search(req.params.id);

    if (!user) {
      return res.status(404).json({errors:['User not found']});
    }

    res.json(user);
}

module.exports = {
    getAllUsers,
    createUser,
    updateUser,
    deleteUser,
    searchUser
}