'use strict'

import { app, BrowserWindow, screen } from 'electron'
import winState from 'electron-window-state'

// It is necessary to require `electron-log` here to use it on the renderer process
require('electron-log')

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow = null
let deeplinkingUrl = null

const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

function createWindow () {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize

  const windowState = winState({
    defaultWidth: width,
    defaultHeight: height
  })

  mainWindow = new BrowserWindow({
    width: windowState.width,
    height: windowState.height,
    x: windowState.x,
    y: windowState.y,
    center: true,
    show: false
  })

  windowState.manage(mainWindow)
  mainWindow.loadURL(winURL)
  mainWindow.once('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.on('closed', () => {
    mainWindow = null
  })

  mainWindow.webContents.on('did-finish-load', () => {
    broadcastURL(deeplinkingUrl)
  })

  require('./menu')
}

function broadcastURL (url) {
  if (!url || typeof url !== 'string') {
    return
  }

  if (mainWindow && mainWindow.webContents) {
    mainWindow.webContents.send('process-url', url)
    deeplinkingUrl = null
  }
}

// Force Single Instance Application
const gotTheLock = app.requestSingleInstanceLock()

if (!gotTheLock) {
  app.exit()
} else {
  app.on('second-instance', (_, argv) => {
    // Someone tried to run a second instance, we should focus our window.
    // argv: An array of the second instance’s (command line / deep linked) arguments
    if (process.platform !== 'darwin') {
      deeplinkingUrl = argv[2]
      broadcastURL(deeplinkingUrl)
    }

    if (mainWindow) {
      if (mainWindow.isMinimized()) {
        mainWindow.restore()
      }
      mainWindow.focus()
    }
  })

  if (process.platform !== 'darwin') {
    deeplinkingUrl = process.argv[2]
    broadcastURL(deeplinkingUrl)
  }
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

app.on('open-url', (event, url) => {
  // Protocol handler for osx
  event.preventDefault()
  deeplinkingUrl = url
  broadcastURL(deeplinkingUrl)
})

app.setAsDefaultProtocolClient('ark', process.execPath, ['--'])

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
