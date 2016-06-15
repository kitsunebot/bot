var _ = require('underscore');

var utils = require('../utils');
var commands = require('../commands');

module.exports = {
    _id: 25,
    main_cmd: 'disablecommand',
    alias: ['disablecommands'],
    min_perm: 3,
    args: '(commands)',
    allow_disable: false,
    handlers: {
        server: function (msg) {
            var split = msg.cleanContent.trim().split(' ');
            if (split.length > 1) {
                var notDisabled = [];
                var notAllowed = [];
                var disabled = [];
                _.rest(split).forEach(function (cmd) {
                    if (commands[cmd] !== undefined) {
                        if (commands[cmd].allow_disable) {
                            msg.server.disableCommand(commands[cmd]);
                            disabled.push(cmd);
                        } else notAllowed.push(cmd)
                    } else notDisabled.push(cmd);
                });
                utils.messages.sendMessage(msg.channel, {
                    key: 'commands.disabled', replacer: {
                        disabled: (disabled.length > 0 ? '`' + disabled.join('` `') + '`' : ''),
                        not_allowed: (notAllowed.length > 0 ? '`' + notAllowed.join('` `') + '`' : ''),
                        not_found: (notDisabled.length > 0 ? '`' + notDisabled.join('` `') + '`' : '')
                    }
                }, {username: msg.author.name});
            } else {
                //todo args
            }
            msg.delete();
        }
    }
};