const path = require("path")
const express = require("express")
const favicon = require('serve-favicon');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const historyApiFallback = require('connect-history-api-fallback')
const webpackConfig = require('../webpack.config');

const app = express()

app.use(favicon(path.join(__dirname, '../src/public', 'favicon.ico')));
app.use(historyApiFallback({ndex: '/index.html'}));
app.use('/static', express.static(path.join(__dirname, '../src/public/static')))

const compiler = webpack(webpackConfig)
app.use(webpackDevMiddleware(compiler, {
	publicPath: webpackConfig.output.publicPath,  // public path should be the same with webpack config
	quiet: true,
	noInfo: true,
	stats: {
		colors: true,
		modules: false,
		builtAt: false,
		entrypoints: false,
		assets: false,
	},
	headers: {"x-Custom-Header": "yes"},
}))

app.use(webpackHotMiddleware(compiler, {
	log: false,
	// path: "/__what",
	heartbeat: 10 * 1000
}))

const port = 4000
app.listen(port, () => {
	console.log("client application is running at http://localhost:" + port)
})
