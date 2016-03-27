const webpack = require('webpack');

module.exports = {
    entry: './example/main.js',
    devtool: 'source-map',
    module: {
        loaders: [
            { test: /\.js$/, loader: 'babel', exclude: /node_modules/ }
        ]
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': { 'NODE_ENV': '"production"' }
        })
    ],
    output: {
        filename: "example/bundle.js"
    }
};
