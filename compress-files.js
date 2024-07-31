const CompressionPlugin = require('compression-webpack-plugin');

module.exports = {
  // autres configurations...
  plugins: [
    new CompressionPlugin({
      algorithm: 'gzip',
      test: /\.(js|css|html|svg)$/,
      threshold: 8192,
      minRatio: 0.8,
    }),
  ],
};
