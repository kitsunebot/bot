module.exports = function (sequelize, Sequelize) {
    return sequelize.define('ChatLog', {
        id: {type: Sequelize.STRING(14), primaryKey: true, unique: true,allowNull:false},
        time: {type: Sequelize.DATE, defaultValue: Sequelize.NOW}
    }, {
        underscored: true,
        tableName: 'chatlogs'
    })
};