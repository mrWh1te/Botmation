/**
 * @description   Dev bundling of playground & examples
 */

const path = require('path');
var nodeExternals = require('webpack-node-externals');

module.exports = {
  entry: {
    //
    // Playground
    'playground_bot': path.resolve(__dirname, 'src/playground_bot.ts'),
    //
    // Examples
    'examples/instagram': path.resolve(__dirname, 'src/examples/instagram.ts'),
    'examples/puppeteer-cluster': path.resolve(__dirname, 'src/examples/puppeteer-cluster.ts'),
    'examples/screenshots': path.resolve(__dirname, 'src/examples/screenshots.ts'),
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [{
          loader: 'ts-loader',
          options: {
            configFile: 'tsconfig.json'
          }
        }],
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ],
    alias: {
      botmation: path.resolve(__dirname, 'src', 'botmation')
    }
  },
  target: 'node',
  output: {
    globalObject: `typeof self !== 'undefined' ? self : this`, // for missing `window` error
    path: path.resolve(__dirname, 'build'),
    filename: (chunkData) => {
      switch(chunkData.chunk.name) {
        default:
          return '[name].js';
      }
    },
    libraryTarget: 'umd',
    library: 'botmation',
    umdNamedDefine: true
  },
  devtool: 'source-map',
  optimization: {
    minimize: false
  },
  mode: 'production',
  node: {
    fs: 'empty'
  },
  externals: [nodeExternals()]
};