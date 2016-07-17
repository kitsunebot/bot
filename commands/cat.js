var request = require('request');
var _ = require('underscore');
var pxlxml = require('pixl-xml');

var lang = require('../lib/lang');
var eris = require('../lib/client');

module.exports = {
    label: 'cat',
    enabled: true,
    isSubcommand: false,
    generator: (msg, args)=> {
        request.get('http://thecatapi.com/api/images/get?format=xml&results_per_page=15&api_key=NzY0NDY', function (err, resp, body) {
            if (!err && [200, 304].indexOf(resp.statusCode) !== -1) {
                var xml = pxlxml.parse(body);
                eris.createMessage(msg.channel.id, xml.data.images.image[_.random(0, 14)].url);
            } else eris.createMessage(msg.channel.id, lang.computeResponse(msg, 'error'));
        });
    },
    options: {
        deleteCommand: true,
        caseInsensitive: true,
        alias:['kitty','kitten']
    }
};