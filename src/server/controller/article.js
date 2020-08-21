const express = require("express")
const router = express.Router()
const article = require("../service/article")
const tag = require("../service/tag")
const moment = require('moment');
const ajax = require('../utils/ajax');
const tryCatch = require('../utils/tryCatch');
const {HOT_OR_NEW_ARTICLE_NUM} = require('../utils/constant')

router.get("/article", async (req, res, next) => {
	const {pageNo, pageSize, order, sort, year, month, tagId, categoryId} = req.query

	const params = {
		pageNo: pageNo ? pageNo : 1,
		pageSize: pageSize ? pageSize : 1,
		order: order ? order : 'create_time',
		sort: sort ? sort : 'desc',
		year,
		month,
		tagId,
		categoryId
	}
	tryCatch(req, res, next, async () => {
		const articleList = await article.articleList(params).catch(err => {
			throw new Error("获取文章列表失败")
		})

		const totalCount = await article.articleCount().catch(err => {
			throw new Error("获取文章数量失败")
		})

		const totalPage = Math.ceil(totalCount / pageSize)
		res.json(ajax({
			articleList,
			totalCount,
			totalPage,
		}))
	})
})

router.get("/article/hot", async (req, res, next) => {
	tryCatch(req, res, next, async () => {
		const result = await article.hot(HOT_OR_NEW_ARTICLE_NUM).catch(err => {
			throw new Error("获取热门文章失败")
		})

		res.json(ajax(result))
	})
})

router.get("/article/new", async (req, res, next) => {
	tryCatch(req, res, next, async () => {
		const result = await article.new(HOT_OR_NEW_ARTICLE_NUM).catch(err => {
			throw new Error("获取最新文章失败")
		})
		res.json(ajax(result))
	})
})

router.get("/article/archive", async (req, res, next) => {
	tryCatch(req, res, next, async () => {
		const result = await article.archive(HOT_OR_NEW_ARTICLE_NUM).catch(err => {
			throw new Error("获取归档数量失败")

		})
		res.json(ajax(result))
	})
})

router.get("/article/view/:id", async (req, res, next) => {
	tryCatch(req, res, next, async () => {
		const id = req.params.id
		const result = await article.getById(id).catch(err => {
			throw new Error("获取归档数量失败")
		})
		res.json(ajax(result))
	})
})

router.get("/article/:id", async (req, res, next) => {
	//TODO
})

//增加文章接口
router.post("/article", async (req, res, next) => {

	const {title, tagid, brief, content} = req.body
	const result = await article.add({title, tagid, brief, content}).catch(err => {
		res.json(ajax(null, 500, '服务器异常'));
	})
	res.json(ajax())
})

//更新文章
router.put("/article/:id", async (req, res, next) => {

	const {id, content, title, brief, tagid} = req.body
	const result = await article.update({id, content, title, brief, tagid}).catch(err => {
		res.json({status: 0, msg: '修改失败'});
	})
	res.json({status: 1, msg: '修改成功'});
	// res.redirect('/article/list')
})

//删除分类
router.delete("/article/:id", async (req, res, next) => {

	const id = req.body.id
	const result = await article.deleteById(id).catch(err => {
		res.json({status: 0, msg: '删除失败'});
	})
	res.json({status: 1, msg: '删除成功'});
})

module.exports = router
