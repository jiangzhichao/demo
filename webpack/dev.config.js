const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const config = require('../src/config');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const babelrc = JSON.parse(fs.readFileSync('./.babelrc'));
babelrc.plugins = [
    ...babelrc.plugins,
    ...babelrc.env.development.plugins
];
delete babelrc.env;
babelrc.plugins.forEach((plugin, index) => {
    if (Array.isArray(plugin) && index > 4) {
        plugin[1].transforms.push({
            transform: 'react-transform-hmr',
            imports: ['react'],
            locals: ['module']
        });
    }
});

module.exports = {
    entry: {
        main: [
            `webpack-dev-server/client?http://${config.host}:${config.port}`,
            'webpack/hot/dev-server',
            'app.js',
        ],
    },
    output: {
        filename: 'js/[hash].js',
        path: path.resolve(__dirname, '../build'),
        publicPath: '/'
    },
    devtool: 'inline-source-map',
    context: path.resolve(__dirname, '../src'),
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                use: ['babel-loader?' + JSON.stringify(babelrc), 'eslint-loader']
            }, {
                test: /\.json$/,
                use: ['json-loader']
            }, {
                test: /\.css$/,
                use: ['style-loader', 'css-loader', 'postcss-loader']
            }, {
                test: /\.less$/,
                use: ['style-loader', 'css-loader', 'postcss-loader', 'less-loader']
            }, {
                test: /\.jpe?g$|\.gif$|\.png$/,
                use: ['url-loader?limit=10000&name=images/[name].[ext]']
            }, {
                test: /\.ico|\.svg$|\.woff$|\.ttf$|\.eot$/,
                use: ['url-loader?limit=10000&name=fonts/[name].[ext]']
            }, {
                test: /\.scss$/,
                use: ['style-loader', 'css-loader', 'postcss-loader', 'sass-loader']
            }, {
                test: /\.html$/,
                use: 'html-loader'
            }
        ]
    },
    resolve: {
        alias: {
            'components': path.resolve(__dirname, '../src/components'),
            'containers': path.resolve(__dirname, '../src/containers'),
            'redux/modules': path.resolve(__dirname, '../src/redux/modules'),
            'utils': path.resolve(__dirname, '../src/utils'),
        },
        modules: [
            'src',
            'node_modules'
        ],
        extensions: ['.json', '.js', '.jsx']
    },
    devServer: {
        contentBase: './build',
        hot: true,
        noInfo: false,
        inline: true,
        stats: { colors: true },
        proxy: {
            '/api/*': {
                target: 'http://' + config.apiHost + ':' + config.apiPort,
                secure: false,
            }
        },
        https: false
    },
    plugins: [
        new webpack.DefinePlugin({ __DEVELOPMENT__: true }),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NamedModulesPlugin(),
        // new webpack.NoEmitOnErrorsPlugin(),
        new HtmlWebpackPlugin({
            title: 'sefonsoft-react-starter-kit',
            filename: 'index.html',
            template: './helpers/template.html',
            favicon: '../favicon.ico'
        }),
        new CopyWebpackPlugin([{ from: './public', to: 'public' }])
    ]
};