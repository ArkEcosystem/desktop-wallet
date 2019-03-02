import electron from 'electron'
import { Application } from 'spectron'

process.env.TEMP_USER_DATA = 'true'
const timeout = 30000
const shortcuts = ['element', 'getAttribute', 'getSource', 'getText', 'isExisting', 'isVisible', 'url', 'click']

jest.setTimeout(timeout)

export default {
  async startApp (scope) {
    scope.app = new Application({
      path: electron,
      args: ['dist/electron/main.js'],
      startTimeout: 30000,
      waitTimeout: timeout
    })

    const app = await scope.app.start()

    shortcuts.forEach(shortcut => {
      scope[shortcut] = app.client[shortcut]
    })

    return app
  },
  async stopApp (scope) {
    shortcuts.forEach(shortcut => {
      delete scope[shortcut]
    })

    if (scope.app && scope.app.isRunning()) {
      return scope.app.stop()
    }
  }
}
