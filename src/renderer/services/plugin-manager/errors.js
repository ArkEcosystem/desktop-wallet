export class PluginManagerError extends Error {
  constructor (message) {
    super(message)

    Error.captureStackTrace(this, this.constructor)
  }
}

export class NotInitiatedError extends PluginManagerError {
  constructor () {
    super('Plugin Manager not initiated')
  }
}

export class PluginAlreadyInstalledError extends PluginManagerError {
  constructor (plugin) {
    super(`Plugin '${plugin}' is already installed`)
  }
}

export class PluginAlreadyLoadedError extends PluginManagerError {
  constructor (plugin) {
    super(`Plugin '${plugin}' has already been loaded`)
  }
}

export class PluginDownloadFailedError extends PluginManagerError {
  constructor (plugin) {
    super(`Plugin '${plugin}' could not be downloaded`)
  }
}

export class PluginStatusError extends PluginManagerError {
  constructor (status, plugin) {
    super(`Plugin '${plugin}' is not ${status}`)
  }
}

export class PluginNotFoundError extends Error {
  constructor (plugin) {
    super(`Plugin '${plugin}' not found`)
  }
}

export class PluginConfigError extends Error {
  constructor (message) {
    super(`Plugin configuration could not be parsed: ${message}`)
  }
}

export class PluginWalletVersionError extends Error {
  constructor () {
    super('Wallet version is not supported')
  }
}
