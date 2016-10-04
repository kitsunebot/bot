var DB = require('db');
var story = require('storyboard').mainStory;
var moment = require('moment');
var Cron = require('cron').CronJob;

var eris = require('./client');
var config = require('../config');

var db = new DB(config.db);

db.on('sqllog', (toLog)=> {
    story.debug('SQL', toLog)
});

module.exports = db;

new Cron('0 */10 * * * *', ()=> {
    db.redis.hset('stats', 'users', eris.users.map((u=> {
            return u
        })).length || 0);
    db.redis.hset('stats', 'channels', eris.privateChannels.map((c)=> {
            return c
        }).length + function () {
            var i = 0;
            for (var o in eris.channelGuildMap) {
                if (eris.channelGuildMap[o])i = i + 1
            }
            return i;
        }() || 0);
}, null, true);