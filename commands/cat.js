var db = require('../lib/db');

module.exports = {
    label: 'cat',
    enabled: true,
    isSubcommand: false,
    generator: (msg, args)=> {
        db.models.Picture.find({where: {type: 'cat'}, order: 'RAND()'}).then(picture=> {
            msg.channel.createMessage( picture.link);
        });
    },
    options: {
        deleteCommand: false,
        caseInsensitive: true,
        alias:['kitty','kitten']
    }
};