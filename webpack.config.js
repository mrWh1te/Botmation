/**
 * @description   Separated bundles for various parts of the library
 * 
 *                Creates the npm distribution modules
 */

const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
var nodeExternals = require('webpack-node-externals');

module.exports = {
  entry: {
    //
    // Class & Assembly-Lines
    'index': path.resolve(__dirname, 'src/botmation/index.ts'), // barrel
    //
    // Interfaces & Types
    'interfaces': path.resolve(__dirname, 'src/botmation/interfaces/index.ts'), // barrel
    'types': path.resolve(__dirname, 'src/botmation/types/index.ts'), // barrel
    //
    // Actions
    'actions/assembly-lines': path.resolve(__dirname, 'src/botmation/actions/assembly-lines.ts'),
    'actions/console': path.resolve(__dirname, 'src/botmation/actions/console.ts'),
    'actions/cookies': path.resolve(__dirname, 'src/botmation/actions/cookies.ts'),
    'actions/errors': path.resolve(__dirname, 'src/botmation/actions/errors.ts'),
    'actions/files': path.resolve(__dirname, 'src/botmation/actions/files.ts'),
    'actions/indexed-db': path.resolve(__dirname, 'src/botmation/actions/indexed-db.ts'),
    'actions/input': path.resolve(__dirname, 'src/botmation/actions/input.ts'),
    'actions/local-storage': path.resolve(__dirname, 'src/botmation/actions/local-storage.ts'),
    'actions/navigation': path.resolve(__dirname, 'src/botmation/actions/navigation.ts'),
    'actions/pipe': path.resolve(__dirname, 'src/botmation/actions/pipe.ts'),
    'actions/utilities': path.resolve(__dirname, 'src/botmation/actions/utilities.ts'),
    // 
    // Helpers
    'helpers/console': path.resolve(__dirname, 'src/botmation/helpers/console.ts'),
    'helpers/files': path.resolve(__dirname, 'src/botmation/helpers/files.ts'),
    'helpers/indexed-db': path.resolve(__dirname, 'src/botmation/helpers/indexed-db.ts'),
    'helpers/local-storage': path.resolve(__dirname, 'src/botmation/helpers/local-storage.ts'),
    'helpers/navigation': path.resolve(__dirname, 'src/botmation/helpers/navigation.ts'),
    'helpers/pipe': path.resolve(__dirname, 'src/botmation/helpers/pipe.ts'),
    'helpers/utilities': path.resolve(__dirname, 'src/botmation/helpers/utilities.ts'),
    //
    // Site Specific
    // Instagram
    'bots/instagram/selectors': path.resolve(__dirname, 'src/botmation/bots/instagram/selectors.ts'),
    'bots/instagram/actions/auth': path.resolve(__dirname, 'src/botmation/bots/instagram/actions/auth.ts'),
    'bots/instagram/actions/modals': path.resolve(__dirname, 'src/botmation/bots/instagram/actions/modals.ts'),
    'bots/instagram/constants/modals': path.resolve(__dirname, 'src/botmation/bots/instagram/constants/modals.ts'),
    'bots/instagram/constants/urls': path.resolve(__dirname, 'src/botmation/bots/instagram/constants/urls.ts'),
    'bots/instagram/helpers/urls': path.resolve(__dirname, 'src/botmation/bots/instagram/helpers/urls.ts'),
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