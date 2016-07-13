var config = require('./config.js');
var story = require('storyboard').mainStory;
var fs = require('fs');
var path = require('path');

var eris = require('./lib/client');

fs.readdir('./eventhandlers', (err, files)=> {
    if (err) {
        story.fatal('Eventhandlers could not be loaded.', {attach: err});
        process.exit(1);
    } else {
        files.forEach((file)=> {
            try {
                var f = require('./eventhandlers/' + file);
                if (f.enabled) {
                    eris.on(f.event, f.handler);
                    story.debug('Loaded handler for ' + f.event);
                }
            } catch (e) {
                story.warn('Error while loading eventhandler ' + file, {attach: e})
            }
        });
    }
});

fs.readdir('./commands', (err, files)=> {
    if (err) {
        story.fatal('Commands could not be loaded.', {attach: err});
        process.exit(1);
    } else {
        files.forEach((file)=> {
            try {
                var c = require('./commands/' + file);
                if (c.enabled && !c.isSubcommand) {
                    var cmd = eris.registerCommand(c.label, c.generator, c.options);
                    registerSubcommands(c, cmd);

                    function registerSubcommands(cmd, parent) {
                        cmd.subcommands = cmd.subcommands || [];
                        cmd.subcommands.forEach((subcmd)=> {
                            if (subcmd.enabled) {
                                var c = parent.registerSubcommand(subcmd.label, subcmd.generator, subcmd.options);
                                registerSubcommands(subcmd, c);
                            }
                        });
                    }
                }
            } catch (e) {
                story.warn('Error while loading command ' + file, {attach: e})
            }
        });
        eris.connect();
        eris.editGame('DEBUG MODE');
    }
});
