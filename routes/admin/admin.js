var express = require('express');
var router = express.Router();

var loggedin = function(req,res,next) {
  if(req.isAuthenticated()) {
  next()
  }
  else {
    res.redirect('/admin/login');

  }
};
/* GET home page. */
router.get('/login', function(req, res, next) {
  res.render('login');
});
router.get('/register', function(req, res, next) {
  res.render('register');
});
router.get('/home',loggedin, function (req,res,next) {
  res.send("you are logged in");
});

router.get('/logout',function (req,res) {
req.logout();
res.redirect('/');

});

module.exports = router;
