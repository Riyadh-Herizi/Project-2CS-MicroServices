var express = require('express');
var router = express.Router();
const { Clients,Users,Groups ,Entities,SubEntities,Plannings,Positions} = require('../../sequelize');
const { response } = require('express');





router.get('/create',async function(req, res, next) {
  const client_id = await Clients.findOne( { where:{email :req.user.username} } );
  const groups = await  Groups.findAll( { where:{clientId :client_id.id} } );
  res.render('creation',{groups :groups });
});

router.post('/create_planning',async function(req, res, next) {
  var utc = new Date().toJSON().slice(0,10);
  const client_id = await Clients.findOne( { where:{email :req.user.username} } );
  await Plannings.create({planning_name: req.body.name,groupId:req.body.id_group, clientId: client_id.id,start:req.body.start
    ,end:req.body.end,
  date:utc}).then((planning)=> {
  //  res.redirect("/planning_control/"+planning.id)
  })
});
module.exports = router;
