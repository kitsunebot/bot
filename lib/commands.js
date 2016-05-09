var commands = {};

commands.ping = {
    _id: 1,
    main_cmd: 'ping',
    alias: [],
    min_perm: 2,
    handler: function (msg) {
        utils.resolverole(msg.author.id, msg.channel.isPrivate ? 'null' : msg.channel.server.id, function (perm) {
            if (perm > 1) {
                utils.sendReply('ping', msg);
                discordBot.deleteMessage(msg);
            }
        });
    }
};

commands.game = {
    _id: 2,
    main_cmd: 'game',
    alias: [],
    min_perm: 7,
    handler: function (msg) {
        utils.resolverole(msg.author.id, msg.channel.isPrivate ? 'null' : msg.channel.server.id, function (perm) {
            if (perm > 6) {
                var split = msg.content.trim().split(' ');
                if (split[1] === 'set') {
                    clearTimeout(workers.gameScheduler);
                    discordBot.setStatus('online', _.rest(split, 2).join(' ').trim());
                    utils.sendReply('game.set', msg);
                } else if (split[1] === 'rotate') {
                    workers.setGame();
                    utils.sendReply('game.rotate', msg);
                } else if (split[1] === 'add') {
                    utils.games.add(split[2], _.rest(split, 3).join(' ').trim());
                    utils.sendReply('game.add', msg, {name: split[2], display: _.rest(split, 3).join(' ').trim()});
                } else if (split[1] === 'random') {
                    clearTimeout(workers.gameScheduler);
                    workers.setGame();
                    utils.sendReply('game.random', msg);
                } else if (split[1] === 'remove') {
                    utils.games.remove(split[2]);
                    utils.sendReply('game.remove', msg, {name: split[2]});
                } else if (split[1] === 'enable') {
                    utils.games.enable(split[2]);
                    utils.sendReply('game.enable', msg, {name: split[2]});
                } else if (split[1] === 'disable') {
                    utils.games.disable(split[2]);
                    utils.sendReply('game.disable', msg, {name: split[2]});
                } else if (split[1] === 'reload') {
                    utils.loadGames();
                    utils.sendReply('game.reload', msg);
                }
                discordBot.deleteMessage(msg);
            }
        });
    }
};

commands.info = {
    _id: 3,
    main_cmd: 'info',
    alias: [],
    min_perm: 0,
    handler: function (msg) {
        utils.sendReply('info', msg);
        discordBot.deleteMessage(msg);
    }
};

commands.joinserver = commands['join-server'] = {
    _id: 4,
    main_cmd: 'joinserver',
    alias: ['join-server'],
    min_perm: 0,
    handler: function (msg) {
        utils.sendReply('invite.default', msg);
        discordBot.deleteMessage(msg);
    }
};

commands.leaveserver = commands['leave-server'] = {
    _id: 5,
    main_cmd: 'leaveserver',
    alias: ['leave-server'],
    min_perm: 4,
    handler: function (msg) {
        if (!msg.channel.isPrivate) {
            utils.resolverole(msg.author.id, msg.channel.server.id, function (perm) {
                if (perm > 3) {
                    utils.sendReply('invite.leave', msg);
                    setTimeout(function () {
                        discordBot.leaveServer(msg.channel.server);
                    }, 3 * 1000);
                } else utils.sendReply('not_allowed', msg);
                discordBot.deleteMessage(msg);
            });
        } else utils.sendReply('dm_not_possible', msg);
    }
};

commands.reloadroles = {
    _id: 6,
    main_cmd: 'reloadroles',
    min_perm: 8,
    alias: [],
    handler: function (msg) {
        utils.resolverole(msg.author.id, msg.channel.server.id, function (perm) {
            if (perm > 7) {
                discordBot.deleteMessage(msg);
                redis.keys('roles:*').then(function (keys) {
                    keys.forEach(function (key) {
                        redis.del(key);
                    });
                    models.User.findAll({where: {custom_role: {$gt: 0}}}).spread(function (user) {
                        if (user !== undefined && user !== null) {
                            redis.set('roles:global:uid:' + user.uid, user.custom_role);
                        }
                    });
                    models.Server.findAll().spread(function (server) {
                        if (server !== undefined && server !== null) {
                            server.getOwner().then(function (owner) {
                                redis.hset('roles:servers:sid:' + server.sid, owner.uid, 5);
                            });
                            server.getServerRoles().then(function (roles) {
                                roles.forEach(function (role) {
                                    role.getUser().then(function (user) {
                                        redis.hset('roles:servers:sid:' + server.sid, user.uid, role.level);
                                    });
                                });
                            });
                        }
                    });
                });
                utils.sendReply('roles.reload', msg);
            } else utils.sendReply('not_allowed', msg);
        });
    }
};

