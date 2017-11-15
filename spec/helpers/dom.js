'use strict'

// Based on:
// <http://jaketrent.com/post/testing-react-with-jsdom/>
// <https://github.com/jesstelford/react-testing-mocha-jsdom>

const jsdom = require('jsdom')

const { window } = new jsdom.JSDOM('<html><body><div id="app"></div></body></html>', {})

global.window = window

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
