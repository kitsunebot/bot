var db = require('../lib/db');

module.exports = {
    label: 'catgirl',
    enabled: true,
    isSubcommand: false,
    generator: (msg)=> {
        db.models.CharacterPicture.find({
            order: 'RAND()', include: [
                {model: db.models.Character, where: {name: 'Catgirl'}}
            ]
        }).then(pic=>msg.channel.createMessage(pic.link));
    },
    options: {
        deleteCommand: false,
        caseInsensitive: true,
        alias: ['neko']
    },
    subcommands: [require('./catgirl_add')]
};