var eris = require('../lib/client');
var db = require('../lib/db');

module.exports = {
    label: 'cat',
    enabled: true,
    isSubcommand: false,
    generator: (msg, args)=> {
        db.models.Pictures.find({where: {type: 'cat'}, order: 'RAND()'}).then(picture=> {
            eris.createMessage(msg.channel.id, picture.link);
        });
    },
    options: {
        deleteCommand: false,
        caseInsensitive: true,
        alias:['kitty','kitten']
    }
};