// page-mod API
var pageMod = require('sdk/page-mod');
// self API
var self = require('sdk/self');

pageMod.PageMod({
  include: [
    /https:\/\/github\.com\/[^\/]+\/[^\/]+\/(pull|commit|compare)\/.*/,
    /https:\/\/[^\/]+\/[^\/]+\/[^\/]+\/(pull|commit|compare)\/.*/,
  ],
  contentScriptFile: [
    self.data.url('js/vendor/jquery-1.9.1.min.js'),
    self.data.url('js/octosplit.js')
  ],
  contentStyleFile: self.data.url('css/octosplit.css')
});
