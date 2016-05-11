'use strict';

var discordjs = require('discord.js');

var discordBot = new discordjs.Client({autoReconnect: true, compress: true, forceFetchUsers: true, maxCachedMessages: 100, largeThreshold: 250});

module.exports = discordBot;