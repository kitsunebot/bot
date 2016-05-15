'use strict';

var utils = require('./utils');
var redis = require('./redis_db');
var config = require('../config');
var discordBot = require('./init_client');
var db = require('./sql_db');

var os = require('os');
var moment = require('moment');
var request = require('request');
var pxlxml = require('pixl-xml');
var _ = require('underscore');
var story = require('storyboard').mainStory;
var S = require('string');

var commands = {};

var not_in_dm = function (msg) {
    utils.messages.sendReply(msg, 'dm_not_possible');
};

commands.ping = {
    _id: 1,
    min_perm: 5,
    main_cmd: 'ping',
    alias: [],
    args: '[none]',
    handlers: {
        default: function (msg) {
            utils.messages.sendMessage(msg.channel, 'ping');
            msg.delete();
        }
    }
};

commands.info = {
    _id: 2,
    min_perm: 0,
    main_cmd: 'info',
    alias: [],
    args: '[none]',
    handlers: {
        default: function (msg) {
            utils.messages.sendMessage(msg.channel, 'info');
            msg.delete();
        }
    }
};

commands.joinserver = commands['join-server'] = commands.invite = {
    _id: 3,
    min_perm: 0,
    main_cmd: 'invite',
    alias: ['joinserver', 'join-server'],
    args: '[none]',
    handlers: {
        default: function (msg) {
            utils.messages.sendMessage(msg.channel, 'invite.default');
            msg.delete();
        }
    }
};

commands.prefix = {
    _id: 4,
    min_perm: 3,
    main_cmd: 'prefix',
    alias: [],
    args: '[none] | enable (prefix) | disable (prefix) | setcustom (prefix | none)',
    handlers: {
        server: function (msg) {
            var split = msg.cleanContent.trim().split(' ');
            if (split.length === 3) {
                var prefix = split[2];
                var action = split[1];
                if (['!', 'slash', '/', 'exclam', 'exclamation_mark'].indexOf(prefix) !== -1 && ['enable', 'disable'].indexOf(action) !== -1) {
                    msg.server.setPrefixValue(prefix, (action === 'enable'), function () {
                        utils.messages.sendMessage(msg.channel, {
                            key: (action === 'enable' ? 'prefix.enabled' : 'prefix.disabled'),
                            replacer: {prefix: prefix}
                        });
                    });
                } else if (split[1] === 'setcustom') {
                    var cprefix = (split[2] !== 'none' ? split[2] : null);
                    msg.server.setCustomPrefix(cprefix, function () {
                        utils.messages.sendMessage(msg.channel, {
                            key: 'prefix.custom.' + (cprefix !== null ? 'set' : 'disable'),
                            replacer: {prefix: cprefix}
                        });
                    });
                } else utils.messages.sendMessage(msg.channel, {
                    key: 'wrong_argument', replacer: {args: '[none] | enable (prefix) | disable (prefix) | setcustom (prefix | none)'}
                });
            } else utils.messages.sendMessage(msg.channel, {
                key: 'wrong_argument', replacer: {args: '[none] | enable (prefix) | disable (prefix) | setcustom (prefix | none)'}
            });
            msg.delete();
        },
        dm: not_in_dm
    }
};

