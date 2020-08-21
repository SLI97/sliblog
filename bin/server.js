const path = require("path")
const logger = require('morgan');
const express = require("express")
const favicon = require('serve-favicon');
const exception = require("../src/server/exception/index")
const parse = require("../src/server/utils/parse")
const router = require("../src/server/router/index")

const app = express()

app.use((req,res,next)=>{
	res.header("Access-Control-Allow-Origin", "http://localhost:4000");  // 允许所有路径跨域
	res.header("Access-Control-Allow-Credentials", true);  // 允许所有路径跨域
	res.header("Access-Control-Allow-Headers", "Content-Type");
	res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
	res.header("X-Powered-By", ' 3.2.1');
	res.header("Content-Type", "application/json;charset=utf-8");
	next()
})

//请求参数解析中间件
parse(app)

//日志中间件
// app.use(logger('dev'));
app.use(favicon(path.join(__dirname, '../src/public', 'favicon.ico')));
// app.use(express.static(path.join(__dirname, 'public')))

//业务逻辑路由中间件
router(app)

//错误统一处理
exception(app)

const port = 3000
app.listen(port, () => {
    console.log("server application is running at http://localhost:" + port)
})
