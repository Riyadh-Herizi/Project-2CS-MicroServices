const Sequelize = require('sequelize');

const AdminModel = require('./models/Admin');
const UserModel  = require('./models/User');
const ClientModel  = require('./models/Client');
const EntityModel  = require('./models/Entities');
const SubEntityModel  = require('./models/Sub_Entities');
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
const Clients = ClientModel(sequelize,Sequelize);
const Entities = EntityModel(sequelize,Sequelize);
const SubEntities = SubEntityModel(sequelize,Sequelize) ;
Users.belongsTo(Clients);
SubEntities.belongsTo(Entities);

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
        Users.create({ firstName :"hadjame", lastName :"moh", email : "moh@als.com", password: hashedPassword} ).then(()=> {
            console.log(`User inserted `)
        });
    }
}

module.exports = {
 Admins,Users,Clients
};
