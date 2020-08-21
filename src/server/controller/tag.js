const express = require("express")
const router = express.Router()
const articleTag = require("../service/article-tag")
const moment = require('moment');
const {HOT_OR_NEW_ARTICLE_NUM} = require('../utils/constant')
const ajax = require('../utils/ajax');

router.get("/list", async (req, res, next) => {
	//每页显示的记录数
	const pageSizes = 10;
	//当前页
	const pageNow = req.query.page ? req.query.page : 1;

	const tagList = await tag.getTagsList(pageSizes, pageNow).catch(err => {
		err = new Error("获取文章列表失败")
		next(err)
	})

	tagList.forEach(item => {
		item.created_at = moment(item.created_at).format('YYYY-MM-DD HH:mm:ss');
	})

	res.render('admin/backend/tags/index', {
		tagList: tagList,
		path: '/tag/list',
		open: 'tag'
	});
})

router.get("/tags/hot", async (req, res, next) => {
	const result = await articleTag.hot(HOT_OR_NEW_ARTICLE_NUM).catch(err => {
		next(new Error("获取热门标签失败"))

	})
	res.json(ajax(result))
})

//渲染文章页面，顺便获取tag列表
router.get("/add", async (req, res, next) => {
	res.render('admin/backend/tags/addtag', {path: '/tag/add', open: 'tag'});
})

//增加分类接口
router.post("/add/done", async (req, res, next) => {

	const tagname = req.body.tagname
	const result = await tag.addTag({tagname}).catch(err => {
		err = new Error("添加文章列表失败")
		// next(err)
		res.json({status: 0, msg: '添加失败'});
	})
	res.redirect('/tag/list');
})

//更新分类
router.post("/update", async (req, res, next) => {

	const {id, tagname} = req.body
	const result = await tag.updateTag({id, tagname}).catch(err => {
		res.json({status: 0, msg: '修改失败'});
	})
	res.json({status: 1, msg: '修改成功'});
})

//删除分类
router.post("/delete", async (req, res, next) => {

	const id = req.body.id
	const result = await tag.deleteById(id).catch(err => {
		res.json({status: 0, msg: '删除失败'});
	})
	res.json({status: 1, msg: '删除成功'});
})

module.exports = router
