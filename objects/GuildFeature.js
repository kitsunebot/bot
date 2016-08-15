class GuildFeature {
    constructor(db, guild) {
        this.guild = guild;
        this.name = db.name;
        this.meta = JSON.parse(db.meta);
        this._ = {
            db
        };
    }

    getType(){
        return this.name;
    }

    getMeta() {
        return this.meta;
    }

    updateMeta(meta) {
        this.meta = meta;
        return this._.db.update({meta});
    }
}

module.exports = GuildFeature;