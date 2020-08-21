const db = require('../config/mysql')

const Tags = db.define('vblog_tag', {

	id: {type: 'serial', key: true}, //主键
	tagname: {type: 'text', size: 30},
	logo: String,
	created_at: {type: 'date', time: true}
});

module.exports = Tags;