commands.reloadcc = commands.reloadcustomcommands = {
    _id: 7,
    min_perm: 8,
    main_cmd: 'reloadcustomcommands',
    alias: ['reloadcc'],
    handler: function (msg) {
        utils.resolverole(msg.author.id, msg.channel.server.id, function (perm) {
            if (perm > 7) {
                discordBot.deleteMessage(msg);
                models.CustomCommand.findAll({where: {type: 'global', active: true}}).then(function (ccs) {
                    redis.del('customcommands:global').then(function () {
                        ccs.forEach(function (cc) {
                            redis.hset('customcommands:global', cc.trigger, cc.display);
                        });
                    });
                });
                redis.keys('customcommands:local:*').then(function (keys) {
                    keys.forEach(function (key) {
                        redis.del(key);
                    });
                    models.CustomCommand.findAll({where: {type: 'local', active: true}}).then(function (ccs) {
                        ccs.forEach(function (cc) {
                            cc.getServer().then(function (server) {
                                redis.hset('customcommands:local:' + server.sid, cc.trigger, cc.display);
                            });
                        });
                    });
                });
                utils.sendReply('customcommand.reload', msg);
            } else utils.sendReply('not_allowed', msg);
        });
    }
};

commands.createcc = {
    _id: 8,
    main_cmd: 'createcc',
    alias: [],
    min_perm: 3,
    handler: function (msg) {
        if (!msg.channel.isPrivate) {
            utils.resolverole(msg.author.id, msg.channel.server.id, function (perm) {
                if (perm > 2) {
                    discordBot.deleteMessage(msg);
                    var split = msg.content.trim().split(' ');
                    if (split.length > 2) {
                        var trigger = split[1];
                        var display = _.rest(split, 2).join(' ').trim();
                        models.CustomCommand.find({
                            where: {
                                trigger: trigger,
                                type: 'local',
                                sid: msg.channel.server.id
                            }
                        }).then(function (ccl) {
                            if (ccl !== undefined && ccl !== null) utils.sendReply('customcommand.exists', msg);
                            else {
                                models.CustomCommand.find({
                                    where: {
                                        trigger: trigger,
                                        type: 'global'
                                    }
                                }).then(function (ccg) {
                                    if (ccg !== undefined && ccg !== null) utils.sendReply('customcommand.exists_global');
                                    else {
                                        models.CustomCommand.create({
                                            trigger: trigger,
                                            display: display,
                                            type: 'local',
                                            sid: msg.channel.server.id
                                        }).then(function (cc) {
                                            models.Server.find({where: {sid: msg.channel.server.id}}).then(function (server) {
                                                cc.setServer(server);
                                                utils.sendReply('customcommand.added', msg, {
                                                    command: cc.trigger,
                                                    msg: cc.display
                                                });
                                            });
                                        });
                                    }
                                });
                            }
                        });
                    } else utils.sendReply('not_allowed', msg);
                }
            });
        } else utils.sendReply('dm_not_possible', msg);
    }
};

commands.activate = {
    _id: 9,
    main_cmd: 'activate',
    alias: [],
    min_perm: 5,
    handler: function (msg) {
        if (!msg.channel.isPrivate) {
            utils.resolverole(msg.author.id, msg.channel.server.id, function (perm) {
                if (perm > 4) {
                    redis.hset('customcommands:servers:enabled', msg.channel.server.id, 1).then(function () {
                        utils.sendReply('bot_activated', msg);
                        models.Server.update({enabled: true}, {where: {sid: msg.channel.server.id}});
                    });
                } else utils.sendReply('not_allowed', msg);
                discordBot.deleteMessage(msg);
            });
        } else utils.sendReply('dm_not_possible', msg);
    }
};

