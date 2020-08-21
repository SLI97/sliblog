<template>
	<!-- <div v-title data-title="ForFun Find Yourself"> -->
	<div>
		<el-container>
			
			<el-main class="me-articles">
				 <article-scroll-page></article-scroll-page>
			</el-main>
			
			<el-aside>
				<card-me class="me-area"></card-me>
				<card-tag :tags="hotTags"></card-tag>
				<card-article cardHeader="最热文章" :articles="hotArticles"></card-article>
				<card-archive cardHeader="文章归档" :archives="archives"></card-archive>
				<card-article cardHeader="最新文章" :articles="newArticles"></card-article>
			</el-aside>
		
		</el-container>
	</div>
</template>

<script>
	  import ArticleScrollPage from '@/views/ArticleScrollPage'
	import CardArticle from '@/components/Card/CardArticle'
	import CardTag from '@/components/Card/CardTag'
	import CardArchive from '@/components/Card/CardArchive'
	import CardMe from '@/components/Card/CardMe'

	  import {getArticles, getHotArtices, getNewArtices} from '@/api/article'
	  import {getHotTags} from '@/api/tag'
	  import {listArchives} from '@/api/article'

	export default {
		name: 'Index',
		components: {
			CardMe,
			CardArticle,
			CardTag,
			CardArchive,
			ArticleScrollPage,
		},
		data() {
			return {
				hotTags: [],
				hotArticles: [],
				newArticles: [],
				archives: []
			}
		},
		created() {
			  this.getHotArtices()
			  this.getNewArtices()
			this.getHotTags()
			  this.listArchives()
		},
		methods: {
			  getHotArtices() {
			    getHotArtices().then(data => {
			      this.hotArticles = data.data
			    }).catch(error => {
			      if (error !== 'error') {
			        this.$message({type: 'error', message: '最热文章加载失败!', showClose: true})
			      }
			    })
			  },
			  getNewArtices() {
			    getNewArtices().then(data => {
			      this.newArticles = data.data
			    }).catch(error => {
			      if (error !== 'error') {
			        this.$message({type: 'error', message: '最新文章加载失败!', showClose: true})
			      }
			    })
			  },
			  getHotTags() {
			    getHotTags().then(data => {
				    this.hotTags = data.data
			    }).catch(error => {
			      if (error !== 'error') {
				      this.$message({type: 'error', message: '最热标签加载失败!', showClose: true})
			      }
			    })
			  },
			  listArchives() {
			    listArchives().then((data => {
			      this.archives = data.data
						console.log(this.archives)
			    })).catch(error => {
			      if (error !== 'error') {
				      this.$message({type: 'error', message: '文章归档加载失败!', showClose: true})
			      }
			    })
			  }
		},
	}
</script>

<style scoped>
	
	.el-container {
		width: 960px;
	}
	
	.el-aside {
		margin-left: 20px;
		width: 260px;
	}
	
	.el-main {
		padding: 0px;
		line-height: 16px;
	}
	
	.el-card {
		border-radius: 0;
	}
	
	.el-card:not(:first-child) {
		margin-top: 20px;
	}
</style>
