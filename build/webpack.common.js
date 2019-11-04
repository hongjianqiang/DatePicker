const path = require('path');

module.exports = {
    entry: {
        app: './src/DatePicker.js'
    },
    module: {
        rules: [{
            test: /\.js$/,
            exclude: /node_modules/,
            loader: 'babel-loader'
        }, {
            test: /\.less$/,
            use: [{
                loader: 'style-loader',
                options: {
                    insert: function insertAtTop(element) {
                        const  parent = document.querySelector('head');
                        // eslint-disable-next-line no-underscore-dangle
                        const lastInsertedElement = window._lastElementInsertedByStyleLoader;

                        if (!lastInsertedElement) {
                            parent.insertBefore(element, parent.firstChild);
                        } else if (lastInsertedElement.nextSibling) {
                            parent.insertBefore(element, lastInsertedElement.nextSibling);
                        } else {
                            parent.appendChild(element);
                        }

                        // eslint-disable-next-line no-underscore-dangle
                        window._lastElementInsertedByStyleLoader = element;
                    },
                }
            }, {
                loader: 'css-loader',
                options: {
                    // modules: { // 开启CSS模块化
                    //     localIdentName: '[local]__[hash:6]'
                    // }
                }
            }, {
                loader: 'postcss-loader',
            }, {
                loader: 'less-loader',
            }]
        }, {
            test: /\.svg$/,
            loader: 'file-loader',
        }]
    },
    plugins: [
    ],
    output: {
        path: path.resolve(__dirname, '../lib'),
        filename: 'DatePicker.min.js',
    }
};