commands.lang = commands.language = {
    _id: 10,
    main_cmd: 'language',
    alias: ['lang'],
    min_perm: 4,
    handler: function (msg) {
        var split = msg.content.trim().split(' ');
        if (!msg.channel.isPrivate) {
            utils.resolverole(msg.author.id, msg.channel.server.id, function (perm) {
                if (perm > 3) {
                    if (split.length === 2) {
                        if (config.languages.all.indexOf(split[1]) !== -1) {
                            models.Server.update({language: split[1]}, {where: {sid: msg.channel.server.id}});
                            redis.hset('language:servers', msg.channel.server.id, split[1]).then(function () {
                                utils.sendReply('lang.set.server', msg, {lang: split[1]});
                            });
                        } else utils.sendReply('wrong_argument', msg, {args: config.languages.all.join(' ').trim()});
                    } else utils.sendReply('missing_argument', msg);
                } else utils.sendReply('not_allowed', msg);
                discordBot.deleteMessage(msg);
            });
        } else {
            if (split.length === 2) {
                if (config.languages.all.indexOf(split[1]) !== -1) {
                    models.User.update({language: split[1]}, {where: {uid: msg.author.id}});
                    redis.hset('language:users', msg.author.id, split[1]).then(function () {
                        utils.sendReply('lang.set.user', msg, {lang: split[1]});
                    });
                } else utils.sendReply('wrong_argument', msg, {args: config.languages.all.join(' ').trim()});
            } else utils.sendReply('missing_argument', msg);
        }
    }
};

commands.reloadlang = {
    _id: 11,
    main_cmd: 'reloadlang',
    alias: [],
    min_perm: 7,
    handler: function (msg) {
        utils.resolverole(msg.author.id, msg.channel.server.id, function (perm) {
            if (perm > 6) {
                var split = msg.content.trim().split(' ');
                var diff = _.difference(_.rest(split, 1), config.languages.all);
                if (diff.length === 0 && _.rest(split, 1).length > 0) {
                    _.rest(split, 1).forEach(function (lang) {
                        utils.loadLangFile(lang);
                    });
                    utils.sendReply('language.reload', msg, {lang: _.rest(split, 1).join(' ').trim()});
                } else utils.sendReply('wrong_argument', msg, {args: config.languages.all.join(' ').trim()});
            } else utils.sendReply('not_allowed', msg);
            discordBot.deleteMessage(msg);
        });
    }
};

commands.whois = {
    _id: 12,
    main_cmd: 'whois',
    alias: [],
    min_perm: 0,
    handler: function (msg) {
        if (!msg.channel.isPrivate) {
            if (msg.mentions.length === 1) {
                msg.mentions.forEach(function (user) {
                    utils.sendChatMsg('whois', msg.channel, {
                        username: user.username,
                        uid: user.id,
                        status: user.status,
                        avatar: user.avatarURL
                    });
                });
            } else utils.sendReply('wrong_argument', msg, {args: '@username'});
            discordBot.deleteMessage(msg);
        } else utils.sendReply('dm_not_possible', msg);
    }
};

commands.whoami = {
    _id: 13,
    main_cmd: 'whoami',
    alias: [],
    min_perm: 0,
    handler: function (msg) {
        utils.sendChatMsg('whoami', msg.channel, {
            username: msg.author.username,
            uid: msg.author.id,
            status: msg.author.status,
            avatar: msg.author.avatarURL
        });
        discordBot.deleteMessage(msg);
    }
};

commands.activatemod = commands.enableautomod = {
    _id: 14,
    main_cmd: 'enableautomod',
    alias: ['activatemod'],
    min_perm: 4,
    handler: function (msg) {
        if (!msg.channel.isPrivate) {
            utils.resolverole(msg.author.id, msg.channel.server.id, function (perm) {
                if (perm > 3) {
                    utils.automod.activate(msg.channel.server.id);
                    utils.sendReply('automod.enabled', msg);
                } else utils.sendReply('not_allowed', msg);
                discordBot.deleteMessage(msg);
            });
        } else utils.sendReply('dm_not_possible', msg);
    }
};

