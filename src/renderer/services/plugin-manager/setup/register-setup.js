export function createRegisterSetup (pluginObject) {
  return async () => {
    if (Object.prototype.hasOwnProperty.call(pluginObject, 'register')) {
      await pluginObject.register()
    }
  }
}
