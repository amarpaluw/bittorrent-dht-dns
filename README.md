# bittorrent-dht-dns
A way to view websites in oppressive countries that are actively filtering or redirecting DNS traffic. The server periodically stores the DNS resolutions for top 1000 Alexa sites in the Bittorrent dht, and the client is a locally run web proxy which performs the dns lookups through the dht. Users simply need configure Firefox to tunnel traffic through the client in order to browse previously blocked sites.