commands.deactivatemod = commands.disableautomod = {
    _id: 15,
    main_cmd: 'disableautomod',
    alias: ['deactivatemod'],
    min_perm: 4,
    handler: function (msg) {
        if (!msg.channel.isPrivate) {
            utils.resolverole(msg.author.id, msg.channel.server.id, function (perm) {
                if (perm > 3) {
                    utils.automod.deactivate(msg.channel.server.id);
                    utils.sendReply('automod.disable', msg);
                } else utils.sendReply('not_allowed', msg);
                discordBot.deleteMessage(msg);
            });
        } else utils.sendReply('dm_not_possible', msg);
    }
};

commands.restart = {
    _id: 16,
    main_cmd: 'restart',
    alias: [],
    min_perm: 8,
    handler: function (msg) {
        utils.resolverole(msg.author.id, msg.channel.server.id, function (perm) {
            if (perm > 7) {
                try {
                    var pm2 = require('pm2');
                    pm2.connect(function () {
                        utils.sendReply('restart.execute', msg);
                        /*_.map(musicworkers, function (m) {
                            m.kill();
                        });*/
                        pm2.restart('foxbot');
                    });
                } catch (e) {
                    story.error('restart', 'Restart failed.', {attach: e});
                    utils.sendReply('restart.failed', msg);
                }
            }
            discordBot.deleteMessage(msg);
        });
    }
};

commands.setperm = {
    _id: 17,
    main_cmd: 'setperm',
    alias: [],
    min_perm: 4,
    handler: function (msg) {
        if (!msg.channel.isPrivate) {
            utils.resolverole(msg.author.id, msg.channel.server.id, function (perm) {
                if (perm > 3) {
                    var split = msg.content.trim().split(' ');
                    if (msg.mentions.length === 0 || split.length < 3) {
                        utils.sendReply('missing_argument', msg);
                    } else {
                        var lvl = utils.resolveRoleLvl(split[1]);
                        if (lvl !== undefined && !isNaN(lvl)) {
                            models.Server.find({where: {sid: msg.channel.server.id}}).then(function (server) {
                                var mentions = [];
                                msg.mentions.forEach(function (usr) {
                                    models.User.find({where: {uid: usr.id}}).then(function (user) {
                                        if (user !== undefined && user !== null) setrole(user);
                                        else {
                                            models.User.create({
                                                uid: usr.id,
                                                username: usr.username,
                                                status: usr.status,
                                                avatar: usr.avatarURL
                                            }).then(function (user) {
                                                setrole(user);
                                            });
                                        }
                                        function setrole(user) {
                                            models.ServerRole.findOrCreate({
                                                where: {sid: msg.channel.server.id, uid: user.uid},
                                                defaults: {sid: msg.channel.server.id, uid: user.uid, level: lvl}
                                            }).spread(function (role) {
                                                role.updateAttributes({level: lvl});
                                                role.setUser(user);
                                                role.setServer(server);
                                            });
                                        }
                                    });
                                    mentions.push(usr.username);
                                });
                                utils.sendReply('roles.set', msg, {
                                    users: mentions.join(' ').trim(),
                                    role: utils.resolveRoleName(lvl)
                                });
                                utils.reloadServerRoles(server.sid);
                            });
                        } else utils.reply('unknown_argument_error', msg);
                    }
                } else utils.sendReply('not_allowed', msg);
                discordBot.deleteMessage(msg);
            });
        } else utils.sendReply('dm_not_possible', msg);
    }
};

