const Category = require("../model/category")
const db = require("../config/mysql")
const moment = require('moment');

exports.list = () => {
	return new Promise((resolve, reject) => {
		// 设置文章评论级别 level_flag
		// 为0:评论文章;1:评论某人评论;2:回复某人评论
		let sql = `
				SELECT
					id,
					category_name,
					avatar,
					description,
					create_time 
				FROM
					vblog_category`
		db.driver.execQuery(sql,
			(err, result) => {
				if (err) reject(err)
				resolve(result)
			})
	})
}
