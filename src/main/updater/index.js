import { autoUpdater } from 'electron-updater'
import { join } from 'path'
import { version } from '../../../package.json'

const isDev = process.env.NODE_ENV === 'development'

autoUpdater.logger = require('electron-log')
autoUpdater.logger.transports.file.level = 'info'
autoUpdater.autoDownload = false

if (isDev) {
  autoUpdater.updateConfigPath = join(__dirname, './dev-app-update.yml')
  autoUpdater.currentVersion = version
}

export default ({ sendToWindow }) => {
  const notificationPrefix = 'updater:'
  const events = ['checking-for-update', 'update-available', 'update-not-available', 'error', 'download-progress']

  events.forEach(evt => {
    autoUpdater.on(evt, data => {
      sendToWindow(notificationPrefix + evt, data)
    })
  })

  autoUpdater.on('update-downloaded', () => {
    sendToWindow(notificationPrefix + 'update-downloaded', autoUpdater.quitAndInstall)
  })

  autoUpdater.checkForUpdates()
}
