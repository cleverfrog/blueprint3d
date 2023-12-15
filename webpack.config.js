const path = require('path');
//const CopyPlugin = require("copy-webpack-plugin");
var HtmlWebpackPlugin = require('html-webpack-plugin');
//var ExtractTextPlugin = require('extract-text-webpack-plugin');
//const TranspilePlugin = require('transpile-webpack-plugin');
module.exports = {
  entry: './src/blueprint3d.ts',
  mode: "development",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  externals: {
    jquery: "jQuery",
    three: "THREE"
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  plugins: [
    /*
    new CopyPlugin({
      patterns: [
        { from: "copyFiles", to: "exTest" },
      ],
    }), */
/*    new ExtractTextPlugin("style.css", {
      allChunks: true
    }), 
    new HtmlWebpackPlugin(),*/
  //  new TranspilePlugin({ longestCommonDir: './src' })
  new HtmlWebpackPlugin({
    title: 'blueprint3d', 
    template: 'src/index.html' }) 

  ],
  output: {
    path: path.resolve(__dirname, 'exTest'),
    filename: 'blueprint3d.js'
  },
  devServer: {
    static: path.join(__dirname, "exTest"),
    compress: false,
    port: 9000,
  },


};
