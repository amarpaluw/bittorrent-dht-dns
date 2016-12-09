var async = require("async");
const dns = require('dns');
const alexa = require('alexa-top-sites');


function dnsLookup(item, callback) {
    var domain = item.replace(/.*?:\/\//g, "");
    dns.lookup(domain, function (err, addresses, family) {
        if (err) return console.error(err);
    	var domain_to_ip = domain + ":" + addresses;
        // sends the ip resolution to map functionn
        callback(null, domain_to_ip);
    })
}

function getDnsResolutions(callback) {
    var topSites = [];
    alexa.global().then(function(res){
        topSites = res["sites"];
        async.map(topSites, dnsLookup, function(err, results) {
            callback(results);
        });
    }, function(err){
        return console.error('Error in Alexa sites fetching', err);
    });
}

module.exports.getDnsResolutions = getDnsResolutions;
