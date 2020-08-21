/**
 * @description   Dev bundling of playground & examples
 * 
 *                For library development
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
    'examples/pdf': path.resolve(__dirname, 'src/examples/pdf.ts'),
    'examples/simple_functional': path.resolve(__dirname, 'src/examples/simple_functional.ts'),
    'examples/simple_objectoriented': path.resolve(__dirname, 'src/examples/simple_objectoriented.ts'),
    'examples/instagram': path.resolve(__dirname, 'src/examples/instagram.ts'),
    'examples/puppeteer-cluster': path.resolve(__dirname, 'src/examples/puppeteer-cluster.ts'),
    'examples/screenshots': path.resolve(__dirname, 'src/examples/screenshots.ts'),
    'examples/linkedin': path.resolve(__dirname, 'src/examples/linkedin.ts'),
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