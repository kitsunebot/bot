let db = require('../lib/db');
let lang = require('../lib/lang');
let config = require('../config');
let fcache = require('../lib/cache');

let request = require('request');

module.exports = {
    label: 'add',
    enabled: true,
    isSubcommand: true,
    generator: (msg, args)=> {
        if (args.length === 0 || args.length > 1)return lang.computeResponse(msg, 'twitch.supply_channel');
        request.get('https://api.twitch.tv/kraken/channels/' + args[0], (err, resp)=> {
            if (!err) {
                if ([304, 200].indexOf(resp.statusCode) !== -1) {
                    db.models.TwitchChannel.findOrCreate({
                        where: {channel: args[0]}, defaults: {
                            channel: args[0],
                            api_url: 'https://api.twitch.tv/kraken/streams/' + args[0]
                        }
                    }).spread((channel)=> {
                        return channel.getTwitchWatchers({where: {server_channel: msg.channel.id}}).then((watchers)=> {
                            if (watchers.length === 0) {
                                db.models.TwitchWatcher.create({server_channel: msg.channel.id}).then((watcher) => {
                                    channel.addTwitchWatcher(watcher);
                                    fcache.getGuild(msg.channel.guild.id).getDbInstance((server)=> {
                                        server.addTwitchWatcher(watcher);
                                        msg.channel.createMessage(lang.computeResponse(msg, 'twitch.add', {channel: channel.channel}));
                                    });
                                });
                            } else msg.channel.createMessage(lang.computeResponse(msg, 'twitch.watched'));
                        });
                    });
                } else msg.channel.createMessage(lang.computeResponse(msg, 'twitch.not_exists'));
            } else msg.channel.createMessage(lang.computeResponse(msg, 'error'));
        });
    },
    options: {
        caseInsensitive: true,
        deleteCommand: true,
        guildOnly: true
    }
};