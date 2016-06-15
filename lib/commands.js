'use strict';

var story = require('storyboard').mainStory;
var path = require('path');
var fs = require('fs');

var commands = {};

fs.readdir(path.join(__dirname, 'commands'), function (err, files) {
    if (err) {
        story.error('Commands', 'Cannot load commands', {attach: err});
        process.exit(1);
    } else {
        files.forEach(function (file) {
            try{
                var command = require('./commands/' + file);
                commands[command.main_cmd] = command;
                command.alias.forEach(function (alias) {
                    commands[alias] = command;
                });
                story.debug('Commands', 'Loaded command ' + file);
            }catch(e){
                story.warn('Commands', 'Cannot load command ' + file, {attach:e});
            }
        });
    }
});

module.exports = commands;