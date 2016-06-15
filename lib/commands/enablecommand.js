var _ = require('underscore');

var utils = require('../utils');
var commands = require('../commands');

module.exports = {
    _id: 25,
    main_cmd: 'enablecommand',
    alias: ['enablecommands'],
    min_perm: 3,
    args: '(commands)',
    allow_disable: false,
    handlers: {
        server: function (msg) {
            var split = msg.cleanContent.trim().split(' ');
            if (split.length > 1) {
                var notEnabled = [];
                var enabled = [];
                _.rest(split).forEach(function (cmd) {
                    if (commands[cmd] !== undefined) {
                        msg.server.enableCommand(commands[cmd]);
                        enabled.push(cmd);
                    } else notEnabled.push(cmd);
                });
                utils.messages.sendMessage(msg.channel, {
                    key: 'commands.enabled', replacer: {
                        enabled: (enabled.length > 0 ? '`' + enabled.join('` `') + '`' : ''),
                        not_found: (notEnabled.length > 0 ? '`' + notEnabled.join('` `') + '`' : '')
                    }
                }, {username: msg.author.name});
            } else {
                //todo args
            }
            msg.delete();
        }
    }
};