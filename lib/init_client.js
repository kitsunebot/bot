var discordjs = require('discord.js');

var discordBot = new discordjs.Client({autoReconnect: true, compress: true, forceFetchUsers: true, maxCachedMessages: 50});

module.exports = discordBot;