var express = require('express');
var router = express.Router();
const { Clients,Users,Groups ,Entities,SubEntities,Plannings,Positions} = require('../../sequelize');





router.get('/create',async function(req, res, next) {
  const client_id = await Clients.findOne( { where:{email :req.user.username} } );
  const groups = await  Groups.findAll( { where:{clientId :client_id.id} } );
  res.render('creation',{groups :groups });
});
module.exports = router;
