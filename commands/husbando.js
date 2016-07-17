var db = require('../db/sql_db');
var eris = require('../lib/client');
var lang = require('../lib/lang');

var story = require('storyboard').mainStory;
var request = require('request');

module.exports = {
    label: 'husbando',
    enabled: true,
    isSubcommand: false,
    generator: (msg, args)=> {
        db.models.User.find({where: {uid: msg.author.id}}).then((user)=> {
            return user.getHusbando().then((husbando)=> {
                return Promise.resolve([husbando, user])
            });
        }).spread((husbando, user)=> {
            if (husbando !== undefined && husbando !== null)return Promise.resolve(husbando);
            else {
                return db.models.Character.findAll({
                    limit: 1,
                    order: 'RAND()',
                    where: {type: 'husbando'}
                }).spread((husbando)=> {
                    return user.setHusbando(husbando).then(()=> {
                        return Promise.resolve(husbando)
                    });
                });
            }
        }).then((husbando)=> {
            husbando.getCharacterPictures({where: {verified: true}, limit: 1, order: 'RAND()'}).spread((pic)=> {
                /*request.get(pic.link, {encoding: null}, function (err, resp, data) {
                 var file;
                 if (err || resp.statusCode !== 200) {
                 story.warn('Error loading picture', {attach: {err: err, statusCode: resp.statusCode}});
                 file = undefined;
                 } else {
                 file = {
                 file: data,
                 name: husbando.name + husbando.source + '.' + pic.link.split('.')[pic.link.split('.').length - 1]
                 }
                 }*/
                eris.createMessage(msg.channel.id, lang.computeResponse(msg, 'husbando.default', {
                    name: husbando.name,
                    origin: husbando.source,
                    pic_link: pic.link
                }), file);
                //});
            });
        });
        return null;
    },
    options: {
        caseInsensitive: true,
        deleteCommand: true
    },
    subcommands: [require('./husbando_list'), require('./husbando_set'), require('./husbando_search'), require('./husbando_addpicture')]
};