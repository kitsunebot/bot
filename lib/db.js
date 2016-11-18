let DB = require('db');
let story = require('storyboard').mainStory;
let moment = require('moment');
let Cron = require('cron').CronJob;

let eris = require('./client');
let config = require('../config');

let db = new DB(config.db);

/*db.on('sqllog', (toLog)=> {
    story.debug('SQL', toLog)
});*/

module.exports = db;

new Cron('0 */10 * * * *', ()=> {
    db.redis.hset('stats', 'users', eris.users.map((u=> {
            return u
        })).length || 0);
    db.redis.hset('stats', 'channels', eris.privateChannels.map((c)=> {
            return c
        }).length + function () {
            let i = 0;
            for (let o in eris.channelGuildMap) {
                if (eris.channelGuildMap[o])i = i + 1
            }
            return i;
        }() || 0);
}, null, true);