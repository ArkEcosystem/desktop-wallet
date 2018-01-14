const electron = require('electron')
const elemon = require('elemon')
const _path = require('path')

// Module to control application life.
const app = electron.app
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow
const ipcMain = electron.ipcMain
const Menu = electron.Menu
const openAboutWindow = require('about-window').default

const ledger = require('ledgerco')
const LedgerArk = require(_path.resolve(__dirname, './LedgerArk'))
const fork = require('child_process').fork

const windowStateKeeper = require('electron-window-state')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

var ledgercomm

// needed to create menu/update it.
var menu = null
var enableScreenshotProtection = true
var template = null

function createWindow () {
  // Create the browser window.t
  var iconpath = _path.resolve(__dirname, '/client/ark.png')
  let {width, height} = electron.screen.getPrimaryDisplay().workAreaSize

  let mainWindowState = windowStateKeeper({
    defaultWidth: width - 100,
    defaultHeight: height - 100
  })

  mainWindow = new BrowserWindow({width: mainWindowState.width, height: mainWindowState.height, x: mainWindowState.x, y: mainWindowState.y, center: true, icon: iconpath, resizable: true, frame: true, show: false})
  mainWindow.setContentProtection(true)
  mainWindowState.manage(mainWindow)
  // and load the index.html of the app.
  mainWindow.loadURL(`file://${__dirname}/client/app/index.html`)
  mainWindow.once('ready-to-show', () => {
    mainWindow.show()
  })

  var ledgerWorker = fork(`${__dirname}/ledger-worker.js`)

  ledgerWorker.on('message', (message) => {
    if (message.connected && !ledgercomm) {
      ledger.comm_node.create_async().then((comm) => {
        ledgercomm = comm
      }).fail((error) => console.log(error))
    } else if (!message.connected && ledgercomm) {
      ledgercomm.close_async()
      ledgercomm = null
    }
  })

  ipcMain.on('ledger', (event, arg) => {
    if (arg.action === 'detect') {
      event.returnValue = {
        status: ledgercomm ? 'Success' : 'Failure'
      }
    } else {
      if (!ledgercomm) {
        console.log('connection not initialised')
        event.returnValue = 'connection not initialised'
      } else {
        try {
          let ark = new LedgerArk(ledgercomm)
          if (arg.action === 'signMessage') {
            ark.signPersonalMessage_async(arg.path, Buffer.from(arg.data)
              .toString('hex'))
              .then((result) => event.sender.send('messageSigned', result))
              .fail((error) => event.sender.send('messageSigned', {error: error}))
          } else if (arg.action === 'signTransaction') {
            ark.signTransaction_async(arg.path, arg.data)
              .then((result) => event.sender.send('transactionSigned', result))
              .fail((error) => event.sender.send('transactionSigned', {error: error}))
          } else if (arg.action === 'getAddress') {
            ark.getAddress_async(arg.path)
              .then((result) => { event.returnValue = result })
              .fail((error) => { event.returnValue = error })
          } else if (arg.action === 'getConfiguration') {
            ark.getAppConfiguration_async()
              .then((result) => {
                result.connected = true
                event.returnValue = result
              })
              .fail((error) => {
                var result = {
                  connected: false,
                  message: error
                }
                if (ledgercomm && ledgercomm.close_async) {
                  ledgercomm.close_async()
                }
                ledgercomm = null
                event.returnValue = result
              })
          }
        } catch (error) {
          if (ledgercomm && ledgercomm.close_async) {
            ledgercomm.close_async()
          }
          ledgercomm = null
          var result = {
            connected: false,
            message: 'Cannot connect to Ark application'
          }
          event.returnValue = result
        }
      }
    }
  })

  // Create the Application's main menu
  template = [
    {
      label: 'Application',
      submenu: [
        {
          label: 'About KapuClient',
          click: () => openAboutWindow({
            icon_path: `${__dirname}/client/ark.ico`,
            package_json_dir: __dirname,
            copyright: 'Copyright (c) 2017 KAPU',
            homepage: 'https://kapu.one/',
            bug_report_url: 'https://github.com/kapucoin/kapu-desktop/issues'
          })
        },
        { type: 'separator' },
        { label: getScreenshotProtectionLabel(), click: () => { updateScreenshotProtectionItem() }, enabled: process.platform !== 'linux' },
        { type: 'separator' },
        { label: 'Minimize', click: function () { mainWindow.minimize() } },
        { label: 'Maximize', click: function () { mainWindow.maximize() } },
        { label: 'Full Screen', click: function () { mainWindow.setFullScreen(!mainWindow.isFullScreen()) } },
        { type: 'separator' },
        { label: 'Restart', accelerator: 'Command+R', click: function () { mainWindow.reload() } },
        { label: 'Quit', accelerator: 'Command+Q', click: function () { app.quit() } }
      ]
    }, {
      label: 'Edit',
      submenu: [
        { label: 'Undo', accelerator: 'CmdOrCtrl+Z', selector: 'undo:' },
        { label: 'Redo', accelerator: 'Shift+CmdOrCtrl+Z', selector: 'redo:' },
        { type: 'separator' },
        { label: 'Cut', accelerator: 'CmdOrCtrl+X', selector: 'cut:' },
        { label: 'Copy', accelerator: 'CmdOrCtrl+C', selector: 'copy:' },
        { label: 'Paste', accelerator: 'CmdOrCtrl+V', selector: 'paste:' },
        { label: 'Select All', accelerator: 'CmdOrCtrl+A', selector: 'selectAll:' },
        { type: 'separator' },
        { label: 'Open Dev Tools', accelerator: 'CmdOrCtrl+D', click: function () { mainWindow.webContents.openDevTools() } },
        { label: 'Reload App', accelerator: 'CmdOrCtrl+R', click: function () { mainWindow.webContents.reload() } },
        { label: 'Print Page', accelerator: 'CmdOrCtrl+P', click: function () { mainWindow.webContents.print({printBackground: true}) } }
      ]
    }
  ]

  menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)

  // Emitted when the window is closed.
  mainWindow.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    if (ledgerWorker.connected) {
      ledgerWorker.send({quit: true})
    }
    mainWindow = null
  })
}

function configureReload () {
  elemon({
    app: app,
    mainFile: 'main.js',
    bws: [
      { bw: mainWindow, res: ['index.html'] }
    ]
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
  createWindow()
  registerShortcuts()

  if (process.env.LIVE_RELOAD) {
    configureReload()
  }
})

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

// enables/disables and updates the screen shot protection item menu
function updateScreenshotProtectionItem () {
  if (menu == null || template == null) {
    return
  }

  enableScreenshotProtection = !enableScreenshotProtection
  mainWindow.setContentProtection(enableScreenshotProtection)
  if (enableScreenshotProtection) {
    template[0].submenu[2].label = 'Disable screenshot protection (unsafe)'
  } else {
    template[0].submenu[2].label = 'Enable screenshot protection (recommended)'
  }

  menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
}

function getScreenshotProtectionLabel () {
  if (process.platform === 'linux') {
    return 'Screenshot Protection Not Available On Linux'
  } else if (enableScreenshotProtection) {
    return 'Disable screenshot protection (unsafe)'
  } else {
    return 'Enable screenshot protection (recommended)'
  }
}

function registerShortcuts () {
  if (process.platform === 'darwin') {
    electron.globalShortcut.register('CommandOrControl+H', hideApp)
  }
}

function hideApp () {
  electron.app.hide()
}
// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
