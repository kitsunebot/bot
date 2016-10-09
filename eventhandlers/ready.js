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
        eris.editStatus('online', {name: 'Initializing...'});
        Promise.all(eris.users.map((user)=> {
            return db.models.User.upsert({uid: user.id, username: user.username, discriminator: user.discriminator});
        })).then(()=> {
            return Promise.all(eris.guilds.map((eguild) => {
                return db.models.Guild.findOrCreate({
                    where: {gid: eguild.id},
                    defaults: {gid: eguild.id, name: eguild.name, region: eguild.region, shard_id: eguild.shard.id}
                }).spread((guild, created) => {
                    if (!created) {
                        return guild.update({
                            name: eguild.name,
                            region: eguild.region,
                            shard_id: eguild.shard.id
                        }).then(()=> {
                            return guild.addPrefix('!fb ').then(()=> {
                                return guild
                            });
                        });
                    } else {
                        return guild.addPrefix('!fb ').then(()=> {
                            return guild
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
                        return Promise.all(eguild.members.map((member=> {
                            return guild.addUser(member.id);
                        })));
                    }).then(()=> {
                        cache.loadGuild(eguild.id);
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
                                type: channel.type === '0' ? 'text' : 'voice'
                            }
                        }).spread(gchannel=> {
                            return gchannel.update({
                                name: channel.name,
                                description: channel.topic,
                                type: channel.type === '0' ? 'text' : 'voice'
                            }).then(()=> {
                                return gchannel.setGuild(guild)
                            })
                        });
                    }));
                });
            }));
        }).then(()=> {
            story.info('SQL', 'Database initialized');
            process.env.bot_ready = true;
            return db.redis.get('fixedStatus');
        }).then((st)=> {
            if (st === '1') {
                return db.redis.get('fixedStatus:status').then((status)=> {
                    return eris.editStatus('online', {name: status});
                });
            } else {
                db.sendSelf('statusUpdate');
                return Promise.resolve();
            }
        }).catch((err)=> {
            story.error('SQL', 'Error while initializing SQL DB', {attach: err});
        })
    }
};