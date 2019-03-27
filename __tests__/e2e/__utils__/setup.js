import electron from 'electron'
import { Application } from 'spectron'

// Use a temporary directory for user data
process.env.TEMP_USER_DATA = 'true'

const timeout = 30000
const shortcuts = ['element', 'getAttribute', 'getSource', 'getText', 'isExisting', 'isVisible', 'url', 'click']
const actions = ['createProfile']

jest.setTimeout(timeout)

export default {
  async startApp (scope) {
    scope.app = new Application({
      path: electron,
      args: ['dist/electron/main.js'],
      startTimeout: 10000,
      waitTimeout: timeout
    })

    const app = await scope.app.start()

    // WebDriver shortcuts
    shortcuts.forEach(shortcut => {
      scope[shortcut] = app.client[shortcut]
    })

    // To send data to the application renderer process
    scope.emitToRenderer = app.rendererProcess.emit

    // To call actions on the renderer process of the application
    actions.forEach(actionName => {
      scope[actionName] = data => {
        app.rendererProcess.emit('e2e', actionName, JSON.stringify(data))
      }
    })

    return app
  },
  async stopApp (scope) {
    shortcuts.forEach(shortcut => {
      delete scope[shortcut]
    })
    actions.forEach(shortcut => {
      delete scope[shortcut]
    })

    if (scope.app && scope.app.isRunning()) {
      return scope.app.stop()
    }
  }
}
