var express = require('express');
var router = express.Router();
const { Clients,Users,Groups ,Entities,SubEntities,Plannings,Positions} = require('../../sequelize');
const { response } = require('express');
const request = require('request');





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
  date:utc,days:"1111111"}).then((planning)=> {
  console.log(planning)
      res.send({id:planning.id})
  })
});
router.get('/:id_planning',async function(req, res, next) {
    await Plannings.findOne({where :{id:req.params.id_planning}}).then(async (planning)=>{
       await SubEntities.count( { include:[{model:Entities,required:true,where: {groupId : planning.groupId}},{model:Positions,required:true,where:{planningId : planning.id}}] } ).then(
        async count=>{
               if (count>0){

                var sub_entities = await SubEntities.findAll( { include:[{model:Entities,required:true,where: {groupId : planning.groupId}},{model:Positions,required:true,where:{planningId : planning.id}}] } );
                   console.log(sub_entities)  ;
                res.render('creation',{sub_entities :sub_entities ,id:req.params.id_planning,check : true,days:planning.days});

               }else{
                    const sub_entities2 =await SubEntities.findAll( { include:[{model:Entities,required:true,where: {groupId : planning.groupId}},] } );

                   res.render('creation',{sub_entities :sub_entities2 ,id:req.params.id_planning,check : false,days:planning.days});
                    }
                 });
                }
    );

});

router.post("/save",async function(req,response,next) {

    request.post({
        json:true,
        headers: {'content-type': 'application/json'},
        url: `http://127.0.0.1:3001/save`,
        body:{
            positions: req.body.positions
        }
    }, (err, res, body) => {
        console.log("executed")
        if (err) {
         // error
            console.log("error")
            console.log(err)
            response.send({final:false})
        } else {
         if(res.statusCode===200) {
             response.send({final:true})
         }
         else {
             response.send({final:false})
         }
        }
    });
});


module.exports = router;
