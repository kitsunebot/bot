let db = require('../lib/db');

module.exports = {
    label: 'cat',
    enabled: true,
    isSubcommand: false,
    generator: (msg, args)=> {
        return db.models.Picture.find({where: {type: 'cat'}, order: 'RAND()'}).then(picture=> {
            return picture.link;
        });
    },
    options: {
        deleteCommand: false,
        caseInsensitive: true,
        alias: ['kitty', 'kitten']
    }
};