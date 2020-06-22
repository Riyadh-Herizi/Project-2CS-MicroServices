

module.exports = (sequelize, type) => {
    return sequelize.define('positions', {
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        day : type.INTEGER,
        start : type.TIME,
        end : type.TIME,

    })
};
