let db = require('../lib/db');
let lang = require('../lib/lang');

module.exports = {
    label: 'enable',
    isSubcommand: true,
    enabled: true,
    generator: (msg, args)=> {
        db.models.User.update({recieve_broadcasts: true}, {where: {uid: msg.author.id}}).then(()=> {
            mag.channel.createMessage(lang.computeResponse(msg, 'broadcast.enable'));
        });
    },
    options: {
        deleteCommand: true,
        caseInsensitive: true
    }
};
