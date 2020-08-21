const Comment = require("../model/comment")
const db = require("../config/mysql")
const moment = require('moment');

//获取文章列表
exports.publish = ({articleId, parentId, toUser, content}) => {
	return new Promise((resolve, reject) => {
		// 设置文章评论级别 level_flag
		// 为0:评论文章;1:评论某人评论;2:回复某人评论
		let sql = `
		INSERT INTO vblog_comment ( user_id, article_id, content, parent_id, to_uid, level_flag, create_time, update_time )
			VALUES
				(
					1000,
					${articleId},
					'${content}',
					${parentId},
					${toUser},
					'0',
					now(),
					now() 
				)`
		db.driver.execQuery(sql,
			(err, result) => {
				if (err) reject(err)
				sql =
					`SELECT
					vc.id,
					vc.level_flag level,
					vc.content,
					vc.create_time createTime,
					vu.avatar,
					vu.id userId,
					vu.nickname
				FROM
					vblog_comment vc
					LEFT JOIN vblog_user vu ON vu.id = vc.user_id
				WHERE
					vc.id = ${result.insertId}`
				db.driver.execQuery(sql,
					(err, result1) => {
						if (err) reject(err)
						if (result1.length <= 0) reject(err)
						const obj = {
							id: result1[0].id,
							level: result1[0].level,
							content: result1[0].content,
							createTime: result1[0].createTime,
							author: {
								id: result1[0].userId,
								nickname: result1[0].nickname,
								avatar: result1[0].avatar,
							},
						}
						resolve(obj)
					})
			})
	})
}

exports.queryArticleComments = (id) => {
	return new Promise((resolve, reject) => {
		// 设置文章评论级别 level_flag
		// 为0:评论文章;1:评论某人评论;2:回复某人评论
		let sql = `
				SELECT
					vc.id,
					vc.parent_id parentId,
					vc.to_uid toUserId,
					vc.create_time createTime,
					vc.level_flag level,
					vc.content,
					vu.avatar,
					vu.id userId,
					vu.nickname
				FROM
					vblog_comment vc
				LEFT JOIN vblog_user vu ON vu.id = vc.user_id
				WHERE
					article_id = ${id}`
		db.driver.execQuery(sql,
			(err, result) => {
				if (err) reject(err)
				const fatherList = []
				const childrenList = []
				result.forEach(item => {
					const obj = {
						author: {
							id: item.userId,
							nickname: item.nickname,
							avatar: item.avatar,
						},
						childrens: [],
						content: item.content,
						createTime: item.createTime,
						id: item.id,
						level: item.level,
					}
					if (item.parentId === null) {
						fatherList.push(obj)
					} else {
						obj.parentId = item.parentId
						childrenList.push(obj)
					}
				})
				fatherList.forEach(item1 => {
					childrenList.forEach(item2 => {
						if (item2.parentId === item1.id) {
							delete item2.parentId
							item1.childrens.push(item2)
						}
					})
				})
				resolve(fatherList)
			})
	})
}
