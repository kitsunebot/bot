let db = require('../lib/db');
let lang = require('../lib/lang');
let fcache = require('../lib/cache');

let shortid = require('shortid');

module.exports = {
    label: 'broadcast',
    enabled: true,
    isSubcommand: false,
    generator: (msg, args)=> {
        if (msg.channel.guild) {
            let guild = fcache.getGuild(msg.channel.guild.id);
            if (guild.getRole(msg.author.id) > 2) {
                let confirm = shortid.generate();
                db.redis.hset(`broadcast:${confirm}`, 'guild_id', msg.channel.guild.id).then(()=> {
                    return db.redis.expire(`broadcast:${confirm}`, 600);
                }).then(()=> {
                    return db.redis.hset(`broadcast:${confirm}`, 'guild_name', msg.channel.guild.name);
                }).then(()=> {
                    return db.redis.hset(`broadcast:${confirm}`, 'user_id', msg.author.id);
                }).then(()=> {
                    return db.redis.hset(`broadcast:${confirm}`, 'user_name', msg.author.username);
                }).then(()=> {
                    return db.redis.hset(`broadcast:${confirm}`, 'msg', args.join(' ').trim());
                }).then(()=> {
                    return msg.channel.createMessage(lang.computeResponse(msg, 'broadcast.create', {confirm: confirm}));
                });
                return null;
            } else return lang.computeResponse(msg, 'no_permission', {required: 3, have: guild.getRole(msg.author.id)});
        }
    },
    options: {
        deleteCommand: true,
        caseInsensitive: true
    },
    subcommands: [require('./broadcast_confirm'), require('./broadcast_enable'), require('./broadcast_disable')]
};