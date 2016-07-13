var db = require('../db/sql_db');

module.exports = {
    event: 'messageDelete',
    enabled: true,
    handler: (msg)=> {
        db.models.Message.update({deleted: true}, {where: {mid: msg.id}});
    }
};