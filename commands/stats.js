var moment = require('moment');

var lang = require('../lib/lang');
var db = require('../lib/db');
var eris = require('../lib/client');

var started = moment();

module.exports = {
    label: 'stats',
    enabled: true,
    isSubcommand: false,
    generator: (msg, args)=> {
        db.models.Message.count({where: {created_at: {$gt: moment().subtract(1, 'minutes').toDate()}}}).then((count)=> {
            msg.channel.createMessage(lang.computeResponse(msg, 'stats.default', {
                uptime: started.fromNow() || lang.computeResponse(msg, 'stats.error', {}, true),
                mpm: count || lang.computeResponse(msg, 'stats.error', {}, true),
                channel_count: eris.privateChannels.map((c)=> {
                    return c
                }).length + function () {
                    var i = 0;
                    for (var o in eris.channelGuildMap) {
                        if (eris.channelGuildMap[o])i = i + 1
                    }
                    return i;
                }() || lang.computeResponse(msg, 'stats.error', {}, true),
                guild_count: eris.guilds.map((g)=> {
                    return g
                }).length || lang.computeResponse(msg, 'stats.error', {}, true),
                user_count: eris.users.map((u=> {
                    return u
                })).length || lang.computeResponse(msg, 'stats.error', {}, true)
            }));
        });
    },
    options: {
        caseInsensitive: true,
        deleteCommand: true
    },
    subcommands: [require('./stats_server')]
};