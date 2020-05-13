var passport = require('passport');
const crypto = require('crypto');
var localStrategy = require('passport-local').Strategy;
const { Clients } = require('./sequelize');

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
        const client = await Clients.findOne({where: {
                email:username ,password : hashedPassword
            }});

        if(client) {
            console.log(client);
            done( null,
                {username:client.email ,
                    password:client.password }
            );
            console.log(client.email);
        } else {
            done(null,false);
        }


    }));
};

