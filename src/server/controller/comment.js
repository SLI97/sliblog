const express = require("express")
const router = express.Router()
const comment = require("../service/comment")
const moment = require('moment');
const ajax = require('../utils/ajax');
const tryCatch = require('../utils/tryCatch');

router.post("/comment", async (req, res, next) => {
	tryCatch(req, res, next, async () => {
		const {articleId, parentId, toUser, content} = req.body

		const params = {
			articleId: articleId ? articleId : 1,
			parentId: null,
			toUser: toUser ? toUser : 1000,
			content: content ? content : 'zzz123'
		}

		const result = await comment.publish(params).catch(err => {
			throw new Error("获取热门文章失败")
		})

		res.json(ajax(result))
	})
})

router.get("/comment/article/:id", async (req, res, next) => {
	tryCatch(req, res, next, async () => {
		const id = req.params.id

		const result = await comment.queryArticleComments(id).catch(err => {
			throw new Error("获取热门文章失败")
		})

		res.json(ajax(result))
	})
})



module.exports = router
