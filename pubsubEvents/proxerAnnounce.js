let eris = require('../lib/client');
let lang = require('../lib/lang');

module.exports = {
    event: 'proxerAnnounce',
    enabled: true,
    handler: (data)=> {
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
    }
};