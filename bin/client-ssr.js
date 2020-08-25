const path = require("path")
const express = require("express")
// const favicon = require('serve-favicon');
const fs = require("fs");
const MemoryFS = require("memory-fs");
const {createBundleRenderer} = require("vue-server-renderer");
const setupDevServer = require('../build/setup-dev-server')

const resolve = file => path.resolve(__dirname, file)
const isProd = process.env.NODE_ENV === 'production'

const app = express()
const mfs = new MemoryFS()

// app.use(favicon(path.join(__dirname, '../src/public', 'favicon.ico')));
// app.use(historyApiFallback({index: '/index.html'}));
// app.use('/static', express.static(path.join(__dirname, '../src/public/static')))

function createRenderer(bundle, options) {
	return createBundleRenderer(bundle, Object.assign(options, {
		runInNewContext: false
	}))
}

let renderer
let readyPromise
const templatePath = resolve('./index.template.html')
if (isProd) {
	const template = fs.readFileSync(templatePath, 'utf-8')
	const serverBundle = require('../dist/vue-ssr-server-bundle.json')
	const clientManifest = require('../dist/vue-ssr-client-manifest.json')
	renderer = createRenderer(serverBundle, {
		template,
		clientManifest
	})
} else {
	readyPromise = setupDevServer(
		app,
		templatePath,
		(bundle, options) => {
			renderer = createRenderer(bundle, options)
		}
	)
}

function render(req, res) {
	const s = Date.now()
	// res.setHeader("Content-Type", "text/html")
	// res.setHeader("Server", serverInfo)

	const handleError = err => {
		if (err.url) {
			res.redirect(err.url)
		} else if (err.code === 404) {
			res.status(404).send('404 | Page Not Found')
		} else {
			// Render Error Page or Redirect
			res.status(500).send('500 | Internal Server Error')
			console.error(`error during render : ${req.url}`)
			console.error(err.stack)
		}
	}

	const context = {
		title: 'Vue HN 2.0', // default title
		url: req.url
	}
	renderer.renderToString(context, (err, html) => {
		if (err) {
			return handleError(err)
		}
		res.send(html)
		if (!isProd) {
			console.log(`whole request: ${Date.now() - s}ms`)
		}
	})
}

app.get('*', isProd ? render : (req, res) => {
	readyPromise.then(() => render(req, res))
})

const port = 4000
app.listen(port, () => {
	console.log("client application is running at http://localhost:" + port)
})
