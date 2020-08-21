const Article = require("../model/article")
const db = require("../config/mysql")
const moment = require('moment');
const sortSign = require('../utils/sort');

//获取文章列表
exports.articleList = (params) => {
	return new Promise((resolve, reject) => {
		const {pageNo, pageSize, order, sort, year, month, tagId, categoryId} = params
		//计算偏移量
		let sql = `SELECT
				id,
				user_id userId,
				nickname,
				title,
				summary,
				content,
				content_html contentHtml,
				view_num viewNum,
				comment_num commentNum,
				weight,
				tags,
				category_id categoryId,
				create_time createTime
			FROM
			vblog_article
			ORDER BY
		 ${order} ${sort}`
		db.driver.execQuery(sql,
			(err, result) => {
				if (err) reject(err)
				result.forEach(item => {
					item.createTime = moment(item.createTime).format('YYYY-MM-DD HH:mm:ss')
					item.tags = item.tags.split(".")
				})
				resolve(result)
			});
	})
}

//获取最热文章列表
exports.hot = (limit) => {
	return new Promise((resolve, reject) => {
		let sql = `SELECT
			id,
			title
			FROM
			vblog_article
			ORDER BY
			view_num
			LIMIT ${limit}`
		db.driver.execQuery(sql,
			(err, result) => {
				if (err) reject(err)
				resolve(result)
			});
	})
}

//获取最新文章列表
exports.new = (limit) => {
	return new Promise((resolve, reject) => {
		let sql = `SELECT
			id,
			title
			FROM
			vblog_article
			ORDER BY
			create_time
			LIMIT ${limit}`
		db.driver.execQuery(sql,
			(err, result) => {
				if (err) reject(err)
				resolve(result)
			});
	})
}

//获取归档数量列表
exports.archive = (limit) => {
	return new Promise((resolve, reject) => {
		let sql =
			`SELECT YEAR( create_time ) year,MONTH ( create_time ) month,COUNT(*) count
				FROM
				vblog_article
				GROUP BY
				YEAR,
					MONTH
				ORDER BY
				YEAR DESC,
					MONTH DESC
				LIMIT ${limit}`
		db.driver.execQuery(sql,
			(err, result) => {
				if (err) reject(err)
				result.forEach(item => {
					item.year = item.year.toString()
					item.month = item.month.toString()
				})
				resolve(result)
			});
	})
}


//根据id获取文章
exports.getById = (id) => {
	return new Promise((resolve, reject) => {
		let sql =
			`SELECT
				va.id,
				va.title,
				va.content,
				va.view_num viewNum,
				va.summary,
				va.create_time createTime,
				va.comment_num commentNum,
				vu.id userId,
				vu.nickname,
				vu.avatar userAvatar,
				vc.id categoryId,
				vc.category_name categoryName,
				vc.create_time categoryCreateTime,
				vc.description,
				vc.avatar categoryAvatar,
				vt.id tagId,
				vt.avatar tagAvatar,
				vt.create_time tagCreateTime,
				vt.tag_name tagName 
			FROM
				vblog_article va
				LEFT JOIN vblog_user vu ON vu.id = va.user_id
				LEFT JOIN vblog_category vc ON vc.id = va.category_id 
				LEFT JOIN vblog_article_tag vat ON vat.article_id = va.id
				LEFT JOIN vblog_tag vt ON vt.id = vat.tag_id 
			WHERE
				va.id = ${id}`
		db.driver.execQuery(sql,
			(err, result) => {
				if (err) reject(err)
				const resultMap = {
					id: result[0].id,
					title: result[0].title,
					content: result[0].content,
					viewNum: result[0].viewNum,
					summary: result[0].summary,
					createTime: moment(result[0].createTime).format('YYYY-MM-DD HH:mm:ss'),
					commentNum: result[0].commentNum,
					author: {
						id: result[0].userId,
						nickname: result[0].nickname,
						avatar: result[0].avatar,
					},
					category: {
						id: result[0].categoryId,
						categoryName: result[0].categoryName,
						createTime: moment(result[0].categoryCreateTime).format('YYYY-MM-DD HH:mm:ss'),
						description: result[0].description,
						avatar: result[0].categoryAvatar
					},
					tags: [...result.map(item => {
						return {
							id: item.tagId,
							createTime: moment(item.tagCreateTime).format('YYYY-MM-DD HH:mm:ss'),
							avatar: item.tagAvatar,
							tagName: item.tagName,
						}
					})]
				}
				resolve(resultMap)
			});
	})
}

//获取文章总数
exports.articleCount = () => {
	return new Promise((resolve, reject) => {
		Article.count((err, result) => {
			if (err) reject(err)
			resolve(result)
		})
	})
}

//新增文章
exports.add = ({title, tagid, brief, content}) => {
	return new Promise((resolve, reject) => {
		const article = {
			title,
			brief,
			content,
			tag_id: tagid,
			pubtime: moment().format('YYYY-MM-DD HH:mm:ss'),
			date: moment().format('YYYY年MM月'),
		}
		Article.create(article, (err, result) => {
			if (err) reject(err)
			resolve(result)
		})
	})
}

//根据id更新文章
exports.update = ({id, content, title, brief, tagid}) => {
	return new Promise((resolve, reject) => {
		Article.find({id}).each((item) => {
			item.content = content;
			item.title = title;
			item.brief = brief;
			item.tag_id = tagid;
		}).save((err) => {
			if (err) reject("修改失败!")
			resolve("修改成功!")
		});
	})
}

//根据id删除文章
exports.deleteById = (id) => {
	return new Promise((resolve, reject) => {
		Article.find({id}).remove((err) => {
			if (err) reject(err)
			resolve("删除成功!")
		});
	})
}

//查询最新的5篇文章
exports.articleNews = () => {
	return new Promise((resolve, reject) => {
		Article.find().limit(5).order('-pubtime').all((err, result) => {
			if (err) reject(err)
			result.forEach(item => {
				item.pubtime = moment(item.pubtime).format('YYYY-MM-DD');
			})
			resolve(result)
		});
	})
}

//根据date进行分组
exports.dateCounts = () => {
	return new Promise((resolve, reject) => {
		Article.aggregate(['date'], {}).count().groupBy("date").get((err, result) => {
			if (err) reject(err)
			resolve(result)
		});
	})
}

//根据分类进行分组
exports.tagCounts = () => {
	return new Promise((resolve, reject) => {
		db.driver.execQuery("SELECT t.id,t.tagname,COUNT(*) as nums FROM article a LEFT JOIN tags t on t.id = a.tag_id GROUP BY a.tag_id",
			(err, result) => {
				if (err) reject(err)
				resolve(result)
			});
	})
}
