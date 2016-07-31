var DB = require('db');
var story = require('storyboard').mainStory;
var moment = require('moment');
var Cron = require('cron').CronJob;

var eris = require('./client');
var config = require('../config');

var db = new DB(config.db);

module.exports = db;

var messageCron = new Cron('0 0 0,6,12,18 * * *', function () {
    db.models.Message.destroy({where: {created_at: {$lt: moment().subtract(3, 'days').toDate()}}}).then(function (msgs) {
        story.debug('SQL', 'Deleted ' + msgs + ' messages from the DB');
    });
}, null, true);

new Cron('0 */10 * * * *', ()=> {
    db.redis.hset('stats', 'guilds', eris.guilds.map((g)=> {
            return g
        }).length || 0);
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
    db.models.Message.count({where: {created_at: {$gt: moment().subtract(1, 'minutes').toDate()}}}).then(function (count) {
        db.redis.hset('stats', 'mpm', count || 0)
    });
}, null, true);