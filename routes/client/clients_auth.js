var express = require('express');
var router = express.Router();




module.exports = function (client_passport) {
    router.post('/login' , client_passport.authenticate('local',{
        failureRedirect :"/client/login",
        successRedirect :"/client",
    }));
    return router;
};



