var request = require('request');
var _ = require('underscore');

var lang = require('../lib/lang');
var eris = require('../lib/client');

module.exports = {
    label: 'smile',
    enabled: true,
    isSubcommand: false,
    generator: (msg, args)=> {
        request.get('http://gifbase.com/tag/smile?format=json', function (err, resp, body) {
            if (!err && [200, 304].indexOf(resp.statusCode) !== -1) {
                body = JSON.parse(body);
                eris.createMessage(msg.channel.id, body.gifs[_.random(0, body.gifs.length - 1)].url);
            } else eris.createMessage(msg.channel.id, lang.computeResponse(msg, 'error'));
        });
    },
    options: {
        deleteCommand: true,
        caseInsensitive: true
    }
};