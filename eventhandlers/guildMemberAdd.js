var story = require('storyboard').mainStory;
var Promise = require('bluebird');

var db = require('../db/sql_db');

module.exports = {
    event: 'guildMemberAdd',
    enabled: true,
    handler: (guild, member)=> {
        db.models.User.upsert({
            uid: member.id,
            username: member.user.username,
            discriminator: member.user.discriminator,
            status: member.status
        });
        story.info('guildJoin', '[' + guild.name + '|' + member.user.username + ']');
    }
};