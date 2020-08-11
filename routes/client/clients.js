var express = require('express');
var router = express.Router();
const crypto = require('crypto');
const { Clients,Users,Groups ,Entities,SubEntities,Plannings,Positions,Responsible} = require('../../sequelize');
var loggedin = function(req,res,next) {
   if(req.isAuthenticated()) {
        next()
    }
    else {
       res.redirect('/client/login');
     }
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
const getHashedPassword = (password) => {
    const sha256 = crypto.createHash('sha256');
    const hash = sha256.update(password).digest('base64');
    return hash;
};
router.get('/login', async function(req, res, next) {
    var check;
    if(typeof req.user === 'undefined')
        check = false;
    else  check = await check_if_client(req);

    res.render('client_login',{check:check});
});
router.get('/',loggedin, async function (req,res,next) {
    const client_id = await Clients.findOne( { where:{email :req.user.username} } );
    const users = await  Users.findAll( { where:{clientId :client_id.id} } );
    res.render('client/home',{users :users});
});
router.get('/planning_service',loggedin ,async function(req, res, next) {
    const client_id = await Clients.findOne( { where:{email :req.user.username} } );
    const groups = await  Groups.findAll( { where:{clientId :client_id.id} } );
    const plannings = await  Plannings.findAll( { where:{clientId :client_id.id} } );
    const users = await  Users.findAll( { where:{clientId :client_id.id} } );
    res.render('planning',{groups :groups,plannings:plannings,users:users });
});




router.post('/get_responsible' ,async function(req, res, next) {
    const client_id = await Clients.findOne( { where:{email :req.user.username} } );
    const users = await  Users.findAll( { where:{clientId :client_id.id},include:[{ model:Responsible,required:true,where: {entityId :req.body.id_entity}}] });
    res.send({users :users });
});
router.post('/create_respo' ,async function(req, res, next) {
    await Responsible.create({ entityId :req.body.id_entity,userId :req.body.id_emp} ).then(()=> {
        res.send("respo created successfully");
    });

});


router.post('/get_group',loggedin ,async function(req, res, next) {
    const client_id = await Clients.findOne( { where:{email :req.user.username} } );
    const groups = await  Groups.findAll( { where:{clientId :client_id.id} } );
    res.send({groups :groups });
});
router.post('/get_sub_entities',loggedin ,async function(req, res, next) {
    const id_entity = req.body.id_entity;
    const client_id = await Clients.findOne( { where:{email :req.user.username} } );
    const sub_entities = await  SubEntities.findAll( { where:{entityId :id_entity} } );
    res.send({sub_entities :sub_entities });
});

router.post('/group_sub_entities',loggedin ,async function(req, res, next) {
    const id_group = req.body.id_group;
    console.log('in function');
    const sub_entities = await SubEntities.findAll( { include:[{model:Entities,required:true,where: {groupId : id_group}}] } );
    res.send({sub_entities :sub_entities });
});

router.post('/get_entities',loggedin ,async function(req, res, next) {
    const client_id = await Clients.findOne( { where:{email :req.user.username} } );
    const id_group = req.body.id_group;
    const entities = await  Entities.findAll( { where:{clientId :client_id.id,groupId:id_group} } );
    res.send({entities :entities });
});

router.post('/show_group',loggedin ,async function(req, res, next) {
    const client_id = await Clients.findOne( { where:{email :req.user.username} } );
    const entities = await  Entities.findAll( { where:{clientId :client_id.id,groupId : req.body.id_group} } );
    res.send({entities :entities });
});


router.get('/logout',function (req,res) {
    req.logout();
    res.redirect('/');
});
router.post('/add',async  function (req,res)  {
    const { email, firstName, lastName, password, confirmPassword } = req.body;console.log(req.body);
    // Check if the password and confirm password fields match
        const user =  await  Users.findOne( { where:{email : email} } );
        if (user) {
            res.send("Employee Already exists");
            return;
        }
        const hashedPassword = getHashedPassword(password);
        const client_id = await Clients.findOne( { where:{email :req.user.username} } );
        Users.create({ firstName :firstName, lastName :lastName, email : email, password: hashedPassword,clientId :client_id.id} ).then(()=> {
           res.send("Employee created successfully");
        });
});
router.post('/add_group',async  function (req,res)  {
    const { group_name } = req.body;console.log(req.body);
    const client_id = await Clients.findOne( { where:{email :req.user.username} } );
    const group =  await  Groups.findOne( { where:{clientId:client_id,group_name:group_name} } );
    if (group) {
        res.send("Group Already exists");
        return;
    }
    Groups.create({ group_name :group_name,clientId :client_id.id} ).then(()=> {
        res.send("Group created successfully");
    });
});
router.post('/add_entity',async  function (req,res)  {
    const { entity_name,complexity,group } = req.body;console.log(req.body);
    const client_id = await Clients.findOne( { where:{email :req.user.username} } );
    const entity =  await  Entities.findOne( { where:{clientId:client_id,name:entity_name} } );

    if(entity === null ) {   Entities.create({ name :entity_name, complex :complexity,clientId :client_id.id,groupId :group} ).then(()=> {
        res.send("Entity created successfully");
    });
    }
});
router.post('/get_emp',async  function (req,res)  {
    const client_id = await Clients.findOne( { where:{email :req.user.username} } );
    const users = await  Users.findAll( { where:{clientId :client_id.id} } );
    res.send(users);
});
router.post('/delete_entity',async function (req,res){
  const client_id = await Clients.findOne( { where:{email :req.user.username} } );
  SubEntities.destroy({where : {entityId:req.body.id_entity}});
  Entities.destroy({where : {id:req.body.id_entity}});
  res.send("Entity deleted successfully");
});
router.post('/add_sub_entity',async  function (req,res)  {
  console.log(req.body);
    const { id_entity,sub_entity_name,hours,min,complexity,repetetion,nb_emp } = req.body;console.log(req.body);
    const sub_entity =  await  SubEntities.findOne( { where:{entityId:id_entity,name:sub_entity_name} } );
    console.log(repetetion);
    if(sub_entity === null ) {
        for( let i=1 ;  i<= repetetion ; i++) {
           await SubEntities.create({ name :sub_entity_name+" "+i, complex :complexity,entityId :id_entity,hours:hours,min:min,nb_emp:nb_emp} )
        }
        res.send("Sub-Entity created successfully");
    }
});
router.post('/delete_sub_entity',async function (req,res){
  SubEntities.destroy({where : {id:req.body.id_sub_entity}});
  res.send("Sub-Entity deleted successfully");
});

module.exports = router;
