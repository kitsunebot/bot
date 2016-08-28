var story = require('storyboard').mainStory;

var db = require('../lib/db');
var cache = require('../lib/cache');

module.exports = {
    event: 'guildUpdate',
    enabled: true,
    handler: (guild)=> {
        cache.getGuild(guild.id).updateValues({
            name: guild.name,
            region: guild.region,
            avability: !guild.unavailable
        });
    }
};