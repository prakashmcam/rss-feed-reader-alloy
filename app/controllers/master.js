var rss = require('rss');
var RSS_URL = OS_MOBILEWEB ? '/goirss.xml' : 'http://www.thehindu.com/news/national/tamil-nadu/?service=rss';
// open detail window
function openDetail(e) {
$.trigger('detail', e);
}

// Refresh table data from remote RSS feed
function refreshRss() {
rss.loadRssFeed( RSS_URL, {
success: function(data) {
var rows = [];
_.each(data, function(item) {
rows.push(Alloy.createController('row', {
articleUrl: item.link,
title: item.title,
date: item.pubDate,
description: item.description
}).getView());
});
$.table.setData(rows);
}
});
}

// do initial load of RSS
refreshRss();