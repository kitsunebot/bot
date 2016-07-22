var Eris = require('eris');

var config = require('../config');

var eris = new Eris.CommandClient(config.login.token, {
    reconnect: 'auto',
    messageLimit: 250,
    getAllUsers: true,
    largeThreshold: 500,
    disabledEvents: {},
    maxShards: 2
}, {
    defaultHelpCommand: false,
    ignoreBots: true,
    prefix: ['!fb ', '@mention', '!', '/']
});

module.exports = eris;