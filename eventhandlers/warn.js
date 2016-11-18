let story = require('storyboard').mainStory;

module.exports = {
    event: 'warn',
    enabled: true,
    handler: (msg, shard)=> {
        story.warn('eris', '[' + shard + ']' + msg)
    }
};