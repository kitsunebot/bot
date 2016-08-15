var eris = require('../lib/client');
var lang = require('../lib/lang');
var cache = require('../lib/cache');

var _ = require('underscore');

module.exports = {
    label: 'purge',
    enabled: true,
    isSubcommand: false,
    generator: (msg, args)=> {
        var guild = cache.getGuild(msg.channel.guild.id)
        if (guild.getRole(msg.author.id) > 2) {
            var count = (!isNaN(parseInt(args[0])) ? parseInt(args[0]) : 10);
            eris.getMessages(msg.channel.id, count + 5, msg.channel.lastMessageID).then((messages)=> {
                var toDelete = _.first(messages.map((msg)=> {
                    return msg
                }), count);
                eris.deleteMessages(msg.channel.id, toDelete.map((msg)=> {
                    return msg.id
                }));
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
    }
};