

module.exports = (sequelize, type) => {
    return sequelize.define('responsible', {
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },

    })
};
