var express = require('express');
var stylus = require('stylus');
var nib = require('nib')
var controllers = require('./controllers');

var mongoose = require('mongoose');
var db = mongoose.createConnection('mongodb://nodejs-camp-user:zd5EfrgE@alex.mongohq.com:10067/nodejs-camp');
var app = express();

// Let stylus use nib for advanced functionality

function compile(str, path) {
    return stylus(str).set('filename', path).use(nib());
}

// Handle database cconnection

db.on('error', function() {
    console.error("Databse connection failed!");
});
db.once('open', function () {
    console.log("Databse connected.");
    startServer();
});

function startServer() {
    // Configuration
    
    app.configure(function() {
        app.set('port', (process.env.PORT | 3000));
        app.set('host', (process.env.IP | 'localhost'));
        app.set('views', __dirname + '/views');
        app.set('view engine', 'jade');
        app.use(express.favicon());
        app.use(express.logger('dev'));
        app.use(express.bodyParser());
        app.use(express.methodOverride());
        app.use(stylus.middleware({
            src: __dirname + '/public',
            compile: compile
        }));
        app.use(app.router);
        app.use(express.static(__dirname + '/public'));
        app.use(logErrors);
        app.use(controllers.error);
    });
    
    // Routes
    
    app.get('/', controllers.index);
	app.get('/overview', controllers.overview);
	app.get('/record', controllers.record);
	app.get('/projects', controllers.projects);
    
    // Start app
    
    app.listen(app.get('port'));
    
    console.log("Server started.");
}

// Error handling

function logErrors(err, req, res, next) {
  console.error(err.stack);
  next(err);
}
