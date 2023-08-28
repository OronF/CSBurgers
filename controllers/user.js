const UserService = require('../services/user');

const getAllUsers = async (req, res) => {
    try {
        let Users;

        if (req.query.is_Manager) {
            Users = await UserService.getAllManagers(req.query.is_Manager);

            res.json(Users);
            return;
        }
        
        if (req.query.fname && req.query.password && req.query.phoneNumber) {
            Users = await UserService.searchForLogIn(req.query.fname, req.query.password, req.query.phoneNumber);

            if(!Users) {
                throw new Error('Non existing users');
            }

            const twentyMinutesToSeconds = 20 * 60; 
            const twentyMinutesToMilliseconds = twentyMinutesToSeconds * 1000; 
            res.cookie(Users.is_Manager ? 'admin' : 'user', Users._id, { maxAge: twentyMinutesToMilliseconds});
            console.log(res.cookies);

            res.json(Users);
            return;
        }
        if (req.query.fname && req.query.lname && req.query.phoneNumber) {
            Users = await UserService.searchForFixingPassward(req.query.fname, req.query.lname, req.query.phoneNumber);

            if(!Users) {
                throw new Error('Non existing users');
            }

            res.json(Users);
            return;
        }

        Users = await UserService.getAll();
        
        if(!Users) {
            throw new Error('Non existing users');
        }

        res.json(Users);
    }

    catch (error) {
        res.status(400).json({
            error: "Getting all the users - Error",
            message: error.message
        });
    }
}

const createUser = async (req, res) => {
    try {
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

    catch (error) {
        res.status(400).json({
            error: "Creating new user - Error",
            message: error.message
        });
    }
}

const updateUser = async (req, res) => {
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

    const newUser = {
        id: req.params.id,
        fname: req.body.fname,
        lname: req.body.lname,
        orders: req.body.orders,
        phoneNumber: req.body.phoneNumber,
        password: req.body.password,
        is_Manager: req.body.is_Manager
    }
    
    if (req.body.currentOrder) {
        newUser.currentOrder = req.body.currentOrder;
    }

    const user = await UserService.update(newUser);
    if (!user) {
        return res.status(404).json({errors:['User not found']});
    }

    res.json(user);
};


const deleteUser = async (req, res) => {
    const user = await UserService.delete(req.params.id);

    if (!user) {
        return res.status(404).json({errors:['User not found']});
    }

    res.send();
}

const searchUser = async (req, res) => {
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