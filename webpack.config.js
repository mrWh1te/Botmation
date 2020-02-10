/**
 * @description   Separated bundles for various parts of the library
 */

const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: {
    //
    // Class & BotActionsFactory
    'index': path.resolve(__dirname, 'src/botmation/index.ts'),
    //
    // Interfaces
    'interfaces': path.resolve(__dirname, 'src/botmation/interfaces/index.ts'), // barrel
    //
    // Actions
    'actions/console': path.resolve(__dirname, 'src/botmation/actions/console.ts'),
    'actions/cookies': path.resolve(__dirname, 'src/botmation/actions/cookies.ts'),
    'actions/input': path.resolve(__dirname, 'src/botmation/actions/input.ts'),
    'actions/navigation': path.resolve(__dirname, 'src/botmation/actions/navigation.ts'),
    'actions/output': path.resolve(__dirname, 'src/botmation/actions/output.ts'),
    'actions/utilities': path.resolve(__dirname, 'src/botmation/actions/utilities.ts'),
    // 
    // Helpers
    'helpers/actions': path.resolve(__dirname, 'src/botmation/helpers/actions.ts'),
    'helpers/assets': path.resolve(__dirname, 'src/botmation/helpers/assets.ts'),
    'helpers/bot-options': path.resolve(__dirname, 'src/botmation/helpers/bot-options.ts'),
    'helpers/files': path.resolve(__dirname, 'src/botmation/helpers/files.ts'),
    'helpers/navigation': path.resolve(__dirname, 'src/botmation/helpers/navigation.ts'),
    'helpers/utilities': path.resolve(__dirname, 'src/botmation/helpers/utilities.ts'),
    //
    // Site Specific
    // Instagram
    'bots/instagram/selectors': path.resolve(__dirname, 'src/botmation/bots/instagram/selectors.ts'),
    'bots/instagram/actions/auth': path.resolve(__dirname, 'src/botmation/bots/instagram/actions/auth.ts'),
    'bots/instagram/actions/feed': path.resolve(__dirname, 'src/botmation/bots/instagram/actions/feed.ts'),
    'bots/instagram/actions/modals': path.resolve(__dirname, 'src/botmation/bots/instagram/actions/modals.ts'),
    'bots/instagram/constants/modals': path.resolve(__dirname, 'src/botmation/bots/instagram/constants/modals.ts'),
    'bots/instagram/constants/urls': path.resolve(__dirname, 'src/botmation/bots/instagram/constants/urls.ts'),
    'bots/instagram/helpers/auth': path.resolve(__dirname, 'src/botmation/bots/instagram/helpers/auth.ts'),
    'bots/instagram/helpers/modals': path.resolve(__dirname, 'src/botmation/bots/instagram/helpers/modals.ts'),
    'bots/instagram/helpers/urls': path.resolve(__dirname, 'src/botmation/bots/instagram/helpers/urls.ts'),
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: [
          path.resolve(__dirname, 'node_modules/'),
        ]
      },
    ],
  },
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ],
  },
  output: {
    globalObject: `typeof self !== 'undefined' ? self : this`,
    path: path.resolve(__dirname, 'dist'),
    filename: (chunkData) => {
      switch(chunkData.chunk.name) {
        case 'interfaces':
          return 'interfaces/index.js';
        case 'index':
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
  plugins: [
    new CopyPlugin([
      // Copy over and tweak the package.json for npm 
      { 
        from: 'package.json', 
        to: 'package.json',
        toType: 'file',
        transform: (content) => {
          let packageJSON = JSON.parse(content.toString())

          // Remap somethings
          packageJSON.module = './index.js'
          packageJSON.types = './index.d.ts'
          // Get rid of these scripts
          delete packageJSON.scripts

          return JSON.stringify(packageJSON)
        } 
      }
    ])
  ],
  mode: 'production',
  node: {
    fs: 'empty'
  }
};