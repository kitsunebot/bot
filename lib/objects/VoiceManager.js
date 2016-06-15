var db = require('../db/sql_db');
var redis = require('../db/redis_db');
var pubsub = require('../db/redis_pubsub');
var utils = require('../utils');
var cache = require('../cache');
var discordBot = require('../client');

var request = require('request');
var Promise = require('bluebird');
var story = require('storyboard').mainStory;

var VoiceManager = function (connection, startChannel) {
    this.connection = connection;
    this.startChannel = startChannel;
    this.server = connection.server;
    this.currentplay = null;
};

VoiceManager.prototype.addFileToQueue = function (file) {
    file = {
        path: file.path,
        name: file.name
    };
    return redis.rpushx('filequeue:' + this.connection.server.id, JSON.stringify(file));
};

VoiceManager.prototype.getQueue = function () {
    var that = this;
    return new Promise(function (resolve, reject) {
        redis.llen('filequeue:' + that.connection.server.id).then(function (length) {
            return redis.lrange('filequeue:' + that.connection.server.id, 0, length + 1);
        }).then(resolve).catch(reject);
    });
};

VoiceManager.prototype.play = function () {
    var that = this;
    return new Promise(function (resolve, reject) {
        redis.llen('filequeue:' + that.connection.server.id).then(function (length) {
            if (length === 0) reject(new Error('Queue empty'));
            else return redis.lpop('filequeue:' + that.connection.server.id);
        }).then(function (file) {
            file = JSON.parse(file);
            that.connection.stopPlaying();
            that.connection.playFile(file.path).then(function (intent) {
                resolve(intent);
                story.info('Voice', 'Now playing ' + file.name + ' on ' + that.server.name + '[' + that.server.id + ']');
                intent.on('end', function () {
                    that.play().catch(function (err) {
                        utils.messages.sendMessage(that.startChannel, 'voice.error');
                    });
                });
            }).catch(function (err) {
                story.warn('Voice', 'voicecon errored', {attach: err});
                reject(err);
            });
        }).catch(reject);
    });
};

VoiceManager.prototype.kill = function () {
    discordBot.leaveVoiceChannel(this.connection.voiceChannel, function (err) {
        if (err)story.warn('Voice', 'Error while disconnecting', {attach: err});
    });
    cache.removeVoiceManager(this);
};

module.exports = VoiceManager;