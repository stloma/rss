const webpack = require('webpack')
const path = require('path')

module.exports = {
  entry: {
    app: './src/client/jsx/Router.jsx',
    vendor: [ 'react', 'react-dom', 'react-router' ]
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'js/app.bundle.js'
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({ name: 'vendor', filename: 'js/vendor.bundle.js' })
  ],
  devServer: {
    port: 8000,
    contentBase: path.join(__dirname, './dist'),
    proxy: {
      '/api/*': {
        target: 'http://127.0.0.1:3000'
      }
    },
    historyApiFallback: true,
    disableHostCheck: true
  },
  stats: {
    colors: true,
    reasons: true,
    chunks: true
  },
  devtool: 'source-map',
  module: {
    loaders: [
      {
        enforce: 'pre',
        test: /\.jsx$/,
        loader: 'babel-loader',
        query: {
          presets: [ 'react', 'es2015' ]
        }
      }
    ]
  }
}
