var path = require('path')
var webpack = require('webpack')

module.exports = {
  entry: [
    './analytics.js'
  ],
  output: {
    filename: 'vue-analytics.min.js',
    libraryTarget: 'umd'
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    }),
  ],
  resolve: {
    extensions: [ '', '.js', '.json' ]
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        query: {
          presets: [ 'es2015', 'stage-2' ]
        },
        exclude: /node_modules/
      }
    ]
  }
}
