/**
 * @description   Separated bundles for various parts of the library
 * 
 *                Creates the npm distribution modules
 */

const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
var nodeExternals = require('webpack-node-externals');

const localSrcBotmationDir = 'src/botmation/';
const sitesInstagramDir = 'sites/instagram/';

module.exports = {
  entry: {
    //
    // Class & Assembly-Lines
    'index': path.resolve(__dirname, localSrcBotmationDir, 'index.ts'), // barrel
    //
    // Interfaces & Types
    'interfaces': path.resolve(__dirname, localSrcBotmationDir, 'interfaces/index.ts'), // barrel
    'types': path.resolve(__dirname, localSrcBotmationDir, 'types/index.ts'), // barrel
    //
    // Actions
    'actions/abort': path.resolve(__dirname, localSrcBotmationDir, 'actions/abort.ts'),
    'actions/assembly-lines': path.resolve(__dirname, localSrcBotmationDir, 'actions/assembly-lines.ts'),
    'actions/console': path.resolve(__dirname, localSrcBotmationDir, 'actions/console.ts'),
    'actions/cookies': path.resolve(__dirname, localSrcBotmationDir, 'actions/cookies.ts'),
    'actions/errors': path.resolve(__dirname, localSrcBotmationDir, 'actions/errors.ts'),
    'actions/files': path.resolve(__dirname, localSrcBotmationDir, 'actions/files.ts'),
    'actions/indexed-db': path.resolve(__dirname, localSrcBotmationDir, 'actions/indexed-db.ts'),
    'actions/input': path.resolve(__dirname, localSrcBotmationDir, 'actions/input.ts'),
    'actions/local-storage': path.resolve(__dirname, localSrcBotmationDir, 'actions/local-storage.ts'),
    'actions/navigation': path.resolve(__dirname, localSrcBotmationDir, 'actions/navigation.ts'),
    'actions/pipe': path.resolve(__dirname, localSrcBotmationDir, 'actions/pipe.ts'),
    'actions/scrapers': path.resolve(__dirname, localSrcBotmationDir, 'actions/scrapers.ts'),
    'actions/utilities': path.resolve(__dirname, localSrcBotmationDir, 'actions/utilities.ts'),
    // 
    // Helpers
    'helpers/abort': path.resolve(__dirname, localSrcBotmationDir, 'helpers/abort.ts'),
    'helpers/cases': path.resolve(__dirname, localSrcBotmationDir, 'helpers/cases.ts'),
    'helpers/console': path.resolve(__dirname, localSrcBotmationDir, 'helpers/console.ts'),
    'helpers/files': path.resolve(__dirname, localSrcBotmationDir, 'helpers/files.ts'),
    'helpers/indexed-db': path.resolve(__dirname, localSrcBotmationDir, 'helpers/indexed-db.ts'),
    'helpers/local-storage': path.resolve(__dirname, localSrcBotmationDir, 'helpers/local-storage.ts'),
    'helpers/navigation': path.resolve(__dirname, localSrcBotmationDir, 'helpers/navigation.ts'),
    'helpers/pipe': path.resolve(__dirname, localSrcBotmationDir, 'helpers/pipe.ts'),
    'helpers/scrapers': path.resolve(__dirname, localSrcBotmationDir, 'helpers/scrapers.ts'),
    //
    // Site Specific
    // Instagram
    'sites/instagram/selectors': path.resolve(__dirname, localSrcBotmationDir, sitesInstagramDir, 'selectors.ts'),
    'sites/instagram/actions/auth': path.resolve(__dirname, localSrcBotmationDir, sitesInstagramDir, 'actions/auth.ts'),
    'sites/instagram/actions/modals': path.resolve(__dirname, localSrcBotmationDir, sitesInstagramDir, 'actions/modals.ts'),
    'sites/instagram/constants/modals': path.resolve(__dirname, localSrcBotmationDir, sitesInstagramDir, 'constants/modals.ts'),
    'sites/instagram/constants/urls': path.resolve(__dirname, localSrcBotmationDir, sitesInstagramDir, 'constants/urls.ts'),
    'sites/instagram/helpers/urls': path.resolve(__dirname, localSrcBotmationDir, sitesInstagramDir, 'helpers/urls.ts'),
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
    filename: (chunkData) => {
      switch(chunkData.chunk.name) {
        case 'interfaces':
          return 'interfaces/index.js';
        case 'types':
          return 'types/index.js'
        case 'index':
        default:
          return '[name].js';
      }
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