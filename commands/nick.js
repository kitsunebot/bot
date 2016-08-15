var eris = require('../lib/client');
var lang = require('../lib/lang');
var cache = require('../lib/cache');

module.exports = {
    label: 'nick',
    enabled: true,
    isSubcommand: false,
    generator: (msg, args)=> {
        var guild = cache.getGuild(msg.channel.guild.id);
        if (guild.getRole(msg.author.id) > 2) {
            var nick = (args.join(' ').trim() !== 'reset' ? args.join(' ').trim() : eris.user.username);
            eris.editNickname(msg.channel.guild.id, nick).then(()=> {
                eris.createMessage(msg.channel.id, lang.computeResponse(msg, 'nick.default'));
            });
        } else eris.createMessage(msg.channel.id, lang.computeResponse(msg, 'no_permission', {
            required: 3,
            have: guild.getRole(msg.author.id) || 0
        }));
        return false;
    },
    options: {
        caseInsensitive: true,
        deleteCommand: true,
        serverOnly: true
    },
    subcommands: [require('./nick_global')]
};