const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const config = require('./src/config');
const devWebpackConfig = require('./webpack/dev.config');

const server = new WebpackDevServer(webpack(devWebpackConfig), devWebpackConfig.devServer);

server.listen(config.port, config.host, () => {
    console.log('\n' + '----- do it ------> http://' + config.host + ':' + config.port + '\n');
});
