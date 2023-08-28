var express = require('express');
//const path = require('path');
var router = express.Router();
const axios = require("axios");

router.get('/Managerbranches', function(req, res, next) {
    res.render("branchesManagers"); 
});

router.get('/graphs', function(req, res, next) {  
    res.render("graphs");
});

router.get('/ManagerMessages', function(req, res, next) {  
    res.render("ManagerMessages");
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

router.post("/posttopage", (req, res) => {
    const Productdesctiption = req.body.Productdesctiption;
    const img = req.body.img;
  
    axios.post(`https://graph.facebook.com/${process.env.FACEBOOK_PAGE_ID}/photos?url=${img}&message=${Productdesctiption}&access_token=${process.env.FACEBOOK_API_TOKEN}`,
    null
    )
    .then(function(res) {
        console.log(res);
    })
    .catch(function(res) {
        console.log(res);
    })
});

module.exports = router;