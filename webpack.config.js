/**
 * @description   Separated bundles for various parts of the library
 * 
 *                Creates the npm distribution modules
 */

const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
var nodeExternals = require('webpack-node-externals');

const localSrcBotmationDir = 'src/botmation/';
const botmationSitesDir = 'sites/';

/**
 * values: 'core' => botmation package
 *         'instagram' => botmation-instagram package
 *          ...
 */
const npmPackageToBuild = 'core' // or 'instagram', 'linkedin', ... 


let entryFileDirectory = localSrcBotmationDir;
let outputDirectory = 'dist/';
let libraryName = 'botmation';

switch(npmPackageToBuild) {
  case 'core':
    outputDirectory += 'core'
    break;
  case 'instagram':
    outputDirectory += 'instagram'
    libraryName += '-instagram'
    entryFileDirectory += botmationSitesDir + 'instagram/'
    break;
  default:
    throw new Error('unrecognized npm package to build')
}


module.exports = {
  entry: {
    'index': path.resolve(__dirname, entryFileDirectory, 'index.ts')
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [{
          loader: 'ts-loader',
          options: {
            configFile: 'tsconfig.dist.json' // todo separate one for each npm package or is there a dynamic way?
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
    // todo separate package output directories? mapped with tsconfig.dist.json out directory
    path: path.resolve(__dirname, 'dist'),
    filename: () => {
      return '[name].js';
    },
    libraryTarget: 'umd',
    library: libraryName,
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
      // todo new or modified package.json?
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

          // todo dynamically add botmation as peerDependency
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
        // todo dynamically choose README.md i.e. sites/instagram/README.md
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