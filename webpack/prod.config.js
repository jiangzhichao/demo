/**
 * Created by jiang on 2017/7/3.
 */
const path = require('path');
const webpack = require('webpack');
const CleanPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    devtool: 'source-map',
    context: path.resolve(__dirname, '../src'),
    entry: {
        main: 'app.js',
    },
    output: {
        path: path.resolve(__dirname, '../build'),
        publicPath: '/',
        filename: 'js/[name][hash].js',
        chunkFilename: 'js/[name]-[chunkhash].js'
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                use: ['babel-loader']
            }, {
                test: /\.json$/,
                use: ['json-loader']
            }, {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: ['css-loader?minimize=true&sourceMap', 'postcss-loader']
                })
            }, {
                test: /\.less$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: ['css-loader?minimize=true&sourceMap', 'postcss-loader', 'less-loader']
                })
            }, {
                test: /\.jpe?g$|\.gif$|\.png$/,
                use: ['url-loader?limit=10000&name=images/[name].[ext]']
            }, {
                test: /\.ico|\.svg$|\.woff$|\.ttf$|\.eot$/,
                use: ['url-loader?limit=10000&name=fonts/[name].[ext]']
            }, {
                test: /\.scss$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: ['css-loader?minimize=true&sourceMap', 'postcss-loader', 'sass-loader']
                })
            }, {
                test: /\.html$/,
                use: 'html-loader?minimize'
            }
        ]
    },
    resolve: {
        modules: [
            'src',
            'node_modules'
        ],
        extensions: ['.json', '.js', '.jsx']
    },
    plugins: [
        new CleanPlugin(['build'], { root: path.resolve(__dirname, '../') }),
        new ExtractTextPlugin('css/[hash].css'),
        new HtmlWebpackPlugin({
            title: 'sefonsoft-react-starter-kit',
            filename: 'index.html',
            template: './helpers/template.html'
        }),
        new webpack.DefinePlugin({
            __DEVELOPMENT__: false,
            'process.env': { NODE_ENV: '"production"' },
        }),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false,
                drop_debugger: true,
                drop_console: true
            },
            sourceMap: true
        }),
        new CopyWebpackPlugin([{ from: './public', to: 'public' }]),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            minChunks: function (module, count) {
                return (
                    module.resource &&
                    /\.js$/.test(module.resource) &&
                    module.resource.indexOf(
                        path.join(__dirname, '../node_modules')
                    ) === 0
                )
            }
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'manifest',
            chunks: ['vendor']
        })
    ]
};
