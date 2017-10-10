require('babel-register')({
  presets: ['es2015', 'react'],
  plugins: ['transform-async-to-generator']
})
require('babel-polyfill')

require('./server.js')
