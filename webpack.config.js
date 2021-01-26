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
let botmation;
let packageJsonOverrides = {};
let readmeUrl = 'README.md';

switch(npmPackageToBuild) {
  case 'core':
    outputDirectory += 'core'
    break;
  case 'instagram':
    outputDirectory += 'instagram'
    libraryName += '-instagram'
    entryFileDirectory += botmationSitesDir + 'instagram/'
    botmation = '^3.0.0'
    packageJsonOverrides = {
      name: 'botmation-instagram',
      version: '1.0.0',
      description: 'An extension package for Botmation on Instagram',
      homepage: 'https://www.botmation.dev/sites/instagram'
    }
    readmeUrl = 'src/botmation/sites/instagram/README.md'
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
      { 
        from: 'package.json', 
        to: 'package.json',
        toType: 'file',
        transform: (content) => {
          let packageJSON = {
            ...JSON.parse(content.toString()),
            ...packageJsonOverrides
          }

          packageJSON.module = './index.js'
          packageJSON.types = './index.d.ts'

          const puppeteerValue = packageJSON.dependencies.puppeteer
          delete packageJSON.dependencies.puppeteer
          
          // site specific packages
          if (npmPackageToBuild !== 'core') {
            delete packageJSON.dependencies.chalk
            delete packageJSON.dependencies.cheerio
          }

          packageJSON.peerDependencies = {
            "puppeteer": puppeteerValue,
            botmation
          }

          delete packageJSON.dependencies['puppeteer-cluster']
          delete packageJSON.devDependencies
          delete packageJSON.scripts

          return JSON.stringify(packageJSON)
        } 
      },
      { 
        from: readmeUrl,
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