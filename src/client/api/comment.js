import request from '@/utils/request'


export function getCommentsByArticle(id) {
	return request({
		url: `/comment/article/${id}`,
		method: 'get'
	})
}

export function publishComment(comment) {
	return request({
		url: '/comment',
		method: 'post',
		data: comment
	})
}

