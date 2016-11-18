let eris = require('../lib/client');
let lang = require('../lib/lang');

module.exports = {
    label: 'shards',
    enabled: true,
    isSubcommand: true,
    generator: (msg, args)=> {
        return lang.computeResponse(msg, 'stats.shards', {
            status: eris.shards.map(shard=> {
                return lang.computeResponse(msg, 'stats.shard', {
                    id: shard.id.toString(),
                    status: shard.status,
                    guildCount: shard.guildCount
                }, true)
            }).join('\n')
        });
    },
    options: {
        deleteCommand: true,
        caseInsensitive: true,
        aliases: ['shard'],
        serverOnly: true
    }
};