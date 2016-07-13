var story = require('storyboard').mainStory;

module.exports = {
    event: 'error',
    enabled:true,
    handler: (msg, shard)=>{
        story.error('eris','[' + shard + ']' + msg)
    }
};