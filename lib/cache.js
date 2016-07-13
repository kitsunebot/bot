var Promise = require('bluebird');
var CronJob = require('cron').CronJob;
var moment = require('moment');

var Guild = require('../objects/Guild');
var config = require('../config');

var cache = {
    guilds: {},
    guildlanguages: {},
    userlanguages: {}
};

var expireCron = new CronJob('0 */10 * * * *', function () {
    var e = moment().subtract(config.options.cache.expire.amount, config.options.cache.expire.scale);
    for (var i in cache.guilds) {
        cache.guilds[i].then((guild)=> {
            if (guild.lastAccessed.isBefore(e)) delete cache.guilds[i];
        });
    }
}, null, true);

var exprt = {
    getGuild: (gid)=> {
        if (cache.guilds[gid] !== undefined) return cache.guilds[gid];
        else {
            cache.guilds[gid] = new Promise((resolve, reject)=> {
                var g = new Guild(gid, (err)=> {
                    if (!err) {
                        resolve(g);
                    }
                    else {
                        reject(err);
                        cache.guilds[gid] = undefined;
                    }
                });
            });
            return cache.guilds[gid];
        }
    },
    getGuildLanguage: (gid)=> {
        return cache.guildlanguages[gid] || config.languages.default;
    },
    setGuildLanguage: (gid, lang)=> {
        cache.guildlanguages[gid] = lang;
        return lang;
    },
    getUserLanguage: (uid)=> {
        return cache.userlanguages[uid] || config.languages.default;
    },
    setUserLanguage: (uid, lang)=> {
        cache.userlanguages[uid] = lang;
        return lang;
    }
};

module.exports = exprt;