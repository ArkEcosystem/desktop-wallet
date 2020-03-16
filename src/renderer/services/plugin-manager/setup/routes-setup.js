import { normalizeJson } from '../utils/normalize-json'
import { getAllRoutes } from '../utils/get-all-routes'

export function create (plugin, pluginObject, sandbox) {
  return () => {
    if (!Object.prototype.hasOwnProperty.call(pluginObject, 'getRoutes')) {
      return
    }

    const pluginRoutes = normalizeJson(pluginObject.getRoutes().map(route => ({
      ...route,
      name: [plugin.config.id, route.name].join(':')
    })))

    if (pluginRoutes && Array.isArray(pluginRoutes) && pluginRoutes.length) {
      const allRoutes = getAllRoutes(sandbox.app)

      const routes = pluginRoutes.reduce((valid, route) => {
        if (typeof route.component === 'string' && plugin.components[route.component]) {
          if (allRoutes.every(loadedRoute => loadedRoute.name !== route.name)) {
            valid.push({
              ...route,
              component: plugin.components[route.component]
            })
          }
        }
        return valid
      }, [])

      if (routes.length) {
        plugin.routes.push(...routes)
        sandbox.app.$router.addRoutes(routes)
      }
    }
  }
}
