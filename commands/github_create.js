var db = require('../lib/db');
var lang = require('../lib/lang');
var fcache = require('../lib/cache');

var shortid = require('shortid');
var Promise = require('bluebird');

module.exports = {
    label: 'create',
    enabled: true,
    isSubcommand: true,
    generator: (msg, args)=> {
        var guild = fcache.getGuild(msg.channel.guild.id);
        if (guild.getRole(msg.author.id) > 1) {
            db.models.Channel.find({where: {cid: msg.channel.id}}).then(ch=> {
                return ch.getVCSFeed().then(feed=> {
                    if (feed !== null && feed !== undefined) {
                        return Promise.resolve([feed, true]);
                    } else {
                        return ch.createGithubFeed({id: shortid.generate()}).then(feed=> {
                            return Promise.resolve([feed, false])
                        });
                    }
                });
            }).spread((feed, isNew)=> {
                return msg.channel.createMessage(lang.computeResponse(msg, `github._${!isNew ? 'created' : 'already'}`, {fid: feed.id}));
            })
        } else return lang.computeResponse(msg, 'no_permission', {required: 2, have: guild.getRole(msg.author.id)});
    },
    options: {
        deleteCommand: true,
        caseInsensitive: true,
        guildOnly: true
    }
};