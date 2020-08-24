import Router from 'vue-router'
import Home from '@/Home'
import Vue from "vue";

Vue.use(Router)

const routes = [
	{
		path: '',
		name: 'Home',
		component: Home,
		children: [
			// {
			// 	path: '/',
			// 	component: () => import('@/views/Index'),
			// },
			// {
			//     path: '/log',
			//     component: r => require.ensure([], () => r(require('@/views/Log')), 'log')
			// },
			// {
			//     path: '/archives/:year?/:month?',
			//     component: r => require.ensure([], () => r(require('@/views/blog/BlogArchive')), 'archives')
			// },
			// {
			//     path: '/feedback',
			//     component: r => require.ensure([], () => r(require('@/views/MessageBoard')), 'messageboard')
			// },
			// {
			// 	path: '/view/:id',
			// 	component: () => import('@/views/blog/BlogView'),
			// },
			// {
			// 	path: '/:type/all',
			// 	component: () => import('@/views/blog/BlogAllCategoryTag'),
			// },
			// {
			//     path: '/:type/:id',
			//     component: r => require.ensure([], () => r(require('@/views/blog/BlogCategoryTag')), 'blogcategorytag')
			// }
		]
	},
]

export function createRouter() {
	return new Router({
		base: '/',
		mode: 'history', // 后端支持可开
		// mode: 'hash',
		scrollBehavior: () => ({y: 0}),
		routes
	})

}
//
// export default new Router({
// 	base: '/',
// 	mode: 'history', // 后端支持可开
// 	// mode: 'hash',
// 	scrollBehavior: () => ({y: 0}),
// 	routes
// })


