<template>
	<!--<div class="me-view-body" v-title :data-title="title">-->
	<div class="me-view-body" :data-title="title">
		<el-container class="me-view-container">
			<!--<el-aside class="me-area">-->
			<!--<ul class="me-operation-list">-->
			<!--<li class="me-operation-item">-->
			<!--<el-button type="primary" icon="el-icon-edit"></el-button>-->
			<!--</li>-->
			<!--</ul>-->
			<!--</el-aside>-->
			<el-main>
				<div class="me-view-card">
					<h1 class="me-view-title">{{article.title}}</h1>
					<div class="me-view-author">
						<a class="">
							<img class="me-view-picture" :src="article.author.avatar"></img>
						</a>
						<div class="me-view-info">
							<span>{{article.author.nickname}}</span>
							<div class="me-view-meta">
								<span>{{article.createTime | format}}</span>
								<span>阅读   {{article.viewNum}}</span>
								<span>评论   {{article.commentNum}}</span>
							</div>
						</div>
						<!--<el-button-->
							<!--v-if="this.article.author.id == this.$store.state.id"-->
							<!--@click="editArticle()"-->
							<!--style="position: absolute;left: 60%;"-->
							<!--size="mini"-->
							<!--type="success"-->
							<!--round-->
							<!--icon="el-icon-edit">编辑-->
						<!--</el-button>-->
					</div>
					<div class="me-view-content">
						<markdown-editor :editor=article.editor></markdown-editor>
					</div>
					
					<div class="me-view-end">
						<el-alert
							title="文章End..."
							type="error"
							center
							:closable="false">
						</el-alert>
					</div>
					
					<div class="me-view-tag">
						标签：
						<!--<el-tag v-for="t in article.tags" :key="t.id" class="me-view-tag-item" size="mini" type="success">{{t.tagname}}</el-tag>-->
						<el-button @click="tagOrCategory('tag', t.id)" size="mini" type="danger" v-for="t in article.tags"
											 :key="t.id" round plain>{{t.tagName}}
						</el-button>
					</div>
					
					<div class="me-view-tag">
						文章分类：
						<!--<span style="font-weight: 600">{{article.category.categoryname}}</span>-->
						<el-button @click="tagOrCategory('category', article.category.id)" size="mini" type="danger" round plain>
							{{article.category.categoryName}}
						</el-button>
					</div>
					
					<div class="me-view-comment">
						<div class="me-view-comment-write">
							<el-row :gutter="20">
								<el-col :span="2">
									<a class="">
										<img class="me-view-picture" :src="avatar"></img>
									</a>
								</el-col>
								<el-col :span="21">
									<el-input
										type="textarea"
										:autosize="{ minRows: 2}"
										placeholder="你的评论..."
										class="me-view-comment-text"
										v-model="comment.content"
										resize="none">
									</el-input>
								</el-col>
							</el-row>
							
							<el-row :gutter="20">
								<el-col :span="3" :offset="21">
									<el-button type="text" @click="publishComment()" style="margin-top: 5px;">评论</el-button>
								</el-col>
							</el-row>
						</div>
						
						<div class="me-view-comment-title">
							<span>{{article.commentNum}} 条评论</span>
						</div>
						
						<commment-item
							v-for="(c,index) in comments"
							:comment="c"
							:articleId="article.id"
							:index="index"
							:rootCommentCounts="comments.length"
							@commentCountsIncrement="commentCountsIncrement"
							:key="c.id">
						</commment-item>
					</div>
				</div>
			</el-main>
		
		</el-container>
	</div>
</template>

