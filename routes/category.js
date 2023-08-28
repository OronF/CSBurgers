var express = require('express'); // Loads express
const categoryController = require('../controllers/category'); // Loads the module
var router = express.Router(); // concting the file to express

router.route('/')
    .get(categoryController.getAllCategories)
    .post(categoryController.createCategory)

router.route('/:id')
    .get(categoryController.searchCategory)
    .put(categoryController.updateCategory)
    .delete(categoryController.deleteCategory)

module.exports = router;