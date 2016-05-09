module.exports = function (sequelize, Sequelize) {
    return sequelize.define('ResponseTime', {
        id: {type: Sequelize.INTEGER.UNSIGNED, primaryKey: true, unique: true, autoIncrement: true},
        startTime: {type: Sequelize.BIGINT, allowNull: false},
        endTime: {type: Sequelize.BIGINT, allowNull:true},
        msg_id: {type: Sequelize.STRING(191), unique:true, allowNull: false},
        command: {type: Sequelize.STRING(32), allowNull: true}
    }, {
        underscored: true,
        tableName: 'responsetimes'
    })
};