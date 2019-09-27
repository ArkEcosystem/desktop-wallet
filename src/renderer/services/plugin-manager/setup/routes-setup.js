import { normalizeJson } from '../utils/normalize-json'
import { getAllRoutes } from '../utils/get-all-routes'

export function createRoutesSetup (plugin, pluginObject, sandbox) {
  return async () => {
    if (!Object.prototype.hasOwnProperty.call(pluginObject, 'getRoutes')) {
      return
    }

    const pluginRoutes = normalizeJson(await pluginObject.getRoutes())
    if (pluginRoutes && Array.isArray(pluginRoutes) && pluginRoutes.length) {
      const allRoutes = getAllRoutes(sandbox.app, plugin)

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
      plugin.routes.push(...routes)
      sandbox.app.$router.addRoutes(routes)
    }
  }
}
