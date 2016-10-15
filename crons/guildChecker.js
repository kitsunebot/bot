var CronJob = require('cron').CronJob;
var eris = require('../lib/client');
var db = require('../lib/db');

module.exports = {
    enabled: true,
    name: 'guildChecker',
    job: new CronJob('0 */10 * * * *', ()=> {
        db.models.Guild.update({online: false}, {where: {online: true}}).then(()=> {
            setTimeout(()=> {
                eris.guilds.map(guild=>db.models.Guild.update({online: true}, {where: {gid: guild.id}}))
            }, 20000);
        });
    })
};