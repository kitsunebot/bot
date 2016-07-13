var db = require('../db/sql_db');
var eris = require('../lib/client');
var lang = require('../lib/lang');

module.exports = {
    label: 'waifu',
    enabled: true,
    isSubcommand: false,
    generator: (msg, args)=> {
        db.models.User.find({where: {uid: msg.author.id}}).then((user)=> {
            return user.getWaifu();
        }).then((waifu)=> {
            waifu.getCharacterPictures({limit: 1, order: 'RAND()'}).spread((pic)=> {
                eris.createMessage(msg.channel.id, lang.computeResponse(msg, 'waifu.default', {
                        name: waifu.name,
                        origin: waifu.source
                    }) + '\n' + pic.link);
            });
        });
        return null;
    },
    options: {
        caseInsensitive: true,
        deleteCommand: true
    },
    subcommands:[require('./waifu_list'),require('./waifu_set')]
};