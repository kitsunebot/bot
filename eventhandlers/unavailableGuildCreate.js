let story = require('storyboard').mainStory;

let db = require('../lib/db');
let fcache = require('../lib/cache');

module.exports = {
    event: 'unavailableGuildCreate',
    enabled: true,
    handler: (guild) => {
        story.debug('guildCreate', guild.name + '[' + guild.id + ']');
        db.models.Guild.findOrCreate({
            where: {gid: guild.id},
            defaults: {
                gid: guild.id,
                name: guild.name,
                region: guild.region,
                avability: false
            }
        }).spread((dbguild, created)=> {
            if (created) {
                return db.models.Prefix.findAll({where: {$or: [{prefix: '!fb'}, {prefix: '!fb '}]}}).then((prefixes)=> {
                    return Promise.all(prefixes.map((prefix)=> {
                        return prefix.addGuild(dbguild.uid)
                    })).then(()=> {
                        return Promise.resolve(dbguild);
                    });
                });
            } else {
                return dbguild.update({
                    gid: guild.id,
                    name: guild.name,
                    region: guild.region,
                    avability: false
                });
            }
        }).then((dbguild)=> {
            return dbguild.setOwner(guild.ownerID);
        }).then(()=>fcache.loadGuild(guild.id));
    }
};