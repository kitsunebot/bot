module.exports = function (sequelize, Sequelize) {
    return sequelize.define('Character', {
        id: {type: Sequelize.STRING(14), allowNull: false, unique: true, primaryKey: true},
        name: {type: Sequelize.STRING(191), allowNull: false},
        type: {type: Sequelize.ENUM('waifu','husbando','idol'), defaultValue: 'waifu', allowNull: false},
        source: {type: Sequelize.STRING(191), allowNull: false}
    }, {
        underscored: true,
        tableName: 'characters'
    })
};