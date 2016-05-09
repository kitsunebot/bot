module.exports = function (sequelize, Sequelize) {
    return sequelize.define('Game', {
        id: {type: Sequelize.INTEGER.UNSIGNED, primaryKey: true, unique: true, autoIncrement: true},
        name: {type: Sequelize.STRING(25), allowNull: false},
        display: {type: Sequelize.TEXT, allowNull: false},
        active: {type: Sequelize.BOOLEAN, defaultValue: true}
    }, {
        underscored: true,
        tableName: 'games'
    })
};