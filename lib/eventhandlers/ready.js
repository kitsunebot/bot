var story = require('storyboard').mainStory;

module.exports = {
    name: 'ready',
    handler: function () {
        story.info('discord.js', 'Client ready to use');
        require('../cronjobs');
    }
};