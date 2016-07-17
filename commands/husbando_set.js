var shortid = require('shortid');

var db = require('../db/sql_db');
var lang = require('../lib/lang');
var eris = require('../lib/client');

module.exports = {
    label: 'set',
    isSubcommand: true,
    enabled: true,
    generator: (msg, args)=> {
        var arg = args.join(' ').trim();
        var query = {type: 'husbando'};
        if (shortid.isValid(arg)) query.id = arg;
        else query.name = arg;
        db.models.Character.find({where: query}).then((husbando)=> {
            if (husbando !== undefined && husbando !== null) {
                db.models.User.find({where: {uid: msg.author.id}}).then((user)=> {
                    user.setHusbando(husbando).then(()=> {
                        eris.createMessage(msg.channel.id, lang.computeResponse(msg, 'husbando.set.default', {
                            w_name: husbando.name,
                            w_id: husbando.id
                        }));
                    });
                });
            } else eris.createMessage(msg.channel.id, lang.computeResponse(msg, 'husbando.set.not_found', {query: arg}));
        })
    },
    options: {
        caseInsensitive: true,
        deleteCommand: true
    }
};