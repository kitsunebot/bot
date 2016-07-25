var Redis = require('ioredis');
var config = require('../config');

var redis = new Redis(config.redis);

module.exports = redis;

var eris = require('../lib/client');
var Cron = require('cron').CronJob;
var moment = require('moment');
var db = require('./sql_db');

new Cron('0 */10 * * * *', ()=> {
    redis.hset('stats', 'guilds', eris.guilds.map((g)=> {
            return g
        }).length || 0);
    redis.hset('stats', 'users', eris.users.map((u=> {
            return u
        })).length || 0);
    redis.hset('stats', 'channels', eris.privateChannels.map((c)=> {
            return c
        }).length + function () {
            var i = 0;
            for (var o in eris.channelGuildMap) {
                if (eris.channelGuildMap[o])i = i + 1
            }
            return i;
        }() || 0);
    db.models.Message.count({where: {created_at: {$gt: moment().subtract(1, 'minutes').toDate()}}}).then(function (count) {
        redis.hset('stats', 'mpm', count || 0)
    });
}, null, true);