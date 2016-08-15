var lang = require('../lib/lang');
var config = require('../config');

module.exports = {
    label: 'help',
    enabled: true,
    generator: (msg, args)=> {
        return lang.computeResponse(msg, 'help', {
            mention: (msg.channel.guild ? (msg.channel.guild.members.find(member=> {
                return member.id === config.owner.id
            }) ? msg.channel.guild.members.find(member=> {
                return member.id === config.owner.id
            }).mention : config.owner.name) : config.owner.name)
        });
    },
    options: {
        caseInsensitive: true,
        deleteCommand: true
    }
};