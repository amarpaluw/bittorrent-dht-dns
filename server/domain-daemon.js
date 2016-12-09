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
var kpGenerator = KP();
var firstKp = KP(require(path.resolve("keypair.json")));

var DHT = require('bittorrent-dht');
var dht = new DHT({ verify: ed.verify });
var MAX_SIZE = 100;
var PUBLIC_KEY_SIZE = 32;
var DEBUG = 1;


var gdns = require('./dns-res');
gdns.getDnsResolutions(updateDht);


function updateDht(resolutions) {
    if (DEBUG) {
        console.log("Got Resolutions", resolutions);
    }
    var pages = assignResolutionsToPages(resolutions);
    var linkedPages = linkPages(pages);
    insertPagesIntoDHT(linkedPages);
}

// array of resolutions that are concatenated into a string that's under
// the MAX_SIZE is returned
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

// each page is assigned a keypair and the keypair of the next page
function linkPages(pages) {
    var curr = firstKp;
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

function insertPagesIntoDHT(linkedPages) {
    // perform a map function with a put over all elements
}


function generateKeys() {
    return KP();
}
