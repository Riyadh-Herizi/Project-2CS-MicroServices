

module.exports = (sequelize, type) => {
    return sequelize.define('emp_positions', {
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
    })
};
