'use strict'

// Based on:
// <http://jaketrent.com/post/testing-react-with-jsdom/>
// <https://github.com/jesstelford/react-testing-mocha-jsdom>

const jsdom = require('jsdom')

const doc = '<html><body><div id="app"></div></body></html>'

const { window } = new jsdom.JSDOM(doc, {
  url: 'http://localhost/'
})

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

// A simple requestAnimationFrame shim which is required by React
window.requestAnimationFrame = (callback) => {
  setTimeout(callback, 0)
}
