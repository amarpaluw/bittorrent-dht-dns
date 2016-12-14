var net = require('net'),
socks = require('./socks.js'),
info = console.log.bind(console);

var ed = require('ed25519-supercop')
var DHT = require('bittorrent-dht')
var dht = new DHT({ verify: ed.verify })

var key = new Buffer(
    '1yMCDW63E2Y4w+enapqgEnm15kU=',
    // 'QiY3P0Buh6lQEXtiuugQ/m8b20M=',
    'base64'
)
console.log("Buffer len", key.length);

domainToIp = {};
num = 1;
dhtGet(key, num);

function dhtGet(key, num) {
    console.log("querying dht");
    dht.get(key, function (err, res) {
        if (err) {
            console.error("Error reading from dht", err);
        } else {
            console.log(`Read #${num} from dht ${res.v.toString()}`);
            var arr = res.v.toString().split(" ");
            for (var i = 0; i < arr.length - 1 ; i++) {
                domainSplit = arr[i].split(":");
                domainToIp[domainSplit[0]] = domainToIp[1];
            }

            if (arr[arr.length - 1] !== "null") {
                dhtGet(new Buffer(arr[arr.length - 1], 'base64'), num + 1);
            }

        }
    });
}
