'use strict';

var Server = require('./objects/Server');

var config = require('../config');

var exprt = {
    _: {
        cache: {
            servers: {},
            command_list: {}
        }
    },
    getServer: function (sid, callback) {
        if (exprt._.cache.servers[sid] !== undefined) callback(exprt._.cache.servers[sid]);
        else {
            exprt._.cache.servers[sid] = new Server(sid, callback);
        }
    }
};

module.exports = exprt;