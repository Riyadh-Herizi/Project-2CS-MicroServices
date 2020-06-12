var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    res.render('index');
});

router.get('/login', function(req, res, next) {
    res.render('login_page');
});



router.get('/test', function(req, res, next) {
    res.render('test');
});
module.exports = router;
