
var net = require('net'),
socks = require('./socks.js'),
info = console.log.bind(console);

var ed = require('ed25519-supercop')
var DHT = require('bittorrent-dht')
var dht = new DHT({ verify: ed.verify })

var key = new Buffer(
    'h9VsWYniflvfaC1mub8GqbHGqU8=',
    'base64'
)

domainToIp = {}

function queryDHT() {
    console.log("querying dht");
    dht.get(key, function (err, res) {
        if (err) {
            console.error("Error reading from dht", err);
        } else {
            console.log("Read from dht", res.v.toString());
            var arr = res.v.toString().split(":");
            domainToIp[arr[0]] = arr[1];
        }
    });
}
// set timer to update the domain to ip resolutions every 10 minutes
// since the bittorrent-dht values expire after 2 hours
setInterval(function() {
    queryDHT();
}, 60000);

queryDHT();

// Create server
// The server accepts SOCKS connections. This particular server acts as a proxy.
var HOST='127.0.0.1',
PORT='8888',
server = socks.createServer(function(socket, port, address, proxy_ready) {

    if (address in domainToIp) {
            address = domainToIp['facebook.com'];
            console.log("Modifying facebook's ip to ", address);
    }


    //address = "www.youtube.com";
    var proxy = net.createConnection({port:port, host:address,localAddress:process.argv[2]||undefined}, proxy_ready);
    var localAddress,localPort;
    proxy.on('connect', function(){
        info('%s:%d <== %s:%d ==> %s:%d',socket.remoteAddress,socket.remotePort,
        proxy.localAddress,proxy.localPort,proxy.remoteAddress,proxy.remotePort);
        localAddress=proxy.localAddress;
        localPort=proxy.localPort;
    }.bind(this));
    proxy.on('data', function(d) {
        try {
            //console.log('receiving ' + d.length + ' bytes from proxy');
            if (!socket.write(d)) {
                proxy.pause();

                socket.on('drain', function(){
                    proxy.resume();
                });
                setTimeout(function(){
                    proxy.resume();
                }, 100);
            }
        } catch(err) {
        }
    });
    socket.on('data', function(d) {
        // If the application tries to send data before the proxy is ready, then that is it's own problem.
        try {
            //console.log('sending ' + d.length + ' bytes to proxy');
            if (!proxy.write(d)) {
                socket.pause();

                proxy.on('drain', function(){
                    socket.resume();
                });
                setTimeout(function(){
                    socket.resume();
                }, 100);
            }
        } catch(err) {
        }
    });

    proxy.on('error', function(err){
        //console.log('Ignore proxy error');
    });
    proxy.on('close', function(had_error) {
        try {
            if(localAddress && localPort)
            console.log('The proxy %s:%d closed', localAddress, localPort);
            else
            console.error('Connect to %s:%d failed', address, port);
            socket.end();
        } catch (err) {
        }
    }.bind(this));

    socket.on('error', function(err){
        //console.log('Ignore socket error');
    });
    socket.on('close', function(had_error) {
        try {
            if (this.proxy !== undefined) {
                proxy.removeAllListeners('data');
                proxy.end();
            }
            //console.error('The socket %s:%d closed',socket.remoteAddress,socket.remotePort);
        } catch (err) {
        }
    }.bind(this));

});

server.on('error', function (e) {
    console.error('SERVER ERROR: %j', e);
    if (e.code == 'EADDRINUSE') {
        console.log('Address in use, retrying in 10 seconds...');
        setTimeout(function () {
            console.log('Reconnecting to %s:%s', HOST, PORT);
            server.close();
            server.listen(PORT, HOST);
        }, 10000);
    }
});
server.listen(PORT, HOST);





// vim: set filetype=javascript syntax=javascript :