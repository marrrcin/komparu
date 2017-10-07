const path = require('path')
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: {
    app: './index.js'
  },
  target: 'web',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          presets: [
            ['env', {
              useBuiltIns: true,
              targets: {chrome: 62, firefox: 56}
            }]
          ],
          plugins: [
            ['transform-object-rest-spread', {
              useBuiltIns: true
            }]
          ]
        }
      }
    ]
  },
  devtool: 'inline-source-map',
  plugins: [
    new HtmlWebpackPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.optimize.CommonsChunkPlugin({name: 'common'})
  ],
  devServer: {
    contentBase: './dist',
    port: 8000,
    publicPath: '/',
    compress: true,
    hot: true
  }
}
