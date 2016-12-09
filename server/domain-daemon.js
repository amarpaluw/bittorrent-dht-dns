// Copyright (C) 2016 Amarpal Singh, Rajas Agashe.
// All rights reserved.
//
// THIS SOFTWARE IS PROVIDED BY THE AUTHOR ``AS IS'' AND ANY EXPRESS OR
// IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
// OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
// IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY DIRECT, INDIRECT,
// INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT
// NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
// DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
// THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
// (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
// THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//

var ed = require('ed25519-supercop');
var DHT = require('bittorrent-dht');
var dht = new DHT({ verify: ed.verify });
var MAX_SIZE = 100;
var PUBLIC_KEY_SIZE = 32;
var DEBUG = 1;


var gdns = require('./dns-res');
gdns.getDnsResolutions(updateDht);


function updateDht(resolutions) {
    console.log("Got Resolutions", resolutions);
    var pages = assignResolutionsToPages(resolutions);
    var linkedPages = linkPages(pages);

}

function assignResolutionsToPages(resolutions) {
    var currString = "";
    var pages = [];
    for (var i = 0; i < resolutions.length; i++) {
        var buf = Buffer.from((currString + resolutions[i] + " "), 'utf8');
        if (buf.length > MAX_SIZE) {
            pages.push({'resolutions': currString});
            currString = resolutions[i] + " ";
        } else {
            currString += resolutions[i] + " ";
        }
    }
    pages.push({'resolutions': currString});

    if (DEBUG) {
        for (var i = 0; i < pages.length; i++) {
            console.log("arr",i,pages[i]);
        }
    }
    return pages
}

function linkPages(pages) {
    // TODO generate the top level pages key from stored seed and time
    // elapsed since time of first seed
    var curr = "";
    for (var i = 0; i < pages.length - 1; i++) {
        pages[i]['next'] = generateKeys();
        pages[i]['curr'] = curr;
        curr = pages[i]['next'];
    }
    pages[pages.length - 1]['curr'] = curr;
    pages[pages.length - 1]['next'] = "";

    if (DEBUG) {
        console.log("Linked Pages", pages);
    }

    return pages;
}


function generateKeys() {
    return ed.createKeyPair(ed.createSeed());
}

// console.log(domain_to_ip);
// var buf = Buffer.from(domain_to_ip, 'utf8');
//
// var opts = {
//     k: keypair.publicKey,
//     seq: 0,
//     v: buf,
//     sign: function (buf) {
//         return ed.sign(buf, keypair.publicKey, keypair.secretKey)
//     }
// }
//
// dht.put(opts, function (err, hash) {
//     console.error('error=', err)
//     console.log('hash=', hash.toString('base64'))
//
//     var key = hash;
//     dht.get(key, function (err, res) {
//         dht.put(res, function () {
//             // re-added the key/value pair
//             console.log(res.v.toString())
//             dht.destroy()
//         })
//     })
// })
