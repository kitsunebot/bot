var S = require('string');

var db = require('../db/sql_db');
var lang = require('../lib/lang');
var eris = require('../lib/client');

module.exports = {
    label: 'list',
    enabled: true,
    isSubcommand: true,
    generator: (msg, args)=> {
        db.models.Character.findAll({where:{type:'waifu'}}).then(function (waifus) {
            var list = S(waifus.map((waifu)=>{return lang.computeResponse(msg, 'waifu.list.format',{name:waifu.name,source:waifu.source,id:waifu.id})}).join(lang.computeResponse(msg,'waifu.list.separator'))).chompRight(lang.computeResponse(msg,'waifu.list.separator')).s;
            eris.createMessage(msg.channel.id,lang.computeResponse(msg,'waifu.list.default',{waifus:list}));
        });
        return false;
    }
};