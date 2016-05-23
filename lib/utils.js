'use strict';

var discordBot = require('./init_client');
var config = require('../config');
var redis = require('./redis_db');
var cache = require('./cache');
var db = require('./sql_db');

var _ = require('underscore');
var S = require('string');
var flatten = require('flat');

var exprt = {
    replace: function (str, replacer) {
        var keys = _.keys(replacer);
        var string = S(str);
        keys.forEach(function (key) {
            string = string.replaceAll('&{' + key + '}', replacer[key] || '');
        });
        return string.s;
    },
    messages: {
        sendReply: function (msg, content, options, callback) {
            exprt.language.getLanguage(msg, function (lang) {
                redis.hget('language:strings:' + lang, (typeof content === 'object' ? content.key : content)).then(function (message) {
                    if (typeof content === 'object') {
                        message = exprt.replace(message, content.replacer);
                    }
                    discordBot.reply(msg, message, options, callback);
                });
            });
        },
        sendMessage: function (channel, content, options, callback) {
            exprt.language.getChannelLanguage(channel, function (lang) {
                redis.hget('language:strings:' + lang, (typeof content === 'object' ? content.key : content)).then(function (message) {
                    if (typeof content === 'object') {
                        message = exprt.replace(message, content.replacer);
                    }

                    if (!channel.isPrivate && function () {
                            if (typeof options === 'object') {
                                return typeof options.username === 'string';
                            } else return false
                        }()) {
                        redis.hget('language:strings:' + lang, 'defaultMessageFormat').then(function (format) {
                            message = exprt.replace(format, {msg: message, username: options.username});
                            send();
                        });
                    } else send();

                    function send() {
                        discordBot.sendMessage(channel, message, options, callback);
                    }
                });
            });
        },
        sendPrivateMessage: function (user, content, options, callback) {
            exprt.language.getUserLanguage(user, function (lang) {
                redis.hget('language:strings:' + lang, (typeof content === 'object' ? content.key : content)).then(function (message) {
                    if (typeof content === 'object') {
                        message = exprt.replace(message, content.replacer);
                    }
                    discordBot.sendMessage(user, message, options, callback);
                });
            });
        }
    },
    language: {
        getLanguage: function (msg, callback) {
            if (!msg.channel.isPrivate) {
                cache.getServer(msg.channel.server.id, function (server) {
                    callback(server.language)
                });
            } else {
                redis.hget('language:users', msg.author.id).then(function (lang) {
                    callback((lang !== null ? lang : config.languages.default));
                });
            }
        },
        getUserLanguage: function (user, callback) {
            redis.hget('language:users', user.id).then(function (lang) {
                callback((lang !== null ? lang : config.languages.default));
            });
        },
        getChannelLanguage: function (channel, callback) {
            if (!channel.isPrivate) {
                cache.getServer(channel.server.id, function (server) {
                    callback(server.language)
                });
            } else {
                redis.hget('language:users', channel.recipient.id).then(function (lang) {
                    callback((lang !== null ? lang : config.languages.default));
                });
            }
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
            f = flatten(f);
            if (lang !== config.languages.default) {
                _.defaults(f, flatten(require('../lang/' + config.languages.default + '.js')));
            }
            redis.del('language:strings:' + lang).then(function () {
                var keys = _.keys(f);
                keys.forEach(function (key) {
                    redis.hset('language:strings:' + lang, key, f[key]);
                });
                exprt.language.generateCommandList(lang);
            });
        },
        generateCommandList: function (language) {
            var commands = require('./commands');
            var cmdarray = function () {
                var keys = _.keys(commands);
                var ids = [];
                var cmds = [];
                keys.forEach(function (key) {
                    if (ids.indexOf(commands[key]._id) === -1) {
                        cmds.push(commands[key]);
                        ids.push(commands[key]._id);
                    }
                });
                return cmds;
            }();

            redis.hget('language:strings:' + language, 'commandslist._template').then(function (template) {
                var text = '';
                iterate(0);
                function iterate(index) {
                    redis.hget('language:strings:' + language, 'commandslist.' + cmdarray[index].main_cmd).then(function (desc) {
                        text += exprt.replace(template, {
                            cmd_main: cmdarray[index].main_cmd,
                            cmd_alias: cmdarray[index].alias.length === 0 ? '' : '(' + cmdarray[index].alias.map(function (e) {
                                return '`' + e + '`';
                            }).join(' ') + ')',
                            args: cmdarray[index].args,
                            desc: desc
                        });
                        if (cmdarray[index + 1] !== undefined) iterate(index + 1);
                        else cache._.cache.command_list[language] = text;
                    });
                }
            });
        }
    },
    users: {
        getGlobalPermLvl: function (uid, callback) {
            redis.hget('users:globalperm', uid).then(function (perm) {
                callback((perm !== null ? parseInt(perm) : 0));
            });
        },
        sendCommandList: function (user) {
            exprt.language.getUserLanguage(user, function (lang) {
                redis.hget('language:strings:' + lang, 'commandslist._text').then(function (text) {
                    discordBot.sendMessage(user.id, text, function (err) {
                        if (err) story.error('meta', 'Error while sending message', {attach: err});
                        else {
                            var split = cache._.cache.command_list[lang].split('_tempend_');
                            split.forEach(function (text) {
                                discordBot.sendMessage(user.id, text);
                            });
                        }
                    });
                });
            });
        },
        sendWaifuList: function (user) {
            db.models.Waifu.findAll().then(function (waifus) {
                waifus = waifus.map(function (e) {
                    return e.name + ' (' + e.source + ') [' + e.wid + ']';
                });
                exprt.messages.sendPrivateMessage(user, {key: 'waifu.list', replacer: {waifus: waifus.join(', ')}});
            });
        }
    }
};

module.exports = exprt;