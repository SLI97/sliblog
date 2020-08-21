<template>
	<scroll-page :loading="loading" :offset="offset" :no-data="noData" v-on:load="load">
		<article-item v-for="a in articles" :key="a.id" v-bind="a"></article-item>
	</scroll-page>
</template>

<script>
	import ArticleItem from '@/components/Article/ArticleItem'
	import ScrollPage from '@/components/ScrollPage/ScrollPage'
	import {getArticles} from '@/api/article'

	export default {
		name: "ArticleScrollPage",
		components: {
			ArticleItem,
			ScrollPage,
		},
		props: {
			offset: {
				type: Number,
				default: 100
			},
			page: {
				type: Object,
				default() {
					return {}
				}
			},
			query: {
				type: Object,
				default() {
					return {}
				}
			}
		},
		watch: {
			// 'query': {
			//   handler() {
			//     this.noData = false
			//     this.articles = []
			//     this.page.pageNo = 1
			//     // this.getArticles()
			//   },
			//   deep: true
			// },
			// 'page': {
			//   handler() {
			//     this.noData = false
			//     this.articles = []
			//     this.page = this.page
			//     // this.getArticles()
			//   },
			//   deep: true
			// }
		},
		data() {
			return {
				loading: false,
				noData: false,
				pageModel: {
					pageSize: 10,
					pageNo: 1,
					order: 'create_time',
					sort: 'desc'
				},
				articles: []
			}
		},
		created() {
			this.getArticles()
		},
		methods: {
			load() {
				this.getArticles()
			},
			view(id) {
				this.$router.push({path: `/view/${id}`})
			},
			getArticles() {
				this.loading = true
				getArticles(this.query, this.page).then(res => {
					const data = res.data

					let newArticles = data.articleList
					if (newArticles && newArticles.length > 0) {
						this.pageModel.pageNo += 1
						this.articles = this.articles.concat(newArticles)
						console.log(this.articles)
					} else {
						this.noData = true
					}

				}).catch(error => {
					if (error !== 'error') {
						this.$message({type: 'error', message: '文章加载失败!', showClose: true})
					}
				}).finally(() => {
					this.loading = false
				})

			}
		},
	}
</script>

<style scoped>
	.el-card {
		border-radius: 0;
	}
	
	.el-card:not(:first-child) {
		margin-top: 10px;
		
	}
</style>
