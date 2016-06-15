module.exports = function (sequelize, Sequelize) {
    return sequelize.define('Waifu', {
        id: {type: Sequelize.INTEGER.UNSIGNED, unique: true, autoIncrement: true, primaryKey: true},
        name: {type: Sequelize.STRING(191), allowNull: false},
        source: {type: Sequelize.STRING(191), allowNull: false},
        wid: {type: Sequelize.STRING(14), allowNull: false, unique: true}
    }, {
        underscored: true,
        tableName: 'waifu'
    })
};