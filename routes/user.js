var express = require('express'); // Loads express
const userController = require('../controllers/user'); // Loads the module
var router = express.Router(); // concting the file to express

router.route('/')
    .get(userController.getAllUsers)
    .post(userController.createUser)

router.route('/:id')
    .get(userController.searchUser)
    .put(userController.updateUser)
    .delete(userController.deleteUser)

module.exports = router;