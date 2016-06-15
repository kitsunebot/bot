var _ = require('underscore');

var utils = require('../utils');
var db = require('../db/sql_db');

module.exports = {
    _id: 23,
    main_cmd: 'setwaifu',
    alias: [],
    min_perm: 0,
    args: 'waifu name',
    allow_disable: true,
    handlers: {
        default: function (msg) {
            db.models.Waifu.find({where: {name: _.rest(msg.cleanContent.split(' ')).join(' ').trim()}}).then(function (waifu) {
                if (waifu !== undefined && waifu !== null) {
                    waifu.addUser(msg.author.id).then(function () {
                        utils.messages.sendMessage(msg.channel, {
                            key: 'waifu.set', replacer: {
                                waifu: waifu.name,
                                source: waifu.source,
                                user: msg.author.name
                            }
                        }, {username: msg.author.name})
                    });
                } else {
                    db.models.Waifu.find({where: {wid: _.rest(msg.cleanContent.split(' ')).join(' ').trim()}}).then(function (waifu) {
                        if (waifu !== undefined && waifu !== null) {
                            waifu.addUser(msg.author.id).then(function () {
                                utils.messages.sendMessage(msg.channel, {
                                    key: 'waifu.set', replacer: {
                                        waifu: waifu.name,
                                        source: waifu.source,
                                        user: msg.author.name
                                    }
                                }, {username: msg.author.name})
                            });
                        } else {
                            //todo send waifu not found
                        }
                    });
                }
            });
        }
    }
};