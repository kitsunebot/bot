var eris = require('../lib/client');
var lang = require('../lib/lang');
var cache = require('../lib/cache');
var pubsub = require('../db/redis_pubsub');

module.exports = {
    label: 'global',
    enabled: true,
    isSubcommand: true,
    generator: (msg, args)=> {
        cache.getGlobalUserPerm(msg.author.id).then((perm)=> {
            if (perm > 6) {
                var nick = (args.join(' ').trim() !== 'reset' ? args.join(' ').trim() : eris.user.username);
                eris.guilds.map((g)=> {
                    return g
                }).forEach((g, index)=> {
                    setTimeout(()=> {
                        eris.editNickname(g.id, nick)
                    }, index * 10000);
                });
                eris.createMessage(msg.channel.id, lang.computeResponse(msg, 'nick.global'));
                pubsub.sendEvent('nicknameChange',nick);
            } else eris.createMessage(msg.channel.id, lang.computeResponse(msg, 'no_permission', {
                required: 7,
                have: perm || 0
            }));
        });
        return false;
    },
    options: {
        caseInsensitive: true,
        deleteCommand: true
    }
};