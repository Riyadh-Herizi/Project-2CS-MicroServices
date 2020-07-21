var express = require('express');
var router = express.Router();
const { Clients,Users,Groups ,Entities,SubEntities,Plannings,Positions} = require('../../sequelize');
const { response } = require('express');





router.get('/create',async function(req, res, next) {
  const client_id = await Clients.findOne( { where:{email :req.user.username} } );
  const groups = await  Groups.findAll( { where:{clientId :client_id.id} } );
  res.render('creation',{groups :groups });
});

router.get('/create_planning',async function(req, res, next) {
  var date=new Date();
  const client_id = await Clients.findOne( { where:{email :req.user.username} } );
  await Plannings.create({planning_name: req.body.planning_name, clientId: req.body.clientId,start:"",end:"",
  date:date.getFullYear+"-"+date.getMonth+"-"+date.getDate}).then((planning)=> {
    res.redirect("/planning_control/"+planning.id)
  })
});
module.exports = router;
