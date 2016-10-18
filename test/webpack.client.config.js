const path = require('path');

module.exports = {
  devtool: 'inline-source-map',
  module: {
    noParse: [
      /node_modules(\\|\/)sinon/
    ],
    loaders: [
      {
        test: /\.json$/,
        loader: 'json-loader'
      },
      {
        test: /\.js$/,
        include: [
          path.resolve(process.cwd(), 'src'),
          path.resolve(process.cwd(), 'test')
        ],
        loader: 'babel-loader'
      },
      {
        test: /sinon(\\|\/)pkg(\\|\/)sinon\.js/,
        loader: 'imports?define=>false,require=>false'
      }
    ]
  },
  resolve: {
    alias: {
      sinon: 'sinon/pkg/sinon'
    }
  },
  node: {
    fs: 'empty',
    module: 'empty',
  }
};