/**
 * livestock.js
 */
(function() {
    var socket      = null,
        options     = {
            host : '192.168.1.103',
            port : 3000,
            ns   : 'livestock'
        };
    
    socket = io.connect('http://' + options.host + ':' + options.port + '/' + options.ns);

    socket.on('connect', function() {
        socket.on('ready', function(quotes) {
            $('body').show();

            quotes.forEach(shout);

            socket.on('message', shout);
        });
    });
    
    function shout(data) {
        console.log(data);
        var name    = data.Name,
            lasttrade   = data.LastTradeRealtimeWithTime;
        	change   = data.Change;
        	prevclose   = data.PreviousClose;
        	open   = data.Open;

        $('<div>').addClass('quote')
            .append('<div class="stock">Stock: ' + name + '</div>')
            .append('<div class="lasttrade">Last Trade Price: ' + lasttrade + '</div>')
            .append('<div class="change">Change: ' + change + '</div>')
            .append('<div class="prevclose">Previous Close: ' + prevclose + '</div>')
            .append('<div class="open">Open: ' + open + '</div>')
            .prependTo('#quotes');

        $('#quote').val('').focus();
    }
})();
