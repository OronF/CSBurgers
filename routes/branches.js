var express = require('express'); // Loads express
const barnchesController = require('../controllers/branches'); // Loads the module
var router = express.Router(); // concting the file to express

router.route('/')
    .get(barnchesController.getAllBranches)
    .post(barnchesController.createBranch)

router.route('/:id')
    .get(barnchesController.searchBranch)
    .put(barnchesController.updateBranch)
    .delete(barnchesController.deleteBranch)

module.exports = router;