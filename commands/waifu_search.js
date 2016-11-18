let S = require('string');

let db = require('../lib/db');
let lang = require('../lib/lang');

module.exports = {
    label: 'search',
    enabled: true,
    isSubcommand: true,
    generator: (msg, args)=> {
        db.models.Character.findAll({
            where: {
                type: 'waifu',
                name: {$like: '%' + S(args.join(' ').trim()).replaceAll('*', '%').s + '%'}
            }
        }).then((waifus)=> {
            msg.channel.createMessage(lang.computeResponse(msg, 'waifu.search.default', {
                waifus: waifus.map(waifu=> {
                    return lang.computeResponse(msg, 'waifu.search.format', {
                        waifu: lang.computeResponse(msg, 'waifu.format', {
                            name: waifu.name,
                            origin: waifu.source
                        }, true),
                        id: waifu.id
                    },true)
                })
            }))
        });
    },
    options: {
        deleteCommand: true,
        caseInsensitive: true
    }
};