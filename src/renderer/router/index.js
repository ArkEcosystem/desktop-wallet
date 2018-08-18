import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'dashboard',
      component: require('@/pages/Dashboard').default
    },
    {
      path: '/contacts',
      name: 'contacts',
      component: require('@/pages/Contacts').default
    },
    {
      path: '/networks',
      name: 'networks',
      component: require('@/pages/Networks').default
    },
    {
      path: '/profile',
      name: 'profile',
      component: require('@/pages/Profile').default
    },
    {
      path: '/settings',
      name: 'settings',
      component: require('@/pages/Settings').default
    },
    {
      path: '/wallets',
      name: 'wallets',
      component: require('@/pages/Wallets').default
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
