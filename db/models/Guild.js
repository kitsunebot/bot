module.exports = function (sequelize, Sequelize) {
    return sequelize.define('Guild', {
        gid: {type: Sequelize.STRING(32), unique: true, allowNull: false, primaryKey: true},
        name: {type: Sequelize.TEXT, allowNull: false},
        region: {type: Sequelize.STRING, allowNull: false},
        icon: {type: Sequelize.STRING, allowNull: true},
        avability: {type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true},
        language: {type: Sequelize.STRING(5), defaultValue: require('../../config').languages.default},
        mod_log: {type: Sequelize.STRING(32), defaultValue: null, allowNull: true},
        automod: {type: Sequelize.BOOLEAN, defaultValue: false},
        mute_role: {type: Sequelize.STRING(32), defaultValue: null, allowNull: true},
        customtext_enabled: {type: Sequelize.BOOLEAN, defaultValue: false},
        customtext_prefix: {type: Sequelize.STRING(4), allowNull: false, defaultValue: '.'},
        shard_id: {type: Sequelize.INTEGER.UNSIGNED},
        permission: {type: Sequelize.TEXT, allowNull: true}
    }, {
        underscored: true,
        tableName: 'guilds'
    })
};