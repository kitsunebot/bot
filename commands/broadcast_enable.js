var db = require('../lib/db');
var lang = require('../lib/lang');
var eris = require('../lib/client');

module.exports = {
    label: 'enable',
    isSubcommand: true,
    enabled: true,
    generator: (msg,args)=> {
        db.models.User.update({recieve_broadcasts: true}, {where: {uid: msg.author.id}}).then(()=> {
            eris.createMessage(msg.channel.id, lang.computeResponse(msg, 'broadcast.enable'));
        });
    },
    options: {
        deleteCommand: true,
        caseInsensitive: true
    }
};
