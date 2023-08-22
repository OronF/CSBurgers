var express = require('express');
//const path = require('path');
var router = express.Router();

router.get('/', function(req, res, next) {
    res.render("homePage");
});

router.get('/Managerbranches', function(req, res, next) {
    res.render("branchesManagers"); 
});

router.get('/graphs', function(req, res, next) {  
    res.render("graphs");
});

router.get('/managerMenu', function(req, res, next) {
    res.render("menuManager");
});

router.get('/delivery', function(req, res, next) {
    res.render("delivery");
});
  
router.get('/orders/:id', function(req, res, next) {  
    res.render("order");
});
  
module.exports = router;