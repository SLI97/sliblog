const express = require("express")
const router = express.Router()
const category = require("../service/category")
const moment = require('moment');
const ajax = require('../utils/ajax');
const tryCatch = require('../utils/tryCatch');

router.get("/category", async (req, res, next) => {
	tryCatch(req, res, next, async () => {
		const result = await category.list().catch(err => {
			throw new Error("获取热门文章失败")
		})

		res.json(ajax(result))
	})
})

// router.get("/comment/article/:id", async (req, res, next) => {
// 	tryCatch(req, res, next, async () => {
// 		const id = req.params.id
//
// 		const result = await comment.queryArticleComments(id).catch(err => {
// 			throw new Error("获取热门文章失败")
// 		})
//
// 		res.json(ajax(result))
// 	})
// })



module.exports = router
