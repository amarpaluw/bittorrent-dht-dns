/*
 * Puts a small into the dht and get it.
 */

var ed = require('ed25519-supercop')
var keypair = ed.createKeyPair(ed.createSeed())

var value = new Buffer(200).fill('whatever') // the payload you want to send
var opts = {
	  k: keypair.publicKey,
	  seq: 0,
	  v: value,
	  sign: function (buf) {
		  return ed.sign(buf, keypair.publicKey, keypair.secretKey)
	  }
}

var DHT = require('bittorrent-dht')
var dht = new DHT

dht.put(opts, function (err, hash) {
	  console.log('Put Successful!')
	  console.log('\tput hash=', hash)
	  // the hash is the key
	  dht.get(hash, function (err, res) {
		  console.log('Get Successful!')
	      console.log('\tgot=', res)
	  })
})
