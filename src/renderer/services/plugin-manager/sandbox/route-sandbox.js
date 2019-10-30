import { getAllRoutes } from '../utils/get-all-routes'

export function createRouteSandbox (walletApi, plugin, app) {
  return () => {
    walletApi.route = {
      get: () => {
        return { ...app.$route, matched: [] }
      },
      goTo: routeName => {
        const route = getAllRoutes(app, plugin).find(route => routeName === route.name)
        if (route) {
          app.$router.push(route)
        }
      }
    }
  }
}
