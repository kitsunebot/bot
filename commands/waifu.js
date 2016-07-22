var db = require('../db/sql_db');
var eris = require('../lib/client');
var lang = require('../lib/lang');

var story = require('storyboard').mainStory;
var request = require('request');
var Promise = require('bluebird');

module.exports = {
    label: 'waifu',
    enabled: true,
    isSubcommand: false,
    generator: (msg, args)=> {
        db.models.User.find({where: {uid: msg.author.id}}).then((user)=> {
            return user.getWaifu().then((waifu)=> {
                return Promise.resolve([waifu, user])
            });
        }).spread((waifu, user)=> {
            if (waifu !== undefined && waifu !== null)return Promise.resolve(waifu);
            else {
                return db.models.Character.findAll({
                    limit: 1,
                    order: 'RAND()',
                    where: {type: 'waifu'}
                }).spread((waifu)=> {
                    return user.setWaifu(waifu).then(()=> {
                        return Promise.resolve(waifu)
                    });
                });
            }
        }).then((waifu)=> {
            waifu.getCharacterPictures({where: {verified: true}, limit: 1, order: 'RAND()'}).spread((pic)=> {
                eris.createMessage(msg.channel.id, lang.computeResponse(msg, 'waifu.default', {
                    name: waifu.name,
                    origin: waifu.source,
                    pic_link: pic.link
                }));
            });
        });
        return null;
    },
    options: {
        caseInsensitive: true,
        deleteCommand: true
    },
    subcommands: [require('./waifu_list'), require('./waifu_set'), require('./waifu_search'), require('./waifu_addpicture'), require('./waifu_id')]
};