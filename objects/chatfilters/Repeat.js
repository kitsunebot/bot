let Promise = require('bluebird');

let db = require('../../lib/db'),
    ChatfilterBase = require('./index');

class Repeat extends ChatfilterBase {
    constructor(config, guild) {
        super(config, guild);
        this.id = 'Repeat';
    }

    check(msg) {
        return new Promise((resolve, reject) => {
            db.redis.get(`spamfilter:${msg.guild.id}:${msg.channel.id}:${msg.author.id}:lastMsg`).then(m => {
                if (m === msg.content) reject(this.id);
                else return db.redis.multi()
                    .set(`spamfilter:${msg.guild.id}:${msg.channel.id}:${msg.author.id}:lastMsg`, msg.content)
                    .expire(`spamfilter:${msg.guild.id}:${msg.channel.id}:${msg.author.id}:lastMsg`, this.config.timeout)
                    .exec();
            }).catch(() => resolve())
        });
    }
}