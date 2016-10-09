var emitter = require('../lib/db');

module.exports = {
    event: 'restart',
    enabled: true,
    handler: (timeout)=> {
        timeout = timeout || 0;
        setTimeout(()=> {
            if (process.env.autorestart === 'true') process.exit(1);
            else {
                try {
                    var pm2 = require('pm2');
                    pm2.connect((err)=> {
                        if (!err)pm2.restart(process.env.pm_id)
                    });
                } catch (e) {
                    emitter.sendEvent('restartFail', e.message);
                }
            }
        }, timeout)
    }
};