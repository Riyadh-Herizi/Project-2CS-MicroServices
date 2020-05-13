var express = require('express');
var router = express.Router();


module.exports = function (user_passport) {
    router.post('/login' , user_passport.authenticate('local',{
        failureRedirect :"/user/login",
        successRedirect :"/user/home",
    }));
    return router;
};

