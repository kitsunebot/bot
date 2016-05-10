var discordBot = require('./init_client');
var config = require('../config');
var redis = require('./redis_db');
var cache = require('./cache');

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
                    discordBot.sendMessage(channel, message, options, callback);
                });
            });
        }
    },
    language: {
        getLanguage: function (msg, callback) {
            if (!msg.channel.isPrivate){
                cache.getServer(msg.channel.server.id, function (server) {
                    callback(server.language)
                });
            } else {
                redis.hget('language:users', msg.author.id).then(function (lang) {
                    callback((lang !== null ? lang : config.languages.default));
                });
            }
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
            });
        }
    }
};

module.exports = exprt;