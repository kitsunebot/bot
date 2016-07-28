var lang = require('../lib/lang');
var db = require('../db/sql_db');
var eris = require('../lib/client');

var Promise = require('bluebird');
var shortid = require('shortid');
var moment = require('moment');

module.exports = {
    label: 'create',
    enabled: true,
    isSubcommand: true,
    generator: (msg, args)=> {
        var c = (!isNaN(parseInt(args[0])) ? parseInt(args[0]) : 5);
        eris.getMessages(msg.channel.id, c + 1, msg.channel.lastMessageID).then(messages=> {
            db.models.ChatLog.create({id: shortid.generate()}).then(cl=> {
                Promise.all(messages.map(msg=> {
                    return db.models.ChatLogMessage.create({
                        mid: msg.id,
                        content: msg.content,
                        create_content: msg.content,
                        timestamp: msg.timestamp
                    }).then(mg=> {
                        return mg.setUser(msg.author.id).then(()=> {
                            cl.addChatLogMessage(mg);
                        });
                    });
                })).then(()=> {
                    eris.createMessage(msg.channel.id, lang.computeResponse(msg, 'chatlog.create', {cl_id: cl.id}));
                })
            });
        });
    },
    optiosn: {
        deleteCommand: true,
        caseInsensitive: true
    }
};