var Promise = require('bluebird');
var fs = require('fs');
var story = require('storyboard').mainStory;
var path = require('path');

var chatfilters = [];

var strings = {};

loadChatfilters();

function loadChatfilters() {
    fs.readdir(path.resolve(__dirname, 'chatfilters'), (err, files)=> {
        if (err) {
            story.fatal('ChatFilters', 'Cannot load chatfilters', {attach: err});
            chatfilters.push(Promise.resolve);
        } else {
            if (files.length === 0) chatfilters.push(Promise.resolve);
            else {
                files.forEach((file)=> {
                    try {
                        var filter = require(path.resolve(__dirname, 'chatfilters', file));
                        if (filter.enabled) {
                            chatfilters.push(filter.check);
                            strings[filter.type] = filter.strings;
                            story.debug('ChatFilters', 'Loaded chatfilter ' + filter.name);
                        } else story.debug('ChatFilters', 'Skipping ' + filter.name + ' since it\'s disabled.');
                    } catch (e) {
                        story.warn('ChatFilters', 'Failed to load chatfilter.', {attach: e});
                    }
                });
            }
            story.info('ChatFilters', 'Loaded ' + (chatfilters.length) + ' chatfilters.');
        }
    });
}

module.exports = {
    filters: chatfilters,
    check: (msg)=> {
        return Promise.all(chatfilters.map(filter=>filter(msg)))
    },
    resolveMsg: (type) => {
        return strings[type];
    },
    _: {
        strings: strings
    }
};