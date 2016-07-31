var story = require('storyboard').mainStory;
var Promise = require('bluebird');

var eris = require('../lib/client');
var db = require('../lib/db');
var cache = require('../lib/cache');

module.exports = {
    event: 'ready',
    enabled: true,
    handler: ()=> {
        story.info('Shards are ready to operate.');
        Promise.all(eris.users.map((user)=> {
            return db.models.User.upsert({uid: user.id, username: user.username, discriminator: user.discriminator});
        })).then(()=> {
            return Promise.all(eris.guilds.map((eguild) => {
                return db.models.Guild.findOrCreate({
                    where: {gid: eguild.id},
                    defaults: {gid: eguild.id, name: eguild.name, region: eguild.region, shard_id: eguild.shard.id}
                }).spread((guild, created) => {
                    if (!created) {
                        return guild.update({name: eguild.name, region: eguild.region, shard_id: eguild.shard.id})
                    } else {
                        return db.models.Prefix.findAll({where: {$or: [{prefix: '!fb'}, {prefix: '!fb '}]}}).then((prefixes)=> {
                            return Promise.all(prefixes.map((prefix)=> {
                                return prefix.addGuild(guild.uid)
                            })).then(()=> {
                                return Promise.resolve(guild);
                            });
                        });
                    }
                }).then((guild)=> {
                    var owner = eris.users.find((user)=> {
                        return user.id === eguild.ownerID
                    });
                    return db.models.User.findOrCreate({
                        where: {uid: eguild.ownerID},
                        defaults: {uid: eguild.ownerID, username: owner.username, discriminator: owner.discriminator}
                    }).spread((user)=> {
                        return guild.setOwner(user);
                    }).then(()=> {
                        cache.getGuild(eguild.id);
                        return Promise.resolve(guild);
                    });
                }).then((guild)=> {
                    var perm = eguild.members.find((member)=> {
                        return member.user.id === eris.user.id
                    }).permission;
                    return guild.update({
                        permission: JSON.stringify([perm.json, {allow: perm.allow, deny: perm.deny}])
                    });
                }).then(guild=> {
                    return Promise.all(eguild.channels.map(channel=> {
                        return db.models.Channel.findOrCreate({
                            where: {cid: channel.id},
                            defaults: {
                                cid: channel.id,
                                name: channel.name,
                                description: channel.topic,
                                type: channel.type
                            }
                        }).spread(channel=> {
                            return channel.setGuild(guild)
                        });
                    }));
                });
            }));
        }).then(()=> {
            story.info('SQL', 'Database initialized');
            eris.editGame({name: 'DEBUG MODE'});
        }).catch((err)=> {
            story.error('SQL', 'Error while initializing SQL DB', {attach: err});
        })
    }
};