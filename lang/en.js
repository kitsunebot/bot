module.exports = {
    lang: 'en',
    strings: {
        help: 'This bot was created by &{mention}. Use !fb commands for my commands.',
        not_implemented: 'This feature isn\'t available yet.',
        error: 'The command ended in an unknown error. If it persists, please open an issue on github: https://github.com/Fuechschen/discordbot/issues',
        syntax_error: 'Something went wrong. Please check command syntax. (https://foxbot.fuechschen.org/commands)',
        no_permission: 'You don\'t have permission to do this. [Needed: &{required} | Current: &{have}]',
        username: '[&{username}]',
        ping: 'Pong!',
        commands: {
            default: 'You can find all my commands here: https://foxbot.fuechschen.org/commands'
        },
        waifu: {
            default: 'Your waifu is &{name} (&{origin})\n&{pic_link}',
            format: '&{name} (&{origin})',
            createPicture: {
                default: 'Picture created. It will be displayed until it was verified by one of my managers.'
            },
            list: {
                default: 'Here are all stored waifus. Add yours with `!fb waifu add (name) | (source) | (picture link)`. \nYou can find a full list under https://foxbot.fuechschen.org/charaters/waifus'
            },
            set: {
                not_found: 'I haven\'t found any entry for `&{query}`',
                default: 'Waifu set to &{w_name}[&{w_id}]'
            },
            search: {
                default: 'I have found the following waifus in my database: ```&{waifus}```',
                format: '&{waifu} [&{id}]'
            },
            id: {
                default: 'Your waifu has the id "&{id}"',
                no_waifu: 'You don\'t have a registered waifu.'
            }
        },
        husbando: {
            default: 'Your husbando is &{name} (&{origin})\n&{pic_link}',
            format: '&{name} (&{origin})',
            createPicture: {
                default: 'Picture created. It will be displayed until it was verified by one of my managers.'
            },
            list: {
                default: 'Here are all stored husbandos. Add yours with `!fb husbando add (name) | (source) | (picture link)`. \nYou can find a full list under https://foxbot.fuechschen.org/charaters/husbandos'
            },
            set: {
                not_found: 'I haven\'t found any entry for `&{query}`',
                default: 'Husbando set to &{w_name}[&{w_id}]'
            },
            search: {
                default: 'I have found the following husbandos in my database: ```&{husbandos}```',
                format: '&{husbando} [&{id}]'
            },
            id: {
                default: 'Your husbando has the id "&{id}"',
                no_waifu: 'You don\'t have a registered husbando.'
            }
        },
        nick: {
            default: 'Nickname was changed.',
            global: 'Nickname was globally changed.'
        },
        stats: {
            default: 'Here are my current stats:\n```Uptime: started &{uptime}\nGuilds: &{guild_count}\nChannels: &{channel_count}\nCached Users: &{user_count}\nMessages per minute: &{mpm}```',
            error: 'Value couldn\'t be retrieved. We\'re working on it!',
            guild: 'Here are my current stats:\n```Channels: &{channel_count}\nCached Users: &{user_count}\nMessages per minute: &{mpm}```'
        },
        twitch: {
            default: 'Usage: `!fb watcher add [channel]` to add a watcher, `!fb wather remove [channel]` to remove a watcher.\nCurrent watchers for this channel: &{watchers}',
            default_format: '`&{ch_name}`',
            default_separator: ',',
            announce: '&{ch_name} just went online on twitch: \nTitle: &{str_title}\nGame: &{str_game}\nLink: &{ch_link}',
            add: 'Watcher added. Online-Status of &{channel} will now be reported to this channel.',
            watched: 'That channel is already watched.',
            not_exists: 'That channel doesn\'t exist.'
        },
        proxer: {
            announce: '&{anime_title} Episode &{nr} is now available on &{link}\n&{mentions}'
        },
        prefix: {
            list: 'These prefixes are available on this guild: &{prefixes}',
            add: 'Prefix was added.',
            remove: 'Prefix was removed.',
            no_remove: 'This prefix can\'t be disabled'
        },
        chatlog: {
            default: 'To create a chatlog, please use `!fb chatlog create`.',
            create: 'A chatlog has been created! You can view it here: https://foxbot.fuechschen.org/chatlogs/&{cl_id}'
        },
        broadcast: {
            send: 'Broadcast is being prepared and will be sent in the next few seconds.',
            create: 'Broadcast has been created. Type `!fb broadcast confirm &{confirm}` to send it to all users in this guild.',
            wrong_user: 'You can\'t confirm the broadcast of another user.',
            msg: 'You received a broadcast by &{sender} from &{sender_guild}. If you don\'t want to receive broadcasts, type `!fb broadcast disable`\n```&{msg}```',
            disable: 'Broadcasts have been disabled. You won\'t receive any more.',
            enable: 'Broadcasts have been enabled. You will receive them again.'
        },
        github: {
            watch: '**&{sender} has starred &{repo_name}@GitHub**',
            push: '**New commits for &{repo_name}@GitHub:**\n&{commits}',
            commit: '    `&{commit_id}` *&{committer}*: **&{message}**',
            _help: 'Take a look at the command reference: https://foxbot.fuechschen.org/commands/github',
            _created: 'Your feed has been created. Point a webhook to `https://foxbot.fuechschen.org/api/v1/github/&{fid}` and enable the events you want to be displayed. You can use this link for as many webhooks as you want.',
            _already: 'This channel already has a github webkhook: `https://foxbot.fuechschen.org/api/v1/github/&{fid}`',
            _removed: 'Feed for this channel has been removed. Don\'t forget to remove the webhook on GitHub.',
            _no_hook: 'There was no feed found for this channel.',
            pull: {
                opened: '**&{sender} opened pull request #&{pull_req} on &{repo}@GitHub:**\n*&{title}*\n&{link}',
                reopened: '**&{sender} reopened pull request #&{pull_req} on &{repo}@GitHub:**\n*&{title}*\n&{link}',
                closed: {
                    closed: '**&{sender} closed pull request #&{pull_req} on &{repo}@GitHub:**\n*&{title}*',
                    merged: '**&{sender} merged pull request #&{pull_req} on &{repo}@GitHub:**\n*&{title}*',
                }
            }
        }
    }
};