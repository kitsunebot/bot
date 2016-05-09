config = require('./config.js');
flatten = require('flat');
utils = require('./lib/utils.js');
_ = require('underscore');
S = require('string');
moment = require('moment');
//noinspection JSAnnotator
path = require('path');
chalk = require('chalk');
story = require('storyboard').mainStory;
var Redis = require('ioredis');
var Sequelize = require('sequelize');
var mailgun = require('mailgun-js');
validator = require('validator');
request = require('request');
discordjs = require('discord.js');
os = require('os');
pxlxml = require('pixl-xml');
mg = mailgun(config.mailgun);
starttime = null;
redis = new Redis(config.redis);
sequelize = new Sequelize(config.db.database, config.db.username, config.db.password, config.db.options);
models = {
    Server: sequelize.import(path.join(__dirname, 'models', 'Server')),
    User: sequelize.import(path.join(__dirname, 'models', 'User')),
    Game: sequelize.import(path.join(__dirname, 'models', 'Game')),
    CustomCommand: sequelize.import(path.join(__dirname, 'models', 'CustomCommand')),
    ServerRole: sequelize.import(path.join(__dirname, 'models', 'ServerRole')),
    TwitchChannel: sequelize.import(path.join(__dirname, 'models', 'TwitchChannel')),
    TwitchWatcher: sequelize.import(path.join(__dirname, 'models', 'TwitchWatcher')),
    ChatReaction: sequelize.import(path.join(__dirname, 'models', 'ChatReaction'))
};

models.Server.belongsTo(models.User, {as: 'Owner'});
models.User.hasMany(models.Server, {as: 'OwnedServers'});
models.User.hasMany(models.ServerRole);
models.Server.hasMany(models.ServerRole);
models.ServerRole.belongsTo(models.Server);
models.ServerRole.belongsTo(models.User);
models.Server.hasMany(models.CustomCommand);
models.CustomCommand.belongsTo(models.Server);
models.Server.hasMany(models.TwitchWatcher);
models.TwitchWatcher.belongsTo(models.Server);
models.TwitchWatcher.belongsTo(models.TwitchChannel);
models.TwitchChannel.hasMany(models.TwitchWatcher);
models.ChatReaction.belongsTo(models.Server);
models.Server.hasMany(models.ChatReaction);

sequelize.sync().then(function () {
    workers.checkTwitchChannels();
    utils.initRedis();
});

discordBot = new discordjs.Client({autoReconnect: true, compress: true, forceFetchUsers: true, maxCachedMessages: 50});
cmds = require('./lib/commands.js');
workers = require('./lib/workers.js');

discordBot.loginWithToken(config.login.token).then(function () {
    story.info('meta', 'Login successfull');
}).catch(function (err) {
    story.error('meta', 'Error while logging in.', {attach: err});
});
