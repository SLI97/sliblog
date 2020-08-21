const db = require('../config/mysql')

const Category = db.define('vblog_category', {

	id: {type: 'serial', key: true}, //主键
	category_name: String,
	avatar: String,
	description: String,
	create_time: Date
});

module.exports = Category;
