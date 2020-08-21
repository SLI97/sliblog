const db = require('../config/mysql')

const Comment = db.define('vblog_comment', {

	id: {type: 'serial', key: true}, //主键
	user_id: {type: 'integer'},
	article_id: {type: 'integer'},
	content:String,
	parent_id:{type: 'integer'},
	to_uid:{type: 'integer'},
	level_flag:String,  // 为0:评论文章;1:评论某人评论;2:回复某人评论
	logo: String,
	create_time: Date,
	update_time: Date,
});

module.exports = Comment;
