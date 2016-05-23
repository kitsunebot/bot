module.exports = {
    ping: 'Pong!',
    defaultMessageFormat: '[&{username}] &{msg}',
    info: 'I am maintained and hosted by Fuechschen. You can find my page here: https://foxbot.fuechschen.org. If you are searching my commandlist, use "!fb commands"',
    welcome: 'Hello, I\'m FoxBot and i was just added to this server',
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
        default: 'Use this link to add me to your server: https://discordapp.com/oauth2/authorize?access_type=online&client_id=168751105558183936&scope=bot&permissions=473033732',
        leave: 'Ok, sorry to hear that. Just PM me or join my discord if you want me back.',
        check_dm: 'Check your DMs for more information.'
    },
    automod: {
        enabled: 'AutoMod enabled.',
        disabled: 'AutoMod disabled.',
        muterole_set: 'MuteRole was set to "&{r_name}" (ID: &{r_id})',
        muteSpam: '&{mention} was muted for spamming',
        repeatingMessages: '&{meantion}, seems like you are repeating yourself. Can you please stop that?'
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
        user: '```ServerID: &{sid}\nUsers: &{users}\nChannels: &{channels}\nMessages per minute: &{mpm}```'
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
        is_enabled: 'ModLog has alredy been enabled for this server. Use "!fb modlog set" to overwrite the current setting.',
        disabled: 'ModLog disabled.',
        channel_deleted: 'Your ModLog-Channel on "&{server}" has been deleted. The function was therefore disabled. Use "!fb modlog" on your server to reenable it.',
        muted: '&{username} was muted by &{mod}',
        unmuted: '&{username} was unmuted by &{mod}'
    },
    prefix: {
        enabled: 'Enabled prefix "&{prefix}"',
        disabled: 'Disabled prefix "&{prefix}"',
        custom: {
            set: 'Set custom prefix to "&{prefix}".',
            disable: 'Custom prefix disabled.'
        }
    },
    commandslist: {
        _text: 'These are my Commands: \n(Please note: I have more than one prefix including a custom prefix per server. All my commands are always usable with `!fb ` as prefix, however, i also supprt `!` and `/` as command prefix if they are activated on your server.)\n(Sorry if the list is a bit slow, it\'s loooong)',
        _template: '`&{cmd_main}` &{cmd_alias}:\nPossible arguments: `&{args}`\nDescription: &{desc}\n _tempend_',
        _list_sent: 'I\'ve sent you a DM with all my commands.',
        ping: 'Pong!',
        info: 'Provides basic information about the bot.',
        invite: 'Gives the invitelink for the bot.',
        prefix: 'Enables/disables a prefix or sets a custom one.',
        language: 'Sets a language for yourself or for the server.',
        whoami: 'Gives information about yourself.',
        whois: 'Gives information about the mentioned user.',
        serverstats: 'Gives some statistics over the server.',
        stats: 'Gives some bot statistics.',
        cat: 'Gives a cat picture.',
        smile: 'Gives a smile.',
        wtf: 'Gives a wtf.',
        modlog: 'Enables/Disables ModLog.',
        restart: 'Restarts the bot.',
        twitchwatcher: 'Adds/Removes/Lists Watchers for Twitch-Channels. These will inform you, when a streamer goes live.',
        automod: 'Enables/Disables AutoMod or sets the muterole.',
        mute: 'Mutes the mentioned user. Muterole has to be set.',
        unmute: 'Unmutes the mentioned user. Muterole has to be set.',
        commands: 'Gives this commands list.',
        waifu: 'Gives you a picture of your waifu.',
        addwaifu: 'Adds a waifu to my list.',
        listwaifu: 'Lists all stored waifus.',
        setwaifu: 'Sets your personal waifu.',
        purge: 'Deletes all messages from the specified user in the channel or deletes the specified amount of messages in the channel. Needs \'Manage Messages\'-Permission.',
        disablecommand: 'Disables the specified commands for the server.'
    },
    commands: {
        enabled: 'The following commands have been enabled for this server: "&{enabled}" \nThe following commands could not be found: "&{not_found}"',
        disabled: 'The following commands have been disabled for this server: "&{disabled}" \nThe following commands could not be found: "&{not_found}" \nThe following commands aren\'t allowed to be disabled: "&{not_allowed}"' 
    },
    waifu: {
        your_waifu: 'Your waifu is &{name} (&{origin})',
        list_see_dm: 'I\'ve sent you the list in a DM.',
        list: 'Here are all stored waifus. Add yours with `!fb addwaifu (name) | (source) | (picture link)`. \n```&{waifus}```',
        set: 'Set &{user}\'s waifu to "&{waifu}" (&{source})'
    }
};