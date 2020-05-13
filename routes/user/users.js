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

var loggedin = function(req,res,next) {
  if(req.isAuthenticated()) {
    next()
  }
  else {
    res.redirect('/user/login');
  }
};

router.get('/login', function(req, res, next) {
  res.render('user_login');
});

router.get('/home',loggedin, function (req,res,next) {
  res.send("you are logged in");
});

router.post('/android_login', async  function (req,res)  {
  var  password = req.body.password;
  var  email = req.body.username;
  const hashedPassword = getHashedPassword(password);

  const user = await Users.findOne({where: {
      email:email ,password : hashedPassword
    }});

  if(user) {
    console.log('android user connected successfully');
    console.log(user);
    res.json(user);
  } else {
    console.log('android user android c\'ant connect ');
  }


});


router.get('/logout',function (req,res) {
  req.logout();
  res.redirect('/');

});

module.exports = router;
