'use strict'

// Based on:
// <http://jaketrent.com/post/testing-react-with-jsdom/>
// <https://github.com/jesstelford/react-testing-mocha-jsdom>

const jsdom = require('jsdom')

global.document = jsdom.jsdom('<html><body><div id="app"></div></body></html>', {})
global.window = document.defaultView

// Add fetch polyfill
window.fetch = global.fetch

// from mocha-jsdom https://github.com/rstacruz/mocha-jsdom/blob/master/index.js#L80
for (const key in window) {
  if (!window.hasOwnProperty(key)) {
    continue
  }

  if (key in global) {
    continue
  }

  global[key] = window[key]
}
