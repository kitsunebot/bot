var Promise = require('bluebird');

var eris = require('../lib/client');
var lang = require('../lib/lang');
var fcache = require('../lib/cache');
var db = require('../lib/db');

module.exports = {
    label: 'initroles',
    enabled: true,
    isSubcommand: false,
    generator: (msg)=> {
        if (msg.author.id !== msg.channel.guild.ownerID)return lang.computeResponse(msg, 'no_permission', {
            required: 5,
            have: '!5'
        });
        var perm = msg.channel.guild.members.find((member)=> {
            return member.user.id === eris.user.id
        }).permission;
        if (!perm.has('manageRoles'))return lang.computeResponse(msg, 'roles.failed');
        if (fcache.getGuild(msg.channel.guild.id).initialized)return lang.computeResponse(msg, 'roles.already');
        Promise.join(eris.createRole(msg.channel.guild.id).then(role=> {
            console.log(role);
            return eris.editRole(msg.channel.guild.id, role.id, {
                name: lang.computeLangString(msg.channel.guild.id, 'roles.manager', false),
                permissions: 0
            });
        }), eris.createRole(msg.channel.guild.id).then(role=> {
            return eris.editRole(msg.channel.guild.id, role.id, {
                name: lang.computeLangString(msg.channel.guild.id, 'roles.moderator', false),
                permissions: 0
            });
        }), eris.createRole(msg.channel.guild.id).then(role=> {
            return eris.editRole(msg.channel.guild.id, role.id, {
                name: lang.computeLangString(msg.channel.guild.id, 'roles.vip', false),
                permissions: 0
            });
        }), eris.createRole(msg.channel.guild.id).then(role=> {
            return eris.editRole(msg.channel.guild.id, role.id, {
                name: lang.computeLangString(msg.channel.guild.id, 'roles.regular', false),
                permissions: 0
            });
        }), (manager, moderator, vip, regular)=> {
            db.models.Guild.update({
                regular_role: regular.id,
                vip_role: vip.id,
                moderator_role: moderator.id,
                manager_role: manager.id,
                initialized: true
            }, {where: {gid: msg.channel.guild.id}});
            eris.createMessage(msg.channel.id, lang.computeResponse(msg, 'roles.init'))
        })
    },
    options: {
        deleteCommand: true,
        caseInsensitive: true,
        serverOnly: true
    }
};