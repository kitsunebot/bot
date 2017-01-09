let Promise = require('bluebird');

class Chatfilter {
    constructor(config, guild) {
        this.config = config;
        this.guild = guild;
    }

    check() {
        return Promise.resolve()
    }
}

module.exports = Chatfilter;