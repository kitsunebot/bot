module.exports = function (sequelize, Sequelize) {
    return sequelize.define('ChatLogMessage', {
        mid: {type: Sequelize.STRING(32), allowNull: false},
        content: {type: Sequelize.STRING(2000), allowNull: false},
        create_content: {type: Sequelize.STRING(2000), allowNull: false},
        edited: {type: Sequelize.BOOLEAN, defaultValue: false},
        deleted: {type: Sequelize.BOOLEAN, defaultValue: false},
        timestamp: {type: Sequelize.INTEGER, allowNull: false, defaultValue: 0}
    }, {
        underscored: true,
        tableName: 'chatlogmessages'
    })
};