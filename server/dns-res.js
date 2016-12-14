var async = require("async");
const dns = require('dns');
const alexa = require('alexa-top-sites');
var DEBUG = 1;
const { getPages, byCategory } = require('alexa-top-sites');

// Get the first 10 pages (250 results) of http://www.alexa.com/topsites/category/Top/Computers/Internet

module.exports.getDnsResolutions = getDnsResolutions;

// returns array of domain:ip for top 25 Alexa sites
function getDnsResolutions(callback) {
    var topSites = [];
    // alexa.global(250).then(function(res){
    getPages(byCategory, 'Computers/Internet', 10).then(function(res){
        // console.log("REs = ", res);
        topSites = res;// res["sites"];
        if (DEBUG) {
            console.log(topSites);
            console.log("Number of top sites", topSites.length);
            // return;
        }
        async.map(topSites, dnsLookup, function(err, results) {
            if (err) console.error(err);
            callback(results);
        });
    }, function(err){
        return console.error('Error in Alexa sites fetching', err);
    });
}

// finds the ip address for a given domain
function dnsLookup(item, callback) {
    // var domain = item.replace(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n]+)/im, "");
    var domain = item.replace(/.*?:\/\//g, "");
    var index = domain.indexOf("/");
    var domain2 = domain;
    if (index != -1) {
        domain2 = domain.substring(0, index);
    }
    domain2 = domain2.replace("www.", "");
    console.log(item, domain2);

    dns.lookup(domain2, function (err, addresses, family) {
        if (err) {
            console.log("ERROR")
            // return console.error(err);
            callback("Error resolving domain", null);
        }
    	var domainToIP = domain2 + ":" + addresses;
        if (DEBUG) {
            console.log("DNS Lookup domain to ip", domainToIP);
        }
        // sends the ip resolution to map functionn
        callback(null, domainToIP);
    })
}
