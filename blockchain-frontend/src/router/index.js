import Vue from 'vue'
import Router from 'vue-router'
// Containers
import DashBoard from '../views/dashboard/index'
import As from '../views/as'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Home',
      component: DashBoard
    },
    {
      path: '/dashboard',
      name: 'DashBoard',
      component: As
    }
  ]
})
