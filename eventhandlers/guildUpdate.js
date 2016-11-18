let story = require('storyboard').mainStory;

let db = require('../lib/db');
let cache = require('../lib/cache');

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