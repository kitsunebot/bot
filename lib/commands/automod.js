var utils = require('../utils');

module.exports = {
    _id: 16,
    main_cmd: 'automod',
    alias: [],
    min_perm: 4,
    args: '[none] | enable | disable | status | setmuterole (rolename)',
    allow_disable: false,
    handlers: {
        server: function (msg) {
            var split = msg.cleanContent.trim().split(' ');
            if (split.length === 2) {
                if (split[1] === 'enable') {
                    msg.server.setAutoMod(true, function () {
                        utils.messages.sendMessage(msg.channel, 'automod.enabled', {username: msg.author.name});
                    });
                } else if (split[1] === 'disable') {
                    msg.server.setAutoMod(false, function () {
                        utils.messages.sendMessage(msg.channel, 'automod.disabled', {username: msg.author.name});
                    });
                } else if (split[1] === 'status') {
                    //todo
                } else wrongArg();
            } else if (split.length === 3) {
                if (split[1] === 'setmuterole') {
                    var rolename = split[2];
                    var role = msg.channel.server.roles.get('name', rolename);
                    if (role !== undefined && role !== null) {
                        msg.server.setMuteRole(role.id, function () {
                            utils.messages.sendMessage(msg.channel, {
                                key: 'automod.muterole_set',
                                replacer: {r_name: role.name, r_id: role.id}
                            }, {username: msg.author.name});
                        });
                    } else wrongArg();
                } else wrongArg();
            } else wrongArg();

            function wrongArg() {
                utils.messages.sendMessage(msg.channel, {
                    key: 'wrong_argument',
                    replacer: {args: 'enable | disable | setmuterole (rolename) | status'}
                }, {username: msg.author.name});
            }
        }
    }
};