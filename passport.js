var passport = require('passport');
const crypto = require('crypto');
var localStrategy = require('passport-local').Strategy;
const { Admins } = require('./sequelize');

const getHashedPassword = (password) => {
    const sha256 = crypto.createHash('sha256');
    const hash = sha256.update(password).digest('base64');
    return hash;
};
module.exports = function (passport) {
     passport.serializeUser(function (user,done) {
        done(null,user);
     });
     passport.deserializeUser(function (user,done) {
         done(null,user);
     });
     passport.use(new localStrategy( async function (username,password,done) {
      const hashedPassword = getHashedPassword(password);
      const admin = await Admins.findOne({where: {
              email:username ,password : hashedPassword
          }});
      if(admin) {
          console.log(admin);
          done( null,
              {username:admin.email ,
          password:admin.password }
          );
          console.log(admin.email);
      } else {
          done(null,false);
      }
     }));
};

