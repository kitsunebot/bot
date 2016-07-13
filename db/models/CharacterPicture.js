module.exports = function (sequelize, Sequelize) {
    return sequelize.define('CharacterPicture', {
        id: {type: Sequelize.INTEGER.UNSIGNED, unique: true, autoIncrement: true, primaryKey: true},
        link: {type: Sequelize.STRING(191), allowNull: false, unique: true}
    }, {
        underscored: true,
        tableName: 'characterpictures'
    })
};