var story = require('storyboard').mainStory;

var db = require('../db/sql_db');
var cache = require('../lib/cache');

module.exports = {
    event: 'guildUpdate',
    enabled: true,
    handler: (update)=> {
        cache.getGuild(update.guild.id).then(function (guild) {
            guild.updateValues({
                name: update.guild.name,
                region: update.guild.region,
                avability: !update.guild.unavailable
            });
        });
    }
};