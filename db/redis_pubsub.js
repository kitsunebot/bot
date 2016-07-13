var Redis = require('ioredis');
var EventEmitter = require('events');
var story = require('storyboard').mainStory;
var shortid = require('shortid');

var config = require('../config');

class PubSub extends EventEmitter {
    constructor() {
        super();
        var that = this;
        this.sub = new Redis(config.redis);
        this.pub = new Redis(config.redis);
        this.sid = shortid.generate();
        this.sub.subscribe(config.redis.pubsub.prefix + 'events');
        this.sub.on('message', (channel, message)=> {
            if (channel === config.redis.pubsub.prefix + 'events') {
                try {
                    var data = JSON.parse(message);
                    if (data.sid !== that.sid) {
                        that.emit(data.type, data.data);
                    }
                } catch (e) {
                    story.warn('PubSub', 'Error handling message', {attach: {error: e, msg: message}});
                }
            }
        })
    }

    sendEvent(event, data) {
        this.pub.publish(config.redis.pubsub.prefix + 'events', JSON.stringify({type: event, data: data, sid: this.sid}));
    }
}

module.exports = new PubSub();