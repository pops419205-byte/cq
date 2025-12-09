import App from './App'
import store from './store'
import tabBar from '@/components/tabbar.vue'
Vue.component('tab-bar', tabBar)
import Router from '@/router/index.js'
import Recipe from '@/common/SDK/Recipe.js'
import mixin from '@/common/mixin/mobile.js'

import privacyAgreenPop from '@/components/privacyAgreenPop/privacyAgreenPop.vue';
Vue.component('privacyAgreenPop', privacyAgreenPop)

import Vue from 'vue'
Vue.config.productionTip = false
App.mpType = 'app'

import uView from 'uview-ui'

Vue.use(uView)


Vue.prototype.$store = store

Vue.prototype.$Router = Router
Vue.prototype.$Recipe = Recipe


Vue.mixin(mixin)


const app = new Vue({
	store,
	...App
})


app.$mount()
