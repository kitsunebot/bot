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
    ProxerWatcher: sequelize.import(path.join(__dirname, 'models', 'ProxerWatcher'))
};

models.Guild.belongsTo(models.User, {as: 'Owner'});
models.User.hasMany(models.Guild, {as: 'OwnedGuilds'});

models.User.hasMany(models.GuildRole);
models.Guild.hasMany(models.GuildRole);
models.GuildRole.belongsTo(models.Guild);
models.GuildRole.belongsTo(models.User);

models.Guild.belongsToMany(models.Prefix, {through: 'GuildPrefixes'});
models.Prefix.belongsToMany(models.Guild, {through: 'GuildPrefixes'});

models.Guild.hasMany(models.TwitchWatcher);
models.TwitchWatcher.belongsTo(models.Guild);
models.TwitchWatcher.belongsTo(models.TwitchChannel);
models.TwitchChannel.hasMany(models.TwitchWatcher);

models.ProxerWatcher.belongsTo(models.ProxerAnime);
models.ProxerAnime.hasMany(models.ProxerWatcher);
models.Guild.hasMany(models.ProxerWatcher);
models.ProxerWatcher.belongsTo(models.Guild);

models.User.belongsTo(models.Character, {as: 'Waifu'});
models.User.belongsTo(models.Character, {as: 'Husbando'});
//models.Character.hasMany(models.User, {as: 'Waifu'});

models.Character.hasMany(models.CharacterPicture);
models.CharacterPicture.belongsTo(models.Character);

sequelize.sync();
messageDB.sync();

var messageCron = new Cron('0 0 0,6,12,18 * * *', function () {
    models.Message.findAll({where: {created_at: {$lt: moment().subtract(3, 'days').unix()}}}).then(function (msgs) {
        return Promise.all(msgs.map((msg)=> {
            return msg.destroy()
        }));
    });
}, null, true);

module.exports = {models: models, sequelize: sequelize, messageDB: messageDB};