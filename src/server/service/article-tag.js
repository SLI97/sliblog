const ArticleTag = require("../model/article-tag")
const db = require("../config/mysql")
const moment = require('moment');

//获取文章列表
exports.hot = (limit) => {
	return new Promise((resolve, reject) => {
		let sql = `SELECT
			vat.tag_id id,
			t.tag_name tagName,
			t.avatar,
			t.create_time createTime 
			FROM
			vblog_article_tag vat
			LEFT JOIN vblog_tag t ON vat.tag_id = t.id 
			GROUP BY
			tag_id 
			ORDER BY
			count(*) DESC
			LIMIT ${limit}`
		db.driver.execQuery(sql,
			(err, result) => {
				if (err) reject(err)
				resolve(result)
			});
	})
}
