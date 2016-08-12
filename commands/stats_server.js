var db = require('../lib/db');
var lang = require('../lib/lang');
var eris = require('../lib/client');

var moment = require('moment');

module.exports = {
    label: 'guild',
    enabled: true,
    isSubcommand: true,
    generator: (msg, args)=> {
        db.models.Message.count({
            where: {
                created_at: {
                    $gt: moment().subtract(1, 'minutes').toDate(),
                    gid: msg.channel.guild.id
                }
            }
        }).then(function (count) {
            console.log(count);
            eris.createMessage(msg.channel.id, lang.computeResponse(msg, 'stats.guild', {
                mpm: count,
                channel_count: eris.guilds.get(msg.channel.guild.id).channels.size || lang.computeResponse(msg, 'stats.error', {}, true),
                user_count: eris.guilds.get(msg.channel.guild.id).members.map((u=> {
                    return u
                })).length || lang.computeResponse(msg, 'stats.error', {}, true)
            }));
        });
    },
    options: {
        deleteCommand: true,
        caseInsensitive: true,
        aliases: ['server'],
        serverOnly: true
    }
};