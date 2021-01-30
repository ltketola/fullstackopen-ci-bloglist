const webpack = require('webpack')
const HtmlWebPackPlugin = require("html-webpack-plugin");
const path = require('path');

const config = (env, argv) => {
  return {
    entry: ['@babel/polyfill', './client/index.js'],
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'bundle.js',
      publicPath: '/'
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
            options: {
              presets: ['@babel/preset-env', '@babel/preset-react']
            }
          },
        },
        {
          test: /\.html$/,
          use: [
            {
              loader: "html-loader",
            },
          ],
        },
        {
          test: /\.css$/,
          loaders: ['style-loader', 'css-loader'],
        }
      ],
    },
    resolve: {
      extensions: ["*", ".js", ".jsx"],
    },
    devServer: {
      contentBase: path.join(__dirname, 'dist'),
      compress: true,
      inline: true,
      historyApiFallback: true,
    },
    devtool: 'source-map',
    plugins: [
      new HtmlWebPackPlugin({
        template: "./public/index.html",
        filename: "./index.html",
      }),
    ],
    proxy: {
      '/api': { 
        'target': 'http://localhost:3001',
        "secure": false
      },
    }
  }
}

module.exports = config