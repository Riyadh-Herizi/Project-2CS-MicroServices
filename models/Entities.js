

module.exports = (sequelize, type) => {
    return sequelize.define('entities', {
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        group : type.STRING,
        name :type.STRING,
        complex :type.INTEGER,


    })
};
