// main.js
import Vue from 'vue'
import App from './app'
import Router from 'vue-router'
import router from './router'
import ElementUI from 'element-ui';
import '@/assets/icon/iconfont.css'
// import 'element-ui/lib/theme-chalk/index.css';
// import { Button, Select } from 'element-ui';
import {formatTime} from "@/utils/time";

Vue.use(Router)
Vue.use(ElementUI, { size: 'small', zIndex: 3000 });

// 格式化时间
Vue.filter('format', formatTime)

new Vue({
    el: '#app',
    router,
    render: h => h(App)
})
