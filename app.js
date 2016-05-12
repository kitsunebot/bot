var config = require('./config.js');
var story = require('storyboard').mainStory;
var S = require('string');

var discordBot = require('./lib/init_client');
var cmds = require('./lib/commands');
var utils = require('./lib/utils');
var cache = require('./lib/cache');
var db = require('./lib/sql_db');
var redis = require('./lib/redis_db');
var cronjobs = null;
var web = require('./web/index');

config.languages.all.forEach(function (lang) {
    utils.language.loadLangFile(lang);
});


discordBot.loginWithToken(config.login.token).then(function () {
    story.info('meta', 'Login successfull');
}).catch(function (err) {
    story.error('meta', 'Error while logging in.', {attach: err});
});

discordBot.on('ready', function () {
    story.info('discord.js', 'Client ready to use');
    cronjobs = require('./lib/cronjobs');
});

discordBot.on('message', function (msg) {
    if (!msg.channel.isPrivate) {
        cache.getServer(msg.channel.server.id, function (server) {
            if (typeof server.isCommand(msg.content) === 'string') {
                var prefix = server.isCommand(msg.content);
                var str = S(msg.content);
                //noinspection JSDuplicatedDeclaration
                var cmd = str.chompLeft(prefix).s.split(' ')[0];
                if (cmds[cmd] !== undefined) {
                    if (server.getPermissionLevel(msg.author.id) >= cmds[cmd].min_perm) {
                        msg.server = server;
                        msg.cleanContent = str.chompLeft(prefix).s;
                        if (cmds[cmd].handlers.server !== undefined) cmds[cmd].handlers.server(msg);
                        else if (cmds[cmd].handlers.default !== undefined) cmds[cmd].handlers.default(msg);
                    } else utils.messages.sendReply(msg, 'not_allowed');
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
        });
        redis.set('stats:messages:time:servers:' + msg.channel.server.id + ':' + msg.id, 1).then(function () {
            redis.expire('stats:messages:time:servers:' + msg.channel.server.id + ':' + msg.id, 60);
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
                    } else utils.messages.sendReply(msg, 'not_allowed');
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
    redis.set('stats:messages:time:all:' + msg.id, 1).then(function () {
        redis.expire('stats:messages:time:all:' + msg.id, 60);
    });
});

discordBot.on('serverCreated', function (server) {
    db.models.Server.findOrCreate({
        where: {sid: server.id},
        defaults: {
            sid: server.id,
            name: server.name,
            region: server.region,
            icon: server.iconURL
        }
    }).spread(function (srv, created) {
        if (created) {
            //todo send welcome
            db.models.User.findOrCreate({
                where: {uid: server.owner.id}, defaults: {
                    uid: server.owner.id,
                    username: server.owner.username,
                    avatar: server.owner.avatarURL
                }
            }).spread(function (user) {
                srv.setOwner(user);
            });
        } else {
            srv.update({
                sid: server.id,
                name: server.name,
                region: server.region,
                icon: server.iconURL
            });
            srv.getOwner().then(function (owner) {
                if (owner.uid !== server.owner.id) {
                    db.models.User.findOrCreate({
                        where: {uid: server.owner.id}, defaults: {
                            uid: server.owner.id,
                            username: server.owner.username,
                            avatar: server.owner.avatarURL
                        }
                    }).spread(function (user) {
                        srv.setOwner(user);
                    });
                }
            });
        }
    });
});

discordBot.on('serverUpdated', function (oldServer, newServer) {
    db.models.Server.update({
        sid: newServer.id,
        name: newServer.name,
        region: newServer.region,
        icon: newServer.iconURL
    }, {where: {sid: newServer.id}});
});

discordBot.on('userBanned', function (user, server) {
    cache.getServer(server.id, function (srv) {
        srv.modlog(user, 'banned');
    });
});

discordBot.on('userUnbanned', function (user, server) {
    cache.getServer(server.id, function (srv) {
        srv.modlog(user, 'unbanned');
    });
});

discordBot.on('debug', function (debug) {
    story.debug('discord.js', debug);
});

discordBot.on('warn', function (warn) {
    story.warn('discord.js', warn);
});

discordBot.on('error', function (error) {
    story.error('discord.js', error);
});