'use strict';

require('babel-register')({
  presets: ['es2015', 'react'],
  plugins: ['transform-async-to-generator']
});
require('babel-polyfill');

require('./server.js');
//# sourceMappingURL=start_hook.js.map