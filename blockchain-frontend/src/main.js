// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import VueResource from 'vue-resource'
import VueMoment from 'vue-moment'
import BootstrapVue from 'bootstrap-vue/dist/bootstrap-vue.common'

Vue.use(BootstrapVue)
Vue.config.productionTip = false

Vue.use(VueResource)
Vue.use(VueMoment)
router.beforeEach((to, from, next) => {
  next()
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
