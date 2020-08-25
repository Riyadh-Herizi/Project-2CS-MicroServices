

var express = require('express');
var router = express.Router();
const crypto = require('crypto');
const { Users } = require('../../sequelize');
const bodyParser = require('body-parser')
router.use(bodyParser.json());
router.use(express.urlencoded({ extended: true }));
const getHashedPassword = (password) => {
  const sha256 = crypto.createHash('sha256');
  return sha256.update(password).digest('base64');
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
var loggedin = function(req,res,next) {
  if(req.isAuthenticated()) {
    next()
  }
  else {
    res.redirect('/user/login');
  }
};

router.get('/login', async function(req, res, next) {
  var check;
  if(typeof req.user === 'undefined')
    check = false;
  else
    check = await check_if_user(req);

  res.render('user_login',{check:check});
});

router.get('/home',loggedin, function (req,res,next) {
  res.render('user/home');
});
router.get('/all_plannings',loggedin, function (req,res,next) {
  res.render('user/all_plannings');
});
router.get('/general_planning',loggedin, function (req,res,next) {
  res.render('user/general_planning');
});
router.get('/profil',loggedin, function (req,res,next) {
  res.render('user/profil');
});
router.get('/wish_form',loggedin, function (req,res,next) {
  res.render('user/wish_form');
});

router.post('/android_login', async  function (req,res)  {
  var  password = req.body.password;
  var  email = req.body.username;
  const hashedPassword = getHashedPassword(password);
   console.log(req.body);
  const user = await Users.findOne({where: {
      email:email ,password : hashedPassword
    }});

  if(user) {
     // var user_info = {
    //    firstName : user.firstName, lastName : user.lastName, email : user.email
    //  };
      var payload = {
          username: email,
      };

      var token = jwt.sign(payload, KEY, {algorithm: 'HS256', expiresIn: "15d"});

    console.log('android user connected successfully');
    console.log(user_info);

    res.status(200).send(JSON.stringify(user_info));
  } else {
    console.log('android user android c\'ant connect ');
      res.status(404).send();
  }

});


router.get('/logout',function (req,res) {
  req.logout();
  res.redirect('/');

});

module.exports = router;
