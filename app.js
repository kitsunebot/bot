var config = require('./config.js');
var story = require('storyboard').mainStory;
var S = require('string');

var discordBot = require('./lib/init_client');
var cmds = require('./lib/commands.js');
var utils = require('./lib/utils');
var cache = require('./lib/cache');
var db = require('./lib/sql_db');

config.languages.all.forEach(function (lang) {
    utils.language.loadLangFile(lang);
});


discordBot.loginWithToken(config.login.token).then(function () {
    story.info('meta', 'Login successfull');
}).catch(function (err) {
    story.error('meta', 'Error while logging in.', {attach: err});
});

discordBot.on('ready', function () {

});

discordBot.on('message', function (msg) {
    if (!msg.channel.isPrivate) {
        cache.getServer(msg.channel.server.id, function (server) {
            if (typeof server.isCommand(msg.content) === 'string') {
                var prefix = server.isCommand(msg.content);
                var str = S(msg.content);
                var cmd = str.chompLeft(prefix).s.split(' ')[0];
                if (cmds[cmd] !== undefined) {
                    msg.server = server;
                    cmds[cmd].handler(msg);
                }
            }
        });
    }
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
