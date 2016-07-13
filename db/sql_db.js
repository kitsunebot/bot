var Sequelize = require('sequelize');
var config = require('../config');
var path = require('path');
var story = require('storyboard').mainStory;

if (config.db.options.logging === true) config.db.options.logging = (toLog)=> {
    //story.debug('SQL', toLog);
};

var sequelize = new Sequelize(config.db.database, config.db.username, config.db.password, config.db.options);
var models = {
    Guild: sequelize.import(path.join(__dirname, 'models', 'Guild')),
    User: sequelize.import(path.join(__dirname, 'models', 'User')),
    GuildRole: sequelize.import(path.join(__dirname, 'models', 'GuildRole')),
    Prefix: sequelize.import(path.join(__dirname,'models','Prefix')),
    //TwitchChannel: sequelize.import(path.join(__dirname, 'models', 'TwitchChannel')),
    //TwitchWatcher: sequelize.import(path.join(__dirname, 'models', 'TwitchWatcher')),
    Character: sequelize.import(path.join(__dirname, 'models', 'Character')),
    CharacterPicture: sequelize.import(path.join(__dirname, 'models', 'CharacterPicture'))
};

models.Guild.belongsTo(models.User, {as: 'Owner'});
models.User.hasMany(models.Guild, {as: 'OwnedGuilds'});

models.User.hasMany(models.GuildRole);
models.Guild.hasMany(models.GuildRole);
models.GuildRole.belongsTo(models.Guild);
models.GuildRole.belongsTo(models.User);

models.Guild.belongsToMany(models.Prefix,{through:'GuildPrefixes'});
models.Prefix.belongsToMany(models.Guild,{through:'GuildPrefixes'});

//models.Guild.hasMany(models.TwitchWatcher);
//models.TwitchWatcher.belongsTo(models.Guild);
//models.TwitchWatcher.belongsTo(models.TwitchChannel);
//models.TwitchChannel.hasMany(models.TwitchWatcher);

models.User.belongsTo(models.Character, {as: 'Waifu'});
//models.Character.hasMany(models.User, {as: 'Waifu'});

models.Character.hasMany(models.CharacterPicture);
models.CharacterPicture.belongsTo(models.Character);

sequelize.sync();

module.exports = {models: models, sequelize: sequelize};