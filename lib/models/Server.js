module.exports = function (sequelize, Sequelize) {
    return sequelize.define('Server', {
        id: {type: Sequelize.INTEGER.UNSIGNED, primaryKey: true, unique: true, autoIncrement: true},
        sid: {type: Sequelize.STRING(191), unique: true, allowNull: false},
        name: {type: Sequelize.TEXT, allowNull: false},
        region: {type: Sequelize.STRING, allowNull: false},
        icon: {type: Sequelize.STRING, allowNull: true},
        language: {type: Sequelize.STRING(5), defaultValue: require('../../config').languages.default},
        mod_log: {type: Sequelize.STRING(191), defaultValue: null, allowNull: true},
        automod: {type: Sequelize.BOOLEAN, defaultValue: false},
        mute_role: {type: Sequelize.STRING(191), defaultValue: null, allowNull: true},
        slash_prefix: {type: Sequelize.BOOLEAN, defaultValue: false},
        exclam_prefix: {type: Sequelize.BOOLEAN, defaultValue: false},
        custom_prefix: {type: Sequelize.STRING(4), allowNull: true},
        customtext_enabled: {type: Sequelize.BOOLEAN, defaultValue: true},
        customtext_prefix: {type: Sequelize.STRING(4), allowNull: false, defaultValue: '.'},
        cluster_value: {type: Sequelize.INTEGER.UNSIGNED}
    }, {
        underscored: true,
        tableName: 'servers'
    })
};