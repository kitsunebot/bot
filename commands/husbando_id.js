var db = require('../lib/db');
var lang = require('../lib/lang');
var eris = require('../lib/client');

module.exports = {
    label: 'id',
    isSubcommand: true,
    enabled: true,
    generator: (msg, args)=> {
        db.models.User.find({where: {uid: msg.author.id}}).then((user)=> {
            return user.getHusbando();
        }).then((husbando)=> {
            if (husbando !== null && husbando !== undefined) {
                eris.createMessage(msg.channel.id, lang.computeResponse(msg, 'husbando.id.default', {id: husbando.id}));
            } else {
                eris.createMessage(msg.channel.id, lang.computeResponse(msg, 'husbando.id.no_husbando'));
            }
        });
    },
    options: {
        deleteCommand: true,
        caseInsensitive: true
    }
};