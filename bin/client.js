const path = require("path")
const express = require("express")
const favicon = require('serve-favicon');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const historyApiFallback = require('connect-history-api-fallback')
const clientConfig = require('../build/webpack.client.config');

const app = express()

app.use(favicon(path.join(__dirname, '../src/public', 'favicon.ico')));
app.use(historyApiFallback({ index: '/index.html' }));
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

const compiler = webpack(clientConfig)
app.use(webpackDevMiddleware(compiler, {
    publicPath: clientConfig.output.publicPath, // public path should be the same with webpack config
    quiet: true,
    noInfo: true,
    stats: {
        colors: true,
        modules: false,
        builtAt: false,
        entrypoints: false,
        assets: false,
    },
    headers: { "x-Custom-Header": "yes" },
}))

app.use(webpackHotMiddleware(compiler))

compiler.hooks.compile.tap('async', (stats) => {
	console.log("开始编译！")
});

// compiler.hooks.compile.tap('done', stats => {
// 	console.log("搞定！！！！！！！！")
// })


compiler.hooks.done.tap('随便写', (stats) => {
	console.log("搞定！！！！！！！！")
});

const port = 4000
app.listen(port, () => {
	console.log("client application is running at http://localhost:" + port)
})
