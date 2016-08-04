var Promise = require('bluebird');
var moment = require('moment');

var eris = require('../lib/client');
var db = require('../lib/db');
var lang = require('../lib/lang');
var cache = require('../lib/cache');

class Guild {
    constructor(gid, cb) {
        this.erisGuild = eris.guilds.find((g)=> {
            return g.id === gid
        });
        var that = this;
        that.id = gid;
        that.avability = !this.erisGuild.unavailable;
        that.lastAccessed = moment();
        db.models.Guild.find({where: {gid: gid}}).then(function (guild) {
            if (guild !== null && guild !== undefined) {
                that.name = guild.name;
                that.prefixes = [];
                that.language = guild.language;
                that.automod = guild.automod;
                that.mod_log = guild.mod_log;
                that.mute_role = guild.mute_role;
                that.roles = {};
                that.customCommands = {
                    enabled: guild.customtext_enabled,
                    prefix: guild.customtext_prefix
                };
                require('../lib/cache').setGuildLanguage(that.id, that.language);
                Promise.all([that.calculatePrefixes(Promise.resolve(guild)).then((pr)=> {
                    eris.registerGuildPrefix(that.id, pr);
                    return Promise.resolve()
                }), guild.getGuildRoles().then((roles)=> {
                    return Promise.all(roles.map((role)=> {
                        return role.getUser();
                    })).then(function (users) {
                        users.forEach((user, index)=> {
                            that.roles[user.uid] = roles[index].level;
                        });
                        return guild.getOwner();
                    }).then((owner)=> {
                        that.roles[owner.uid] = 6;
                        return db.models.User.findAll({where: {custom_role: {$gt: 0}}});
                    }).then(users=> {
                        users.forEach((user)=> {
                            if (that.roles[user.uid] < user.custom_role || that.roles[user.uid] === undefined) that.roles[user.uid] = user.custom_role;
                        });
                        return Promise.resolve();
                    });
                })]).then(()=> {
                    cb(null)
                });
            } else cb(new Error('guild not found'));
        });
    }

    getLangString(key) {
        this.accessed();
        return lang.resolve(this.language, key);
    }

    setLanguage(lang) {
        this.language = lang;
        require('../lib/cache').setGuildLanguage(this.id, this.language);
        return this.updateDbInstance({language: lang});
    }

    addPrefix(prefix) {
        this.accessed();
        var that = this;
        return db.models.Prefix.findOrCreate({where: {prefix: prefix}, defaults: {prefix: prefix}}).spread((prefix)=> {
            return prefix.addGuild(that.id).then(()=> {
                that.updateFromDb();
                return Promise.resolve();
            });
        });
    }

    removePrefix(prefix) {
        this.accessed();
        var that = this;
        return db.models.Prefix.find({where: {prefix: prefix}}).then((prefix)=> {
            if (prefix.allowDisable) return prefix.removeGuild(that.id).then(()=> {
                that.updateFromDb();
                return Promise.resolve(true);
            });
            else return Promise.resolve(false);
        });
    }

    getRole(uid) {
        return this.roles[uid] || 0;
    }

    getDbInstance() {
        this.accessed();
        return db.models.Guild.find({where: {gid: this.id}});
    }

    updateDbInstance(updates) {
        this.accessed();
        return this.getDbInstance().then((guild)=> {
            return guild.update(updates);
        })
    }

    updateValues(updates) {
        this.accessed();
        if (updates !== undefined) {
            for (var i in updates) {
                if (typeof updates[i] !== 'object' || Array.isArray(updates[i])) {
                    this[i] = updates[i];
                } else {
                    for (var o in updates[i]) {
                        this[i][o] = updates[i][o];
                    }
                }
            }
            this.writeToDb();
        } else this.updateFromDb();
    }

    calculatePrefixes(guild, register) {
        var that = this;
        guild = guild || this.getDbInstance();
        return guild.then((guild)=> {
            return guild.getPrefixes();
        }).then((prefixes)=> {
            that.prefixes = prefixes.map((prefix)=> {
                return prefix.prefix
            });
            if (register) eris.registerGuildPrefix(that.id, that.prefixes);
            return Promise.resolve(that.prefixes);
        })
    }

    writeToDb() {
        return this.updateDbInstance({name: this.name, avability: this.avability, region: this.region});
    }

    updateFromDb() {
        var that = this;
        return db.models.Guild.find({where: {gid: that.id}}).then(function (guild) {
            if (guild !== null && guild !== undefined) {
                that.name = guild.name;
                that.language = guild.language;
                that.automod = guild.automod;
                that.mod_log = guild.mod_log;
                that.mute_role = guild.mute_role;
                that.roles = {};
                that.customCommands = {
                    enabled: guild.customtext_enabled,
                    prefix: guild.customtext_prefix
                };
                require('../lib/cache').setGuildLanguage(that.id, that.language);
                Promise.all([that.calculatePrefixes(Promise.resolve(guild)).then((pr)=> {
                    eris.registerGuildPrefix(that.id, pr);
                    return Promise.resolve()
                }), guild.getGuildRoles().then((roles)=> {
                    return Promise.all(roles.map((role)=> {
                        return role.getUser();
                    })).then(function (users) {
                        users.forEach((user, index)=> {
                            that.roles[user.uid] = roles[index].level;
                        });
                        return guild.getOwner();
                    }).then((owner)=> {
                        that.roles[owner.uid] = 6;
                        return db.models.User.findAll({where: {custom_role: {$gt: 0}}});
                    }).then(users=> {
                        users.forEach((user)=> {
                            if (that.roles[user.uid] < user.custom_role || that.roles[user.uid] === undefined) that.roles[user.uid] = user.custom_role;
                        });
                        return Promise.resolve();
                    });
                })]);
            } else return Promise.reject('not found');
        });
    }

    accessed() {
        this.lastAccessed = moment();
    }

    updateFromPubSub(data){
        this.updateValues(data.updates);
    }

}

module.exports = Guild;