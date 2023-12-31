var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/delivery', function(req, res, next) {
  res.render("delivery");
});

router.get('/orders/:id', function(req, res, next) {  
  res.render("order");
});

router.get('/privateArea', function(req, res, next) {  
  res.render("privateArea");
});

router.get('/continueOrder', function(req, res, next) {  
  res.render("continueOrder");
});

module.exports = router;
