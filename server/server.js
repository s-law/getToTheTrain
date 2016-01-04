var express = require('express');
var mongoose = require('mongoose');

var app = express();
var dbLoc = process.env.DB || 'mongodb://localhost/gt3';

mongoose.connect(dbLoc);

app.use(express.static(__dirname + '../client'));
require('./config/routes.js')(app, express);

app.listen(8001);
module.exports = app;