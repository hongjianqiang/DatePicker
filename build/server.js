const express = require('express');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');

const PORT = process.env.PORT || 3000;

console.log(`> Starting dev server...\n`);

const app = express();

const config = require('./webpack.dev.js');

{
    /**
     * 模块热加载相关功能，实现修改代码后浏览器自动刷新
     */
    if( 'plugins' in config ) {
        const plugins = config.plugins;

        config.plugins = [
            ...plugins,
            new webpack.HotModuleReplacementPlugin()
        ];
    }

    if( 'entry' in config ) {
        const entry = config.entry;

        config.entry = {};

        for( const [key, value] of Object.entries(entry) ) {
            if( '[object String]' == Object.prototype.toString.call(value) ) {
                config.entry[key] = [
                    'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000',
                    value
                ];
            } else if( '[object Array]' == Object.prototype.toString.call(value) ) {
                config.entry[key] = [
                    'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000',
                    ...value
                ];
            }
        }
    }
}

const compiler = webpack(config);

const devInstance = webpackDevMiddleware(compiler, {
    publicPath: config.output.publicPath,
    logLevel: 'info',  // 默认 info, 设置为 silent 不输出打包信息
    stats: {
        all: false,
        hash: true,
        version: true,
        timings: true,
        builtAt: true,
        assets: true,
        entrypoints: true,
        warnings: true,
        colors: true
    }
});

const hotInstance = webpackHotMiddleware(compiler, {
    log: false,
    path: '/__webpack_hmr',  // 模块热加载相关配置，默认为 /__webpack_hmr
    heartbeat: 2*1000
})

app.use(devInstance);
app.use(hotInstance);

devInstance.waitUntilValid(() => {
    console.clear();
    console.log(`\n> Listening at http://localhost:${PORT}`);
    console.log(`> Main Page http://localhost:${PORT}\n`);
});

app.listen(PORT);
