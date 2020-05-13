var passport = require('passport');

var localStrategy = require('passport-local').Strategy;
const { Users } = require('./sequelize');
const crypto = require('crypto');
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
        console.log(username,password);
        const hashedPassword = getHashedPassword(password);
        const user = await Users.findOne({where: {
                email:username ,password : hashedPassword
            }});

        if(user) {
            console.log(user);
            done( null,
                {username:user.email ,
                    password:user.password }
            );
            console.log(user.email);
        } else {
            done(null,false);
        }


    }));
};

