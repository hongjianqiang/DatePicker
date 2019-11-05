const HtmlWebpackPlugin = require('html-webpack-plugin');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const package = require('../package.json');

module.exports = merge(common, {
    mode: 'production'
});
