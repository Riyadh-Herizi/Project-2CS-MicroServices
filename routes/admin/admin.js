var express = require('express');
var router = express.Router();
const { Admins } = require('../../sequelize');
var loggedin = function(req,res,next) {
  if(req.isAuthenticated()) {
  next()
  }
  else {
    res.redirect('/admin/login');

  }
};
async function check_if_client(req) {
  const clients = await  Clients.findOne({where: {email:req.user.username}});
  if (clients) return true;
  else return false;
}
async function check_if_user(req) {
  const User = await  Users.findOne({where: {email:req.user.username}});
  if (User) return true;
  else return false;
}
async function check_if_admin(req) {
  const admin = await  Admins.findOne({where: {email:req.user.username}});
  if (admin) return true;
  else return false;
}
/* GET home page. */
router.get('/login', async function(req, res, next) {
  var check;
  if(typeof req.user === 'undefined')
    check = false;
  else  check = await check_if_admin(req);

  res.render('login',{check:check});});
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
