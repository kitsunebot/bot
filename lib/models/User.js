module.exports = function (sequelize, Sequelize) {
    return sequelize.define('User', {
        id: {type: Sequelize.INTEGER.UNSIGNED, primaryKey: true, unique: true, autoIncrement: true},
        username: {type: Sequelize.STRING(191), allowNull: false},
        uid: {type: Sequelize.STRING(191), allowNull: false, unique: true},
        status: {type: Sequelize.ENUM('online', 'offline', 'idle'), allowNull: false, defaultValue: 'online'},
        avatar: {type: Sequelize.STRING, allowNull: true},
        custom_role: {type: Sequelize.INTEGER.UNSIGNED, allowNull: false, defaultValue: 0},
        language: {type: Sequelize.STRING(5), defaultValue: require('../../config').languages.default}
    }, {
        underscored: true,
        tableName: 'users'
    })
};