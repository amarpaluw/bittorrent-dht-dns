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
var REFRESH_INTERVAL = 600000;

setInterval(function() {
    console.log("Querying DHT for updated entries");
    queryDHT();
}, REFRESH_INTERVAL);

var initialKey = new Buffer(
  'nyJDeBAaWjndr2wEIualWD4y7I8=',
  'base64'
)

var key;
var index;

var domainToIp = {}

function queryDHT() {
    if (!key) {
        key = initialKey
        index = 0
    }
    dht.get(key, function (err, res) {
        if (err) {
            console.error("Error reading from dht", err);
        } else {
            if (res != null) {
              // console.log(res)
              console.log(`Read page[${index}] ~~~~~~~~~~~~~~`);
              var arr = res.v.toString().split(" ");
              var len = arr.length - 1
              for (var i = 0; i < len; i++) {
                  var kv = arr[i].split(":")
                  domainToIp[kv[0]] = kv[1]
                  console.log(kv)
              }
              if (arr[len] === 'null') {
                  key = initialKey
                  index = 0
                  console.log('DNS records fetched from DHT. Ready.')
              } else {
                  console.log(`Pointer to next page = ${arr[len]} ->`)
                  key = new Buffer(
                      arr[len],
                      'base64'
                  )
                  index++
                  queryDHT(key)
              }
            } else {
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
