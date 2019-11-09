const merge = require('webpack-merge')
const common = require('./webpack.common')
const webpack = require('webpack')

module.exports = merge(common, {
    mode: 'development',
    devtool: 'inline-source-map',
    devServer: {
        contentBase: './dist',
        port: 8823,
        hot: true,
        open: true,
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin()
    ]
})