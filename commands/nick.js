var eris = require('../lib/client');
var lang = require('../lib/lang');
var cache = require('../lib/cache');

module.exports = {
    label: 'nick',
    enabled: true,
    generator: (msg, args)=> {
        cache.getGuild(msg.channel.guild.id).then(function (guild) {
            if (guild.getRole(msg.author.id) > 2) {
                eris.editNickname(msg.channel.guild.id, args.join(' ').trim()).then(()=> {
                    eris.createMessage(msg.channel.id, lang.computeResponse(msg, 'nick.default'));
                });
            } else eris.createMessage(msg.channel.id, lang.computeResponse(msg, 'no_permission', {
                required: 3,
                have: guild.getRole(msg.author.id) || 0
            }));
        });
        return false;
    },
    options: {
        caseInsensitive: true,
        deleteCommand: true,
        serverOnly: true
    }
};