commands.stats = {
    _id: 18,
    main_cmd: 'stats',
    alias: [],
    min_perm: 0,
    handler: function (msg) {
        utils.resolverole(msg.author.id, msg.channel.server.id, function (perm) {
            redis.keys('stats:messages:time:all:*').then(function (keys) {
                if (perm < 6) {
                    utils.sendReply('stats.user', msg, {
                        servers: discordBot.servers.length,
                        users: discordBot.users.getAll('status', 'online').length + discordBot.users.getAll('status', 'idle').length,
                        mpm: keys.length
                    });
                } else {
                    utils.sendChatMsg('stats.staff', msg.channel, {
                        servers: discordBot.servers.length,
                        users: discordBot.users.getAll('status', 'online').length + discordBot.users.getAll('status', 'idle').length + '/' + discordBot.users.length,
                        mpm: keys.length,
                        mem: Math.round((os.totalmem() - os.freemem()) / 1000000) + '/' + Math.round(os.totalmem() / 1000000),
                        sysload: os.loadavg().join(' '),
                        uptime: starttime.fromNow()
                    }, function (err, msg) {
                        if (!err) discordBot.deleteMessage(msg, {wait: 60 * 1000});
                    });
                }
                discordBot.deleteMessage(msg);
            });
        });
    }
};

commands.serverstats = {
    _id: 19,
    main_cmd: 'serverstarts',
    alias: [],
    min_perm: 0,
    handler: function (msg) {
        if (!msg.channel.isPrivate) {
            redis.keys('stats:messages:time:servers:' + msg.channel.server.id + ':*').then(function (keys) {
                utils.sendReply('serverstats.user', msg, {
                    users: msg.channel.server.members.getAll('status', 'idle').length + msg.channel.server.members.getAll('status', 'online').length + '/' + msg.channel.server.members.length,
                    channels: msg.channel.server.channels.length + ' [ ' + msg.channel.server.channels.getAll('type', 'text').length + ' | ' + msg.channel.server.channels.getAll('type', 'voice').length + ' ]',
                    mpm: keys.length
                }, function (err, msg) {
                    if (!err) discordBot.deleteMessage(msg, {wait: 120 * 1000});
                });
                discordBot.deleteMessage(msg);
            });
        } else utils.sendReply('dm_not_possible', msg);
    }
};

commands.twitchwatcher = commands.watcher = {
    _id: 20,
    main_cmd: 'twitchwatcher',
    alias: ['watcher'],
    min_perm: 3,
    handler: function (msg) {
        if (!msg.channel.isPrivate) {
            utils.resolverole(msg.author.id, msg.channel.server.id, function (perm) {
                if (perm > 2) {
                    var split = msg.content.trim().split(' ');
                    if (split.length === 3) {
                        if (split[1] === 'add') {
                            request.get('https://api.twitch.tv/kraken/channels/' + split[2], function (err, resp) {
                                if ([304, 200].indexOf(resp.statusCode) !== -1) {
                                    models.TwitchChannel.findOrCreate({
                                        where: {channel: split[2]},
                                        defaults: {
                                            channel: split[2],
                                            api_url: 'https://api.twitch.tv/kraken/streams/' + split[2]
                                        }
                                    }).spread(function (channel) {
                                        models.TwitchWatcher.findOrCreate({
                                            where: {
                                                server_channel: msg.channel.id,
                                                tw_channel: channel.channel
                                            }, defaults: {
                                                server_channel: msg.channel.id,
                                                tw_channel: channel.channel,
                                                sid: msg.channel.server.id
                                            }
                                        }).spread(function (watcher, created) {
                                            if (created) {
                                                utils.sendReply('twitchWatcher.add', msg, {channel: channel.channel});
                                                watcher.setTwitchChannel(channel);
                                                models.Server.find({where: {sid: msg.channel.server.id}}).then(function (server) {
                                                    watcher.setServer(server);
                                                });
                                            } else utils.sendReply('twitchWatcher.already_watched', msg);
                                        });
                                    });
                                } else utils.sendReply('twitchWatcher.channel_not_found', msg);
                            });
                        } else if (split[1] === 'remove') {
                            models.TwitchWatcher.find({where: {tw_channel: split[2]}}).then(function (watcher) {
                                if (watcher !== null && watcher !== undefined) {
                                    watcher.destroy().then(function () {
                                        utils.sendReply('twitchWatcher.remove', msg, {channel: watcher.tw_channel});
                                        models.TwitchChannel.find({where: {channel: split[2]}}).then(function (channel) {
                                            channel.getTwitchWatchers().then(function (watchers) {
                                                if (watchers.length === 0) channel.destroy();
                                            });
                                        });
                                    });
                                } else utils.sendReply('twitchWatcher.channel_not_found', msg);
                            });
                        } else utils.sendReply('wrong_argument', msg, {args: 'add, remove, list'});
                    } else if (split.length === 2 && split[1] === 'list') {
                        models.TwitchWatcher.findAll({where: {server_channel: msg.channel.id}}).then(function (watchers) {
                            var channels = watchers.map(function (e) {
                                return e.tw_channel + '\n';
                            });
                            utils.sendReply('twitchWatcher.list', msg, {channels: '```' + channels + '```'});
                        });
                    } else utils.sendReply('wrong_argument', msg, {args: 'add, remove, list'});
                } else utils.sendReply('not_allowed', msg);
                discordBot.deleteMessage(msg);
            });
        } else utils.sendReply('dm_not_possible', msg);
    }
};

