var db = require('../lib/db');

module.exports = {
    event: 'messageUpdate',
    enabled: true,
    handler: (msg)=> {
        db.models.Message.update({edited: true, content: msg.content}, {where: {mid: msg.id}});
    }
};