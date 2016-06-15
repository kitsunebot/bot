var utils = require('../utils');

module.exports = {
    _id: 26,
    main_cmd: 'summonvoice',
    alias: [],
    min_perm: 50,
    args: '[none]',
    allow_disable: true,
    handlers: {
        server: function (msg) {
            if (msg.author.voiceChannel === null) utils.messages.sendMessage(msg.channel, 'voice.user_not_connected', {username: msg.author.username});
            else if (!msg.author.voiceChannel.server.equals(msg.channel.server)) utils.messages.sendMessage(msg.channel, 'voice.user_not_connected', {username: msg.author.username}, function () {
                console.log('z', msg.author.voiceChannel.server.id, msg.channel.server.id);
            });
            else {
                if (cache.getVoiceManagerCount() >= config.voice.maxConnections) {
                    utils.messages.sendMessage(msg.channel, 'voice.maxConn', {username: msg.author.username});
                } else {
                    discordBot.joinVoiceChannel(msg.author.voiceChannel).then(function (conn) {
                        cache.addVoiceManager(new VoiceManager(conn, msg.channel));
                    }).catch(function (err) {
                        story.warn('Voice', 'Connection errored while connecting', {attach: err});
                        utils.messages.sendMessage(msg.channel, 'voice.error', {username: msg.author.username});
                    });
                }
            }
        }
    }
};