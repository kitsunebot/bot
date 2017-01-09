let Eris = require('eris');

let config = require('../config');

let eris = new Eris.CommandClient(config.login.token, {
    reconnect: 'auto',
    messageLimit: 250,
    getAllUsers: true,
    largeThreshold: 500,
    disabledEvents: {
        TYPING_START: true,
        VOICE_STATE_UPDATE: true,
        PRESENCE_UPDATE: true
    },
    maxShards: config.login.maxShards
}, {
    defaultHelpCommand: false,
    ignoreBots: true,
    prefix: ['!fb ', '@mention', '!', '/']
});

eris.Embed = require('eris-embed-builder');

module.exports = eris;