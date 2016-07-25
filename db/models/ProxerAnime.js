module.exports = function (sequelize, Sequelize) {
    return sequelize.define('ProxerAnime', {
            id: {type: Sequelize.INTEGER.UNSIGNED, primaryKey: true, unique: true, autoIncrement: true},
            api_url: {type: Sequelize.STRING(191), allowNull: false, unique: true},
            title: {type: Sequelize.STRING(100), allowNull: false, unique: true},
            status: {type: Sequelize.INTEGER.UNSIGNED, allowNull: false, defualtValue: 0},
            has_ended: {type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false},
            week_day: {type: Sequelize.INTEGER.UNSIGNED, defaultValue: 7}
        },
        {
            underscored: true,
            tableName: 'proxeranimes'
        }
    )
};