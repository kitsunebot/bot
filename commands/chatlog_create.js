let lang = require('../lib/lang');
let db = require('../lib/db');
let eris = require('../lib/client');

let Promise = require('bluebird');
let shortid = require('shortid');

module.exports = {
    label: 'create',
    enabled: true,
    isSubcommand: true,
    generator: (msg, args)=> {
        let c = (!isNaN(parseInt(args[0])) ? parseInt(args[0]) : 5);
        eris.getMessages(msg.channel.id, c + 1, msg.channel.lastMessageID).then(messages=> {
            db.models.ChatLog.create({id: shortid.generate()}).then(cl=> {
                return Promise.join(cl.setGuild(msg.channel.guild.id), cl.setUser(msg.author.id), cl.setChannel(msg.channel.id)).then(()=> {
                    return Promise.all(messages.map(lmsg=> {
                        return db.models.ChatLogMessage.create({
                            mid: lmsg.id,
                            content: lmsg.content,
                            create_content: lmsg.content,
                            timestamp: lmsg.timestamp
                        }).then(mg=> {
                            return mg.setUser(lmsg.author.id).then(()=> {
                                return cl.addChatLogMessage(mg);
                            });
                        });
                    }));
                }).then(()=> {
                    return msg.channel.createMessage(lang.computeResponse(msg, 'chatlog.create', {cl_id: cl.id}));
                });
            });
        });
    },
    options: {
        deleteCommand: true,
        caseInsensitive: true,
        guildOnly: true
    }
};