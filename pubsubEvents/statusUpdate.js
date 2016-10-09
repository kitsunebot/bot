var eris = require('../lib/client');
var db = require('../lib/db');

module.exports = {
    event: 'statusUpdate',
    enabled: true,
    handler: (update)=> {
        if (update.mode === 'manual') eris.editStatus('online', {name: update.status});
        else {
            db.models.StatusMessage.find({order: 'RAND()'}).then(msg=> {
                eris.editStatus('online', {name: msg.message});
            })
        }
    }
}
;