let db = require('../lib/db');
let lang = require('../lib/lang');

module.exports = {
    label: 'remove',
    enabled: false,
    isSubcommand: true,
    generator: (msg, args)=> {
        if (args.length === 0 || args.length > 1)return lang.computeResponse(msg, 'twitch.supply_channel');
        db.models.TwitchChannel.find({where: {channl: args[0]}}).then(c=> {
            if (c !== null && c !== undefined) {
                return c.getTwitchWatchers({
                    where: {
                        server_channel: msg.channel.id
                    }
                }).then(watcher=> {
                    return watcher.destroy();
                }).then(()=> {
                    return msg.channel.createMessage(lang.computeResponse(msg, 'twitch.remove'));
                })
            } else return msg.channel.createMessage(lang.computeResponse(msg, 'twitch.supply_channel'));
        })
    },
    options: {
        caseInsensitive: true,
        deleteCommand: true,
        guildOnly: true
    }
};