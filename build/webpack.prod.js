const HtmlWebpackPlugin = require('html-webpack-plugin');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const package = require('../package.json');

module.exports = merge(common, {
    mode: 'production',
    plugins: [
        new HtmlWebpackPlugin({
            title: package.description,
            template: './src/index.html',
            filename: './index.html',
            inject: 'body',
            minify: true
        }),
    ],
    performance: {
        // assetFilter(assetFilename) {
            // 排除 .map .lock .json 文件的性能提示
            // return !(/\.(map|lock|json)$/.test(assetFilename));
        // }
    }
});
