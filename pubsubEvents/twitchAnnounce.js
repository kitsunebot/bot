var eris = require('../lib/client');
var lang = require('../lib/lang');

module.exports = {
    event: 'twitchAnnounce',
    enabled: true,
    handler: (data)=> {
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
    }
};