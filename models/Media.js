module.exports = function (sequelize, Sequelize) {
    return sequelize.define('Media', {
        id: {type: Sequelize.INTEGER.UNSIGNED, primaryKey: true, unique: true, autoIncrement: true},
        mid: {type: Sequelize.STRING(191), allowNull: false, unique: true},
        filepath: {type: Sequelize.STRING(191), allowNull: false, unique: true},
        name: {type: Sequelize.STRING(191), allowNull: false},
        length: {type: Sequelize.INTEGER},
        format: {type: Sequelize.ENUM('mp3', 'wav')}
    }, {
        underscored: true,
        tableName: 'media'
    })
};