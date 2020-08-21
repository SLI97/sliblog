const createError = require('http-errors');
const ajax = require('../utils/ajax');

const exception = (app) => {
	// 兜底404
	app.use((req, res, next) => {
		next(createError(404));
	});

//抛出异常才会来到这
	app.use((err, req, res, next) => {
		res.status(200)
		if (err.status === 404) {
			console.log("NOT FOUND404")
			res.json(ajax(null, 404, '页面不存在'))
		} else {
			console.log("SERVER ERROR500")
			res.json(ajax(null, 500, '服务器异常'))
		}
	})

}

module.exports = exception
