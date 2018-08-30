import Vue from 'vue'
import Router from 'vue-router'
import db from '@/store/db/instance'

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
      path: '/profile/new',
      name: 'profile-new',
      component: require('@/pages/Profile/ProfileNew').default,
      props: {
        showSidemenuBar: true
      }
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

router.beforeEach(async (to, from, next) => {
  const profiles = await db.getAllByType('profile')

  if (to.name === 'profile-new' || profiles.length) {
    next()
  } else {
    next({ name: 'profile-new' })
  }
})

export default router
