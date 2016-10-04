var config = require('./config.js');
var storyboard = require('storyboard');
var fs = require('fs');
var path = require('path');
var URL = require('url');

var eris = require('./lib/client');
var pubsub = require('./lib/db');
var db = require('./lib/db');
var lang = require('./lib/lang');

storyboard.addListener(require('storyboard/lib/listeners/console').default);
var story = storyboard.mainStory;

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
    }
});

pubsub.on('twitchAnnounce', (data)=> {
    data.channels.filter((channel)=> {
        return eris.channelGuildMap[channel] !== undefined
    }).forEach((chid)=> {
        eris.createMessage(chid, lang.computeLangString(eris.channelGuildMap[chid], 'twitch.announce', false, {
            ch_name: data.ch_name,
            str_title: data.str_title,
            str_game: data.str_game,
            ch_link: data.ch_link
        }));
    });
});

pubsub.on('proxerAnnounce', (data)=> {
    data.channels.filter((channel)=> {
        return eris.channelGuildMap[channel] !== undefined
    }).forEach((chid)=> {
        eris.createMessage(chid, lang.computeLangString(eris.channelGuildMap[chid], 'proxer.announce', false, {
            anime_title: data.title,
            nr: data.nr,
            link: data.link,
            mentions: ''
        }));
    });
});

pubsub.on('nicknameChange', (nick)=> {
    eris.guilds.map((g)=> {
        return g
    }).forEach((g, index)=> {
        setTimeout(()=> {
            eris.editNickname(g.id, nick)
        }, index * 10000);
    });
});

pubsub.on('restart', (timeout)=> {
    timeout = timeout || 0;
    setTimeout(()=> {
        if (process.env.autorestart === 'true') process.exit(1);
        else {
            try {
                var pm2 = require('pm2');
                pm2.connect((err)=> {
                    if (!err)pm2.restart(process.enc.pm_id)
                });
            } catch (e) {
                pubsub.sendEvent('restartFail', e.message);
            }
        }
    }, timeout)
});

pubsub.on('checkGuilds', ()=> {
    eris.guilds.map(guild=>db.models.Guild.update({online: true}, {where: {gid: guild.id}}));
});

pubsub.on('checkUsers', ()=> {
    eris.users.map(user=>db.models.User.update({online: true}, {where: {uid: user.id}}));
});

pubsub.on('statusUpdate', (update)=> {
    if (update.mode === 'manual') eris.editStatus(null, {name: update.status});
    else {
        db.models.StatusMessage.find({order: 'RAND()'}).then(msg=> {
            eris.editStatus(null,{name: msg.message});
        })
    }
});

pubsub.on('githubUpdate', (github)=> {
    if (eris.channelGuildMap[github.channel] !== undefined) {
        if (github.event === 'watch') {
            eris.createMessage(github.channel, lang.computeLangString(eris.channelGuildMap[github.channel], 'github.watch', false, {
                repo_name: github.payload.repository.full_name,
                sender: github.payload.sender.login
            }));
        } else if (github.event === 'push') {
            eris.createMessage(github.channel, lang.computeLangString(eris.channelGuildMap[github.channel], 'github.push', false, {
                repo_name: github.payload.repository.full_name,
                ref: github.payload.ref.split('/')[github.payload.ref.split('/').length - 1],
                commits: github.payload.commits.map(commit=>lang.computeLangString(eris.channelGuildMap[github.channel], 'github.commit', false, {
                    message: commit.message,
                    committer: commit.author.name,
                    commit_id: commit.id.slice(0, 7),
                })).join('\n')
            }));
        } else if (github.event === 'pull_request') {
            if (['opened', 'closed', 'reopened'].includes(github.payload.action)) {
                eris.createMessage(github.channel, lang.computeLangString(eris.channelGuildMap[github.channel], `github.pull.${github.payload.action}${github.payload.action === 'closed' ? github.payload.pull_request.merged ? 'merged' : 'closed' : ''}`, false, {
                    repo: github.payload.repository.full_name,
                    pull_req: github.payload.number,
                    title: github.pull_request.title,
                    sender: github.payload.sender.login,
                    link: github.payload.pull_request.html_url
                }))
            }
        }
    }
});

pubsub.on('gitlabUpdate', (gitlab)=> {
    if (eris.channelGuildMap[gitlab.channel] !== undefined) {
        if (gitlab.event === 'Push Hook') {
            eris.createMessage(gitlab.channel, lang.computeLangString(eris.channelGuildMap[github.channel], 'gitlab.push', false, {
                repo_name: gitlab.payload.project.path_with_namespace,
                vcsurl: URL.parse(gitlab.payload.project.git_http_url).host,
                ref: gitlab.payload.ref.split('/')[gitlab.payload.ref.split('/').length - 1],
                commits: gitlab.payload.commits.map(commit=>lang.computeLangString(eris.channelGuildMap[github.channel], 'gitlab.commit', false, {
                    message: commit.message,
                    committer: commit.author.name,
                    commit_id: commit.id.slice(0, 7),
                })).join('\n')
            }));
        }
    }
});