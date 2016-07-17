var cache = require('../lib/cache');
var eris = require('../lib/client');
var lang = require('../lib/lang');

module.exports = {
    label: 'prefix',
    enabled: true,
    isSubcommand: false,
    generator: (msg, args)=> {
        return lang.computeResponse(msg, 'prefix.list', {
            prefixes: (eris.guildPrefixes[msg.channel.guild.id] || eris.commandOptions.prefix).map((p)=> {
                return '`' + p + '`'
            }).join(' ')
        });
    },
    options: {
        caseInsensitive: true,
        deleteCommand: true,
        serverOnly: true
    },
    subcommands: [require('./prefix_add'), require('./prefix_remove')]
};