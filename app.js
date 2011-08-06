
/**
 * Module dependencies.
 */

var express = require('express'),
	app     = express.createServer(),
	io      = require('socket.io'),
	ejs     = require('ejs'),
	
	options = {
        host : 'localhost',
        port : 3000
    },
    
    stocks = [
      	'Genting Malaysia',
      	'Maybank',
      	'Nestle',
      	'Telekom Malaysia',
      	'Tenaga Nasional Berhad'
        ],

	quotes = [];

// Express Configuration
app.configure(function(){
  app.register('html', ejs);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'html');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

// Routes
app.get('/', function(req, res){
  res.render('index', { title: 'Live Stockboard' });
});

app.listen(options.port, options.host, function() {
    console.log("Server running on http://%s:%d", options.host, options.port);
});
