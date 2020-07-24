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

      res.send({id:planning.id})
  })
});
router.get('/:id_planning',async function(req, res, next) {
    const client_id = await Clients.findOne( { where:{email :req.user.username} } );
    await Plannings.findOne({where :{id:req.params.id_planning}}).then(async (planning)=>{
       const sub_entities =await SubEntities.findAll( { include:[{model:Entities,required:true,where: {groupId : planning.groupId}}] } );
      res.render('creation',{sub_entities :sub_entities });

    });

});


module.exports = router;
