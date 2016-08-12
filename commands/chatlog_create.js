var lang = require('../lib/lang');
var db = require('../lib/db');
var eris = require('../lib/client');

var Promise = require('bluebird');
var shortid = require('shortid');

module.exports = {
    label: 'create',
    enabled: true,
    isSubcommand: true,
    generator: (msg, args)=> {
        var c = (!isNaN(parseInt(args[0])) ? parseInt(args[0]) : 5);
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
                    return eris.createMessage(msg.channel.id, lang.computeResponse(msg, 'chatlog.create', {cl_id: cl.id}));
                });
            });
        });
    },
    options: {
        deleteCommand: true,
        caseInsensitive: true,
        serverOnly: true
    }
};