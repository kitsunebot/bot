module.exports = {
    lang: 'en',
    strings:{
        help: 'This bot was created by Fuechschen#5218. Use !fb commands for my commands.',
        not_implemented: 'This feature isn\'t available yet.',
        no_permission:'You don\'t have permission to do this. [Needed: &{required} | Current: &{have}]',
        username: '[&{username}]',
        waifu: {
            default: 'Your waifu is &{name} (&{origin})',
            list: {
                default: 'Here are all stored waifus. Add yours with `!fb waifu add (name) | (source) | (picture link)`. \n```&{waifus}```',
                format: '&{name} (&{source})[&{id}]',
                separator :' | '
            },
            set:{
                not_found: 'I haven\'t found any entry for `&{query}`',
                default: 'Waifu set to &{w_name}[&{w_id}]'
            }
        },
        nick:{
            default: 'Nickname was changed.'
        },
        stats:{
            default: 'Here are my current stats:\n```Uptime: started &{uptime}\nGuilds: &{guild_count}\nChannels: &{channel_count}\nCached Users: &{user_count}\nMessages per minute: &{mpm}```'
        },
        twitch:{
            default: 'Usage: `!fb watcher add [channel]` to add a watcher, `!fb wather remove [channel]` to remove a watcher.\nCurrent watchers for this channel: &{watchers}',
            default_format: '`&{ch_name}`',
            default_separator: ',',
            announce: '&{ch_name} just went online on twitch: \nTitle: &{str_title}\nGame: &{str_game}\nLink: &{ch_link}'
        }
    }
};