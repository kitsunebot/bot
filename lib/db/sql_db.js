'use strict';

var Sequelize = require('sequelize');
var config = require('../../config');
var path = require('path');
var story = require('storyboard').mainStory;

if(config.db.options.logging === true) config.db.options.logging = function (toLog) {
    story.debug('SQL', toLog);
};

var sequelize = new Sequelize(config.db.database, config.db.username, config.db.password, config.db.options);
var models = {
    Server: sequelize.import(path.join(__dirname, 'models', 'Server')),
    User: sequelize.import(path.join(__dirname, 'models', 'User')),
    Game: sequelize.import(path.join(__dirname, 'models', 'Game')),
    ServerRole: sequelize.import(path.join(__dirname, 'models', 'ServerRole')),
    TwitchChannel: sequelize.import(path.join(__dirname, 'models', 'TwitchChannel')),
    TwitchWatcher: sequelize.import(path.join(__dirname, 'models', 'TwitchWatcher')),
    Waifu: sequelize.import(path.join(__dirname, 'models', 'Waifu')),
    CharacterPicture: sequelize.import(path.join(__dirname, 'models', 'CharacterPicture')),
    MusicFile: sequelize.import(path.join(__dirname, 'models', 'MusicFile'))
};

models.Server.belongsTo(models.User, {as: 'Owner'});
models.User.hasMany(models.Server, {as: 'OwnedServers'});

models.User.hasMany(models.ServerRole);
models.Server.hasMany(models.ServerRole);
models.ServerRole.belongsTo(models.Server);
models.ServerRole.belongsTo(models.User);

models.Server.hasMany(models.TwitchWatcher);
models.TwitchWatcher.belongsTo(models.Server);
models.TwitchWatcher.belongsTo(models.TwitchChannel);
models.TwitchChannel.hasMany(models.TwitchWatcher);

models.User.belongsTo(models.Waifu);
models.Waifu.hasMany(models.User);
models.Waifu.hasMany(models.CharacterPicture);
models.CharacterPicture.belongsTo(models.Waifu);

models.User.hasMany(models.MusicFile);
models.MusicFile.belongsTo(models.User);

sequelize.sync();

module.exports = {models: models, sequelize: sequelize};