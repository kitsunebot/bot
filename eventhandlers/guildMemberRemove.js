let db = require('../lib/db');
let fcache = require('../lib/cache');

let story = require('storyboard').mainStory;

module.exports = {
    event: 'guildMemberRemove',
    handler: (guild, member)=> {
        story.info('guildLeave', `[${guild.name} | ${member.name}`);
        fcache.getGuild(guild.id).getDbInstance().then(guild=> {
            guild.removeUser(member.id);
        });
    }

};