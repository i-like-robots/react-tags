const webpack = require('webpack');

module.exports = {
    entry: './example/main.js',
    devtool: 'source-map',
    module: {
        loaders: [
            { test: /\.js$/, loader: 'babel-loader', exclude: /node_modules/ }
        ]
    },
    output: {
        filename: "example/bundle.js"
    }
};
