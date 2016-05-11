var express = require('express');
var app = express();
var http = require('http').Server(app);
var story = require('storyboard').mainStory;

var config = require('../config');

app.get('/*', function (req, res) {
    res.send('Under construction');
});

https.listen(config.web.port, function (err) {
    if (!err)  story.info('web', 'Listening on webport');
    else story.error('web', 'Error in init', {attach: err});
});

module.exports = {http: http, express: app};