let Limiter = require('rolling-rate-limiter'),
    Redis = require('redis'),
    db = require('db'),
    Promise = require('bluebird'),
    Chatfilter = require('./index'),
    config = require('../../config'),
    fcache = require('../../lib/cache');

let redis = Redis.createClient(config.db.redis);

class Spam extends Chatfilter {
    constructor(config, guild) {
        super();
        this.config = config;
        this.limiter = Limiter({
            interval: config.interval || 60000,
            maxInInterval: config.max || 30,
            minDiffrence: config.diff,
            namespace: `limiter${guild.id}`,
            redis
        });
    }

    check(msg) {
        return new Promise((resolve, reject) => {
            if (fcache.getUserPerm(msg) > 0)return resolve();
            this.limiter(`${msg.channel.id}:${msg.author.id}`, (err, wait) => {
                if (err) return resolve();
                else if (wait) reject({name: this.id, wait});
            });
        });
    }

}