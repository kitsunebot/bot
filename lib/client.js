var Eris = require('eris');

var config = require('../config');

var eris = new Eris.CommandClient(config.login.token, {
    reconnect: 'auto',
    messageLimit: 250,
    getAllUsers: true,
    largeThreshold: 500,
    disabledEvents: {
        TYPING_START: true,
        VOICE_STATE_UPDATE: true
    },
    maxShards: 4
}, {
    defaultHelpCommand: false,
    ignoreBots: true,
    prefix: ['!fb ', '@mention', '!', '/']
});

module.exports = eris;