var request = require('request');
var _ = require('underscore');

var utils = require('../utils');
var discordBot = require('../client');

module.exports = {
    _id: 12,
    main_cmd: 'wtf',
    alias: [],
    min_perm: 0,
    args: '[none]',
    allow_disable: true,
    handlers: {
        default: function (msg) {
            request.get('http://gifbase.com/tag/wtf?format=json', function (err, resp, body) {
                if (!err && [200, 304].indexOf(resp.statusCode) !== -1) {
                    body = JSON.parse(body);
                    discordBot.sendFile(msg, body.gifs[_.random(0, body.gifs.length - 1)].url, function (err, msg) {
                        if (!err) discordBot.deleteMessage(msg, {wait: 180 * 1000});
                    });
                } else utils.sendMessage(msg.channel, 'unknown_error');
                discordBot.deleteMessage(msg);
            });
        }
    }
};