commands.modlog = {
    _id: 21,
    main_cmd: 'modlog',
    alias: [],
    min_perm: 4,
    handler: function (msg) {
        if (!msg.channel.isPrivate) {
            utils.resolverole(msg.author.id, msg.channel.server.id, function (perm) {
                if (perm > 2) {
                    var split = msg.content.trim().split(' ');
                    if (split.length === 2) {
                        if (split[1] === 'enable') {
                            models.Server.update({mod_log: msg.channel.id}, {where: {sid: msg.channel.server.id}}).then(function () {
                                utils.sendReply('modlog.enabled', msg);
                            });
                        } else if (split[1] === 'disable') {
                            models.Server.update({mod_log: null}, {where: {sid: msg.channel.server.id}}).then(function () {
                                utils.sendReply('modlog.disabled', msg);
                            });
                        } else utils.sendReply('wrong_argument', msg, {args: 'enable, disable'});
                    } else utils.sendReply('wrong_argument', msg, {args: 'enable, disable'});
                } else utils.sendReply('not_allowed', msg);
            });
            discordBot.deleteMessage(msg);
        } else utils.sendReply('dm_not_possible', msg);
    }
};

commands.cat = commands.kitten = commands.kitty = {
    _id: 22,
    main_cmd: 'cat',
    alias: ['kitten', 'kitty'],
    min_perm: 0,
    handler: function (msg) {
        request.get('http://thecatapi.com/api/images/get?format=xml&results_per_page=15&api_key=NzY0NDY', function (err, resp, body) {
            if (!err && [200, 304].indexOf(resp.statusCode) !== -1) {
                var xml = pxlxml.parse(body);
                discordBot.sendFile(msg, xml.data.images.image[_.random(0, 14)].url);
            } else utils.sendReply('unknown_arror', msg);
            discordBot.deleteMessage(msg);
        });
    }
};

commands.smile = {
    _id: 23,
    main_cmd: 'smile',
    alias: [],
    min_perm: 0,
    handler: function (msg) {
        request.get('http://gifbase.com/tag/smile?format=json', function (err, resp, body) {
            if (!err && [200, 304].indexOf(resp.statusCode) !== -1) {
                body = JSON.parse(body);
                discordBot.sendFile(msg, body.gifs[_.random(0, body.gifs.length - 1)].url, function (err, msg) {
                    if (!err) discordBot.deleteMessage(msg, {wait: 180 * 1000});
                });
            } else utils.sendReply('unknown_arror', msg);
            discordBot.deleteMessage(msg);
        });
    }
};

commands.wtf = {
    _id: 24,
    main_cmd: 'smile',
    alias: [],
    min_perm: 0,
    handler: function (msg) {
        request.get('http://gifbase.com/tag/wtf?format=json', function (err, resp, body) {
            if (!err && [200, 304].indexOf(resp.statusCode) !== -1) {
                body = JSON.parse(body);
                discordBot.sendFile(msg, body.gifs[_.random(0, body.gifs.length - 1)].url, function (err, msg) {
                    if (!err) discordBot.deleteMessage(msg, {wait: 180 * 1000});
                });
            } else utils.sendReply('unknown_arror', msg);
            discordBot.deleteMessage(msg);
        });
    }
};

module.exports = commands;