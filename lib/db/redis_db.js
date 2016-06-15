'use strict';

var Redis = require('ioredis');
var config = require('../../config');
var db = require('./sql_db');

var redis = new Redis(config.redis);

module.exports = redis;

db.models.User.findAll({where: {custom_role: {$gt: 0}}}).then(function (users) {
    users.forEach(function (user) {
        redis.hset('users:globalperm', user.uid, user.custom_role);
    });
});