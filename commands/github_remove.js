var db = require('../lib/db');
var lang = require('../lib/lang');
var fcache = require('../lib/cache');
var eris = require('../lib/client');

module.exports = {
    label: 'remove',
    enabled: true,
    isSubcommand: true,
    generator: (msg, args)=> {
        var guild = fcache.getGuild(msg.channel.guild.id);
        if (guild.getRole(msg.author.id) > 2) {
            db.models.Channel.find({where: {cid: msg.channel.id}}).then(ch=> {
                return ch.getGitHubFeed().then(feed=>{
                   return feed.destroy();
                }).then(()=>{
                    return eris.createMessage(msg.channel.id,lang.computeResponse(msg,'github._removed'));
                });
            })
        } else return lang.computeResponse(msg, 'no_permission', {required: 3, have: guild.getRole(msg.author.id)});
    },
    options: {
        deleteCommand: true,
        caseInsensitive: true,
        serverOnly: true
    }
};