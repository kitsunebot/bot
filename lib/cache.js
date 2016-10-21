var Guild = require('../objects/Guild');
var config = require('../config');
var db = require('../lib/db');
var Collection = require('../objects/Collection');

class Cache {
    constructor() {
        this.guilds = new Collection(Guild);
        this.userlanguages = {};
        this.userPerms = {};

        db.on('guildUpdate', (data)=> {
            if (this.guilds[data.gid] !== undefined)this.guilds[data.gid].updateFromPubSub(data);
        });

        db.models.User.findAll({where: {custom_role: {$gt: 0}}}).then(users=> {
            for (var u of users) {
                this.userPerms[u.uid] = u.custom_role;
            }
        })
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
        return this.userPerms[uid];
    }

    getUserPerm(msg) {
        if (msg.guild)return this.getGuild(msg.guild.id).getRole(msg.author.id);
        else return this.getGlobalUserPerm(msg.author.id);
    }
}

module.exports = new Cache();