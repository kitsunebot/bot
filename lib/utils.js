module.exports = {
    replace: function (str, replacer) {
        var keys = _.keys(replacer);
        var string = S(str);
        keys.forEach(function (key) {
            string = string.replaceAll('&{' + key + '}', replacer[key] || '');
        });
        return string.s;
    },
    resolverole: function (uid, sid, callback) {
        var role_level = 0;
        if (sid === 'null') {
            redis.exists('roles:global:uid:' + uid).then(function (gex) {
                redis.get('roles:global:uid:' + uid).then(function (role) {
                    if (gex === 1) {
                        role = parseInt(role, 10);
                        if (role > role_level) role_level = role;
                    }
                    callback(role_level);
                })
            });
        } else {
            redis.exists('roles:global:uid:' + uid).then(function (gex) {
                redis.get('roles:global:uid:' + uid).then(function (role) {
                    if (gex === 1) {
                        role = parseInt(role, 10);
                        if (role > role_level) role_level = role;
                    }
                    redis.hexists('roles:servers:sid:' + sid, uid).then(function (hex) {
                        redis.hget('roles:servers:sid:' + sid, uid).then(function (srole) {
                            if (hex === 1) {
                                srole = parseInt(srole, 10);
                                if (srole > role_level) role_level = srole;
                            }
                            callback(role_level);
                        });
                    });
                })
            });
        }
    },
    msglogstring: function (msg) {
        return msg.author.username + '[' + msg.author.id + '] ' + msg.cleanContent;
    },
    initRedis: function () {
        config.languages.all.forEach(function (lang) {
            utils.loadLangFile(lang);
        });

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

        models.User.findAll({where: {language: {$not: 'en'}}}).then(function (users) {
            users.forEach(function (user) {
                redis.hset('language:users', user.uid, user.language);
            });
        });

        models.Server.findAll({where: {language: {$not: 'en'}}}).then(function (servers) {
            servers.forEach(function (server) {
                redis.hset('language:servers', server.sid, server.language);
            });
        });

        models.CustomCommand.findAll({where: {type: 'global', active: true}}).then(function (ccs) {
            redis.del('customcommands:global').then(function () {
                ccs.forEach(function (cc) {
                    redis.hset('customcommands:global', cc.trigger, cc.display);
                    redis.hset('customcommands:global:types', cc.trigger, cc.msg_type);
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
                        redis.hset('customcommands:local:' + server.sid + ':types', cc.trigger, cc.msg_type);
                    });
                });
            });
        });



        models.ChatReaction.findAll({where: {type: 'global', active: true}}).then(function (ccs) {
            redis.del('chatreactions:global').then(function () {
                ccs.forEach(function (cc) {
                    redis.hset('chatreactions:global', cc.trigger, cc.display);
                    redis.hset('chatreactions:global:types', cc.trigger, cc.msg_type);
                });
            });
        });
        redis.keys('chatreactions:local:*').then(function (keys) {
            keys.forEach(function (key) {
                redis.del(key);
            });
            models.ChatReaction.findAll({where: {type: 'local', active: true}}).then(function (ccs) {
                ccs.forEach(function (cc) {
                    cc.getServer().then(function (server) {
                        redis.hset('chatreactions:local:' + server.sid, cc.trigger, cc.display);
                        redis.hset('chatreactions:local:' + server.sid + ':types', cc.trigger, cc.msg_type);
                    });
                });
            });
        });

        utils.loadGames();

        redis.del('commands:servers:enabled').then(function () {
            models.Server.findAll({where: {enabled: true}}).then(function (servers) {
                servers.forEach(function (server) {
                    redis.hset('commands:servers:enabled', server.sid, 1);
                });
            });
        });

        redis.del('customcommands:servers:enabled').then(function () {
            models.Server.findAll({where: {ccenabled: true}}).then(function (servers) {
                servers.forEach(function (server) {
                    redis.hset('customcommands:servers:enabled', server.sid, 1);
                });
            });
        });

        redis.del('chatreactions:servers:enabled').then(function () {
            models.Server.findAll({where: {crenabled: true}}).then(function (servers) {
                servers.forEach(function (server) {
                    redis.hset('chatreactions:servers:enabled', server.sid, 1);
                });
            });
        });

        redis.del('commands:servers:slash:enabled').then(function () {
            models.Server.findAll({where: {slash: true}}).then(function (servers) {
                servers.forEach(function (server) {
                    redis.hset('commands:servers:slash:enabled', server.sid, 1);
                });
            });
        });

        redis.del('commands:servers:shortpref:enabled').then(function () {
            models.Server.findAll({where: {shortpref: true}}).then(function (servers) {
                servers.forEach(function (server) {
                    redis.hset('commands:servers:shortpref:enabled', server.sid, 1);
                });
            });
        });

        redis.del('automod:enabled').then(function () {
            models.Server.findAll({where: {automod: true}}).then(function (servers) {
                servers.forEach(function (server) {
                    redis.hset('automod:enabled', server.sid, 1);
                });
            });
        });
    },
    games: {
        add: function (name, display) {
            models.Game.findOrCreate({
                where: {name: name, display: display},
                defaults: {name: name, display: display}
            }).spread(function (g) {
                g.updateAttributes({name: name, display: display});
            });
            redis.sadd('meta:games:strings', display);
        },
        remove: function (name) {
            models.Game.findAll({where: {name: name}}).then(function (games) {
                games.forEach(function (game) {
                    redis.srem('meta:games:strings', game.display);
                    game.destroy();
                });
            });
        },
        enable: function (name) {
            models.Game.findAll({where: {name: name}}).then(function (games) {
                games.forEach(function (game) {
                    redis.sadd('meta:games:strings', game.display);
                    game.updateAttributes({active: true});
                });
            });
        },
        disable: function (name) {
            models.Game.findAll({where: {name: name}}).then(function (games) {
                games.forEach(function (game) {
                    redis.srem('meta:games:strings', game.display);
                    game.updateAttributes({active: false});
                });
            });

        }
    },
    reloadServerRoles: function (sid) {
        redis.del('roles:servers:sid:' + sid).then(function () {
            models.Server.find({where: {sid: sid}}).then(function (server) {
                server.getOwner().then(function (owner) {
                    redis.hset('roles:servers:sid:' + server.sid, owner.uid, 5);
                });
                server.getServerRoles({order: [['level', 'asc']]}).then(function (roles) {
                    roles.forEach(function (role) {
                        role.getUser().then(function (user) {
                            redis.hset('roles:servers:sid:' + server.sid, user.uid, role.level);
                        });
                    });
                });
            });
        });
    },
    sendChatMsg: function (key, channel, replacer, callback) {
        var rediskey;
        var id;
        if (callback === undefined && typeof replacer === 'function') {
            callback = replacer;
            replacer = {};
        }
        if (typeof channel === 'object') {
            if (channel.status !== undefined) {
                rediskey = 'language:users';
                id = channel.id;
            } else {
                if (channel.isPrivate) {
                    rediskey = 'language:users';
                    id = channel.recipient.id;
                } else {
                    rediskey = 'language:servers';
                    id = channel.server.id;
                }
            }
        } else if (typeof channel === 'string') {
            rediskey = 'language:servers';
            id = discordBot.channels.get('id', channel).server.id;
        }

        redis.hget(rediskey, id).then(function (lang) {
            if (lang === undefined || lang === null) lang = 'en';
            redis.hget('language:strings:' + lang, key).then(function (str) {
                var send = utils.replace(str, replacer);
                discordBot.sendMessage(channel, send, callback);
            });
        });

    },
    sendReply: function (key, channel, replacer, callback) {
        var rediskey;
        var id;
        if (callback === undefined && typeof replacer === 'function') {
            callback = replacer;
            replacer = {};
        }
        if (channel.channel !== undefined) {
            if (channel.channel.isPrivate) {
                rediskey = 'language:users';
                id = channel.chnnel.recipient.id;
            } else {
                rediskey = 'language:servers';
                id = channel.channel.server.id;
            }
        } else {
            if (channel.isPrivate) {
                rediskey = 'language:users';
                id = channel.recipient.id;
            } else {
                rediskey = 'language:servers';
                id = channel.server.id;
            }
        }
        redis.hget(rediskey, id).then(function (lang) {
            if (lang === undefined || lang === null) lang = 'en';
            redis.hget('language:strings:' + lang, key).then(function (str) {
                var send = utils.replace(str, replacer);
                discordBot.reply(channel, send, callback);
            });
        });

    },
    loadLangFile: function (lang) {
        try {
            delete require.cache['../lang/' + lang + '.js'];
            var f = require('../lang/' + lang + '.js');
        } catch (e) {
            story.error('lang', 'Error loading langfile ' + lang, {attach: e});
            if (lang === config.languages.default) {
                throw new Error('Error loading default langfile.');
            } else return;
        }
        if (lang !== config.languages.default) {
            _.defaults(f, require('../lang/' + config.languages.default + '.js'));
        }
        f = flatten(f);
        redis.del('language:strings:' + lang).then(function () {
            var keys = _.keys(f);
            keys.forEach(function (key) {
                redis.hset('language:strings:' + lang, key, f[key]);
            });
        });
    },
    loadGames: function () {
        redis.del('meta:games:strings').then(function () {
            models.Game.findAll({where: {active: true}}).then(function (gs) {
                gs.forEach(function (g) {
                    if (g !== undefined && g !== null) {
                        redis.sadd('meta:games:strings', g.display);
                    }
                });
            });
        });
    },
    automod: {
        activate: function (sid) {
            models.Server.update({automod: true}, {where: {sid: sid}});
            redis.hset('automod:enabled', sid, 1);
        },
        deactivate: function (sid) {
            models.Server.update({automod: false}, {where: {sid: sid}});
            redis.hdel('automod:enabled', sid);
        }
    },
    clone: function (obj, options) {
        options = options || {};
        if (options.deep === undefined) options.deep = false;
        if (options.exclude === undefined) options.exclude = [];
        function copy(obj, level) {
            if (obj == null || typeof obj !== 'object') return obj;
            var clone, i;
            if (obj instanceof Array) {
                clone = [];
                for (i = 0; i < obj.length; i++) {
                    if (!obj.hasOwnProperty(i)) continue;
                    if (options.deep && level < 4) clone.push(copy(obj[i], level + 1));
                    else clone.push(obj[i]);
                }
            } else {
                clone = {};
                for (i in obj) {
                    if (!obj.hasOwnProperty(i)) continue;
                    if (options.exclude[level] !== undefined && options.exclude[level].indexOf(i) !== -1) continue;
                    if (options.deep && level < 4) clone[i] = copy(obj[i], level + 1);
                    else clone[i] = obj[i];
                }
            }
            return clone;
        }

        return copy(obj, 0);
    },
    resolveRoleLvl: function (r) {
        var p = parseInt(r);
        if (!isNaN(p) && r >= 0 && r < 6) {
            return p;
        } else {
            switch (r) {
                case 'none':
                    return 0;
                    break;
                case 'permitted':
                    return 1;
                    break;
                case 'moderator':
                    return 2;
                    break;
                case 'mod':
                    return 2;
                    break;
                case 'editor':
                    return 3;
                    break;
                case 'manager':
                    return 4;
                    break;
                default:
                    return NaN;
                    break;
            }
        }
    },
    resolveHighRoleLvl: function (r) {
        var p = parseInt(r);
        if (!isNaN(p) && r >= 0 && r < 6) {
            return p;
        } else {
            switch (r) {
                case 'none':
                    return 0;
                    break;
                case 'permitted':
                    return 1;
                    break;
                case 'moderator':
                    return 2;
                    break;
                case 'mod':
                    return 2;
                    break;
                case 'editor':
                    return 3;
                    break;
                case 'manager':
                    return 4;
                    break;
                case 'owner':
                    return 5;
                    break;
                case 'helper':
                    return 6;
                    break;
                case 'tech':
                    return 7;
                    break;
                case 'admin':
                    return 8;
                    break;
                case 'developer':
                    return 9;
                    break;
                case 'dev':
                    return 9;
                    break;
                case 'host':
                    return 10;
                    break;
                default:
                    return NaN;
                    break;
            }
        }
    },
    resolveRoleName: function (r) {
        switch (r) {
            case 0:
                return 'none';
                break;
            case 1:
                return 'permitted';
                break;
            case 2:
                return 'moderator';
                break;
            case 3:
                return 'editor';
                break;
            case 4:
                return 'manager';
                break;
            case 5:
                return 'owner';
                break;
            case 6:
                return 'helper';
                break;
            case 7:
                return 'tech';
                break;
            case 8:
                return 'admin';
                break;
            case 9:
                return 'developer';
                break;
            case 10:
                return 'host';
                break;
            default:
                return undefined;
                break;
        }
    }
};