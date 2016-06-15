var utils = require('../utils');

module.exports = {
    _id: 6,
    main_cmd: 'whoami',
    alias: [],
    min_perm: 0,
    args: '[none]',
    allow_disable: true,
    handlers: {
        server: function (msg) {
            utils.messages.sendMessage(msg.channel, {
                key: 'whoami', replacer: {
                    username: msg.author.username,
                    uid: msg.author.id,
                    status: msg.author.status,
                    avatar: msg.author.avatarURL
                }
            }, {username: msg.author.name});
            msg.delete();
        }
    }
};