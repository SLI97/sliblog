const path = require("path")
const express = require("express")
const favicon = require('serve-favicon');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const historyApiFallback = require('connect-history-api-fallback')
const webpackConfig = require('../build/webpack.config');

const app = express()

app.use(favicon(path.join(__dirname, '../src/public', 'favicon.ico')));
app.use(historyApiFallback({index: '/index.html'}));
app.use('/static', express.static(path.join(__dirname, '../src/public/static')))

// let ready
// const readyPromise = new Promise(r => { ready = r })
// const update = () => {
// 	if (bundle && clientManifest) {
// 		ready()
// 		cb(bundle, {
// 			template,
// 			clientManifest
// 		})
// 	}
// }

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
//
// compiler.done('done', stats => {
// 	stats = stats.toJson()
// 	stats.errors.forEach(err => console.error(err))
// 	stats.warnings.forEach(err => console.warn(err))
// 	if (stats.errors.length) return
// 	clientManifest = JSON.parse(readFile(
// 		devMiddleware.fileSystem,
// 		'vue-ssr-client-manifest.json'
// 	))
// 	update()
// })

const port = 4000
app.listen(port, () => {
	console.log("client application is running at http://localhost:" + port)
})
