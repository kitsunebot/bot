var lang = require('../lib/lang');
var cache = require('../lib/cache');
var eris = require('../lib/client');

module.exports = {
    label: 'watcher',
    enabled: true,
    isSubcommand: false,
    generator: (msg, args)=> {
        var guild = cache.getGuild(msg.channel.guild.id);
        guild.getDbInstance().then((guild)=> {
            return guild.getTwitchWatchers({where: {server_channel: msg.channel.id}}).then((watchers)=> {
                return Promise.all(watchers.map((watcher)=> {
                    return watcher.getTwitchChannel()
                }));
            });
        }).then((watchers)=> {
            eris.createMessage(msg.channel.id, lang.computeResponse(msg, 'twitch.default', {
                watchers: watchers.map((watcher)=> {
                    return lang.computeLangString(msg.channel.guild.id, 'twitch.default_format', false, {ch_name: watcher.channel})
                }).join(lang.computeLangString(msg.channel.guild.id, 'twitch.default_separator', false))
            }));
        });

    },
    options: {
        caseInsensitive: true,
        deleteCommand: true,
        serverOnly: true,
        aliases: ['twitchwatcher']
    },
    subcommands: [require('./twitchwatcher_add'), require('./twitchwatcher_remove')]
};