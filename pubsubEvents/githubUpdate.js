var eris = require('../lib/client');
var lang = require('../lib/lang');

module.exports = {
    event: 'githubUpdate',
    enabled: true,
    handler: (github)=> {
        if (eris.channelGuildMap[github.channel] !== undefined) {
            if (github.event === 'watch') {
                eris.createMessage(github.channel, lang.computeLangString(eris.channelGuildMap[github.channel], 'github.watch', false, {
                    repo_name: github.payload.repository.full_name,
                    sender: github.payload.sender.login
                }));
            } else if (github.event === 'push') {
                eris.createMessage(github.channel, lang.computeLangString(eris.channelGuildMap[github.channel], 'github.push', false, {
                    repo_name: github.payload.repository.full_name,
                    ref: github.payload.ref.split('/')[github.payload.ref.split('/').length - 1],
                    commits: github.payload.commits.map(commit=>lang.computeLangString(eris.channelGuildMap[github.channel], 'github.commit', false, {
                        message: commit.message,
                        committer: commit.author.name,
                        commit_id: commit.id.slice(0, 7),
                    })).join('\n')
                }));
            } else if (github.event === 'pull_request') {
                if (['opened', 'closed', 'reopened'].includes(github.payload.action)) {
                    eris.createMessage(github.channel, lang.computeLangString(eris.channelGuildMap[github.channel], `github.pull.${github.payload.action}${github.payload.action === 'closed' ? github.payload.pull_request.merged ? 'merged' : 'closed' : ''}`, false, {
                        repo: github.payload.repository.full_name,
                        pull_req: github.payload.number,
                        title: github.payload.pull_request.title,
                        sender: github.payload.sender.login,
                        link: github.payload.pull_request.html_url
                    }))
                }
            } else if (github.event === 'issues') {
                if (['opened', 'edited', 'closed', 'reopened'].includes(github.payload.action)) {
                    eris.createMessage(github.channel, lang.computeLangString(eris.channelGuildMap[github.channel], `github.issue.${github.payload.action}`, false, {
                        repo: github.payload.repository.full_name,
                        issue: github.payload.issue.number,
                        title: github.payload.issue.title,
                        sender: github.payload.sender.login,
                        link: github.payload.issue.html_url
                    }))
                }
            } else if (github.event === 'issue_comment') {
                if (github.payload.action === 'created') {
                    eris.createMessage(github.channel, lang.computeLangString(eris.channelGuildMap[github.channel], `github.issue.comment`, false, {
                        repo: github.payload.repository.full_name,
                        issue: github.payload.issue.number,
                        title: github.payload.issue.title,
                        sender: github.payload.sender.login,
                        link: github.payload.comment.html_url
                    }))
                }
            }
        }
    }
}
;