<script>
	import MarkdownEditor from '@/components/markdown/MarkdownEditor'
	import CommmentItem from '@/components/Comment/CommentItem'
	import {viewArticle} from '@/api/article'
	import {getCommentsByArticle, publishComment} from '@/api/Comment'

	import default_avatar from '@/assets/img/default_avatar.png'

	export default {
		name: 'BlogView',
		watch: {
			'$route': 'getArticle'
		},
		data() {
			return {
				article: {
					id: '',
					title: '',
					commentNum: 0,
					viewNum: 0,
					summary: '',
					createTime: '',
					author: {},
					tags: [],
					category: {},
					editor: {
						value: '',
						toolbarsFlag: false,
						subfield: false,
						defaultOpen: 'preview'
					}
				},
				comments: [],
				comment: {
					article: {},
					content: ''
				}
			}
		},
		components: {
			MarkdownEditor,
			CommmentItem
		},
		computed: {
			avatar() {
				// let avatar = this.$store.state.avatar
				let avatar = []
				if (avatar.length > 0) {
					return avatar
				}
				return default_avatar
			},
			title() {
				return `${this.article.title} - 文章 - For Fun`
			}
		},
		created() {
			this.getArticle()
		},
		methods: {
			tagOrCategory(type, id) {
				this.$router.push({path: `/${type}/${id}`})
			},
			editArticle() {
				this.$router.push({path: `/write/${this.article.id}`})
			},
			getArticle() {
				viewArticle(this.$route.params.id).then(data => {
					Object.assign(this.article, data.data)
					this.article.editor.value = data.data.content

					this.getCommentsByArticle()
				}).catch(error => {
					if (error !== 'error') {
						this.$message({type: 'error', message: '文章加载失败', showClose: true})
					}
				})
			},
			publishComment() {
				if (!this.comment.content) {
					return;
				}
				this.comment.articleId = this.article.id

				publishComment(this.comment).then(data => {
					this.$message({type: 'success', message: '评论成功', showClose: true})
					this.comments.unshift(data.data)
					this.commentCountsIncrement()
					this.comment.content = ''
				}).catch(error => {
					if (error !== 'error') {
						this.$message({type: 'error', message: '评论失败', showClose: true})
					}
				})
			},
			getCommentsByArticle() {
				getCommentsByArticle(this.article.id).then(data => {
					this.comments = data.data
				}).catch(error => {
					if (error !== 'error') {
						this.$message({type: 'error', message: '评论加载失败', showClose: true})
					}
				})
			},
			commentCountsIncrement() {
				this.article.commentCounts += 1
			}
		},
		//组件内的守卫 调整body的背景色
		beforeRouteEnter(to, from, next) {
			// window.document.body.style.backgroundColor = '#fff';
			next();
		},
		beforeRouteLeave(to, from, next) {
			// window.document.body.style.backgroundColor = '#f5f5f5';
			next();
		}
	}
</script>

<style>
	.me-view-body {
		margin: 100px auto 140px;
	}
	
	.me-view-container {
		width: 700px;
	}
	
	.el-main {
		padding:0;
		overflow: hidden;
	}
	
	.me-view-title {
		font-size: 34px;
		font-weight: 700;
		line-height: 1.3;
	}
	
	.me-view-author {
		/*margin: 30px 0;*/
		margin-top: 30px;
		vertical-align: middle;
	}
	
	.me-view-picture {
		width: 40px;
		height: 40px;
		border: 1px solid #ddd;
		border-radius: 50%;
		vertical-align: middle;
		background-color: #5fb878;
	}
	
	.me-view-info {
		display: inline-block;
		vertical-align: middle;
		margin-left: 8px;
	}
	
	.me-view-meta {
		font-size: 12px;
		color: #969696;
	}
	
	.me-view-end {
		margin-top: 20px;
		padding-right: 25px;
	}
	
	.me-view-tag {
		margin-top: 20px;
		padding-left: 6px;
		border-left: 4px solid #c5cac3;
	}
	
	.me-view-tag-item {
		margin: 0 4px;
	}
	
	.me-view-comment {
		margin-top: 60px;
	}
	
	.me-view-comment-title {
		font-weight: 600;
		border-bottom: 1px solid #f0f0f0;
		padding-bottom: 20px;
	}
	
	.me-view-comment-write {
		margin-top: 20px;
	}
	
	.me-view-comment-text {
		font-size: 16px;
	}
	
	.v-show-content {
		padding: 8px 25px 15px 0px !important;
	}
	
	.v-note-wrapper .v-note-panel {
		box-shadow: none !important;
	}
	
	.v-note-wrapper .v-note-panel .v-note-show .v-show-content, .v-note-wrapper .v-note-panel .v-note-show .v-show-content-html {
		background: #fff !important;
	}


</style>
