const path = require('path')
const webpack = require('webpack');
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const hotMiddlewareScript = 'webpack-hot-middleware/client?reload=true'

function resolve(dir) {
    return path.join(__dirname, '..', dir)
}

module.exports = {
    mode: 'development',
    // mode: 'production',
    entry: {
        app: [path.resolve(__dirname, './src/client/index.js'), hotMiddlewareScript]
    },
    output: {
        path: path.resolve(__dirname, './dist'),
        //不用webpack-dev-server的话，这里的路径必须跟webpack打包的路径publicPath相同
        publicPath: '/',
        filename: '[name]-[hash].js'  //chunkhash,hash
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src/client'),
        },
        extensions: ['*', '.js', '.vue', '.json']
    },
    module: {
        rules: [
            { test: /\.vue$/, loader: 'vue-loader' },
            { test: /\.js$/, loader: 'babel-loader', exclude: path.resolve(__dirname, './node_modules/') },
            { test: /\.css$/, use: ['style-loader', 'css-loader'] },
            { test: /\.scss$/, use: ["style-loader", "css-loader", "sass-loader"] },
            {
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                loader: 'url-loader',
                exclude: [resolve('src/icons')],
                options: {
                    limit: 10000,
                    // name: path.join('static', 'img/[name].[hash:7].[ext]')
                }
            },
            {
                test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    // name: path.join('static', 'media/[name].[hash:7].[ext]')
                }
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    // name: path.join('static', 'fonts/[name].[hash:7].[ext]')
                }
            }
        ]
    },
    plugins: [
        new VueLoaderPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, './src/public/index.html'),
            // favicon: path.resolve(__dirname, '../public/favicon.ico'),
            inject: true,
            minify: {
                collapseInlineTagWhitespace: true,   //折叠空白区域
                removeRedundantAttributes: true, // 删除多余的属性
                removeAttributeQuotes: true, // 移除属性的引号
                removeComments: true,   //删除注释
                hash: true,    //是否需要对src引的文件后面加上Hash，使用时需要区分开发环境和生产环境
                collapseBooleanAttributes: true // 省略只有 boolean 值的属性值 例如：readonly checked
            },
            templateParameters: {
                BASE_TITLE: 'vue-express-mysql',
            },
        }),
    ]
}
