module.exports = function (sequelize, Sequelize) {
    return sequelize.define('ServerRole', {
        id: {type: Sequelize.INTEGER.UNSIGNED, primaryKey: true, unique: true, autoIncrement: true},
        level: {type: Sequelize.INTEGER.UNSIGNED, defaultValue: 0},
        sid: {type: Sequelize.STRING(191), allowNull: true},
        uid: {type: Sequelize.STRING(191), allowNull: true}
    }, {
        underscored: true,
        tableName: 'serverroles'
    })
};