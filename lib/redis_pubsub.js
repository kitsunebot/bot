'use strict';

var Redis = require('ioredis');
var config = require('../config');
var util = require('util');
var EventEmitter = require('events');

var sub = new Redis(config.redis);

var pub = new Redis(config.redis);

var PubSub = function () {
    var that = this;
    sub.subscribe(config.redis.pubsub.prefix + 'serverupdates', config.redis.pubsub.prefix + 'userupdates');
    sub.on('message', function (channel, message) {
        console.log(channel, message);
        that.emit('message', channel, message);
    });

    sub.on('messageBuffer', function (channel, message) {
        that.emit('messageBuffer', channel, message);
    });
};

util.inherits(PubSub, EventEmitter);

PubSub.prototype.serverUpdate = function (sid) {
    pub.publish(config.redis.pubsub.prefix + 'serverupdates', sid);
};

PubSub.prototype.userUpdate = function (uid) {
    pub.publish(config.redis.pubsub.prefix + 'userupdates', uid);
};

module.exports = new PubSub();