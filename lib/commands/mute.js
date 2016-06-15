var utils = require('../utils');

module.exports = {
    _id: 17,
    main_cmd: 'mute',
    alias: [],
    min_perm: 0,
    args: '(@user)',
    allow_disable: true,
    handlers: {
        server: function (msg) {
            if (msg.channel.permissionsOf(msg.author).serialise().manageMessages) {
                if (msg.mentions.length === 1) {
                    msg.server.setMuted(msg.mentions[0], true, function () {
                        msg.server.sendToModLog({
                            key: 'modlog.muted',
                            replacer: {username: msg.mentions[0].username, mod: msg.author.username}
                        });
                    });
                } else utils.messages.sendReply(msg, {key: 'wrong_argument', replacer: {args: '(@user)'}});
            } else utils.messages.sendReply(msg, 'not_allowed');
            msg.delete();
        }
    }
};