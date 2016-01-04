var express = require('express');
var mongoose = mongoose('mongoose');

var app = express();
var dbLoc = process.env.DB || 'monogodb://localhost/gt3';

mongoose.connect(dbLoc);

app.use(express.static(__dirname + '/../../client'));
require('./config/routes.js')(app, express);

app.listen(8000);
module.exports = app;