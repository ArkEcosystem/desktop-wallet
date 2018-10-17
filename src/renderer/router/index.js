import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

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
    {
      path: '/search',
      name: 'search',
      component: require('@/pages/Search').default
    },
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
      path: '/networks',
      name: 'networks',
      component: require('@/pages/Networks').default
    },
    {
      path: '/profiles/new',
      name: 'profile-new',
      component: require('@/pages/Profile/ProfileNew').default
    },
    {
      path: '/profiles/:profile-id',
      name: 'profile-edition',
      component: require('@/pages/Profile/ProfileEdition').default
    },
    {
      path: '/profiles',
      name: 'profiles',
      component: require('@/pages/Profile/ProfileAll').default
    },
    {
      path: '/settings',
      name: 'settings',
      component: require('@/pages/Settings').default
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
