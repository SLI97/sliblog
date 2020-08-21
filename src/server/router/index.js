const article = require("../controller/article")
const tag = require("../controller/tag")
const comment = require("../controller/comment")
const category = require("../controller/category")

const router = (app)=>{
	app.use("/", article)
	app.use("/", tag)
	app.use("/", comment)
	app.use("/", category)
}

module.exports = router
