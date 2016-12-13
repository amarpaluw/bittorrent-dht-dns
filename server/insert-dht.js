
var ed = require('ed25519-supercop');
var DHT = require('bittorrent-dht');
var dht = new DHT({ verify: ed.verify });
var KP = require('bittorrent-dht-store-keypair')
var async = require("async");

var DEBUG = 1;

module.exports.insertPagesIntoDHT = insertPagesIntoDHT;


function insertPagesIntoDHT(linkedPages, callback) {
    console.log("Starting insertion process ~~~~~~~");
    insertPageIntoDHT(linkedPages, linkedPages.length - 1, null, callback);
}

// helper function that recursively puts, starting with lowest level page
function insertPageIntoDHT(linkedPages, index, hash, callback) {
    // perform a map function with a put over all elements
    var page = linkedPages[index];
    var currKp = KP(page['curr']);
    var resAndPointer = page['resolutions'] + " " + hash;
    var buf = Buffer.from(resAndPointer, 'utf8');

    dht.put(currKp.store(buf), function (err, hash) {
        if (err) return console.error('Error in putting in dht=', err);
        if (DEBUG) {
            console.log(`Inserted pages[${index}] = ${resAndPointer}`);
            console.log(`   Hash = ${hash.toString('base64')}`);
        }

        if (index > 0) {
            insertPageIntoDHT(linkedPages, index - 1, hash.toString('base64'), callback);
        } else {
            callback("Completed insertion ~~~~~")
        }
    });
}
