var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/delivery', function(req, res, next) {
  res.render("delivery");
});

router.get('/order', function(req, res, next) {  
  res.render("order");
});

module.exports = router;
