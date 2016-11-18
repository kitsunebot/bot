let eris = require('../lib/client');
let lang = require('../lib/lang');
let cache = require('../lib/cache');

let _ = require('underscore');

module.exports = {
    label: 'purge',
    enabled: true,
    isSubcommand: false,
    generator: (msg, args)=> {
        let guild = cache.getGuild(msg.channel.guild.id)
        if (guild.getRole(msg.author.id) > 2) {
            let count = (!isNaN(parseInt(args[0])) ? parseInt(args[0]) : 10);
            eris.getMessages(msg.channel.id, count + 5, msg.channel.lastMessageID).then((messages)=> {
                let toDelete = _.first(messages.map((msg)=> {
                    return msg
                }), count);
                eris.deleteMessages(msg.channel.id, toDelete.map((msg)=> {
                    return msg.id
                }));
            });
        } else msg.channel.createMessage(lang.computeResponse(msg, 'no_permission', {
            required: 3,
            have: guild.getRole(msg.author.id) || 0
        }));
        return false;
    },
    options: {
        caseInsensitive: true,
        deleteCommand: true,
        guildOnly: true
    }
};