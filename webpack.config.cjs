const path = require('path');
const WrapperPlugin = require('wrapper-webpack-plugin');
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
  optimization: {
    minimize: false,
  },
  devtool: "source-map",
/*  externals: {
    jquery: "jQuery",
  }, */
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  plugins: [
    /*new WrapperPlugin({
      footer: 'export {BP3D};'
    }), */
    
    /*
    new CopyPlugin({
      patterns: [
        { from: "copyFiles", to: "app" },
      ],
    }), */
    /*    new ExtractTextPlugin("style.css", {
      allChunks: true
    }), 
    new HtmlWebpackPlugin(),*/
    //  new TranspilePlugin({ longestCommonDir: './src' })
  new HtmlWebpackPlugin({
    title: 'blueprint3d',
    template: 'src/index.html',
    minify: false,
    scriptLoading: "blocking",
    //   inject: "head"
  })
  ],
  output: {
    library: 'BP3D',
    //  module: true,
    path: path.resolve(__dirname, 'app'),
    filename: 'blueprint3d.js',
    //      libraryTarget: 'module',
    //      devtoolNamespace: "BP3D",
    //      scriptType: "module"
    
  },
  watch: true,
  devServer: {
    static: path.join(__dirname, "app"),
    compress: true,
//    compress: false,
    port: 9000,
  },


};
