module.exports = function (sequelize, Sequelize) {
    return sequelize.define('ChatReaction', {
        id: {type: Sequelize.INTEGER.UNSIGNED, primaryKey: true, unique: true, autoIncrement: true},
        trigger: {type: Sequelize.STRING(25), allowNull: false},
        display: {type: Sequelize.TEXT, allowNull: false},
        sid: {type: Sequelize.STRING(191), allowNull: true},
        type: {type: Sequelize.ENUM('global', 'local'), allowNull: false, defaultValue: 'local'},
        msg_type: {type: Sequelize.ENUM('file', 'text'), allowNull: false, defaultValue: 'text'},
        active: {type: Sequelize.BOOLEAN, defaultValue: true}
    }, {
        underscored: true,
        tableName: 'chatreactions'
    })
};