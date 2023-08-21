var express = require('express');
//const path = require('path');
var router = express.Router();

router.get('/branchesManger', function(req, res, next) {
    res.render("branchesMangers"); 
});

module.exports = router;