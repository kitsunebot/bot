let config = require('./config.js');
let storyboard = require('storyboard');
let fs = require('fs');
let path = require('path');

let eris = require('./lib/client');
let pubsub = require('./lib/db');

storyboard.addListener(require('storyboard/lib/listeners/console').default);
let story = storyboard.mainStory;

fs.readdir('./eventhandlers', (err, files)=> {
    if (err) {
        story.fatal('Eventhandlers could not be loaded.', {attach: err});
        process.exit(1);
    } else {
        files.forEach((file)=> {
            try {
                let f = require('./eventhandlers/' + file);
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
                let c = require('./commands/' + file);
                if (c.enabled && !c.isSubcommand) {
                    let cmd = eris.registerCommand(c.label, c.generator, c.options);
                    registerSubcommands(c, cmd);

                    function registerSubcommands(cmd, parent) {
                        cmd.subcommands = cmd.subcommands || [];
                        cmd.subcommands.forEach((subcmd)=> {
                            if (subcmd.enabled) {
                                let c = parent.registerSubcommand(subcmd.label, subcmd.generator, subcmd.options);
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
    }
});

fs.readdir('./pubsubEvents', (err, files)=> {
    if (err) {
        story.fatal('PubSubEvents could not be loaded.', {attach: err});
        process.exit(1);
    } else {
        files.forEach((file)=> {
            try {
                let f = require('./pubsubEvents/' + file);
                if (f.enabled) {
                    pubsub.on(f.event, f.handler);
                    story.debug('Loaded pubsub-handler for ' + f.event);
                }
            } catch (e) {
                story.warn('Error while loading pubsub-handler ' + file, {attach: e})
            }
        });
    }
});

fs.readdir('./crons',(err,files)=>{
    if (err) {
        story.fatal('Crons could not be loaded.', {attach: err});
    } else {
        files.forEach((file)=> {
            try {
                let f = require('./crons/' + file);
                if (f.enabled) {
                    f.job.start();
                    story.debug('Started CronJob ' + f.name);
                }
            } catch (e) {
                story.warn('Error while loading cron ' + file, {attach: e})
            }
        });
    }
});