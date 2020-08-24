const webpack = require('webpack');
const path = require('path')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const hotMiddlewareScript = 'webpack-hot-middleware/client?reload=true'
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

// const resolve = dir => path.join(__dirname, dir)

const isProd = process.env.NODE_ENV === 'production'

config = {
	mode:isProd?'production':'development',
	entry: {
		app: isProd ?
			path.resolve(__dirname, `../src/client/entry-client.js`) :
			[path.resolve(__dirname, `../src/client/entry-client.js`), hotMiddlewareScript]
	},
	output: {
		path: path.resolve(__dirname, `./dist/client`),
		publicPath: '/',
		filename: '[name]-[hash].js',  //chunkhash,hash
	},
	module: {
		rules: [
			{test: /\.vue$/, loader: 'vue-loader'},
			{test: /\.js$/, loader: 'babel-loader', exclude: path.resolve(__dirname, './node_modules/')},
			{test: /\.css$/, use: [isProd ? MiniCssExtractPlugin.loader : 'style-loader', 'css-loader']},
			{test: /\.scss$/, use: ["style-loader", "css-loader", "sass-loader"]},
			{
				test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
				loader: 'url-loader',
				// exclude: [resolve('src/icons')],
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
		new HtmlWebpackPlugin({
			template: path.resolve(__dirname, '../src/public/index.html'),
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
	],
	resolve: {
		alias: {
			'@': path.resolve(__dirname, '../src/client'),
		},
		extensions: ['*', '.js', '.vue', '.json']
	},
}

if(isProd){
	config.plugins.push(new MiniCssExtractPlugin({   //提取css作为单独文件
		filename: path.join('static', 'css/[name].[contenthash].css'),
		chunkFilename: path.join('static', 'css/[name].[contenthash].css')
	}))
	config.plugins.push(new webpack.HotModuleReplacementPlugin())
}


module.exports = config
