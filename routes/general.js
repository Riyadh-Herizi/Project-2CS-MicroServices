var express = require('express');
var router = express.Router();
const {Admins, Clients,Users,Groups ,Entities,SubEntities,Plannings,Positions,Responsible} = require('../sequelize');

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
router.get('/', async function(req, res, next) {

    if(typeof req.user === 'undefined')
        res.render('index',{type:"no"});
    else if(await check_if_user(req)) {
        res.render('index',{type:"user"});
    } else if(await check_if_admin(req)) {
        res.render('index',{type:"admin"});
    } else if (await check_if_client(req)){
        res.render('index',{type:"client"});
    }

});

router.get('/login', function(req, res, next) {
    res.render('login_page');
});



router.get('/test', function(req, res, next) {
    res.render('test');
});
module.exports = router;
