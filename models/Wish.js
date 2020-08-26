

module.exports = (sequelize, type) => {
    return sequelize.define('wishes', {
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        day1 :type.INTEGER,
        day2 :type.INTEGER,


    })
};
