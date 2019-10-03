export function getAllRoutes (app, plugin) {
  const routes = plugin ? plugin.routes : []
  return [...app.$router.options.routes, ...routes]
}
