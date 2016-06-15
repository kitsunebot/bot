var utils = require('../utils');

module.exports = {
    _id: 1,
    min_perm: 5,
    main_cmd: 'ping',
    alias: [],
    args: '[none]',
    allow_disable: true,
    handlers: {
        default: function (msg) {
            utils.messages.sendMessage(msg.channel, 'ping', {username: msg.author.name});
            msg.delete();
        }
    }
};