var utils = require('../utils');

module.exports = {
    _id: 22,
    main_cmd: 'listwaifu',
    alias: ['listwaifus'],
    min_perm: 0,
    args: '(page)',
    allow_disable: true,
    handlers: {
        server: function (msg) {
            utils.messages.sendReply(msg, 'waifu.list_see_dm');
            utils.users.sendWaifuList(msg.author);
            msg.delete();
        },
        dm: function (msg) {
            utils.users.sendWaifuList(msg.author);
        }
    }
};