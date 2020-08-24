const path = require("path")
const express = require("express")
// const favicon = require('serve-favicon');
// const webpack = require('webpack');
// const webpackDevMiddleware = require('webpack-dev-middleware');
// const webpackHotMiddleware = require('webpack-hot-middleware');
// const historyApiFallback = require('connect-history-api-fallback')
// const webpackConfig = require('../webpack.config');
const fs = require("fs");

const {createBundleRenderer} = require("vue-server-renderer");
const serverBundle = require("../dist/server/vue-ssr-server-bundle.json");
const clientManifest = require("../dist/client/vue-ssr-client-manifest.json");

const app = express()

// app.use(favicon(path.join(__dirname, '../src/public', 'favicon.ico')));
// app.use(historyApiFallback({index: '/index.html'}));
// app.use('/static', express.static(path.join(__dirname, '../src/public/static')))

//需要开启服务端渲染的时候，打开
const renderer = createBundleRenderer(serverBundle, {
	runInNewContext: false,
	template: fs.readFileSync(path.resolve(__dirname, "./index.template.html"), "utf-8"),
	clientManifest,
});

function renderToString(context) {
	return new Promise((resolve, reject) => {
		renderer.renderToString(context, (err, html) => {
			err ? reject(err) : resolve(html);
		});
	});
}

app.get('*', async (req, res) => {
	const context = {url: req.url, title: "Hello SSR",}
	if (req.url === 'space') {

	}

	// 将 context 数据渲染为 HTML
	const html = await renderToString(context).catch(err => {
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
	});
	res.send(html)
})

const port = 4000
app.listen(port, () => {
	console.log("client application is running at http://localhost:" + port)
})
