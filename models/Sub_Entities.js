

module.exports = (sequelize, type) => {
    return sequelize.define('sub_entities', {
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name :type.STRING,
        hours:type.STRING,
        min:type.STRING,
        complex :type.INTEGER,
        nb_emp:type.INTEGER,

    })
};
