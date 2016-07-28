var Sequelize = require('sequelize');
var config = require('../config');
var path = require('path');
var story = require('storyboard').mainStory;
var Cron = require('cron').CronJob;
var utils = require('../lib/utils');
var moment = require('moment');

if (config.db.options.logging === true) config.db.options.logging = (toLog)=> {
    //story.debug('SQL', toLog);
};

var sequelize = new Sequelize(config.db.database, config.db.username, config.db.password, config.db.options);
var messageDB = new Sequelize(config.db.database, config.db.username, config.db.password, config.db.options);
var models = {
    Guild: sequelize.import(path.join(__dirname, 'models', 'Guild')),
    User: sequelize.import(path.join(__dirname, 'models', 'User')),
    GuildRole: sequelize.import(path.join(__dirname, 'models', 'GuildRole')),
    Prefix: sequelize.import(path.join(__dirname, 'models', 'Prefix')),
    TwitchChannel: sequelize.import(path.join(__dirname, 'models', 'TwitchChannel')),
    TwitchWatcher: sequelize.import(path.join(__dirname, 'models', 'TwitchWatcher')),
    Character: sequelize.import(path.join(__dirname, 'models', 'Character')),
    CharacterPicture: sequelize.import(path.join(__dirname, 'models', 'CharacterPicture')),
    Message: messageDB.import(path.join(__dirname, 'models', 'Message')),
    ProxerAnime: sequelize.import(path.join(__dirname, 'models', 'ProxerAnime')),
    ProxerWatcher: sequelize.import(path.join(__dirname, 'models', 'ProxerWatcher')),
    Channel: sequelize.import(path.join(__dirname, 'models', 'Channel')),
    ChatLog: sequelize.import(path.join(__dirname, 'models', 'ChatLog')),
    ChatLogMessage: sequelize.import(path.join(__dirname, 'models', 'ChatLogMessage'))
};

models.Guild.belongsTo(models.User, {as: 'Owner'});
models.Guild.hasMany(models.GuildRole);
models.Guild.belongsToMany(models.Prefix, {through: 'GuildPrefixes'});
models.Guild.hasMany(models.ProxerWatcher);
models.Guild.hasMany(models.TwitchWatcher);
models.Guild.hasMany(models.Channel);

models.User.hasMany(models.Guild, {as: 'OwnedGuilds'});
models.User.hasMany(models.GuildRole);

models.GuildRole.belongsTo(models.Guild);
models.GuildRole.belongsTo(models.User);
models.User.belongsTo(models.Character, {as: 'Waifu'});
models.User.belongsTo(models.Character, {as: 'Husbando'});

models.Prefix.belongsToMany(models.Guild, {through: 'GuildPrefixes'});

models.TwitchWatcher.belongsTo(models.Guild);
models.TwitchWatcher.belongsTo(models.TwitchChannel);

models.TwitchChannel.hasMany(models.TwitchWatcher);

models.ProxerWatcher.belongsTo(models.ProxerAnime);
models.ProxerWatcher.belongsTo(models.Guild);

models.ProxerAnime.hasMany(models.ProxerWatcher);

models.Character.hasMany(models.CharacterPicture);

models.CharacterPicture.belongsTo(models.Character);

models.ChatLog.belongsToMany(models.ChatLogMessage, {through: 'LogMessages'});
models.ChatLog.belongsTo(models.User);
models.ChatLog.belongsTo(models.Guild);
models.ChatLog.belongsTo(models.Channel);

models.ChatLogMessage.belongsToMany(models.ChatLog, {through: 'LogMessages'});
models.ChatLogMessage.belongsTo(models.User);

models.Channel.belongsTo(models.Guild);
models.Channel.hasMany(models.ChatLog);

sequelize.sync();
messageDB.sync();

var messageCron = new Cron('0 0 0,6,12,18 * * *', function () {
    models.Message.destroy({where: {created_at: {$lt: moment().subtract(3, 'days').toDate()}}}).then(function (msgs) {
        story.debug('SQL', 'Deleted ' + msgs + ' messages from the DB');
    });
}, null, true);

module.exports = {models: models, sequelize: sequelize, messageDB: messageDB};