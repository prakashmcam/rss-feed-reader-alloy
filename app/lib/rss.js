//var RSS_URL = OS_MOBILEWEB ? '/samplefeed.xml' : 'http://goidirectory.gov.in/rss/new_additions_rss.php';
var MONTH_MAP = { JAN: 1, FEB: 2, MAR: 3, APR: 4, MAY: 5, JUN: 6, JUL: 7, AUG: 8, SEP: 9, OCT: 10, NOV: 11, DEC: 12 };

var getRssText = function(item, key) {
	return OS_MOBILEWEB ?
			item.getElementsByTagName(key).item(0).textContent : //childNodes[0].nodeValue :
			item.getElementsByTagName(key).item(0).text;
}
var getRSSTextNS = function(item,ns, key){
	// ns = 'http://mashable.com/', key='thumbnail'
		var elemsValue;
		try {
		var elems = item.getElementsByTagNameNS(ns, key);
		elemsValue = elems.item(0).getElementsByTagName('img').item(0).getAttribute('src');
		} catch (ex) {
		elemsValue = '';
		}
		return elemsValue;
}

var parseDate = function(dateString) {
	var dateParts = dateString.split(' ');
	var timeParts = dateParts[4].split(':');
	return MONTH_MAP[dateParts[2].toUpperCase()] + '/' + dateParts[1] + ' ' + timeParts[0] + ':' + timeParts[1];
}

exports.loadRssFeed = function(RSS_URL, o, tries) {
	var xhr = Titanium.Network.createHTTPClient();	
	tries = tries || 0;
	xhr.open('GET', RSS_URL);
	xhr.onload = function(e) {
		var xml = this.responseXML;
		
		if (xml === null || xml.documentElement === null) { 
			if (tries < 3) {
				tries++
				exports.loadRssFeed(o, tries);
				return;
			} else {
				alert('Error reading RSS feed. Make sure you have a network connection and try refreshing.');
				if (o.error) { o.error(); }
				return;	
			}	
		}
		
		var items = xml.documentElement.getElementsByTagName("item");
		var data = [];

		for (var i = 0; i < items.length; i++) {
			var item = items.item(i);
			data.push({
				title: getRssText(item, 'title'),
				link: getRssText(item, 'link'),
				description: getRssText(item, 'description'),
				pubDate: parseDate(getRssText(item, 'pubDate'))
			});
		}
		if (o.success) { o.success(data); }
	};
	xhr.onerror = function(e) {
		if (o.error) { o.error(); }
	};

	if (o.start) { o.start(); }
	xhr.send();	
};