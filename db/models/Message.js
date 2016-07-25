module.exports = function (sequelize, Sequelize) {
    return sequelize.define('Message', {
        mid: {type: Sequelize.STRING(32), unique: true, allowNull: false, primaryKey: true},
        content: {type: Sequelize.STRING(2000), allowNull: false},
        uid: {type: Sequelize.STRING(32), allowNull: false},
        gid: {type: Sequelize.STRING(32), allowNull: true},
        cid: {type: Sequelize.STRING(32), allowNull: false},
        edited: {type: Sequelize.BOOLEAN, defaultValue: false},
        deleted: {type: Sequelize.BOOLEAN, defaultValue: false},
        timestamp: {type: Sequelize.INTEGER, allowNull: false, defaultValue: 0}
    }, {
        underscored: true,
        tableName: 'messages'
    })
};