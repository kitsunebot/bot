var utils = require('../utils');
var db = require('../db/sql_db');
var discordBot = require('../client');

module.exports = {
    _id: 20,
    main_cmd: 'waifu',
    alias: [],
    min_perm: 0,
    args: '[none]',
    allow_disable: true,
    handlers: {
        default: function (msg) {
            db.models.User.find({where: {uid: msg.author.id}}).then(function (user) {
                user.getWaifu().then(function (waifu) {
                    if (waifu !== null && waifu !== undefined) {
                        waifu.getCharacterPictures({order: 'RAND()', limit: 1}).spread(function (picture) {
                            if (picture !== null && picture !== undefined) {
                                utils.messages.sendMessage(msg.channel, {
                                    key: 'waifu.your_waifu',
                                    replacer: {name: waifu.name, origin: waifu.source}
                                }, {username: msg.author.name}, function (err, msg) {
                                    if (!err) discordBot.sendFile(msg.channel, picture.link);
                                });
                            }
                        });
                    } else {
                        db.models.Waifu.find({order: 'RAND()'}).then(function (waifu) {
                            user.setWaifu(waifu);
                            waifu.getCharacterPictures({order: 'RAND()', limit: 1}).spread(function (picture) {
                                if (picture !== null && picture !== undefined) {
                                    utils.messages.sendMessage(msg.channel, {
                                        key: 'waifu.your_waifu',
                                        replacer: {name: waifu.name, origin: waifu.source}
                                    }, {username: msg.author.name}, function (err, msg) {
                                        if (!err) discordBot.sendFile(msg.channel, picture.link);
                                    });
                                }
                            });
                        });
                    }
                });
            });
            msg.delete();
        }
    }
};