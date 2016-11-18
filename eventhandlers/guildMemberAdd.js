let story = require('storyboard').mainStory;
let Promise = require('bluebird');

let db = require('../lib/db');

module.exports = {
    event: 'guildMemberAdd',
    enabled: true,
    handler: (guild, member)=> {
        db.models.User.upsert({
            uid: member.id,
            username: member.user.username,
            discriminator: member.user.discriminator,
            status: member.status
        }).then(()=> {
            return db.models.User.find({where: {uid: member.id}});
        }).then((user)=> {
            return user.addGuild(guild.id);
        });
        story.info('guildJoin', '[' + guild.name + '|' + member.user.username + ']');
    }
};