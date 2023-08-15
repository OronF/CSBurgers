var express = require('express');
//const path = require('path');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render("homePage");
});

router.get('/branches', function(req, res, next) {  
  res.render("branches");
});

router.get('/menu', function(req, res, next) {
  res.render("menuPage");
});

router.get('/branchesManger', function(req, res, next) {
  res.render("branchesMangers"); 
});

router.get('/signUp', function(req, res, next) {
  res.render("signUp");
});

router.get('/contactUs', function(req, res, next) {
  res.render("contactUs");
});
  
router.get('/aboutUs', function(req, res, next) {  
  res.render("aboutUs"); 
});

module.exports = router;