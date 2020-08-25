const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const MemoryFS = require("memory-fs");
const path = require("path")
const clientConfig = require('./webpack.client.config');
const serverConfig = require('./webpack.server.config');
const fs = require("fs")

const readFile = (fs, file) => {
	try {
		return fs.readFileSync(path.join(serverConfig.output.path, file), 'utf-8')
	} catch (e) {}
}

module.exports = function setupDevServer (app, templatePath, cb) {
	let template
	let bundle
	let clientManifest

	let ready
	const readyPromise = new Promise(r => { ready = r })
	const update = () => {
		if (bundle && clientManifest) {
			ready()
			cb(bundle, {
				template,
				clientManifest
			})
		}
	}

	// read template from disk and watch
	template = fs.readFileSync(templatePath, 'utf-8')
	update()
	// chokidar.watch(templatePath).on('change', () => {
	// 	template = fs.readFileSync(templatePath, 'utf-8')
	// 	console.log('index.html template updated.')
	// 	update()
	// })

	// modify client config to work with hot middleware
	// clientConfig.output.filename = '[name].js'

	// dev middleware
	const clientCompiler = webpack(clientConfig)
	const devMiddleware = webpackDevMiddleware(clientCompiler, {
		publicPath: clientConfig.output.publicPath,
		noInfo: true
	})
	app.use(devMiddleware)

	clientCompiler.hooks.done.tap('随便写', (stats) => {
		console.log("重新编译完成！！！！！！！！")
		stats = stats.toJson()
		stats.errors.forEach(err => console.error(err))
		stats.warnings.forEach(err => console.warn(err))
		if (stats.errors.length) return
		clientManifest = JSON.parse(readFile(
			devMiddleware.fileSystem,
			'vue-ssr-client-manifest.json'
		))
		update()
	});

	// hot middleware
	app.use(webpackHotMiddleware(clientCompiler, { heartbeat: 5000 }))

	// watch and update server renderer
	const serverCompiler = webpack(serverConfig)
	const mfs = new MemoryFS()
	serverCompiler.outputFileSystem = mfs
	serverCompiler.watch({}, (err, stats) => {
		console.log(err)
		if (err) throw err
		stats = stats.toJson()
		console.log(stats.errors.length)
		if (stats.errors.length) return

		// read bundle generated by vue-ssr-webpack-plugin
		bundle = JSON.parse(readFile(mfs, 'vue-ssr-server-bundle.json'))
		update()
	})

	return readyPromise
}
