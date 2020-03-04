'use strict'

import { app, BrowserWindow, ipcMain, screen } from 'electron'
import { setupPluginManager } from './plugin-manager'
import { setupUpdater } from './updater'
import winState from 'electron-window-state'
import packageJson from '../../package.json'
import assignMenu from './menu'

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
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const tempy = require('tempy')
  const tempDirectory = tempy.directory()
  app.setPath('userData', tempDirectory)
}

const windows = {
  main: null,
  loading: null
}
let windowState
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
  windows.loading = new BrowserWindow({
    width: 800,
    height: 600,
    backgroundColor: '#f7fafb',
    skipTaskbar: true,
    frame: false,
    autoHideMenuBar: true,
    resizable: false,
    webPreferences: {
      nodeIntegration: true
    }
  })
  windows.loading.loadURL(loadingURL)
  windows.loading.show()
  windows.loading.on('close', () => (windows.loading = null))
  windows.loading.on('closed', () => (windows.loading = null))
  windows.loading.webContents.on('did-finish-load', () => windows.loading.show())
}

function broadcastURL (url) {
  if (!url || typeof url !== 'string') {
    return
  }

  if (windows.main && windows.main.webContents) {
    windows.main.webContents.send('process-url', url)
    deeplinkingUrl = null
  }
}

assignMenu({ createLoadingWindow })

// The `window.main.show()` is executed after the opening splash screen
ipcMain.on('splashscreen:app-ready', () => {
  if (windows.loading) {
    windows.loading.close()
  }
  windows.main.show()
  windows.main.setFullScreen(windowState ? Boolean(windowState.isFullScreen) : false)
})

ipcMain.on('disable-iframe-protection', function (_event, urls) {
  const filter = { urls }
  windows.main.webContents.session.webRequest.onHeadersReceived(
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

function createWindow () {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize

  windowState = winState({
    defaultWidth: width,
    defaultHeight: height,
    fullScreen: false
  })

  windows.main = new BrowserWindow({
    width: windowState.width,
    height: windowState.height,
    x: windowState.x,
    y: windowState.y,
    backgroundColor: '#f7fafb',
    center: true,
    show: false,
    webPreferences: {
      nodeIntegration: true,
      webviewTag: true
    }
  })
  windows.main.isMain = true

  windowState.manage(windows.main)
  windows.main.loadURL(winURL)
  windows.main.hide()
  windows.main.setBackgroundColor('#f7fafb')

  windows.main.on('close', () => (windows.main = null))
  windows.main.on('closed', () => (windows.main = null))

  windows.main.webContents.on('did-finish-load', () => {
    const name = packageJson.build.productName
    const version = app.getVersion()
    const windowTitle = `${name} ${version}`
    windows.main.setTitle(windowTitle)

    broadcastURL(deeplinkingUrl)
  })
}

ipcMain.on('show-loading-window-on-reload', () => {
  if (windows.main && windows.main.isMain) {
    windows.main.reload()
    windows.main.webContents.clearHistory()
    windows.main.hide()
    createLoadingWindow()
  }
})

function sendToWindow (key, value) {
  if (windows.main && windows.main.webContents) {
    windows.main.webContents.send(key, value)
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

    if (windows.main) {
      if (windows.main.isMinimized()) {
        windows.main.restore()
      }
      windows.main.focus()
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
  setupPluginManager({ sendToWindow, windows, ipcMain })
  setupUpdater({ sendToWindow, ipcMain })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (windows.main === null) {
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
