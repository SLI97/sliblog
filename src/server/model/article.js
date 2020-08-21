const db = require("../config/mysql")

const Article = db.define("vblog_article", {
	id: {type: 'serial', key: true}, //主键
	user_id: {type: 'integer'},
	nickname: String,
	title: String,
	summary: String,
	content: {type: 'text'},
	content_html: {type: 'text'},
	view_num:{type: 'integer'},
	comment_num:{type: 'integer'},
	weight:{type: 'integer'},
	pubtime: {type: 'date', time: true},
	tags: String,
	category_id: String,
	create_time: Date,
	update_time: Date,
})

module.exports = Article
