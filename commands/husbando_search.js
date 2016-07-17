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
                type: 'husbando',
                name: {$like: '%' + S(args.join(' ').trim()).replaceAll('*', '%').s + '%'}
            }
        }).then((husbandos)=> {
            eris.createMessage(msg.channel.id, lang.computeResponse(msg, 'husbando.search.default', {
                husbandos: husbandos.map(husbando=> {
                    return lang.computeResponse(msg, 'husbando.search.format', {
                        husbando: lang.computeResponse(msg, 'husbando.format', {
                            name: husbando.name,
                            origin: husbando.source
                        }, true),
                        id: husbando.id
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