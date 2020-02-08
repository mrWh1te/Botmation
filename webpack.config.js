const path = require('path');

module.exports = [
  'source-map'
].map(devtool => ({
  mode: 'development',
  devtool: 'inline-source-map',
  entry: {
    classes: './src/botmation/class.ts',
    factories: './src/botmation/factories/bot-actions-chain.factory.ts',
    actions: './src/botmation/actions/index.ts'
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ],
  },
  output: {
		path: path.join(__dirname, "dist"),
		filename: "Botmation.[name].js",
		library: ["Botmation", "[name]"],
		libraryTarget: "umd"
	},
  externals: {
    puppeteer: {
      commonjs: 'puppeteer',
      commonjs2: 'puppeteer',
      amd: 'puppeteer',
      root: 'puppeteer',
    },
  },
  devtool,
  optimization: {
    runtimeChunk: true
  },
  node: {
    fs: 'empty'
  }
}))