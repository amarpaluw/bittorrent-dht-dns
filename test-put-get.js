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
// var keypair = ed.createKeyPair(ed.createSeed())
var keypair = {}
keypair.publicKey = new Buffer(
 read.sync('publicKey.base64').toString(),
 'base64'
)
keypair.secretKey = new Buffer(
 read.sync('privateKey.base64').toString(),
 'base64'
)
console.log('publickey=', keypair.publicKey.toString('base64'))
console.log('secretkey=', keypair.secretKey.toString('base64'))

// var value = new Buffer(200).fill('whatever') // the payload you want to send
var value = new Buffer(200).fill('isclever') // the payload you want to send
var opts = {
 k: keypair.publicKey,
 seq: 0,
 v: value,
 sign: function (buf) {
   return ed.sign(buf, keypair.publicKey, keypair.secretKey)
 }
}

dht.put(opts, function (err, hash) {
 console.error('error=', err)
 console.log('hash=', hash.toString('base64'))

 var key = hash;
 dht.get(key, function (err, res) {
	 dht.put(res, function () {
		 // re-added the key/value pair
     console.log(res.v.toString())
	 })
 })
})
