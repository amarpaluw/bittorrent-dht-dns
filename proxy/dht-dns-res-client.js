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


var DHT = require('bittorrent-dht');
var dht = new DHT({ verify: ed.verify });
var MAX_SIZE = 100;
var PUBLIC_KEY_SIZE = 32;
var DEBUG = 1;

var initialKey = new Buffer(
  /* '1yMCDW63E2Y4w+enapqgEnm15kU=', */ 'QiY3P0Buh6lQEXtiuugQ/m8b20M=',
  'base64'
)

var key;

var domainToIp = {}

function queryDHT() {
    if (!key) {
        key = initialKey
    }
    console.log("querying dht", key);
    dht.get(key, function (err, res) {
        if (err) {
            console.error("Error reading from dht", err);
        } else {
            if (res != null) {
              console.log(res)
              console.log("Read from dht", res.v.toString());
              var arr = res.v.toString().split(" ");
              var len = arr.length - 1
              for (var i = 0; i < len; i++) {
                  var kv = arr[i].split(":")
                  domainToIp[kv[0]] = kv[1]
              }
              if (arr[len] === 'null') {
                  key = initialKey
              } else {
                  key = new Buffer(
                      arr[len],
                      'base64'
                  )
                  queryDHT(key)
              }
            } else {
              console.log(res)
              queryDHT(key)
            }
        }
    });
}

function dnsLookup(domain) {
    if (domain in domainToIp) {
        return domainToIp[domain]
    } else {
        return null
    }
}

module.exports = {
  queryDHT : queryDHT,
  dnsLookup : dnsLookup
}
