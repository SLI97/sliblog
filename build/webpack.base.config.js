const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const isProd = process.env.NODE_ENV === 'production'
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');//压缩css插件

config = {
	devtool: false,
	module: {
		rules: [
			{test: /\.vue$/, loader: 'vue-loader'},
			{test: /\.js$/, loader: 'babel-loader', exclude: path.resolve(__dirname, './node_modules/')},
			{test: /\.css$/, use: [isProd ? MiniCssExtractPlugin.loader : 'style-loader', 'css-loader']},
			{
				test: /\.styl(us)?$/,
				use: [isProd ? MiniCssExtractPlugin.loader : 'style-loader', 'css-loader', "stylus-loader"]
			},
			{test: /\.sass/, use: [isProd ? MiniCssExtractPlugin.loader : 'style-loader', 'css-loader', "sass-loader"]},
			{test: /\.scss/, use: [isProd ? MiniCssExtractPlugin.loader : 'style-loader', 'css-loader', "sass-loader"]},
			{
				test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
				loader: 'url-loader',
				// exclude: [resolve('src/icons')],
				options: {
					limit: 10000,
					name: path.join('static', 'img/[name].[hash:7].[ext]')
				}
			},
			{
				test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
				loader: 'url-loader',
				options: {
					limit: 10000,
					name: path.join('static', 'media/[name].[hash:7].[ext]')
				}
			},
			{
				test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
				loader: 'url-loader',
				options: {
					limit: 10000,
					name: path.join('static', 'fonts/[name].[hash:7].[ext]')
				}
			}
		]
	},
	optimization: {
		splitChunks: {
			chunks: "all",
			minSize: 30000, // 模块的最小体积
			minChunks: 1, // 模块的最小被引用次数
			maxAsyncRequests: 5, // 按需加载的最大并行请求数
			maxInitialRequests: 3, // 一个入口最大并行请求数
			automaticNameDelimiter: '~', // 文件名的连接符
			name: true,
			cacheGroups: { // 缓存组
				vendors: {
					test: /[\\/]node_modules[\\/]/,
					priority: -10
				},
				default: {
					minChunks: 2,
					priority: -20,
					reuseExistingChunk: true
				}
			}
		},
		runtimeChunk: {
			name: 'manifest'
		},
		minimizer: [ // 用于配置 minimizers 和选项
			new UglifyJsPlugin({
				cache: true,
				parallel: true,
				sourceMap: false,
			}),
			new OptimizeCssAssetsPlugin({  //压缩提取出来的css空格，并且把重复的css样式去掉
				cssProcessorOptions: {
					safe: true,
					// map: {inline: false}
				}
			}),
		]
	},
}

module.exports = config
