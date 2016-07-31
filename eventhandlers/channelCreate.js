var db = require('../lib/db');

module.exports = {
    event: 'channelCreate',
    enabled: true,
    handler: (channel=> {
        db.models.Channel.findOrCreate({
            where: {cid: channel.id}, defaults: {
                cid: channel.id,
                name: channel.name,
                description: channel.topic,
                type: channel.type
            }
        }).spread((ch)=> {
            return ch.setGuild(channel.guild.id)
        });
    })
};