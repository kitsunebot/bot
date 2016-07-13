var story = require('storyboard').mainStory;

module.exports = {
    event: 'messageCreate',
    enabled: true,
    handler: (msg)=> {
        story.info('msg', '[' + (msg.channel.guild === undefined ? 'Private Message' : msg.channel.guild.name) + '|' + msg.channel.name + '|' + msg.author.username + ']: ' + msg.content);
    }
};