var lang = require('../lib/lang');
var config = require('../config');

module.exports = {
    label: 'help',
    enabled: true,
    generator: (msg, args)=> {
        return lang.computeResponse(msg, 'help', {
            mention: function () {
                var m = msg.channel.guild.members.find(m=>m.id === config.owner.id);
                if (m)return m.mention;
                else return config.owner.name;
            }()
        });
    },
    options: {
        caseInsensitive: true,
        deleteCommand: true
    }
};