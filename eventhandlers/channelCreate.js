var db = require('../db/sql_db');

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
        }).then((ch)=> {
            ch.setGuild(channel.guild.id)
        });
    })
};