var Promise = require('bluebird');

var Collection = require('./Collection');
var Chatfilter = require('../chatfilters/index');

var Links_Whitelist = require('../chatfilters/Links_Whitelist');
var Links_Blacklist = require('../chatfilters/Links_Blacklist');

class ChatFilter {
    constructor(settings, guild) {
        this.guild = guild;
        this.filters = new Collection(Chatfilter);
        var that = this;
        if (settings.links) {
            if (settings.links_mode === 'whitelist') {
                settings.getChatFilterWords({where: {type: 'link', setting: 'whitelist'}}).then(links=> {
                    that.filters.add(new Links_Whitelist(links.map(link=>link.content)));
                });
            } else if (settings.links_mode === 'blacklist') {
                settings.getChatFilterWords({where: {type: 'link', setting: 'blacklist'}}).then(links=> {
                    that.filters.add(new Links_Blacklist(links.map(link=>link.content)));
                });
            }
        }
    }

    check(msg) {
        return Promise.all(this.filters.map(filter=>filter.check(msg)));
    }
}

module.exports = ChatFilter;