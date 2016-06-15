var utils = require('../utils');

module.exports = {
    _id: 13,
    main_cmd: 'modlog',
    alias: [],
    min_perm: 3,
    args: '[none] | set | disable',
    allow_disable: false,
    handlers: {
        server: function (msg) {
            var split = msg.cleanContent.trim().split(' ');
            if (split.length === 1) {
                if (msg.server.options.modlog !== null) {
                    utils.messages.sendMessage(msg.channel, 'modlog.is_enabled', {username: msg.author.name});
                } else {
                    msg.server.setModLog(msg.channel.id, function () {
                        utils.messages.sendMessage(msg.channel, 'modlog.enabled', {username: msg.author.name});
                    });
                }
            } else if (split.length === 2) {
                if (split[1] === 'set') {
                    msg.server.setModLog(msg.channel.id, function () {
                        utils.messages.sendMessage(msg.channel, 'modlog.enabled', {username: msg.author.name});
                    });
                } else if (split[1] === 'disable') {
                    msg.server.setModLog(null, function () {
                        utils.messages.sendMessage(msg.channel, 'modlog.disabled', {username: msg.author.name});
                    });
                } else invalid();
            } else invalid();
            msg.delete();

            function invalid() {
                utils.messages.sendMessage(msg.channel, {
                    key: 'wrong_argument',
                    replacer: {args: 'set disable'}
                }, {username: msg.author.name});
            }
        }
    }
};