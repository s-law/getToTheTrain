var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

var app = express();
var dbLoc = process.env.DB || 'mongodb://localhost/gt3';
var port = process.env.PORT || 8001;

mongoose.connect(dbLoc);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/../client'));
require('./config/routes.js')(app, express);

app.listen(port);
module.exports = app;