'use strict';

var Redis = require('ioredis');
var config = require('../config');

var redis = new Redis(config.redis);

module.exports = redis;