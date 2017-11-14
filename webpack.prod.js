const webpack = require('webpack')
const path = require('path')

module.exports = {
  entry: {
    app: ['babel-polyfill', './src/client/components/Router/Router.jsx', './src/client/styles/base.scss'],
    vendor: ['react', 'react-dom', 'react-router', 'react-bootstrap', 'react-router-bootstrap']
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
      sourceMap: true,
      parallel: true,
      uglifyOptions: {
        ie8: false,
        mangle: {
          screw_ie8: true,
          keep_fnames: true
        }
      },
      compress: {
        screw_ie8: true,
        warnings: false
      },
      output: {
        beautify: false,
        comments: false
      }
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    }),
    new webpack.optimize.ModuleConcatenationPlugin(),
    new webpack.optimize.AggressiveMergingPlugin()
  ],
  devtool: 'source-map',
  resolve: {
    extensions: ['.js', '.jsx']
  },
  module: {
    loaders: [
      {
        test: /\.jsx$/,
        loader: 'babel-loader',
        query: {
          presets: ['react', 'es2015', 'stage-2']
        }
      },
      {
        test: /\.scss$/,
        exclude: /(node_modules)/,
        loaders: ['style-loader', 'css-loader', 'sass-loader']
      }
    ]
  }
}
