var S = require('string');
var _ = require('underscore');

var db = require('../lib/db');
var lang = require('../lib/lang');

module.exports = {
    label: 'list',
    enabled: true,
    isSubcommand: true,
    generator: (msg, args)=> {
        db.models.Character.findAll({where: {type: 'waifu'}}).then(function (waifus) {
            waifus = waifus.map((waifu)=> {
                return lang.computeResponse(msg, 'waifu.list.format', {
                    name: waifu.name,
                    source: waifu.source,
                    id: waifu.id
                }, true)
            });

            var separator = lang.computeResponse(msg, 'waifu.list.separator', {}, true);
            var out = [lang.computeResponse(msg,'waifu.list.default',{})];
            compute(0, 0);

            function compute(windex, sendindex) {
                var r = out[sendindex] + waifus[windex] + separator;
                if (r.length < 1997) {
                    out[sendindex] = r;
                    next();
                }
                else {
                    out[sendindex] = out[sendindex] + lang.computeResponse(msg, 'waifu.list.list_end', {}, true) + waifus[windex] + separator;
                    sendindex = sendindex + 1;
                    out[sendindex] = out[sendindex] + lang.computeResponse(msg, 'waifu.list.if_over_start', {}, true);
                    next();
                }

                function next() {
                    if (windex - 1 === waifus.length) {
                        out[sendindex] = out[sendindex] + lang.computeResponse(msg, 'waifu.list.list_end', {}, true);
                        var s = _.rest(out);
                        send(out[0], s);
                    } else compute(windex + 1, sendindex);
                }
            }


            function send(list, appends) {
                msg.channel.createMessage(list);
                appends.forEach((append)=> {
                    msg.channel.createMessage( append);
                });
            }
        });
        return false;
    }
};