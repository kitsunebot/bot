var db = require('../db/sql_db');
var eris = require('../lib/client');
var lang = require('../lib/lang');

var story = require('storyboard').mainStory;
var request = require('request');

module.exports = {
    label: 'waifu',
    enabled: true,
    isSubcommand: false,
    generator: (msg, args)=> {
        db.models.User.find({where: {uid: msg.author.id}}).then((user)=> {
            return user.getWaifu();
        }).then((waifu)=> {
            waifu.getCharacterPictures({limit: 1, order: 'RAND()'}).spread((pic)=> {
                request.get(pic.link, {encoding: null}, function (err, resp, data) {
                    var file;
                    if (err || resp.statusCode !== 200) {
                        story.warn('Error loading picture', {attach: {err: err, statusCode: resp.statusCode}});
                        file = undefined;
                    } else {
                        file = {
                            file: data,
                            name: waifu.name + waifu.source + '.' + pic.link.split('.')[pic.link.split('.').length - 1]
                        }
                    }
                    eris.createMessage(msg.channel.id, lang.computeResponse(msg, 'waifu.default', {
                        name: waifu.name,
                        origin: waifu.source,
                        pic_link: pic.link
                    }), file);
                });
            });
        });
        return null;
    },
    options: {
        caseInsensitive: true,
        deleteCommand: true
    },
    subcommands: [require('./waifu_list'), require('./waifu_set')]
};