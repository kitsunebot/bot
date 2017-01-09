let eris = require('../lib/client');
let lang = require('../lib/lang');

module.exports = {
    label: 'whois',
    enabled: true,
    isSubcommand: false,
    generator: (msg, args) => {
        let user;
        if (msg.mentions.length > 0) user = msg.mentions[0];
        else if (args[0] && eris.users.get(args[0])) user = eris.users.get(args[0]);
        else user = msg.author;
        msg.channel.createEmbed()
            .setTitle('UserInfo')
            .setAuthor(user.nick || user.username, user.avatarURL)
            .setColor(msg.guild ? msg.guild.members.get(user.id) ? msg.guild.roles.get(msg.guild.members.get(user.id).roles[0] || msg.guild.id).color : 0 : 0)
            .addField('ID', user.id)
            .addField('Discriminator', user.discriminator)
            .send()
    },
    options: {
        deleteCommand: true,
        caseInsensitive: true,
        serverOnly: true
    }
};