const path = require('path');
const webPack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const distFolder = 'dist';

module.exports = {
    mode: 'development',
    entry: {
        demo: [
            'webpack/hot/dev-server',
            'webpack-dev-server/client?http://localhost:8011',
            './demo/bootstrap.tsx']
    },
    output: {
        path: path.resolve(__dirname, distFolder),
        publicPath: '/',
        filename: 'autofontsize.js',
        library: 'AutoFontSize',
        libraryTarget: 'umd'
    },
    devtool: 'source-map',
    devServer: {
        contentBase: '/',
        compress: true,
        port: 8011,
        hot: true,
        inline: false
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: 'awesome-typescript-loader',
                exclude: /node_modules/
            },
            {
                enforce: 'pre',
                test: /\.js$/,
                loader: 'source-map-loader'
            }
        ]
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js']
    },
    externals: {
        react: 'React',
        'react-dom': 'ReactDOM'
    },
    plugins: [
        new webPack.HotModuleReplacementPlugin(),
        new HtmlWebpackPlugin({
            template: './demo/template.html'
        })
    ]
};
