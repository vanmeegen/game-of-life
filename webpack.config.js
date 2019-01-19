const path = require('path');
const webpack = require("webpack");

module.exports = {
  entry: {web: "./src/index.tsx"},
  mode: "development",
  output: {
    // output path
    path: path.resolve(__dirname, 'public/dist'),
    publicPath: 'dist/',
    filename: 'bundle-[name].js'
  },

  devtool: "source-map",

  resolve: {
    // Add '.ts' and '.tsx' as resolvable extensions.
    extensions: [".webpack.js", ".web.js", ".ts", ".tsx", ".js", ".min.js"],
    alias: {"ag-grid-root": __dirname + "/node_modules/ag-grid"}
  },
  module: {
    rules: [
      // All files with a '.ts' or '.tsx' extension will be handled by 'ts-loader'.
      {test: /\.tsx?$/, loader: "ts-loader"},
      {test: /\.css$/, loader: 'style-loader!css-loader'},
      {test: /\.(png|jpg|gif)$/, loader: "file-loader?name=img/[name].[ext]"},

      // loaders needed for bootstrap
      {test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: "file-loader"},
      {test: /\.(woff|woff2)$/, loader: "url-loader?prefix=font/&limit=5000"},
      {test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: "url-loader?limit=10000&mimetype=application/octet-stream"},
      {test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: "url-loader?limit=10000&mimetype=image/svg+xml"},
      // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
      {test: /\.js$/, loader: "source-map-loader", enforce: "pre"},
      {test: /\.tsx?$/, loader: 'tslint-loader', enforce: "pre"}
    ]
  },

  externals: {
  },

  plugins: [new webpack.DefinePlugin({
    // the api server url could be something like http://myserver:8080
    // however, we use blank in order to server all api requests from the same server as the html/css/js - files
    // this works both for development (with the devserver proxy) and in production
    __API_SERVER_URL__: JSON.stringify(''),
    __VERSION__: JSON.stringify(require("./package.json").version),
    __BUILD_NUMBER__: JSON.stringify(process.env.BUILD_NUMBER),
    __GIT_COMMIT__: JSON.stringify(process.env.GIT_COMMIT),
    __NODE_ENV__: JSON.stringify('development')
  })],

  devServer: {
    port: 8080
  }

};