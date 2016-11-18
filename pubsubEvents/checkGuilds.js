let eris = require('../lib/client');
let db = require('../lib/db');

/** @namespace eris.guilds */
module.exports = {
    event: 'checkGuilds',
    enabled: true,
    handler: ()=>eris.guilds.map(guild=>db.models.Guild.update({online: true}, {where: {gid: guild.id}}))
};