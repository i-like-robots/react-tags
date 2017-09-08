const webpack = require('webpack')

module.exports = {
  entry: './example/main.js',
  devtool: 'source-map',
  module: {
    loaders: [
      { test: /\.js$/, loader: 'buble', exclude: /node_modules/ }
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
  devServer: {
    disableHostCheck: true,
    // listen server to be accessed from another host
    // useful for mobile testing
    host: "0.0.0.0",
    port: process.env.PORT || 8080
  }
  // resolve: {
  //   alias: {
  //     'react': 'preact-compat',
  //     'react-dom': 'preact-compat'
  //   }
  // }
}