commands.lang = commands.language = {
    _id: 5,
    min_perm: 4,
    main_cmd: 'language',
    alias: ['lang'],
    args: '[none] | (language)',
    handlers: {
        server: function (msg) {
            var split = msg.cleanContent.split(' ');
            if (split.length === 1) {
                utils.messages.sendMessage(msg.channel, {
                    key: 'language.current',
                    replacer: {lang: msg.server.getLanguage()}
                });
            } else if (split.length === 2) {
                if (config.languages.all.indexOf(split[1] !== -1)) {
                    msg.server.setLanguage(split[1]);
                    utils.messages.sendMessage(msg.channel, {key: 'language.set', replacer: {lang: split[1]}});
                } else utils.messages.sendMessage(msg.channel, {
                    key: 'wrong_argument',
                    replacer: {args: config.languages.all.join(' ')}
                });
            } else utils.messages.sendMessage(msg.channel, {
                key: 'wrong_argument',
                replacer: {args: config.languages.all.join(' ')}
            });
        },
        dm: function (msg) {
            var split = msg.cleanContent.split(' ');
            if (split.length === 1) {
                redis.hget('language:users', msg.author.id).then(function (lang) {
                    utils.messages.sendMessage(msg.channel, {
                        key: 'language.current',
                        replacer: {lang: (lang === null ? config.languages.default : lang)}
                    });
                });
            } else if (split.length === 2) {
                if (config.languages.all.indexOf(split[1]) !== -1) {
                    redis.hset('language:users', msg.author.id, split[1]).then(function () {
                        utils.messages.sendMessage(msg.channel, {
                            key: 'language.set',
                            replacer: {lang: split[1]}
                        });
                    });
                } else wrongarg();
            } else wrongarg();

            function wrongarg() {
                utils.messages.sendMessage(msg.channel, {
                    key: 'wrong_argument',
                    replacer: {args: config.languages.all.join(' ')}
                });
            }
        }
    }
};

commands.whoami = {
    _id: 6,
    main_cmd: 'whoami',
    alias: [],
    min_perm: 0,
    args: '[none]',
    handlers: {
        server: function (msg) {
            utils.messages.sendMessage(msg.channel, {
                key: 'whoami', replacer: {
                    username: msg.author.username,
                    uid: msg.author.id,
                    status: msg.author.status,
                    avatar: msg.author.avatarURL
                }
            });
            msg.delete();
        }
    }
};

commands.whois = {
    _id: 7,
    main_cmd: 'whois',
    alias: [],
    min_perm: 0,
    args: '(@user)',
    handlers: {
        server: function (msg) {
            if (msg.mentions.length === 1) {
                msg.mentions.forEach(function (user) {
                    utils.messages.sendMessage(msg.channel, {
                        key: 'whois', replacer: {
                            username: user.username,
                            uid: user.id,
                            status: user.status,
                            avatar: user.avatarURL
                        }
                    });
                });
            } else utils.messages.sendMessage(msg.channel, {key: 'wrong_argument', replacer: {args: '@username'}});
            msg.delete();
        },
        dm: not_in_dm
    }
};

commands.serverstats = {
    _id: 8,
    main_cmd: 'serverstarts',
    alias: [],
    min_perm: 0,
    args: '[none]',
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
                }, function (err, msg) {
                    if (!err) discordBot.deleteMessage(msg, {wait: 120 * 1000});
                });
                discordBot.deleteMessage(msg);
            });
        },
        dm: not_in_dm
    }
};

