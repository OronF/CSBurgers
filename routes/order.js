var express = require('express'); // Loads express
const orderController = require('../controllers/order'); // Loads the module
var router = express.Router(); // concting the file to express

router.route('/')
    .get(orderController.getAllOrders)
    .post(orderController.creatOrder)

router.route('/:id')
    .get(orderController.searchOrder)
    .put(orderController.updateOrder)
    .delete(orderController.deleteOrder)

module.exports = router;