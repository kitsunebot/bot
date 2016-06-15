var utils = require('../utils');

module.exports = {
    _id: 3,
    min_perm: 0,
    main_cmd: 'invite',
    alias: ['joinserver', 'join-server', 'oauth'],
    args: '[none]',
    allow_disable: true,
    handlers: {
        server: function (msg) {
            utils.messages.sendReply(msg, 'invite.check_dm');
            msg.delete();
        },
        dm: function (msg) {
            utils.messages.sendMessage(msg.channel, 'invite.default');
        }
    }
};