commands.stats = {
    _id: 9,
    main_cmd: 'stats',
    alias: [],
    min_perm: 0,
    args: '[none]',
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

commands.cat = commands.kitten = commands.kitty = {
    _id: 10,
    main_cmd: 'cat',
    alias: ['kitten', 'kitty'],
    min_perm: 0,
    args: '[none]',
    handlers: {
        default: function (msg) {
            request.get('http://thecatapi.com/api/images/get?format=xml&results_per_page=15&api_key=NzY0NDY', function (err, resp, body) {
                if (!err && [200, 304].indexOf(resp.statusCode) !== -1) {
                    var xml = pxlxml.parse(body);
                    discordBot.sendFile(msg, xml.data.images.image[_.random(0, 14)].url);
                } else utils.messages.sendMessage(msg.channel, 'unknown_error');
                msg.delete();
            });
        }
    }
};

commands.smile = {
    _id: 11,
    main_cmd: 'smile',
    alias: [],
    min_perm: 0,
    args: '[none]',
    handlers: {
        default: function (msg) {
            request.get('http://gifbase.com/tag/smile?format=json', function (err, resp, body) {
                if (!err && [200, 304].indexOf(resp.statusCode) !== -1) {
                    body = JSON.parse(body);
                    discordBot.sendFile(msg, body.gifs[_.random(0, body.gifs.length - 1)].url, function (err, msg) {
                        if (!err) discordBot.deleteMessage(msg, {wait: 180 * 1000});
                    });
                } else utils.sendMessage(msg.channel, 'unknown_error');
                msg.delete();
            });
        }
    }
};

commands.wtf = {
    _id: 12,
    main_cmd: 'wtf',
    alias: [],
    min_perm: 0,
    args: '[none]',
    handlers: {
        default: function (msg) {
            request.get('http://gifbase.com/tag/wtf?format=json', function (err, resp, body) {
                if (!err && [200, 304].indexOf(resp.statusCode) !== -1) {
                    body = JSON.parse(body);
                    discordBot.sendFile(msg, body.gifs[_.random(0, body.gifs.length - 1)].url, function (err, msg) {
                        if (!err) discordBot.deleteMessage(msg, {wait: 180 * 1000});
                    });
                } else utils.sendMessage(msg.channel, 'unknown_error');
                discordBot.deleteMessage(msg);
            });
        }
    }
};

commands.modlog = {
    _id: 13,
    main_cmd: 'modlog',
    alias: [],
    min_perm: 3,
    args: '[none] | set | disable',
    handlers: {
        server: function (msg) {
            var split = msg.cleanContent.trim().split(' ');
            if (split.length === 1) {
                if (msg.server.options.modlog !== null) {
                    utils.messages.sendMessage(msg.channel, 'modlog.is_enabled');
                } else {
                    msg.server.setModLog(msg.channel.id, function () {
                        utils.messages.sendMessage(msg.channel, 'modlog.enabled');
                    });
                }
            } else if (split.length === 2) {
                if (split[1] === 'set') {
                    msg.server.setModLog(msg.channel.id, function () {
                        utils.messages.sendMessage(msg.channel, 'modlog.enabled');
                    });
                } else if (split[1] === 'disable') {
                    msg.server.setModLog(null, function () {
                        utils.messages.sendMessage(msg.channel, 'modlog.disabled');
                    });
                } else invalid();
            } else invalid();
            msg.delete();

            function invalid() {
                utils.messages.sendMessage(msg.channel, {key: 'wrong_argument', replacer: {args: 'set disable'}});
            }
        },
        dm: not_in_dm
    }
};

commands.restart = {
    _id: 14,
    main_cmd: 'restart',
    alias: [],
    min_perm: 8,
    args: '[none]',
    handlers: {
        default: function (msg) {
            try {
                var pm2 = require('pm2');
                pm2.connect(function (err) {
                    if (!err) {
                        utils.messages.sendMessage(msg.channel, 'restart.execute');
                        setTimeout(function () {
                            pm2.restart(config.options.pm2.process, function (err) {
                                if (!err) pm2.disconnect();
                                else error(err);
                            });
                        });
                    } else error(err);
                })
            } catch (e) {
                error(e);
            }

            function error(err) {
                story.error('restart', 'Could not restart through command', {attach: err});
                utils.messages.sendMessage(msg.channel, {
                    key: 'restart.failed',
                    replacer: {err: err}
                }, function (err, msg) {
                    if (!err) setTimeout(function () {
                        msg.delete();
                    }, 30 * 1000);
                });
                if (pm2 !== undefined && pm2 !== null) pm2.disconnect();
            }
        }
    }
};

commands.watcher = commands.twitchwatcher = {
    _id: 15,
    main_cmd: 'twitchwatcher',
    alias: ['watcher'],
    min_perm: 2,
    args: 'list | add (channel) | remove (channel)',
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
                                                    });
                                                });
                                            });
                                        } else utils.messages.sendMessage(msg.channel, 'twitchWatcher.already_watched');
                                    });
                                });
                            } else utils.messages.sendMessage(msg.channel, 'twitchWatcher.already_watched');
                        } else utils.messages.sendMessage(msg.channel, 'unknown_error');
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
                                        })
                                    });
                                }
                            });
                        } else notWatched();

                        function notWatched() {
                            utils.messages.sendMessage(msg.channel, 'twitchWatcher.no_watcher');
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
                                    });
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
                });
            }
        }
    }
};

