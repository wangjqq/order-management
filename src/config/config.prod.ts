import { defineConfig } from 'umi';
const CompressionWebpackPlugin = require('compression-webpack-plugin');
export default defineConfig({
  chainWebpack(config) {
    // 添加 Gzip 压缩插件
    config.plugin('compression-webpack-plugin').use(CompressionWebpackPlugin, [
      {
        filename: '[path][base].gz',
        algorithm: 'gzip',
        test: /\.(js|css|html|svg)$/,
        threshold: 10240, // 大于 10KB 才进行压缩
        minRatio: 0.8,
      },
    ]);
  },
});
