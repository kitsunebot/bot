var S = require('string');

var db = require('../db/sql_db');
var lang = require('../lib/lang');
var eris = require('../lib/client');

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
            eris.createMessage(msg.channel.id, lang.computeResponse(msg, 'waifu.search.default', {
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