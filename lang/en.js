module.exports = {
    ping: 'Pong!',
    info: 'I am mainained and hosted by Fuechschen. You can find my page here: https://fuechschen.org/foxbot. Any complaints about me? Email foxbot@fuechschen.org',
    not_allowed: 'You are not allowed to do this.',
    missing_argument: 'You are missing something.',
    unknown_error: 'An unknown error occured while executing your command.',
    unknown_argument_error: 'You used an argument which threw an unknown error.',
    wrong_argument: 'That argument isn\'t allowed there, Allowed arguments: "&{args}"',
    dm_not_possible: 'You can\'t do that in a DM',
    bot_activated: 'FoxBot is now enabled for this server.',
    whois: '```Username: &{username}\nID: &{uid}\nStatus: &{status}\nAvatar-URL: &{avatar}```',
    whoami: '```Username: &{username}\nID: &{uid}\nStatus: &{status}\nAvatar-URL: &{avatar}```',
    language: {
        reload: 'Now reloading languages "&{lang}"',
        current: 'The language is currently set to "&{lang}"',
        set: 'Language was set to "&{lang}"'
    },
    game: {
        set: 'Now playing custom game.',
        rotate: 'Now rotating games.',
        add: 'Added "&{name}" with display "&{display}" to the games list.',
        random: 'New random game was choosen.',
        remove: 'Removed "&{name}" from the list.',
        enable: 'Enabled game "&{name}"',
        disable: 'Disabled game "&{name}"',
        reload: 'Now reloading games.'
    },
    invite: {
        default: 'With the latest api chenges, I\'m cannot join an invite anymore. Use this link to add me to your server: https://discordapp.com/oauth2/authorize?access_type=online&client_id=168751105558183936&scope=bot&permissions=3148800',
        leave: 'Ok, sorry to hear that. Just PM me or join my discord if you want me back.'
    },
    automod: {
        enabled: 'AutoMod enabled.',
        disabled: 'AutoMod disabled.'
    },
    restart: {
        execute: 'Restart triggerd.',
        failed: 'Restart failed. Use command line.'
    },
    stats: {
        user: 'I am currently online on &{servers} servers handling &{users} online users and &{mpm} messages per minute.',
        staff: '```Uptime: started &{uptime}\nServers: &{servers}\nManaged Users: &{users}\nMessages per minute: &{mpm}\nMemory: &{mem}\nSystem Load: &{sysload}```'
    },
    serverstats: {
        user: '```Users: &{users}\nChannels: &{channels}\nMessages per minute: &{mpm}```'
    },
    twitchWatcher: {
        wentonline: '&{ch_name} just went online on twitch: \nTitle: &{str_title}\nGame: &{str_game}\nLink: &{ch_link}',
        add: 'Watcher for channel "&{channel}" added.',
        remove: 'Watcher for channel "&{channel}" removed.',
        no_watcher: 'No watcher for this channel there to remove.',
        already_watched: 'That channel is already watched.',
        channel_not_found: 'The given twitch channel wasn\'t found',
        list: 'Watched Channels: &{channels}'
    },
    modlog: {
        banned: 'Banned: &{username}',
        unbanned: 'Unbanned: &{username}',
        banunsetrole: '&{username}, who was &{rname} on your server &{sname} has been banned. I therefore removed his role on this server. You will have to grant the role to them again.',
        enabled: 'ModLog enabled. Bans and Unbans will now be reported to this channel.',
        disabled: 'ModLog disabled.'
    }
};