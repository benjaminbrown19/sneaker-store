const path = require('path')

module.exports = (config) => {
  process.env.NODE_ENV = 'test'
  process.env.BABEL_ENV = 'test'

  config.set({
    basePath: '',
    frameworks: ['jasmine', 'webpack'],
    files: [
      { pattern: 'src/tests/index.js', watched: false },
      { pattern: 'public/assets/**/*.jpg', included: false, served: true, watched: false },
      { pattern: 'public/assets/**/*.svg', included: false, served: true, watched: false },
      { pattern: 'public/assets/**/*.mp4', included: false, served: true, watched: false },
    ],
    proxies: { '/assets/': '/base/public/assets/' },
    preprocessors: {
      'src/tests/index.js': ['webpack', 'sourcemap'],
    },
    webpack: {
      mode: 'development',
      devtool: 'inline-source-map',
      module: {
        rules: [
          {
            test: /\.m?jsx?$/,
            resolve: { fullySpecified: false },
          },
          {
            test: /\.jsx?$/,
            exclude: /node_modules/,
            use: { loader: 'babel-loader', options: { envName: 'test' } },
          },
        ],
      },
      resolve: { extensions: ['.js', '.jsx'] },
    },
    reporters: ['progress', 'coverage'],
    coverageReporter: {
      dir: path.join(__dirname, 'coverage'),
      subdir: '.',
      reporters: [
        { type: 'html' },
        { type: 'text-summary' },
        { type: 'json-summary' },
        { type: 'lcov' },
      ],
    },
    browsers: ['ChromeHeadlessCI'],
    customLaunchers: {
      ChromeHeadlessCI: {
        base: 'ChromeHeadless',
        flags: ['--no-sandbox', '--disable-gpu', '--disable-dev-shm-usage'],
      },
    },
    client: { jasmine: { random: true } },
    singleRun: false,
    restartOnFileChange: true,
  })
}
