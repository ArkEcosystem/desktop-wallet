'use strict'

import { app, BrowserWindow, ipcMain, screen } from 'electron'
import { setupPluginManager } from './plugin-manager'
import { setupUpdater } from './updater'
import winState from 'electron-window-state'
import packageJson from '../../package.json'

// It is necessary to require `electron-log` here to use it on the renderer process
require('electron-log')

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path')
    .join(__dirname, '/static')
    .replace(/\\/g, '\\\\')
}

// To E2E tests
if (process.env.TEMP_USER_DATA === 'true') {
  const tempy = require('tempy')
  const tempDirectory = tempy.directory()
  app.setPath('userData', tempDirectory)
}

let mainWindow = null
let loadingWindow = null
let deeplinkingUrl = null

const winURL =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:9080'
    : `file://${__dirname}/index.html`

const loadingURL =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:9080/splashscreen.html'
    : `file://${__dirname}/splashscreen.html`

const createLoadingWindow = () => {
  loadingWindow = new BrowserWindow({
    width: 800,
    height: 600,
    parent: mainWindow,
    skipTaskbar: true,
    frame: false,
    autoHideMenuBar: true,
    resizable: false,
    webPreferences: {
      nodeIntegration: true
    }
  })
  loadingWindow.setResizable(false)
  loadingWindow.loadURL(loadingURL)
  loadingWindow.show()
  loadingWindow.on('close', () => (loadingWindow = null))
  loadingWindow.on('closed', () => (loadingWindow = null))
  loadingWindow.webContents.on('did-finish-load', () => loadingWindow.show())
}

function createWindow () {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize

  const windowState = winState({
    defaultWidth: width,
    defaultHeight: height,
    fullScreen: false
  })

  const wasFullScreen = windowState.isFullScreen
  mainWindow = new BrowserWindow({
    width: windowState.width,
    height: windowState.height,
    x: windowState.x,
    y: windowState.y,
    center: true,
    show: false,
    webPreferences: {
      nodeIntegration: true,
      webviewTag: true
    }
  })

  mainWindow.hide()

  // The `mainWindow.show()` is executed after the opening splash screen
  ipcMain.on('splashscreen:app-ready', () => {
    if (loadingWindow) {
      loadingWindow.close()
    }
    mainWindow.show()
    mainWindow.setFullScreen(wasFullScreen)
  })

  ipcMain.on('disable-iframe-protection', function (_event, urls) {
    const filter = { urls }
    mainWindow.webContents.session.webRequest.onHeadersReceived(
      filter,
      (details, done) => {
        const headers = details.responseHeaders

        const xFrameOrigin = Object.keys(headers).find(header =>
          header.toString().match(/^x-frame-options$/i)
        )
        if (xFrameOrigin) {
          delete headers[xFrameOrigin]
        }

        done({
          cancel: false,
          responseHeaders: headers,
          statusLine: details.statusLine
        })
      }
    )
  })

  windowState.manage(mainWindow)
  mainWindow.loadURL(winURL)

  mainWindow.on('close', () => (mainWindow = null))
  mainWindow.on('closed', () => (mainWindow = null))

  mainWindow.webContents.on('did-finish-load', () => {
    const name = packageJson.build.productName
    const version = app.getVersion()
    const windowTitle = `${name} ${version}`
    mainWindow.setTitle(windowTitle)

    broadcastURL(deeplinkingUrl)
  })

  require('./menu')
}

function broadcastURL (url) {
  if (!url || typeof url !== 'string') {
    return
  }

  if (sendToWindow('process-url', url)) {
    deeplinkingUrl = null
  }
}

function sendToWindow (key, value) {
  if (mainWindow && mainWindow.webContents) {
    mainWindow.webContents.send(key, value)
    return true
  }

  return false
}

// Force Single Instance Application
const gotTheLock = app.requestSingleInstanceLock()

if (!gotTheLock) {
  app.exit()
} else {
  app.on('second-instance', (_, argv) => {
    // Someone tried to run a second instance, we should focus our window.
    // argv: An array of the second instance’s (command line / deep linked) arguments
    for (const arg of argv) {
      if (arg.startsWith('ark:')) {
        deeplinkingUrl = arg
        broadcastURL(deeplinkingUrl)
        break
      }
    }

    if (mainWindow) {
      if (mainWindow.isMinimized()) {
        mainWindow.restore()
      }
      mainWindow.focus()
    }
  })

  for (const arg of process.argv) {
    if (arg.startsWith('ark:')) {
      deeplinkingUrl = arg
      broadcastURL(deeplinkingUrl)
      break
    }
  }
}

app.on('ready', () => {
  createLoadingWindow()
  createWindow()
  setupPluginManager({ sendToWindow, mainWindow, ipcMain })
  setupUpdater({ sendToWindow, ipcMain })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createLoadingWindow()
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
