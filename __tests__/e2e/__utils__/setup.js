import fs from 'fs'
import electron from 'electron'
import { Application } from 'spectron'

// Use a temporary directory for user data
process.env.TEMP_USER_DATA = 'true'

const actions = fs.readdirSync(`${__dirname}/../__actions__/`).map(action => action.slice(0, -3))

const timeout = 30000
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

    // http://v4.webdriver.io/api.html
    scope.browser = app.client

    // To send data to the application renderer process
    scope.emitToRenderer = app.rendererProcess.emit

    // To call actions on the renderer process of the application
    scope.actions = {}
    actions.forEach(actionName => {
      scope.actions[actionName] = data => {
        return app.rendererProcess.emit('e2e', actionName, JSON.stringify(data))
      }
    })

    return app
  },
  async stopApp (scope) {
    delete scope.actions
    delete scope.browser
    delete scope.emitToRenderer

    if (scope.app && scope.app.isRunning()) {
      return scope.app.stop()
    }
  }
}
