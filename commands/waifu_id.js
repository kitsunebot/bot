var db = require('../db/sql_db');
var lang = require('../lib/lang');
var eris = require('../lib/client');

module.exports = {
    label: 'id',
    isSubcommand: true,
    enabled: true,
    generator: (msg, args)=> {
        db.models.User.find({where: {uid: msg.author.id}}).then((user)=> {
            return user.getWaifu();
        }).then((waifu)=> {
            if (waifu !== null && waifu !== undefined) {
                eris.createMessage(msg.channel.id, lang.computeResponse(msg, 'waifu.id.default', {id: waifu.id}));
            } else {
                eris.createMessage(msg.channel.id, lang.computeResponse(msg, 'waifu.id.no_waifu'));
            }
        });
    },
    options: {
        deleteCommand: true,
        caseInsensitive: true
    }
};