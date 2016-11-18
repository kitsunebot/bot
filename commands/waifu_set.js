let shortid = require('shortid');

let db = require('../lib/db');
let lang = require('../lib/lang');

module.exports = {
    label: 'set',
    isSubcommand: true,
    enabled: true,
    generator: (msg, args)=> {
        let arg = args.join(' ').trim();
        let query = {type: 'waifu'};
        if (shortid.isValid(arg)) query.id = arg;
        else query.name = arg;
        db.models.Character.find({where: query}).then((waifu)=> {
            if (waifu !== undefined && waifu !== null) {
                db.models.User.find({where: {uid: msg.author.id}}).then((user)=> {
                    user.setWaifu(waifu).then(()=> {
                        msg.channel.createMessage(lang.computeResponse(msg, 'waifu.set.default', {
                            w_name: waifu.name,
                            w_id: waifu.id
                        }));
                    });
                });
            } else msg.channel.createMessage(lang.computeResponse(msg, 'waifu.set.not_found', {query: arg}));
        })
    },
    options: {
        caseInsensitive: true,
        deleteCommand: true
    }
};