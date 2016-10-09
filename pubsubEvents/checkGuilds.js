var eris = require('../lib/client');

module.exports = {
    event: 'checkGuilds',
    enabled: true,
    handler: ()=>eris.guilds.map(guild=>db.models.Guild.update({online: true}, {where: {gid: guild.id}}))
}
;