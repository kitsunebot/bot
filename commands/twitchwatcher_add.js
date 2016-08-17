var db = require('../lib/db');
var lang = require('../lib/lang');
var config = require('../config');
var eris = require('../lib/client');
var fcache = require('../lib/cache');

var request = require('request');

module.exports = {
    label: 'add',
    enabled: true,
    isSubcommand: true,
    generator: (msg, args)=> {
        request.get('https://api.twitch.tv/kraken/channels/' + split[2], function (err, resp) {
            if (!err) {
                if ([304, 200].indexOf(resp.statusCode) !== -1) {
                    db.models.TwitchChannel.findOrCreate({
                        where: {channel: split[2]}, defaults: {
                            channel: split[0],
                            api_url: 'https://api.twitch.tv/kraken/streams/' + split[2]
                        }
                    }).spread(function (channel) {
                        channel.getTwitchWatchers({where: {server_channel: msg.channel.id}}).then(function (watchers) {
                            if (watchers.length === 0) {
                                db.models.TwitchWatcher.create({server_channel: msg.channel.id}).then(function (watcher) {
                                    channel.addTwitchWatcher(watcher);
                                    fcache.getGuild(msg.channel.guild.id).getDbInstance(function (server) {
                                        server.addTwitchWatcher(watcher);
                                        eris.createMessage(msg.channel.id, lang.computeResponse(msg, 'twitch.add', {channel: channel.channel}));
                                    });
                                });
                            } else eris.createMessage(msg.channel.id, lang.computeResponse(msg, 'twitch.watched'));
                        });
                    });
                } else eris.createMessage(msg.channel.id, lang.computeResponse(msg, 'twitch.not_exists'));
            } else eris.createMessage(msg.channel.id, lang.computeResponse(msg, 'error'));
        });
    },
    options: {
        caseInsensitive: true,
        deleteCommand: true,
        serverOnly: true
    }
};