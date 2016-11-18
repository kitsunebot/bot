let story = require('storyboard').mainStory;
let Promise = require('bluebird');

let db = require('../lib/db');
let fcache = require('../lib/cache');

module.exports = {
    event: 'guildCreate',
    enabled: false,
    handler: guild=> {
        story.debug('guildCreate', '[' + guild.shard.id + ']' + guild.name + '[' + guild.id + ']');
        guild.fetchAllMembers();
        db.models.Guild.findOrCreate({
            where: {gid: guild.id},
            defaults: {
                gid: guild.id,
                name: guild.name,
                region: guild.region,
                avability: true,
                shard_id: guild.shard.id
            }
        }).spread((dbguild, created)=> {
            if (created) return dbguild.addPrefix('!fb ').then(()=> {
                return Promise.resolve(dbguild)
            });
            else return dbguild.update({
                gid: guild.id,
                name: guild.name,
                region: guild.region,
                avability: true,
                shard_id: guild.shard.id
            });
        }).then(guild=> {
            fcache.loadGuild(guild.id);
            return guild;
        }).then(dbguild=>guild.getMember(guild.ownerID).then(member=>db.models.User.findOrCreate({
            where: {uid: member.id}, defaults: {
                uid: member.id,
                username: member.user.username,
                discriminator: member.user.discriminator,
                status: member.status
            }
        })).spread(owner=>dbguild.setOwner(owner).then(()=>Promise.resolve(dbguild)))).then(dbguild=>Promise.all(guild.channels.map(channel=> db.models.Channel.findOrCreate({
                where: {cid: channel.id},
                defaults: {
                    cid: channel.id,
                    name: channel.name,
                    description: channel.topic,
                    type: channel.type
                }
            }).spread(channel=>channel.setGuild(dbguild))
        ))).then(()=>db.models.Guild.find({where: {gid: guild.id}})).then((dbguild)=>Promise.all(guild.members.map((member)=> {
            return db.models.User.upsert({
                uid: member.id,
                username: member.user.username,
                discriminator: member.user.discriminator,
                status: member.status
            }).then(()=>dbguild.addMember(member.id));
        })));
    }
};