module.exports = function (sequelize, Sequelize) {
    return sequelize.define('Server', {
        id: {type: Sequelize.INTEGER.UNSIGNED, primaryKey: true, unique: true, autoIncrement: true},
        sid: {type: Sequelize.STRING(191), unique: true, allowNull: false},
        name: {type: Sequelize.TEXT, allowNull: false},
        region: {type: Sequelize.STRING, allowNull: false},
        icon: {type: Sequelize.STRING, allowNull: true},
        enabled: {type: Sequelize.BOOLEAN, defaultValue: false},
        automod: {type: Sequelize.BOOLEAN, defaultValue: false},
        language: {type: Sequelize.STRING(5), defaultValue: config.languages.default},
        mod_log: {type: Sequelize.STRING(191), defaultValue: null, allowNull: true},
        slash: {type: Sequelize.BOOLEAN, defaultValue: false},
        shortpref: {type: Sequelize.BOOLEAN, defaultValue: false},
        ccenabled: {type: Sequelize.BOOLEAN, defaultValue: false},
        crenabled: {type: Sequelize.BOOLEAN, defaultValue: false}
    }, {
        underscored: true,
        tableName: 'servers'
    })
};