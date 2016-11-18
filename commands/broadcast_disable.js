let db = require('../lib/db');
let lang = require('../lib/lang');

module.exports = {
    label: 'disable',
    isSubcommand: true,
    enabled: true,
    generator: (msg, args)=> {
        db.models.User.update({recieve_broadcasts: false}, {where: {uid: msg.author.id}}).then(()=> {
            mag.channel.createMessage(lang.computeResponse(msg, 'broadcast.disable'));
        });
    },
    options: {
        deleteCommand: true,
        caseInsensitive: true
    }
};
