var story = require('storyboard').mainStory;

module.exports = {
    name: 'warn',
    handler:function (warn) {
        story.warn('discord.js', warn);
    }
};