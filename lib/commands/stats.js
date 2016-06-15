var moment = require('moment');
var os = require('os');

var utils = require('../utils');
var redis = require('../db/redis_db');
var discordBot = require('../client');

module.exports = {
    _id: 9,
    main_cmd: 'stats',
    alias: [],
    min_perm: 0,
    args: '[none]',
    allow_disable: true,
    handlers: {
        server: function (msg) {
            redis.keys('stats:messages:time:all:*').then(function (keys) {
                if (msg.server.getPermissionLevel(msg.author.id) < 6) {
                    utils.messages.sendMessage(msg.channel, {
                        key: 'stats.user', replacer: {
                            servers: discordBot.servers.length,
                            users: discordBot.users.getAll('status', 'online').length + discordBot.users.getAll('status', 'idle').length,
                            mpm: keys.length
                        }
                    }, {username: msg.author.name});
                } else {
                    utils.messages.sendMessage(msg.channel, {
                        key: 'stats.staff', replacer: {
                            servers: discordBot.servers.length,
                            users: discordBot.users.getAll('status', 'online').length + discordBot.users.getAll('status', 'idle').length + '/' + discordBot.users.length,
                            mpm: keys.length,
                            mem: Math.round((os.totalmem() - os.freemem()) / 1000000) + '/' + Math.round(os.totalmem() / 1000000),
                            sysload: os.loadavg().join(' '),
                            uptime: moment().subtract(discordBot.uptime, 'milliseconds').fromNow()
                        }
                    }, {username: msg.author.name}, function (err, msg) {
                        if (!err) discordBot.deleteMessage(msg, {wait: 60 * 1000});
                    });
                }
                msg.delete();
            });
        },
        dm: function (msg) {
            redis.keys('stats:messages:time:all:*').then(function (keys) {
                utils.users.getGlobalPermLvl(msg.author.id, function (perm) {
                    if (perm < 6) {
                        utils.messages.sendMessage(msg.channel, {
                            key: 'stats.user', replacer: {
                                servers: discordBot.servers.length,
                                users: discordBot.users.getAll('status', 'online').length + discordBot.users.getAll('status', 'idle').length,
                                mpm: keys.length
                            }
                        });
                    } else {
                        utils.messages.sendMessage(msg.channel, {
                            key: 'stats.staff', replacer: {
                                servers: discordBot.servers.length,
                                users: discordBot.users.getAll('status', 'online').length + discordBot.users.getAll('status', 'idle').length + '/' + discordBot.users.length,
                                mpm: keys.length,
                                mem: Math.round((os.totalmem() - os.freemem()) / 1000000) + '/' + Math.round(os.totalmem() / 1000000),
                                sysload: os.loadavg().join(' '),
                                uptime: moment().subtract(discordBot.uptime, 'milliseconds').fromNow()
                            }
                        }, function (err, msg) {
                            if (!err) discordBot.deleteMessage(msg, {wait: 60 * 1000});
                        });
                    }
                });
                msg.delete();
            });
        }
    }
};