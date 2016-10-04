var db = require('../lib/db');
var lang = require('../lib/lang');
var eris = require('../lib/client');
var fcache = require('../lib/cache');

module.exports = {
    label: 'confirm',
    enabled: true,
    isSubcommand: true,
    generator: (msg, args)=> {
        if (args.length === 1) {
            db.redis.exists(`broadcast:${args[0]}`).then(ex=> {
                if (ex === 1) {
                    db.redis.hgetall(`broadcast:${args[0]}`).then(br=> {
                        if (br.user_id === msg.author.id) {
                            msg.channel.createMessage(lang.computeResponse(msg, 'broadcast.send'));
                            fcache.getGuild(br.guild_id).getDbInstance().then(guild=> {
                                return guild.getUsers({where: {recieve_broadcasts: true}});
                            }).then(users=> {
                                users.forEach((user)=> {
                                    eris.getDMChannel(user.uid).then(ch=> {
                                        ch.createMessage(lang.computeLangString(user.uid, 'broadcast.msg', true, {
                                            msg: br.msg,
                                            sender: br.user_name,
                                            sender_guild: br.guild_name
                                        }));
                                    });
                                });
                            })
                        }
                    });
                }
            })
        } else return lang.computeResponse(msg, 'syntax_error')
    },
    options: {
        deleteCommand: true,
        caseInsensitive: true
    }
};