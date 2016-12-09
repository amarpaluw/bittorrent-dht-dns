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

var ed = require('ed25519-supercop')
var DHT = require('bittorrent-dht')
var dht = new DHT({ verify: ed.verify })
var keypair = ed.createKeyPair(ed.createSeed())
var keypair = {}


var gdns = require('./dns-res');


function updateDht(resolutions) {
    console.log("Got Resolutions", resolutions);
}

gdns.getDnsResolutions(updateDht);

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
