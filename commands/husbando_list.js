var S = require('string');
var _ = require('underscore');

var db = require('../db/sql_db');
var lang = require('../lib/lang');
var eris = require('../lib/client');

module.exports = {
    label: 'list',
    enabled: true,
    isSubcommand: true,
    generator: (msg, args)=> {
        db.models.Character.findAll({where: {type: 'husbando'}}).then(function (husbandos) {
            husbandos = husbandos.map((husbando)=> {
                return lang.computeResponse(msg, 'husbando.list.format', {
                    name: husbando.name,
                    source: husbando.source,
                    id: husbando.id
                }, true)
            });

            var separator = lang.computeResponse(msg, 'husbando.list.separator', {}, true);
            var out = [lang.computeResponse(msg,'husbando.list.default',{})];
            compute(0, 0);

            function compute(windex, sendindex) {
                var r = out[sendindex] + husbandos[windex] + separator;
                if (r.length < 1997) {
                    out[sendindex] = r;
                    next();
                }
                else {
                    out[sendindex] = out[sendindex] + lang.computeResponse(msg, 'husbando.list.list_end', {}, true) + husbandos[windex] + separator;
                    sendindex = sendindex + 1;
                    out[sendindex] = out[sendindex] + lang.computeResponse(msg, 'husbando.list.if_over_start', {}, true);
                    next();
                }

                function next() {
                    if (windex - 1 === husbandos.length) {
                        out[sendindex] = out[sendindex] + lang.computeResponse(msg, 'husbando.list.list_end', {}, true);
                        var s = _.rest(out);
                        send(out[0], s);
                    } else compute(windex + 1, sendindex);
                }
            }


            function send(list, appends) {
                eris.createMessage(msg.channel.id, list);
                appends.forEach((append)=> {
                    eris.createMessage(msg.channel.id, append);
                });
            }
        });
        return false;
    }
};