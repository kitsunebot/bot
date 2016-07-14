module.exports = function (sequelize, Sequelize) {
    return sequelize.define('GuildRole', {
        id: {type: Sequelize.INTEGER.UNSIGNED, primaryKey: true, unique: true, autoIncrement: true},
        level: {type: Sequelize.INTEGER.UNSIGNED, defaultValue: 0},
        guild_id: {type: Sequelize.STRING(32), allowNull: true},
        user_id: {type: Sequelize.STRING(32), allowNull: true}
    }, {
        underscored: true,
        tableName: 'guildroles'
    })
};