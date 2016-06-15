var config = require('./config.js');
var story = require('storyboard').mainStory;
var fs = require('fs');
var path = require('path');

var discordBot = require('./lib/client');
var utils = require('./lib/utils');

config.languages.all.forEach(function (lang) {
    utils.language.loadLangFile(lang);
});

fs.readdir(path.join(__dirname, 'lib', 'eventhandlers'), function (err, files) {
    if (err) {
        story.error('Cannot load eventhandlers', {attach: err});
        process.exit(1);
    }
    else {
        files.forEach(function (file) {
            try {
                var handler = require('./lib/eventhandlers/' + file);
                discordBot.on(handler.name, handler.handler);
                story.debug('Events', 'Loaded handler ' + handler.name);
            } catch (e) {
                story.warn('Events', 'Couldn\'t load ' + file, {attach: e});
            }

        });
    }
});