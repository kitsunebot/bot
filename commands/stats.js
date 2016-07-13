var moment = require('moment');

var lang = require('../lib/lang');
var db = require('../db/sql_db');
var eris = require('../lib/client');

var started = moment();

module.exports = {
    label: 'stats',
    enabled: true,
    isSubcommand: false,
    generator: (msg, args)=> {
        db.models.Message.count({where: {created_at: {$gt: moment().subtract(1, 'minutes').toDate()}}}).then(function (count) {
            eris.createMessage(msg.channel.id, lang.computeResponse(msg, 'stats.default', {
                uptime: started.fromNow(),
                mpm: count,
                channel_count: eris.privateChannels.map((c)=> {
                    return c
                }).length + function() {
                    var i = 0;
                    for (var o in eris.channelGuildMap) {
                        if (eris.channelGuildMap[o])i = i + 1
                    }
                    return i;
                }(),
                guild_count: eris.guilds.map((g)=> {
                    return g
                }).length,
                user_count: eris.users.map((u=> {
                    return u
                })).length
            }));
        });
    },
    options: {
        caseInsensitive: true,
        deleteCommand: true
    }
};