const db = require("../config/mysql")

const ArticleTag = db.define("vblog_article_tag", {
	id: {type: 'serial', key: true}, //主键
	article_id: {type: 'integer'},
	tag_id: {type: 'integer'},
	create_time: String,
	update_time: String,
})

module.exports = ArticleTag
