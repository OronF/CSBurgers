var express = require('express');
//const path = require('path');
var router = express.Router();

router.get('/Managerbranches', function(req, res, next) {
    res.render("branchesManagers"); 
});

router.get('/graphs', function(req, res, next) {  
    res.render("graphs");
});

router.get('/managerMenu', function(req, res, next) {
    res.render("menuManager");
});

router.get('/Managerdelivery', function(req, res, next) {
    res.render("delivery");
});
  
router.get('/orders/:id', function(req, res, next) {  
    res.render("order");
});

router.get('/cartForManager', function(req, res, next) {
    res.render("cartForManager");
});

router.get('/continueOrder', function(req, res, next) {  
    res.render("continueOrder");
});

module.exports = router;