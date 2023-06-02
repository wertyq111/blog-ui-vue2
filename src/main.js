import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import http from './utils/request'
import common from './utils/common'
import constant from './utils/constant'
import mavonEditor from 'mavon-editor'
import i18n from './lang'

// 引入 jquery
import $ from 'jquery'

// 引入js
//import './utils/live2d'
import './utils/title'


// 引入css
import './assets/css/animation.css'
import './assets/css/index.css'
import './assets/css/tocbot.css'
import './assets/css/color.css'
import './assets/css/markdown-highlight.css'
import './assets/css/font-awesome.min.css'
import 'mavon-editor/dist/css/index.css'
// 点击涟漪效果
import Ripple from 'vue-ripple-directive'
import {vueBaberrage} from 'vue-baberrage'
// wow滚动效果
import {WOW} from 'wowjs'
import 'wowjs/css/libs/animate.css'

// 配置 jquery
window.jquery = window.$ = $

Ripple.color = 'var(--rippleColor)'
Vue.directive("ripple", Ripple)

Vue.use(ElementUI)
Vue.use(vueBaberrage)
Vue.use(mavonEditor)

Vue.prototype.$http = http
Vue.prototype.$common = common
Vue.prototype.$constant = constant
Vue.prototype.$wow = new WOW({
  boxClass: 'wow', // 需要执行动画的元素的 class
  animateClass: 'animated', //animation.css 动画的 class
  offset: 0, // 距离可视区域多少开始执行动画
  mobile: true, // 是否在移动设备上执行动画
  live: true // 异步加载的内容是否有效
}).init()

Vue.config.productionTip = false

new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app')
