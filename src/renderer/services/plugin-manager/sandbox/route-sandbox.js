import { getAllRoutes } from '../utils/get-all-routes'

export function create (walletApi, plugin, app) {
  return () => {
    walletApi.route = {
      get: () => {
        return {
          ...app.$route,
          name: app.$route.name.split(':')[1],
          fullName: app.$route.name,
          matched: []
        }
      },
      goTo: routeName => {
        const route = getAllRoutes(app, plugin).find(route => {
          return (
            route.name === routeName ||
            route.name === [plugin.config.id, routeName].join(':')
          )
        })
        if (route) {
          app.$router.push(route)
        }
      }
    }
  }
}
