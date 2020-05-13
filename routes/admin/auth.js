var express = require('express');
var router = express.Router();
const crypto = require('crypto');
const { Admins } = require('../../sequelize');

const getHashedPassword = (password) => {
    const sha256 = crypto.createHash('sha256');
    const hash = sha256.update(password).digest('base64');
    return hash;
};


module.exports = function (passport) {
        router.post('/register',async  function (req,res)  {
        const { email, firstName, lastName, password, confirmPassword } = req.body;console.log(req.body);
        // Check if the password and confirm password fields match
        if (password === confirmPassword) {
            const admin =  await  Admins.findOne( { where:{email : email} } );

            if (admin) {
                res.send("Admin Already exists");
            return;
            }
            const hashedPassword = getHashedPassword(password);
            Admins.create({ firstName :firstName, lastName :lastName, email : email, password: hashedPassword} ).then(()=> {
                res.redirect('/admin/login');
                });
        }
        else { res.send("Password does not match"); }
    });
        router.post('/login' , passport.authenticate('local',{
            failureRedirect :"/admin/login",
            successRedirect :"/admin/home",
        }));
    return router;
};



