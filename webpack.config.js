const path = require('path');

const {CleanWebpackPlugin} = require('clean-webpack-plugin');

const isDev = process.env.NODE_ENV === 'development';

const jsLoaders = () => {
    const loaders = [
        {
            loader: 'babel-loader',
            options: {
                presets: ['@babel/preset-env'],
                plugins: ['@babel/plugin-proposal-class-properties']
            }
        }
    ];


  if (isDev) {
      loaders.push('eslint-loader');
  }

  return loaders;
};

module.exports = {
    context: path.resolve(__dirname, 'src'),
    mode: 'development',
    entry: ['@babel/polyfill'],
    output: {
        filename: 'inject.js',
        path: path.resolve(__dirname, 'dist')
    },
    resolve: {
        extensions: ['.js'],
        alias: {
            '@core': path.resolve(__dirname, 'src')
        }
    },
    devtool: isDev ? 'source-map': false,
    plugins: [
        new CleanWebpackPlugin()
    ],
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: jsLoaders()
            }
        ]
    }
};
