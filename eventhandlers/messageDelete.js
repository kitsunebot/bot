var db = require('../lib/db');

module.exports = {
    event: 'messageDelete',
    enabled: true,
    handler: (msg)=> {
        db.models.Message.update({deleted: true}, {where: {mid: msg.id}});
    }
};