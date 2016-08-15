var lang = require('../lib/lang');
var eris = require('../lib/client');
var cache = require('../lib/cache');

module.exports = {
    label: 'add',
    enabled: true,
    isSubcommand: true,
    generator: (msg, args)=> {
        eris.sendChannelTyping(msg.channel.id);
        var guild = cache.getGuild(msg.channel.guild.id)
        if (guild.getRole(msg.author.id) > 2) {
            guild.addPrefix(args.join(' ').trim()).then(()=> {
                eris.createMessage(msg.channel.id, lang.computeResponse(msg, 'prefix.add'));
            });
        } else eris.createMessage(msg.channel.id, lang.computeResponse(msg, 'no_permission', {
            required: 3,
            have: guild.getRole(msg.author.id)
        }));
    },
    options: {
        serverOnly: true,
        deleteCommand: true,
        caseInsensitive: true
    }
};