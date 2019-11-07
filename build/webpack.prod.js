const package = require('../package.json');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
    mode: 'production',
    plugins: [
        new HtmlWebpackPlugin({
            title: package.description,
            template: './src/index.html',
            filename: '../demo/index.html',
            inject: 'body',
            minify: true
        }),
    ]
});
