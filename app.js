/**
 * Module dependencies.
 */
var fs      = require('fs'),
    express = require('express'),
	app     = express.createServer(),
	io      = require('socket.io').listen(app),
	ejs     = require('ejs'),
	_date 	= require('underscore.date'),
	
	options = {
        host : '192.168.1.103',
        port : 3000
    },

	quotes,
    livestock;

// Get DB
fs.readFile('./db.json', 'utf-8', function(err, data) {
    if (err) {
        throw err;
    }

    quotes = JSON.parse(data);
});

// Express Configuration
app.configure(function(){
    app.register('html', ejs);
    app.set('views', __dirname + '/views');
    app.set('view engine', 'html');

    app.use(app.router);
    app.use(express.static(__dirname + '/public'));

    app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

//Socket.IO configuration
io.configure(function() {
  io.set('log level', 1);
});

//Socket.IO events
livestock = io.of('/livestock')
	.on('connection', function (socket) {
	    socket.emit('ready', quotes);
    });

// Routes
app.get('/', function(req, res){
    res.render('index', { title: 'Live Stockboard' });
});

app.get('/stock/:name/:price/:change/:close/:open', function(req, res) {
	var current = new Date();
	var data	= {
			Name: req.param('name'),
			LastTradeRealtimeWithTime:  _date(current).format('MMM D HH:mm:ss') + ' - <b>' + req.param('price') + '</b>',
			Change: req.param('change'),
			PreviousClose: req.param('close'),
			Open: req.param('open')			
	};
	
	quotes.push(data);
	livestock.emit('message', data);
	
	res.send(200);
});

app.listen(options.port, options.host, function() {
    console.log("Server running on http://%s:%d ...", options.host, options.port);
});
