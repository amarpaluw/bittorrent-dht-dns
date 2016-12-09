var KP = require('bittorrent-dht-store-keypair')
var kp = KP()

console.log(JSON.stringify({
  publicKey: kp.publicKey.toString('hex'),
  secretKey: kp.secretKey.toString('hex')
}))
