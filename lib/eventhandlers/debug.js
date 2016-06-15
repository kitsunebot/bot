var story = require('storyboard').mainStory;

module.exports = {
    name: 'debug',
    handler: function (debug) {
        story.debug('discord.js', debug);
    }
};