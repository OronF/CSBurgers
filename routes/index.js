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

router.get('/delivery', function(req, res, next) {
  res.render("delivery");
});

router.get('/contactUs', function(req, res, next) {
  res.render("contactUs");
});

router.get('/aboutUs', function(req, res, next) {  
  res.render("aboutUs");
});

router.get('/termsPage', function(req, res, next) {  
  res.render("termsPage");
});

router.get('/AccessibilityStatement', function(req, res, next) {  
  res.render("AccessibilityStatement");
});

module.exports = router;