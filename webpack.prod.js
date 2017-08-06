const webpack = require('webpack')
const path = require('path')

module.exports = {
  entry: {
    app: './src/client/jsx/Router.jsx',
    vendor: [ 'react', 'react-dom', 'react-router', 'react-bootstrap', 'react-router-bootstrap' ]
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'js/app.bundle.js'
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({ name: 'vendor', filename: 'js/vendor.bundle.js' }),
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false
    }),
    new webpack.optimize.UglifyJsPlugin({
      beautify: false,
      mangle: {
        screw_ie8: true,
        keep_fnames: true
      },
      compress: {
        screw_ie8: true
      },
      comments: false
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    })
  ],
  devtool: 'source-map',
  module: {
    loaders: [
      {
        test: /\.jsx$/,
        loader: 'babel-loader',
        query: {
          presets: [ 'react', 'es2015', 'stage-2' ]
        }
      }
    ]
  }
}
