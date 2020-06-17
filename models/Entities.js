

module.exports = (sequelize, type) => {
    return sequelize.define('entities', {
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name :type.STRING,
        complex :type.INTEGER,


    })
};
