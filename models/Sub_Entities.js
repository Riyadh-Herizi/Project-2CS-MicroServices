

module.exports = (sequelize, type) => {
    return sequelize.define('sub_entities', {
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name :type.STRING,
        hours_number:type.INTEGER,
        complex :type.INTEGER,

    })
};
