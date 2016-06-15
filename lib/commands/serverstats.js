var utils = require('../utils');
var redis = require('../db/redis_db');
var discordBot = require('../client');

module.exports = {
    _id: 8,
    main_cmd: 'serverstats',
    alias: [],
    min_perm: 0,
    args: '[none]',
    allow_disable: true,
    handlers: {
        server: function (msg) {
            redis.keys('stats:messages:time:servers:' + msg.channel.server.id + ':*').then(function (keys) {
                utils.messages.sendMessage(msg.channel, {
                    key: 'serverstats.user', replacer: {
                        sid: msg.server.id,
                        users: msg.channel.server.members.getAll('status', 'idle').length + msg.channel.server.members.getAll('status', 'online').length + '/' + msg.channel.server.members.length,
                        channels: msg.channel.server.channels.length + ' [ ' + msg.channel.server.channels.getAll('type', 'text').length + ' | ' + msg.channel.server.channels.getAll('type', 'voice').length + ' ]',
                        mpm: keys.length
                    }
                }, {username: msg.author.name}, function (err, msg) {
                    if (!err) discordBot.deleteMessage(msg, {wait: 120 * 1000});
                });
                discordBot.deleteMessage(msg);
            });
        }
    }
};