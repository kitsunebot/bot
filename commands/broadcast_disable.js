var db = require('../lib/db');
var lang = require('../lib/lang');
var eris = require('../lib/client');

module.exports = {
    label: 'disable',
    isSubcommand: true,
    enabled: true,
    generator: (msg,args)=> {
        db.models.User.update({recieve_broadcasts: false}, {where: {uid: msg.author.id}}).then(()=> {
            eris.createMessage(msg.channel.id, lang.computeResponse(msg, 'broadcast.disable'));
        });
    },
    options: {
        deleteCommand: true,
        caseInsensitive: true
    }
};
