var utils = require('../utils');

module.exports = {
    _id: 4,
    min_perm: 3,
    main_cmd: 'prefix',
    alias: [],
    args: '[none] | enable (prefix) | disable (prefix) | setcustom (prefix | none)',
    allow_disable: false,
    handlers: {
        server: function (msg) {
            var split = msg.cleanContent.trim().split(' ');
            if (split.length === 3) {
                var prefix = split[2];
                var action = split[1];
                if (['!', 'slash', '/', 'exclam', 'exclamation_mark'].indexOf(prefix) !== -1 && ['enable', 'disable'].indexOf(action) !== -1) {
                    msg.server.setPrefixValue(prefix, (action === 'enable'), function () {
                        utils.messages.sendMessage(msg.channel, {
                            key: (action === 'enable' ? 'prefix.enabled' : 'prefix.disabled'),
                            replacer: {prefix: prefix}
                        }, {username: msg.author.name});
                    });
                } else if (split[1] === 'setcustom') {
                    var cprefix = (split[2] !== 'none' ? split[2] : null);
                    msg.server.setCustomPrefix(cprefix, function () {
                        utils.messages.sendMessage(msg.channel, {
                            key: 'prefix.custom.' + (cprefix !== null ? 'set' : 'disable'),
                            replacer: {prefix: cprefix}
                        }, {username: msg.author.name});
                    });
                } else utils.messages.sendMessage(msg.channel, {
                    key: 'wrong_argument',
                    replacer: {args: '[none] | enable (prefix) | disable (prefix) | setcustom (prefix | none)'}
                }, {username: msg.author.name});
            } else utils.messages.sendMessage(msg.channel, {
                key: 'wrong_argument',
                replacer: {args: '[none] | enable (prefix) | disable (prefix) | setcustom (prefix | none)'}
            }, {username: msg.author.name});
            msg.delete();
        }
    }
};