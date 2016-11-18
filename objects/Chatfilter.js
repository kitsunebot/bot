let Promise = require('bluebird');

let Collection = require('./Collection'),
    ChatfilterBase = require('./chatfilters/index');

let Links_Whitelist = require('chatfilters/Links_Whitelist'),
    Links_Blacklist = require('chatfilters/Links_Blacklist'),
    Spam = require('chatfilters/Spam');

class Chatfilter {
    constructor(filters, guild) {
        this.guild = guild;
        this.filters = new Collection(ChatfilterBase);
        for (let f of filters) {
            if (f.enabled) {
                switch (f.name) {
                    case 'Links_Whitelist':
                        this.filters.add(new Links_Whitelist(JSON.parse(f.config)));
                        break;
                    case 'Links_Blacklist':
                        this.filters.add(new Links_Blacklist(JSON.parse(f.config)));
                        break;
                    case 'Spam':
                        this.filters.add(new Spam(JSON.parse(f.config)));
                        break;
                }
            }
        }


    }

    check(msg) {
        if (this.filters.size === 0)return Promise.resolve();
        return Promise.all(this.filters.map(filter => filter.check(msg)));
    }
}

module.exports = Chatfilter;