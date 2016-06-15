var utils = require('../utils');

module.exports = {
    _id: 7,
    main_cmd: 'whois',
    alias: [],
    min_perm: 0,
    args: '(@user)',
    allow_disable: true,
    handlers: {
        server: function (msg) {
            if (msg.mentions.length === 1) {
                msg.mentions.forEach(function (user) {
                    utils.messages.sendMessage(msg.channel, {
                        key: 'whois', replacer: {
                            username: user.username,
                            uid: user.id,
                            status: user.status,
                            avatar: user.avatarURL
                        }
                    }, {username: msg.author.name});
                });
            } else utils.messages.sendMessage(msg.channel, {
                key: 'wrong_argument',
                replacer: {args: '@username'}
            }, {username: msg.author.name});
            msg.delete();
        }
    }
};