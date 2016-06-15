var utils = require('../utils');

module.exports = {
    _id: 2,
    min_perm: 0,
    main_cmd: 'info',
    alias: ['help'],
    args: '[none]',
    allow_disable: false,
    handlers: {
        default: function (msg) {
            utils.messages.sendMessage(msg.channel, 'info', {username: msg.author.name});
            msg.delete();
        }
    }
};