const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin') // прокидвание ссылок в html при сборке
const {CleanWebpackPlugin} = require('clean-webpack-plugin') // очистка дериктории
const CopyPlugin = require('copy-webpack-plugin') // переносить выбранные файлы/каталоги
const MiniCssExtractPlugin = require('mini-css-extract-plugin') // извлекает css из js - modlue - продвинутые настройки

require('babel-core/register')
require('babel-polyfill')

const prod = process.env.NODE_ENV === 'production';
const dev = !prod;

const bundle = (fileType) => prod ? `bundle.[hash].${fileType}` : `bundle.${fileType}`;

module.exports = {
    mode: 'development',
    context: path.resolve(__dirname, 'src'),
    entry: ['babel-polyfill', './index.js'], // полифил для обработки беблом асинк функций
    resolve: {
        extensions: ['.js', '.json'], // позволяет не использовать расширение при импорте
        alias: {
            '@src': path.resolve(__dirname, 'src'),
        },
    },
    output: {
        filename: bundle('js'),
        path: path.resolve(__dirname, './dist'),
    },
    devtool: dev ? 'source-map' : false, // настройка вебпака
    devServer: {
        port: 3010,
        hot: dev,
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            template: 'index.html',
            minify: prod,
        }),
        new CopyPlugin({
            patterns: [
              {
                  from: path.resolve(__dirname, 'src/favicon.ico'),
                  to: path.resolve(__dirname, './dist')},
            ],
          }),
        new MiniCssExtractPlugin({
            filename: bundle('css'),
        }),
    ],
    module: {
        rules: [
          {
            test: /\.s[ac]ss$/i,
            use: [
              MiniCssExtractPlugin.loader, // минификация css
              'css-loader', // после обрабатываетяся обычный css
              'sass-loader', // sass обрабатывается первый
            ],
          },
          {
            test: /\.m?js$/,
            exclude: /node_modules/,
            use: [
                {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'], // пресет бабеля
                    },
                },
                {
                    loader: 'eslint-loader',
                },
            ],
          },
        ],
    },
}
