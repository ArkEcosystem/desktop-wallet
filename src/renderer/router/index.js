import Vue from 'vue'
import Router from 'vue-router'

const originalPush = Router.prototype.push
Router.prototype.push = function push (location) {
  return originalPush.call(this, location).catch(error => {
    if (error.name !== 'NavigationDuplicated') {
      throw error
    }
  })
}

Vue.use(Router)

// NOTE: when adding a route here, check the `KeepAliveRoutes` computed property
// of `App.vue`: only routes that do not depend on params or the profile should be kept alive
const router = new Router({
  routes: [
    {
      path: '/',
      name: 'dashboard',
      component: require('@/pages/Dashboard').default
    },
    {
      path: '/announcements',
      name: 'announcements',
      component: require('@/pages/Announcements').default
    },
    // {
    //   path: '/search',
    //   name: 'search',
    //   component: require('@/pages/Search').default
    // },
    {
      path: '/contacts/all',
      name: 'contacts',
      component: require('@/pages/Contact/ContactAll').default
    },
    {
      path: '/contacts/new',
      name: 'contact-new',
      component: require('@/pages/Contact/ContactNew').default
    },
    {
      path: '/networks/all',
      name: 'networks',
      component: require('@/pages/NetworkOverview').default
    },
    {
      path: '/plugin-manager',
      name: 'plugin-manager',
      component: require('@/pages/PluginManager').default
    },
    {
      path: '/profiles/new',
      name: 'profile-new',
      component: require('@/pages/Profile/ProfileNew').default
    },
    {
      path: '/profiles/:profileId',
      name: 'profile-edition',
      component: require('@/pages/Profile/ProfileEdition').default
    },
    {
      path: '/profiles',
      name: 'profiles',
      component: require('@/pages/Profile/ProfileAll').default
    },
    {
      path: '/wallet/all',
      name: 'wallets',
      component: require('@/pages/Wallet/WalletAll').default
    },
    {
      path: '/wallets/import',
      name: 'wallet-import',
      component: require('@/pages/Wallet/WalletImport').default
    },
    {
      path: '/wallets/new',
      name: 'wallet-new',
      component: require('@/pages/Wallet/WalletNew').default
    },
    {
      path: '/wallets/:address',
      name: 'wallet-show',
      component: require('@/pages/Wallet/WalletShow').default
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})

export default router
