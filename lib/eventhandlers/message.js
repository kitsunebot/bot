var discordBot = require('../client.js');
var story = require('storyboard').mainStory;
var S = require('string');
var _ = require('underscore');

var redis = require('../db/redis_db');
var cache = require('../cache');
var cmds = require('../commands');
var utils = require('../utils');

module.exports = {
    name: 'message',
    handler:function (msg) {
        if (!msg.author.equals(discordBot.user) && !msg.author.bot) {
            if (!msg.channel.isPrivate) {
                cache.getServer(msg.channel.server.id, function (server) {
                    msg.server = server;
                    server.isSpam(msg, function (isSpam) {
                        if (isSpam === false) {
                            if (typeof server.isCommand(msg.content) === 'string') {
                                var prefix = server.isCommand(msg.content);
                                var str = S(msg.content);
                                //noinspection JSDuplicatedDeclaration
                                var cmd = str.chompLeft(prefix).s.split(' ')[0];
                                if (cmds[cmd] !== undefined) {
                                    server.isCommandEnabled(cmds[cmd], function (isEnabled) {
                                        if (isEnabled) {
                                            if (server.getPermissionLevel(msg.author.id) >= cmds[cmd].min_perm) {
                                                msg.cleanContent = str.chompLeft(prefix).s;
                                                if (cmds[cmd].handlers.server !== undefined) cmds[cmd].handlers.server(msg);
                                                else if (cmds[cmd].handlers.default !== undefined) cmds[cmd].handlers.default(msg);
                                            } else utils.messages.sendReply(msg, 'not_allowed');
                                            story.info('command', msg.author.username + '[' + msg.author.id + '] used command ' + cmds[cmd].main_cmd + ' in channel ' + msg.channel.name + '[' + msg.channel.id + '] on server ' + msg.channel.server.name + '[' + msg.channel.server.id + '] (' + msg.content + ')');
                                        }
                                    });
                                }
                            } else if (typeof server.isCustomCommand(msg.content) === 'string') {
                                var cprefix = server.isCustomCommand(msg.content);
                                var cstr = S(msg.content);
                                //noinspection JSDuplicatedDeclaration
                                var cmd = cstr.chompLeft(cprefix).s;
                                redis.hexists('customcommands:global', cmd).then(function (hex) {
                                    if (hex === 1) {
                                        redis.hget('customcommands:global', cmd).then(function (content) {
                                            redis.hget('customcommands:global:types', cmd).then(function (type) {
                                                sendCustomCommand(content, type);
                                            });
                                        });
                                    } else {
                                        redis.hexists('customcommands:server:' + server.id, cmd).then(function (lex) {
                                            if (lex === 1) {
                                                redis.hget('customcommands:server:' + server.id, cmd).then(function (content) {
                                                    redis.hget('customcommands:server:' + server.id + ':types', cmd).then(function (type) {
                                                        sendCustomCommand(content, type);
                                                    });
                                                });
                                            }
                                        });
                                    }
                                });

                                function sendCustomCommand(content, type) {
                                    if (type === 'file') discordBot.sendFile(msg, content);
                                    else if (type === 'text') discordBot.sendMessage(msg, content);
                                    else if (type === 'reply') discordBot.reply(msg, content);
                                }
                            }
                        } else {
                            if (isSpam === 'repeatingMessages') {
                                msg.delete();
                                utils.messages.sendMessage(msg.channel, {
                                    key: 'automod.repeatingMessages',
                                    replacer: {mention: msg.author.mention()}
                                });
                            } else if (isSpam === 'overScore') {
                                msg.delete();
                                server.setMuted(msg.author, true);
                                utils.messages.sendMessage(msg.channel, {
                                    key: 'automod.muteSpam',
                                    replacer: {mention: msg.author.mention()}
                                });
                                server.sendToModLog({key: 'automod.muteSpam', replacer: {mention: msg.author.mention()}});
                            }
                        }
                    });
                });
                redis.set('stats:messages:time:servers:' + msg.channel.server.id + ':' + msg.id + ':' + msg.author.id, msg.content).then(function () {
                    redis.expire('stats:messages:time:servers:' + msg.channel.server.id + ':' + msg.id + ':' + msg.author.id, 60);
                });
            } else {
                var str = S(msg.content);
                if (typeof determinePrefix() === 'string') {
                    var prefix = determinePrefix();
                    var cmd = str.chompLeft(prefix).s.split(' ')[0];
                    if (cmds[cmd] !== undefined) {
                        utils.users.getGlobalPermLvl(msg.author.id, function (perm) {
                            if (perm >= cmds[cmd].min_perm) {
                                msg.cleanContent = str.chompLeft(prefix).s;
                                if (cmds[cmd].handlers.dm !== undefined) cmds[cmd].handlers.dm(msg);
                                else if (cmds[cmd].handlers.default !== undefined) cmds[cmd].handlers.default(msg);
                                else utils.messages.sendReply(msg, 'dm_not_possible');
                            } else utils.messages.sendReply(msg, 'not_allowed');
                            story.info('command', msg.author.username + '[' + msg.author.id + '] used command ' + cmds[cmd].main_cmd + ' in a Direct Message (' + msg.content + ')');
                        });
                    }
                }

                function determinePrefix() {
                    if (str.startsWith('!fb '))return '!fb ';
                    else if (str.startsWith('!')) return '!';
                    else if (str.startsWith('/')) return '/';
                    else return false;
                }
            }
        }
        redis.set('stats:messages:time:all:' + msg.id, 1).then(function () {
            redis.expire('stats:messages:time:all:' + msg.id, 60);
        });
    }
};