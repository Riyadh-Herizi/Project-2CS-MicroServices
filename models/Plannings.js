

module.exports = (sequelize, type) => {
    return sequelize.define('plannings', {
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        days:type.STRING,
        planning_name : type.STRING,
        date : type.STRING,
        start : type.STRING,
        end : type.STRING,
    })
};
