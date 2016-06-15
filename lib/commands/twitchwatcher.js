var request = require('request');

var utils = require('../utils');
var db = require('../db/sql_db');

module.exports = {
    _id: 15,
    main_cmd: 'twitchwatcher',
    alias: ['watcher'],
    min_perm: 2,
    args: 'list | add (channel) | remove (channel)',
    allow_disable: true,
    handlers: {
        server: function (msg) {
            var split = msg.cleanContent.trim().split(' ');
            if (split.length === 3) {
                if (split[1] === 'add' || split[1] === 'create') {
                    request.get('https://api.twitch.tv/kraken/channels/' + split[2], function (err, resp) {
                        if (!err) {
                            if ([304, 200].indexOf(resp.statusCode) !== -1) {
                                db.models.TwitchChannel.findOrCreate({
                                    where: {channel: split[2]}, defaults: {
                                        channel: split[2],
                                        api_url: 'https://api.twitch.tv/kraken/streams/' + split[2]
                                    }
                                }).spread(function (channel) {
                                    channel.getTwitchWatchers({where: {server_channel: msg.channel.id}}).then(function (watchers) {
                                        if (watchers.length === 0) {
                                            db.models.TwitchWatcher.create({server_channel: msg.channel.id}).then(function (watcher) {
                                                channel.addTwitchWatcher(watcher);
                                                msg.server.getSequelizeInstance(function (server) {
                                                    server.addTwitchWatcher(watcher);
                                                    utils.messages.sendMessage(msg.channel, {
                                                        key: 'twitchWatcher.add',
                                                        replacer: {channel: channel.channel}
                                                    }, {username: msg.author.name});
                                                });
                                            });
                                        } else utils.messages.sendMessage(msg.channel, 'twitchWatcher.already_watched', {username: msg.author.name});
                                    });
                                });
                            } else utils.messages.sendMessage(msg.channel, 'twitchWatcher.already_watched', {username: msg.author.name});
                        } else utils.messages.sendMessage(msg.channel, 'unknown_error', {username: msg.author.name});
                    });
                } else if (split[1] === 'remove' || split[1] === 'delete') {
                    db.models.TwitchChannel.find({where: {channel: split[2]}}).then(function (channel) {
                        if (channel !== null && channel !== undefined) {
                            channel.getTwitchWatchers({where: {server_channel: msg.channel.id}}).then(function (watchers) {
                                if (watchers.length === 0) notWatched();
                                else {
                                    watchers[0].destroy().then(function () {
                                        utils.messages.sendMessage(msg.channel, {
                                            key: 'twitchWatcher.remove',
                                            replacer: {channel: channel.channel}
                                        }, {username: msg.author.name})
                                    });
                                }
                            });
                        } else notWatched();

                        function notWatched() {
                            utils.messages.sendMessage(msg.channel, 'twitchWatcher.no_watcher', {username: msg.author.name});
                        }
                    });
                } else wrongArg();
            } else if (split.length === 2) {
                if (split[1] === 'list') {
                    db.models.TwitchWatcher.findAll({where: {server_channel: msg.channel.id}}).then(function (watchers) {
                        var list = '';
                        iterate(0);

                        function iterate(index) {
                            watchers[index].getTwitchChannel().then(function (channel) {
                                list += channel.channel;
                                if (watchers[index + 1] !== undefined) {
                                    list += ', ';
                                    iterate(index + 1);
                                } else {
                                    utils.messages.sendMessage(msg.channel, {
                                        key: 'twitchWatcher.list',
                                        replacer: {channels: list}
                                    }, {username: msg.author.name});
                                }
                            });
                        }
                    });
                } else wrongArg();
            } else wrongArg();
            msg.delete();

            function wrongArg() {
                utils.messages.sendMessage(msg.channel, {
                    key: 'wrong_argument',
                    replacer: {args: 'add (channel) | remove (channel) | list'}
                }, {username: msg.author.name});
            }
        }
    }
};