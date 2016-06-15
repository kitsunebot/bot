var _ = require('underscore');

var utils = require('../utils');
var discordBot = require('../client');

module.exports = {
    _id: 24,
    main_cmd: 'purge',
    alias: [],
    min_perm: 3,
    args: '((@)user) | (count)',
    allow_disable: true,
    handlers: {
        server: function (msg) {
            var split = msg.cleanContent.split(' ');
            if (split.length > 1) {
                if (msg.mentions.length === 0) {
                    var argsstr = _.rest(split).join(' ');
                    if (validator.isNumeric(argsstr)) {
                        var count = parseInt(argsstr);
                        var toDelete = _.last(msg.channel.messages, count);
                        if (count > 2) {
                            toDelete.forEach(function (msg) {
                                discordBot.deleteMessage(msg);
                                //todo use bulk delete
                            });
                        } else {
                            toDelete.forEach(function (msg) {
                                discordBot.deleteMessage(msg);
                            });
                        }
                    } else {
                        //todo resolve user
                    }
                } else {
                    var Delete = [];
                    msg.mentions.forEach(function (mention) {
                        msg.channel.messages.getAll('author', mention).forEach(function (e) {
                            Delete.push(e);
                        });
                    });
                    if (Delete.length > 2) {
                        Delete.forEach(function (msg) {
                            discordBot.deleteMessage(msg);
                            //todo use bulk delete
                        });
                    } else {
                        Delete.forEach(function (msg) {
                            discordBot.deleteMessage(msg);
                        });
                    }
                }
            } else {
                //todo args
            }
        }
    }
};