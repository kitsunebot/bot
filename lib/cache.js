var Promise = require('bluebird');

var Guild = require('../objects/Guild');
var config = require('../config');
var db = require('../lib/db');
var redis = require('../lib/db').redis;
var Collection = require('../objects/Collection');

class Cache {
    constructor() {
        this.guilds = new Collection(Guild);
        this.userlanguages = {};

        db.on('guildUpdate', (data)=> {
            if (this.guilds[data.gid] !== undefined)this.guilds[data.gid].updateFromPubSub(data);
        });
    }

    getGuild(gid) {
        return this.guilds.get(gid);
    }

    loadGuild(gid) {
        var that = this;
        var g = new Guild(gid, (err)=> {
            if (!err) that.guilds.add(g);
        });
    }

    getUserLanguage(uid) {
        return this.userlanguages[uid] || config.languages.default;
    }

    setUserLanguage(uid, lang) {
        this.userlanguages[uid] = lang;
        db.models.User.update({language: lang}, {where: {uid: uid}});
        return lang;
    }

    getGlobalUserPerm(uid) {
        return redis.hget('user:global:perm', uid).then((perm)=> {
            if (perm !== null) return Promise.resolve(perm);
            else return db.models.User.find({where: {uid: uid}}).then((user)=> {
                if (user !== null && user !== undefined) {
                    redis.hset('user:global:perm', uid, user.custom_role);
                    return Promise.resolve(user.custom_role);
                } else return Promise.reject('404');
            })
        });
    }
}

module.exports = new Cache();