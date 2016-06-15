'use strict';

var story = require('storyboard').mainStory;

var discordjs = require('discord.js');
var config = require('../config');

var discordBot = new discordjs.Client({autoReconnect: true, compress: true, forceFetchUsers: true, maxCachedMessages: 100, largeThreshold: 250});

discordBot.loginWithToken(config.login.token).then(function () {
    story.info('meta', 'Login successful');
}).catch(function (err) {
    story.error('meta', 'Error while logging in.', {attach: err});
});

module.exports = discordBot;