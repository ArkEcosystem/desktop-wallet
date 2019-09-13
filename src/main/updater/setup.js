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

export const setupUpdater = ({ sendToWindow, ipcMain }) => {
  const notificationPrefix = 'updater:'
  const events = ['checking-for-update', 'update-available', 'update-not-available', 'error', 'download-progress', 'update-downloaded']

  events.forEach(evt => {
    autoUpdater.on(evt, data => {
      sendToWindow(notificationPrefix + evt, data)
    })
  })

  ipcMain.on(notificationPrefix + 'quit-and-install', () => {
    setImmediate(() => autoUpdater.quitAndInstall())
  })

  ipcMain.on(notificationPrefix + 'check-for-updates', async () => {
    const result = await autoUpdater.checkForUpdates()

    if (result) {
      autoUpdater.cancellationToken = result.cancellationToken
    }
  })

  ipcMain.on(notificationPrefix + 'download-update', () => {
    autoUpdater.downloadUpdate(autoUpdater.cancellationToken)
  })
}
