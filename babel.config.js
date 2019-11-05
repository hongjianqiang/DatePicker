module.exports = {
    "presets": [
        [
            "@babel/preset-env",
            {
                "debug": false,
                "useBuiltIns": "usage",
                "targets": "> 0.25%",
                "corejs": 3  // 因为使用 useBuiltIns 字段，所以需要显式指定corejs版本
            }
        ]
    ],
    "plugins": [
        ["@babel/plugin-proposal-class-properties", { "loose": true }]
    ]
}
