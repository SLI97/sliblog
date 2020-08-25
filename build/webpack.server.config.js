const path = require('path')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const nodeExternals = require("webpack-node-externals");
const VueSSRServerPlugin = require("vue-server-renderer/server-plugin");
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const base = require("./webpack.base.config")
const {merge} = require("webpack-merge")

const resolve = dir => path.join(__dirname, dir)

const env = process.env;
const isProd = env.NODE_ENV === 'production'

const config = merge(base, {
	target: "node",
	mode: isProd ? 'production' : 'development',
	entry: path.resolve(__dirname, `../src/client/entry-server.js`),
	output: {
		path: path.resolve(__dirname, `../dist`),
		publicPath: '/',
		filename: '[name]-[hash].js',  //chunkhash,hash
		libraryTarget: "commonjs2"
	},
	externals: nodeExternals({
		// 不要外置化 webpack 需要处理的依赖模块。
		// 你可以在这里添加更多的文件类型。例如，未处理 *.vue 原始文件，
		// 你还应该将修改 `global`（例如 polyfill）的依赖模块列入白名单
		whitelist: /\.css$/,
	}),
	module: {
		rules: [
			{test: /\.vue$/, loader: 'vue-loader'},
			{test: /\.js$/, loader: 'babel-loader', exclude: path.resolve(__dirname, './node_modules/')},
			{test: /\.css$/, use: [MiniCssExtractPlugin.loader, 'css-loader']},
			// {test: /\.scss$/, use: ["style-loader", "css-loader", "sass-loader"]},
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
		new MiniCssExtractPlugin({   //提取css作为单独文件
			filename: path.join('static', 'css/[name].[contenthash].css'),
			chunkFilename: path.join('static', 'css/[name].[contenthash].css')
		}),
		new VueSSRServerPlugin()
	],
	resolve: {
		alias: {
			'@': path.resolve(__dirname, '../src/client'),
		},
		extensions: ['*', '.js', '.vue', '.json']
	},
})

module.exports = config
