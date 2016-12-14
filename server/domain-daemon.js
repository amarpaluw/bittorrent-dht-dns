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
var path = require('path');
var KP = require('bittorrent-dht-store-keypair')
var firstKp = KP(require(path.resolve("keypair.json")));
var getDns = require('./dns-res');
var kpGenerator = KP();
var DHT = require('bittorrent-dht');
var dht = new DHT({ verify: ed.verify });
var inserter = require('./insert-dht');

var MAX_SIZE = 950; // 20 is length of hash value
var PUBLIC_KEY_SIZE = 32;
var DEBUG = 0;
var REFRESH_INTERVAL = 120000; // 10 minutes

var iterNumber = 0;
setInterval(function() {
    iterNumber++;
    console.log("Iteration", iterNumber);
    updateDht();
}, REFRESH_INTERVAL);

console.log("Iteration", iterNumber);
updateDht();

function updateDht () {
    getDns.getDnsResolutions(function prepareResolutionsAndInsert(resolutions) {
        if (DEBUG) {
            console.log("Got Resolutions", resolutions);
        }
        var pages = assignResolutionsToPages(resolutions);
        var linkedPages = linkPages(pages);
        var x = 5;
        inserter.insertPagesIntoDHT(linkedPages, function(results) {
            if (DEBUG) {
                console.log("Insert complete!");
            }
            console.log("results = ", results);
        });
    });
}

// array of resolutions that are concatenated into a string that's under
// the MAX_SIZE is returned
function assignResolutionsToPages(resolutions) {
    var currString = "";
    var pages = [];
    for (var i = 0; i < resolutions.length; i++) {
        var buf = Buffer.from((currString + resolutions[i] + " "), 'utf8');
        if (buf.length > MAX_SIZE) {
            pages.push({'resolutions': currString.trim()});
            currString = resolutions[i] + " ";
        } else {
            currString += resolutions[i] + " ";
        }
    }
    pages.push({'resolutions': currString.trim()});

    if (DEBUG) {
        for (var i = 0; i < pages.length; i++) {
            console.log("arr",i,pages[i]);
        }
    }
    return pages
}

// each page is assigned a keypair and the keypair of the next page
function linkPages(pages) {
    var curr = firstKp;
    for (var i = 0; i < pages.length; i++) {
        pages[i]['curr'] = curr;
        curr = generateKeys(curr);
        if (DEBUG) {
            console.log(curr);
        }
    }

    if (DEBUG) {
        console.log("Linked Pages", pages);
    }

    return pages;
}

function generateKeys(prevKey) {
    var kp = ed.createKeyPair(prevKey.publicKey.toString('hex'));
    kp.seq = 1;
    return KP(kp);
}
