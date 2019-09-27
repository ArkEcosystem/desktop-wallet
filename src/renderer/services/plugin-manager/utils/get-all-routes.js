export function getAllRoutes (app, plugin) {
  return [...app.$router.options.routes, ...plugin.routes]
}
