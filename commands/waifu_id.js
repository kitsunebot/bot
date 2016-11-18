let db = require('../lib/db');
let lang = require('../lib/lang');

module.exports = {
    label: 'id',
    isSubcommand: true,
    enabled: true,
    generator: (msg, args)=> {
        db.models.User.find({where: {uid: msg.author.id}}).then((user)=> {
            return user.getWaifu();
        }).then((waifu)=> {
            if (waifu !== null && waifu !== undefined) {
                msg.channel.createMessage( lang.computeResponse(msg, 'waifu.id.default', {id: waifu.id}));
            } else {
                msg.channel.createMessage(lang.computeResponse(msg, 'waifu.id.no_waifu'));
            }
        });
    },
    options: {
        deleteCommand: true,
        caseInsensitive: true
    }
};