let story = require('storyboard').mainStory;

module.exports = {
    event: 'debug',
    enabled: true,
    handler:  (msg, shard)=>{
        story.debug('eris','[' + shard + ']' + msg);
    }
};