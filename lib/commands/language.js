var utils = require('../utils');
var config = require('../../config');
var redis = require('../db/redis_db');

module.exports = {
    _id: 5,
    min_perm: 4,
    main_cmd: 'language',
    alias: ['lang'],
    args: '[none] | (language)',
    allow_disable: false,
    handlers: {
        server: function (msg) {
            var split = msg.cleanContent.split(' ');
            if (split.length === 1) {
                utils.messages.sendMessage(msg.channel, {
                    key: 'language.current',
                    replacer: {lang: msg.server.getLanguage()}
                }, {username: msg.author.name});
            } else if (split.length === 2) {
                if (config.languages.all.indexOf(split[1] !== -1)) {
                    msg.server.setLanguage(split[1]);
                    utils.messages.sendMessage(msg.channel, {
                        key: 'language.set',
                        replacer: {lang: split[1]}
                    }, {username: msg.author.name});
                } else utils.messages.sendMessage(msg.channel, {
                    key: 'wrong_argument',
                    replacer: {args: config.languages.all.join(' ')}
                }, {username: msg.author.name});
            } else utils.messages.sendMessage(msg.channel, {
                key: 'wrong_argument',
                replacer: {args: config.languages.all.join(' ')}
            }, {username: msg.author.name});
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