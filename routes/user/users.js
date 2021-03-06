

var express = require('express');
var router = express.Router();
const crypto = require('crypto');
const {Wishes ,Clients,Users,Groups ,Entities,SubEntities,Plannings,Positions,Responsible,EmpPositions} = require('../../sequelize');

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
router.get('/all_plannings',loggedin,async function (req,res,next) {
  const user_id = await Users.findOne( { where:{email :req.user.username} } );

  var plannings =
      await Plannings.findAll( { include:[{model:Positions,required:true,
        include:[{model:EmpPositions,required:true ,where : {userId: user_id.id}}]},
            ]},
          )
     
  res.render('user/all_plannings',{plannings});
 });  
router.get('/general_planning',loggedin, function (req,res,next) {
  res.render('user/general_planning');
});
router.get('/profil',loggedin, function (req,res,next) {
  res.render('user/profil');
});
router.get('/wish_form',loggedin,async function (req,res,next) {
  const user_id = await Users.findOne( { where:{email :req.user.username} } );
  const wish= await Wishes.findOne({where : {userId:user_id.id}});
  if(wish){
     res.render('user/wish_form',{day1:wish.day1,day2:wish.day2});
  }
  else
  res.render('user/wish_form',{day1:-1,day2:-1});
 
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
router.post('/add_wish',async  function (req,res)  {
  const { day1,day2 } = req.body;console.log(req.body);
  const user_id = await Users.findOne( { where:{email :req.user.username} } );
  const wish= await Wishes.findOne({where : {userId:user_id.id}})
  if(wish){
    await wish.update({day1 :day1, day2 :day2});
  }
  else
  await Wishes.create({ day1 :day1, day2 :day2,userId :user_id.id} )
    res.redirect('/user/wish_form');
});

router.get('/logout',function (req,res) {
  req.logout();
  res.redirect('/');

});
router.post('/show_general_planning',async function(req, res, next) {
  const user_id = await Users.findOne( { where:{email :req.user.username} } );

  var sub_entities =
      await SubEntities.findAll( { include:[{model:Entities,required:true},
          {model:Positions,required:true,include : [
              {model:EmpPositions,required:true ,where : {userId: user_id.id}}
            ]},

         ] }
          ).catch((err)=> {
            console.log(err)
      });
  console.log(sub_entities)  ;
  res.send({sub_entities :sub_entities});


});
module.exports = router;
