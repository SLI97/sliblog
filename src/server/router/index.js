const article = require("../controller/article")
const tag = require("../controller/tag")
const comment = require("../controller/comment")

const router = (app)=>{
	app.use("/", article)
	app.use("/", tag)
	app.use("/", comment)
}

module.exports = router
