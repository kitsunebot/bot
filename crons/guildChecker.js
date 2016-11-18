let CronJob = require('cron').CronJob;
let eris = require('../lib/client');
let db = require('../lib/db');

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