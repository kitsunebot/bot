var utils = require('../utils');
var cache = require('../cache');

module.exports = {
    _id: 27,
    main_cmd: 'dismissvoice',
    alias: [],
    min_perm: 50,
    args: '[none]',
    allow_disable: true,
    handlers: {
        server: function (msg) {
            var m = cache.getVoiceManager(msg.server.id);
            if (m !== undefined) {
                m.kill();
            } else {
                utils.messages.sendMessage(msg.channel, 'voice.no_connection', {username: msg.author.username});
            }
        }
    }
};