commands.automod = {
    _id: 16,
    main_cmd: 'automod',
    alias: [],
    min_perm: 4,
    args: '[none] | enable | disable | status | setmuterole (rolename)',
    handlers: {
        server: function (msg) {
            var split = msg.cleanContent.trim().split(' ');
            if (split.length === 2) {
                if (split[1] === 'enable') {
                    msg.server.setAutoMod(true, function () {
                        utils.messages.sendMessage(msg.channel, 'automod.enabled');
                    });
                } else if (split[1] === 'disable') {
                    msg.server.setAutoMod(false, function () {
                        utils.messages.sendMessage(msg.channel, 'automod.disabled');
                    });
                } else if (split[1] === 'status') {
                    //todo
                } else wrongArg();
            } else if (split.length === 3) {
               if(split[1] === 'setmuterole'){
                   var rolename = split[2];
                   var role = msg.channel.server.roles.get('name', rolename);
                   if (role !== undefined && role !== null) {
                       msg.server.setMuteRole(role.id, function () {
                           utils.messages.sendMessage(msg.channel, {
                               key: 'automod.muterole_set',
                               replacer: {r_name: role.name, r_id: role.id}
                           });
                       });
                   } else wrongArg();
               } else wrongArg();
            } else wrongArg();

            function wrongArg() {
                utils.messages.sendMessage(msg.channel, {
                    key: 'wrong_argument',
                    replacer: {args: 'enable | disable | setmuterole (rolename) | status'}
                });
            }
        }
    }
};

commands.mute = {
    _id: 17,
    main_cmd: 'mute',
    alias: [],
    min_perm: 0,
    args: '(@user)',
    handlers: {
        server: function (msg) {
            if (msg.channel.permissionsOf(msg.author).serialise().manageMessages) {
                if (msg.mentions.length === 1) {
                    msg.server.setMuted(msg.mentions[0], true, function () {
                        msg.server.sendToModLog({
                            key: 'modlog.muted',
                            replacer: {username: msg.mentions[0].username, mod: msg.author.username}
                        });
                    });
                } else utils.messages.sendReply(msg, {key: 'wrong_argument', replacer: {args: '(@user)'}});
            } else utils.messages.sendReply(msg, 'not_allowed');
            msg.delete();
        }
    }
};

commands.unmute = {
    _id: 18,
    main_cmd: 'unmute',
    alias: [],
    min_perm: 0,
    args: '(@user)',
    handlers: {
        server: function (msg) {
            if (msg.channel.permissionsOf(msg.author).serialise().manageMessages) {
                if (msg.mentions.length === 1) {
                    msg.server.setMuted(msg.mentions[0], false, function () {
                        msg.server.sendToModLog({
                            key: 'modlog.unmuted',
                            replacer: {username: msg.mentions[0].username, mod: msg.author.username}
                        });
                    });
                } else utils.messages.sendReply(msg, {key: 'wrong_argument', replacer: {args: '(@user)'}});
            } else utils.messages.sendReply(msg, 'not_allowed');
            msg.delete();
        }
    }
};

commands.commands = commands.cmds = {
    _id: 19,
    main_cmd: 'commands',
    alias: ['cmds'],
    min_perm: 0,
    args: '[none]',
    handlers: {
        server: function (msg) {
            utils.messages.sendMessage(msg.channel, 'commandslist._list_sent');
            utils.users.sendCommandList(msg.author);
            msg.delete();
        },
        dm: function (msg) {
            utils.users.sendCommandList(msg.author);
        }
    }
};

module.exports = commands;