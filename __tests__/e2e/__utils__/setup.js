import electron from 'electron'
import { Application } from 'spectron'

const shortcuts = ['element', 'getAttribute', 'getText', 'isExisting']

export default {
  stopApp (scope) {
    shortcuts.forEach(shortcut => {
      delete scope[shortcut]
    })

    if (scope.app && scope.app.isRunning()) {
      return scope.app.stop()
    }
  },
  async startApp (scope) {
    scope.app = new Application({
      path: electron,
      args: ['dist/electron/main.js'],
      startTimeout: 10000,
      waitTimeout: 10000
    })

    const app = await scope.app.start()

    shortcuts.forEach(shortcut => {
      scope[shortcut] = app.client[shortcut]
    })

    return app
  }
}
