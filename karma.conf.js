const webpack = require("webpack");

module.exports = function (config) {
  config.set({
    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ["Chrome"],
    // browsers: ["Chrome", "Firefox", "PhantomJS","IE"],

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: "",


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ["mocha", "es6-shim"],


    // list of files / patterns to load in the browser
    files: [
      // each file acts as entry point for the webpack configuration
      // all files ending in ".karma"
      "test/**/*.karma.ts",
      "test/**/*.karma.tsx"
    ],


    // list of files to exclude
    exclude: [],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      // add webpack as preprocessor
      "test/**/*.karma.ts": ["webpack", "sourcemap"],
      "test/**/*.karma.tsx": ["webpack", "sourcemap"]
    },

    // test results reporter to use
    // possible values: "dots", "progress"
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ["mocha", "progress", "jenkins"],

    jenkinsReporter: {
      // outputFile is ignored, set in package.json with REPORT_FILE=./results/karmatests.xml
      // see https://github.com/actano/karma-jenkins-reporter/issues/2
      outputFile: "test-results.xml",
      suite: "game-of-life",                 // this will be mapped to the package
      classnameSuffix: "karma"
    },

    webpack: {
      // you don"t need to specify the entry option because
      // karma watches the test entry points
      // webpack watches dependencies
      resolve: {
        // Add ".ts" and ".tsx" as resolvable extensions.
        extensions: ["", ".webpack.js", ".web.js", ".ts", ".tsx", ".js", ".min.js", ".json"],
        alias: {"ag-grid-root": __dirname + "/node_modules/ag-grid"},
        modulesDirectories: [
          "",
          "src",
          "test",
          "node_modules"
        ]
      },

      devtool: "inline-source-map",

      module: {
        loaders: [
          // All files with a ".ts" or ".tsx" extension will be handled by "ts-loader".
          {test: /\.tsx?$/, loader: "ts-loader"},
          {test: /\.css$/, loader: "style-loader!css-loader"},
          {test: /\.(png|jpg|gif)$/, loader: "file-loader?name=img/[name].[ext]"},
          {test: /\.json$/, loader: "json-loader"},

          // loaders needed for bootstrap
          {test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: "file-loader"},
          {test: /\.(woff|woff2)$/, loader: "url-loader?prefix=font/&limit=5000"},
          {test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: "url-loader?limit=10000&mimetype=application/octet-stream"},
          {test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: "url-loader?limit=10000&mimetype=image/svg+xml"}
        ],
        preLoaders: [
          // All output ".js" files will have any sourcemaps re-processed by "source-map-loader".
          {test: /\.js$/, loader: "source-map-loader"}
        ]
      },
      plugins: [
        // sourcemaps only work with this patch, see
        // https://github.com/webpack-contrib/karma-webpack/issues/109#issuecomment-224961264
        new webpack.SourceMapDevToolPlugin({
          filename: null, // if no value is provided the sourcemap is inlined
          test: /\.(ts|tsx|js)($|\?)/i // process .js and .ts files only
        })
      ]
    },

    webpackMiddleware: {
      // webpack-dev-middleware configuration
      // i.e.
      noInfo: true,
      // and use stats to turn off verbose output
      stats: {
        // options i.e.
        chunks: false
      }
    },

    // enable / disable colors in the output (reporters and logs)
    colors: true,

    plugins: [
      require("karma-webpack"),
      require("karma-mocha"),
      require("karma-es6-shim"),
      require("karma-phantomjs-launcher"),
      require("karma-chrome-launcher"),
      require("karma-firefox-launcher"),
      require("karma-ie-launcher"),
      require("karma-edge-launcher"),
      require("karma-mocha-reporter"),
      require("karma-jenkins-reporter"),
      require("karma-sourcemap-loader")

      // require("karma-spec-reporter")
      // require("istanbul-instrumenter-loader"),
      // require("karma-coverage"),
    ]

  });
};
