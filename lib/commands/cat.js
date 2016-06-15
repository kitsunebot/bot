var request = require('request');
var _ = require('underscore');
var pxlxml = require('pixl-xml');

var utils = require('../utils');
var discordBot = require('../client');

module.exports = {
    _id: 10,
    main_cmd: 'cat',
    alias: ['kitten', 'kitty'],
    min_perm: 0,
    args: '[none]',
    allow_disable: true,
    handlers: {
        default: function (msg) {
            request.get('http://thecatapi.com/api/images/get?format=xml&results_per_page=15&api_key=NzY0NDY', function (err, resp, body) {
                if (!err && [200, 304].indexOf(resp.statusCode) !== -1) {
                    var xml = pxlxml.parse(body);
                    discordBot.sendFile(msg, xml.data.images.image[_.random(0, 14)].url);
                } else utils.messages.sendMessage(msg.channel, 'unknown_error');
                msg.delete();
            });
        }
    }
};