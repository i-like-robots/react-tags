const webpack = require('webpack')

module.exports = [{
  name: 'example',
  entry: './example/main.js',
  devtool: 'source-map',
  module: {
    loaders: [
      { test: /\.js$/, loader: 'buble-loader?objectAssign=Object.assign', exclude: /node_modules/ }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': { 'NODE_ENV': '"production"' }
    })
  ],
  output: {
    filename: 'example/bundle.js'
  },
  // resolve: {
  //   alias: {
  //     'react': 'preact-compat',
  //     'react-dom': 'preact-compat'
  //   }
  // }
}]
