let story = require('storyboard').mainStory;

module.exports = {
    event: 'error',
    enabled: true,
    handler: (err, shard)=> {
        story.error('eris', '[' + shard + ']' + err, {attach: err});
    }
};