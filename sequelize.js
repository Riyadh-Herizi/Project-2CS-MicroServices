const Sequelize = require('sequelize');

const AdminModel = require('./models/Admin');
const UserModel  = require('./models/User');
const EmpPositionsModel  = require('./models/Emp_positions');
const PlanningModel  = require('./models/Plannings');
const PositionModel = require('./models/Position');
const ClientModel  = require('./models/Client');
const EntityModel  = require('./models/Entities');
const ResponsibleModel  = require('./models/Responsible');
const GroupsModel  = require('./models/Group');
const SubEntityModel  = require('./models/Sub_Entities');
const WishModel  = require('./models/Wish');
const crypto = require('crypto');
const sequelize = new Sequelize('project', 'root', '', {
    host: 'localhost',
    dialect: 'mysql',
    pool: {
        max: 10,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});

const getHashedPassword = (password) => {
    const sha256 = crypto.createHash('sha256');
    const hash = sha256.update(password).digest('base64');
    return hash;
};

const Admins = AdminModel(sequelize, Sequelize);
const Users = UserModel(sequelize,Sequelize);
const Plannings = PlanningModel(sequelize,Sequelize);
const Positions = PositionModel(sequelize,Sequelize);
const EmpPositions = EmpPositionsModel(sequelize,Sequelize);
const Clients = ClientModel(sequelize,Sequelize);
const Entities = EntityModel(sequelize,Sequelize);
const Responsible = ResponsibleModel(sequelize,Sequelize);
const SubEntities = SubEntityModel(sequelize,Sequelize) ;
const Groups = GroupsModel(sequelize,Sequelize) ;
const Wishes = WishModel(sequelize,Sequelize) ;
Responsible.belongsTo(Entities);
Users.hasMany(Responsible)
Responsible.belongsTo(Users);
Users.belongsTo(Clients);
Clients.hasMany(Users);
SubEntities.belongsTo(Entities);
Entities.hasMany(SubEntities);
Entities.belongsTo(Clients);
Clients.hasMany(Entities);
Entities.belongsTo(Groups);
Groups.hasMany(Entities);
Groups.belongsTo(Clients);
Clients.hasMany(Groups);
Plannings.belongsTo(Clients);
Clients.hasMany(Plannings);
Plannings.belongsTo(Groups);
Groups.hasMany(Plannings);
Positions.belongsTo(Plannings);
Positions.belongsTo(SubEntities);
SubEntities.hasMany(Positions);
Wishes.belongsTo(Users);
EmpPositions.belongsTo(Users);
EmpPositions.belongsTo(Positions);
Users.hasMany(EmpPositions);
Positions.hasMany(EmpPositions);
Plannings.hasMany(Positions);

sequelize.sync({ force: false })
    .then(() => {
        check();
    });

async function check() {
    const  admin = await Admins.findOne( { where:{email :"r.herizi@als.com"} } );
        if (!admin) {
            const hashedPassword =getHashedPassword("12345678");
            Admins.create({ firstName :"Riyadh", lastName :"Herizi", email : "r.herizi@als.com", password: hashedPassword} ).then(()=> {
                console.log(`Admin inserted `)
            });
        }
    const  client = await Clients.findOne( { where:{email :"a.azzouz@als.com"} } );
    if (!client) {
        const hashedPassword =getHashedPassword("12345678");
        Clients.create({ firstName :"Aymen", lastName :"Azzouz", email : "a.azzouz@als.com", password: hashedPassword} ).then(()=> {
            console.log(`Client inserted `)
        });
    }
    const  user = await Users.findOne( { where:{email :"moh@als.com"} } );
    if (!user) {
        const hashedPassword =getHashedPassword("12345678");
        Users.create({ firstName :"hadjame", lastName :"mohamed", email : "moh@als.com", password: hashedPassword,clientId:1} ).then(()=> {
            console.log(`User inserted `)
        });
    }
}

module.exports = {
 Admins,Users,Clients,Entities,SubEntities,Groups,Plannings,Positions,Responsible,Wishes,EmpPositions
};
