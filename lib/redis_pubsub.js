'use strict';

var config = require('../config');

var Redis = require('ioredis');
var util = require('util');
var EventEmitter = require('events');
var story = require('storyboard').mainStory;
var S = require('string');

var sub = new Redis(config.redis);

var pub = new Redis(config.redis);

var PubSub = function () {
    var that = this;
    sub.subscribe(config.redis.pubsub.prefix + 'serverupdates', config.redis.pubsub.prefix + 'userupdates', config.redis.pubsub.prefix + 'meta');
    sub.on('message', function (channel, message) {
        if (S(channel).startsWith(config.redis.pubsub.prefix)) {
            story.debug('redis-pubsub', channel + ': ' + message);
            that.emit('message', channel, message);
        }
    });

    sub.on('messageBuffer', function (channel, message) {
        if (S(channel).startsWith(config.redis.pubsub.prefix)) {
            that.emit('messageBuffer', channel, message);
        }
    });
};

util.inherits(PubSub, EventEmitter);

PubSub.prototype.serverUpdate = function (sid) {
    pub.publish(config.redis.pubsub.prefix + 'serverupdates', sid);
};

PubSub.prototype.userUpdate = function (uid) {
    pub.publish(config.redis.pubsub.prefix + 'userupdates', uid);
};

PubSub.prototype.publish = function (channel, message) {
    pub.publish(config.redis.pubsub.prefix + channel, message);
};

PubSub.prototype.subscribe = function (channel) {
    sub.subscribe(config.redis.pubsub.prefix + channel);
};

PubSub.prototype.unsubscribe = function (channel) {
    sub.unsubscribe(channel);
};

module.exports = new PubSub();