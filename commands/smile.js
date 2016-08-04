var eris = require('../lib/client');
var db = require('../lib/db');

module.exports = {
    label: 'smile',
    enabled: true,
    isSubcommand: false,
    generator: (msg, args)=> {
        db.models.Picture.find({where: {type: 'wtf'}, order: 'RAND()'}).then(picture=> {
            eris.createMessage(msg.channel.id, picture.link);
        });
    },
    options: {
        deleteCommand: false,
        caseInsensitive: true
    }
};