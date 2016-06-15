var story = require('storyboard').mainStory;

module.exports = {
    name: 'error',
    handler: function (error) {
        story.error('discord.js', error);
    }
};