var express = require('express'); // Loads express
const dishController = require('../controllers/dish'); // Loads the module
var router = express.Router(); // concting the file to express

router.route('/')
    .get(dishController.getAllDishes)
    .post(dishController.createDish)

router.route('/:id')
    .get(dishController.searchDish)
    .put(dishController.updateDish)
    .delete(dishController.deleteDish)

module.exports = router;