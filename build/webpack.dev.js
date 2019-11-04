const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const package = require('../package.json');

module.exports = merge(common, {
    mode: 'development',
    devtool: 'inline-source-map',
    devServer: {
        contentBase: '../dist',
        hot: true,
        host: 'localhost'  // 如果希望服务器外部可访问，请设为 0.0.0.0
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: package.description,
            template: './src/index.html',
            filename: './index.html',
            inject: 'body',
            minify: false
        }),
    ]
});
