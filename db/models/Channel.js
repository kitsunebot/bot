module.exports = function (sequelize, Sequelize) {
    return sequelize.define('Channel', {
        cid: {type: Sequelize.STRING(32), unique: true, allowNull: false, primaryKey: true},
        name: {type: Sequelize.STRING(191), allowNull: false},
        description: {type: Sequelize.STRING(2000), defaultValue: null, allowNull: true},
        type: {type: Sequelize.ENUM('voice', 'text', 'dm'), defaultValue: 'text', allowNull: false}
    }, {
        underscored: true,
        tableName: 'channels'
    })
};