module.exports = function (sequelize, Sequelize) {
    return sequelize.define('MusicWorker', {
        id: {type: Sequelize.INTEGER.UNSIGNED, primaryKey: true, unique: true, autoIncrement: true},
        sid: {type: Sequelize.STRING(191), unique: true},
        login_name: {type: Sequelize.STRING(191), unique: true, allowNull: false},
        login_password: {type: Sequelize.STRING(191), allowNull: false},
        type: {type: Sequelize.ENUM('public', 'private'), defaultValue: 'private', allowNull: false},
        active: {type: Sequelize.BOOLEAN, defaultValue: false}
    }, {
        underscored: true,
        tableName: 'musicworkers'
    })
};