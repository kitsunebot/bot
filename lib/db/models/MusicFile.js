module.exports = function (sequelize, Sequelize) {
    return sequelize.define('MusicFile', {
        id: {type: Sequelize.INTEGER.UNSIGNED, primaryKey: true, unique: true, autoIncrement: true},
        fid: {type: Sequelize.STRING(191), unique: true, allowNull: false},
        name: {type: Sequelize.TEXT, allowNull: false},
        filepath: {type: Sequelize.STRING(191), unique: true, allowNull:false},
        dl_url: {type: Sequelize.STRING(191), allowNull: true},
        isPrivate: {type: Sequelize.BOOLEAN, defaultValue: false}
    }, {
        underscored: true,
        tableName: 'musicfiles'
    })
};