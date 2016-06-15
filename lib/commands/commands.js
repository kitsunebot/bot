var utils = require('../utils');

module.exports = {
    _id: 19,
    main_cmd: 'commands',
    alias: ['cmds'],
    min_perm: 0,
    args: '[none]',
    allow_disable: false,
    handlers: {
        server: function (msg) {
            utils.messages.sendMessage(msg.channel, 'commandslist._list_sent', {username: msg.author.name});
            utils.users.sendCommandList(msg.author);
            msg.delete();
        },
        dm: function (msg) {
            utils.users.sendCommandList(msg.author);
        }
    }
};