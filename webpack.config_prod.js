const path = require('path');
const webpack = require("webpack");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const common = require('./webpack.config');

//noinspection JSDeprecatedSymbols
const prodConfig = Object.assign({}, common, {
      plugins: [
        new webpack.NoErrorsPlugin(),
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.DefinePlugin({
          // the api server url could be something like http://myserver:8080
          // however, we use blank in order to server all api requests from the same server as the html/css/js - files
          // this works both for development (with the devserver proxy) and in production
          __API_SERVER_URL__: JSON.stringify(''),
          __VERSION__: JSON.stringify(require("./package.json").version),
          __BUILD_NUMBER__: JSON.stringify(process.env.BUILD_NUMBER),
          __GIT_COMMIT__: JSON.stringify(process.env.GIT_COMMIT),
          __BUILD_TIME__: JSON.stringify(new Date().toUTCString()),
          __NODE_ENV__: JSON.stringify('production')
        }),
        new webpack.optimize.UglifyJsPlugin({
          compressor: {
            warnings: false
          }
        }),
        // avoid browser caching of bundle
        new HtmlWebpackPlugin({
          hash: true,
          title: 'Game of Life',
          filename: '../index.html',
          template: 'assets.html'
        })],

      module: {
        loaders: common.module.loaders.map(o => {
          return Object.assign(o, {loader: o.loader.replace('file-loader?name=img/[name].[ext]', 'file-loader?name=img/[name]-[hash:6].[ext]')})
        })
      }
    })
    ;

module.exports = prodConfig;