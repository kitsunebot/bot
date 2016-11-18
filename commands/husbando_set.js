let shortid = require('shortid');

let db = require('../lib/db');
let lang = require('../lib/lang');

module.exports = {
    label: 'set',
    isSubcommand: true,
    enabled: true,
    generator: (msg, args)=> {
        let arg = args.join(' ').trim();
        let query = {type: 'husbando'};
        if (shortid.isValid(arg)) query.id = arg;
        else query.name = arg;
        db.models.Character.find({where: query}).then((husbando)=> {
            if (husbando !== undefined && husbando !== null) {
                db.models.User.find({where: {uid: msg.author.id}}).then((user)=> {
                    user.setHusbando(husbando).then(()=> {
                        msg.channel.createMessage(lang.computeResponse(msg, 'husbando.set.default', {
                            w_name: husbando.name,
                            w_id: husbando.id
                        }));
                    });
                });
            } else msg.channel.createMessage(lang.computeResponse(msg, 'husbando.set.not_found', {query: arg}));
        })
    },
    options: {
        caseInsensitive: true,
        deleteCommand: true
    }
};