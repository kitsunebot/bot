module.exports = {
    setGame: function () {
        redis.srandmember('meta:games:strings').then(function (game) {
            discordBot.setStatus('online', game);
            workers.gameScheduler = setTimeout(workers.setGame, _.random(15, 45) * 60 * 1000);
        });
    },
    gameScheduler: null,
    checkTwitchChannels: function () {
        models.TwitchChannel.findAll().then(function (channels) {
            channels.forEach(function (channel) {
                request.get(channel.api_url, function (err, resp, body) {
                    if (!err && [200, 304].indexOf(resp.statusCode) !== -1) {
                        body = JSON.parse(body);
                        if (channel.status && body.stream === null) {
                            models.TwitchChannel.update({status: false}, {where: {id: channel.id}});
                        } else if (!channel.status && body.stream !== null) {
                            if (body.stream._id !== undefined) {
                                channel.getTwitchWatchers().then(function (watchers) {
                                    watchers.forEach(function (watcher) {
                                        utils.sendChatMsg('twitchWatcher.wentonline', discordBot.channels.get('id', watcher.server_channel), {
                                            ch_name: body.stream.channel.display_name,
                                            str_title: body.stream.channel.status,
                                            str_game: body.stream.game,
                                            ch_link: body.stream.channel.url
                                        }, function (err) {
                                            if (!err) discordBot.sendFile(watcher.server_channel, body.preview.medium)
                                        });
                                    });
                                });
                                models.TwitchChannel.update({status: true}, {where: {id: channel.id}});
                            }
                        }
                    }
                });
            });
        });
        workers.twitchWatcher = setTimeout(workers.checkTwitchChannels, _.random(10, 20) * 60 * 1000);
    },
    twitchWatcher: null
};