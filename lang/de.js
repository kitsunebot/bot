module.exports = {
    ping: 'Pong!',
    info: 'Ich werde von Fuechschen entwickelt und gehostet. Hier ist meine Seite: https://fuechschen.org/foxbot. Beschwerden? Anregungen? Sende eine Mail an foxbot@fuechschen.org',
    not_allowed: 'Das darfst du nicht.',
    missing_argument: 'Da fehlt noch was.',
    unknown_argument_error: 'Du hast ein Arfument benutzt, welches ein unbekannten Fehler verursachte.',
    wrong_argument: 'Dieses Argument ist hier nicht erlaubt. Erlaubte Atgumente: "&{args}"',
    dm_not_possible: 'Dies geht nur in einem ServerChannel.',
    bot_activated: 'FoxBot ist nun auf diesem Server aktiv.',
    whois: 'Username: &{username}\nID: &{uid}\nStatus: &{status}\nAvatar-URL: &{avatar}',
    whoami: 'Username: &{username}\nID: &{uid}\nStatus: &{status}\nAvatar-URL: &{avatar}',
    language: {
        reload: 'Lade Sprache-Dateien neu "&{lang}"'
    },
    game: {
        set: 'Spiel gesetzt.',
        rotate: 'Rotiere Spiele...',
        add: '"&{name}" mit "&{display}" als Anzeige der Spieleliste hinzugefügt.',
        random: 'Neues, zufälliges Spiel wurde ausgewählt.',
        remove: '"&{name}" von der Spieleliste entfernt.',
        enable: '"&{name}" deaktiviert.',
        disable: '"&{name}" aktiviert.',
        reload: 'Lade Spiele neu...'
    },
    lang: {
        set: {
            server: 'Setze Server-Sprache zu "&{lang}"',
            user: 'Setze Benutzer-Sprache zu "&{lang]"'
        }
    },
    invite: {
        default: 'Durch die letzten Änderungen an der API kann ich keine Einladungen mehr benutzen. Nutze stattdessen diesen Link: https://discordapp.com/oauth2/authorize?access_type=online&client_id=168751105558183936&scope=bot&permissions=3148800',
        leave: 'OK, schade das zu hören. Wenn du mich wieder haben willst, geh auf meinen Discord-Server oder schicke mir eine Private Nachricht.'
    },
    roles: {
        reload: 'Lade Berechtigungen neu.',
        set: 'Setze &{users} als &{role}'
    },
    customcommand: {
        reload: 'Lade CustomCommands neu...',
        exists: 'Dieser CustomCommand existiert bereits. Update ihn mit !fbupdatecc.',
        exists_global: 'Dieser CustomCommand existiert bereits als globaler command und ist nicht überschreibbar.',
        added: 'CustomCommand hinzugefügt: "&{command}":"&{msg}"'
    },
    automod: {
        enabled: 'AutoMod aktiviert.',
        disabled: 'AutoMod deaktiviert.'
    },
    restart: {
        execute: 'Restart ausgelöst.',
        failed: 'Restart gescheitert.'
    },
    commandsreload: {
        failed: 'Kommando-Reload fehlgeschlagen',
        success: 'Befehle erfolgreich neu geladen.'
    },
    stats: {
        user: 'Ich bin derzeit auf &{servers} aktiv und verbeite &{mpm} Nachrichten pro Minute von &{users} Usern',
        staff: '```Uptime: &{uptime}\nServers: &{servers}\nManaged Users: &{users}\nMessages per minute: &{mpm}\nMemory: &{mem}\nSystem Load: &{sysload}```'
    },
    serverstats: {
        user: '```Benutzer: &{users}\nKanäle: &{channels}\nNachrichten pro Minute: &{mpm}```'
    },
    twitchWatcher: {
        wentonline: '&{ch_name} ist auf Twitch online gegangen: \nTitel: &{str_title}\nSpiel: &{str_game}\nLink: &{ch_link}',
        add: 'Watcher für "&{channel}" hinzugefügt.',
        remove: 'Watcher für "&{channel}" enfernt.',
        no_watcher: 'Für diesen Kanal existiert kein Watcher.',
        already_watched: 'Dieser channel hat schon einen Watcher.',
        channel_not_found: 'Dieser Twitch-Kanal existiert nicht.',
        list: 'Überwachte Twitch-Kanäle: &{channels}'
    }
};