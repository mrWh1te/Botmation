/**
 * @description   Separated bundles for various parts of the library
 * 
 *                Creates the npm distribution modules
 */

const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
var nodeExternals = require('webpack-node-externals');

const localSrcBotmationDir = 'src/botmation/';

module.exports = {
  entry: {
    // main bundle barrel
    'index': path.resolve(__dirname, localSrcBotmationDir, 'index.ts')
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [{
          loader: 'ts-loader',
          options: {
            configFile: 'tsconfig.dist.json'
          }
        }],
        exclude: ['/node_modules']
      }
    ]
  },
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ],
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: () => {
      return '[name].js';
    },
    libraryTarget: 'umd',
    library: 'botmation',
    umdNamedDefine: true
  },
  target: 'node',
  devtool: 'source-map',
  optimization: {
    minimize: false
  },
  plugins: [
    new CopyPlugin({
      patterns: [
      // Copy over and tweak the package.json for npm package
      { 
        from: 'package.json', 
        to: 'package.json',
        toType: 'file',
        transform: (content) => {
          let packageJSON = JSON.parse(content.toString())

          // Distribution setup
          packageJSON.module = './index.js'
          packageJSON.types = './index.d.ts'

          // Move puppeteer dependency to peer
          const puppeteerValue = packageJSON.dependencies.puppeteer
          delete packageJSON.dependencies.puppeteer

          packageJSON.peerDependencies = {
            "puppeteer": puppeteerValue
          }

          // Remove the puppeteer-cluster dependency (not required to use library, it's for an example)
          delete packageJSON.dependencies['puppeteer-cluster']

          // Get rid of these scripts
          delete packageJSON.scripts

          return JSON.stringify(packageJSON)
        } 
      },
      { 
        from: 'README.md', 
        to: 'README.md',
        toType: 'file'
      }
    ]})
  ],
  mode: 'development',
  node: {
    fs: 'empty'
  },
  externals: [nodeExternals()]
};