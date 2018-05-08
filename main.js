const electron = require('electron') // {app, electron, protocol, BrowserWindow, ipcMain, Menu, globalShortcut}
const elemon = require('elemon')
const openAboutWindow = require('about-window').default
const windowStateKeeper = require('electron-window-state')
const _path = require('path')

const app = electron.app
const BrowserWindow = electron.BrowserWindow
const ipcMain = electron.ipcMain
const Menu = electron.Menu

const ledger = require('ledgerco')
const LedgerArk = require(_path.resolve(__dirname, './LedgerArk'))
const fork = require('child_process').fork

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

let ledgercomm

// needed to create menu/update it.
let menu = null
let enableScreenshotProtection = true
let template = null
let deeplinkingUrl = null

// Force Single Instance Application
const shouldQuit = app.makeSingleInstance((argv, workingDirectory) => {
  // Someone tried to run a second instance, we should focus our window.

  // argv: An array of the second instance’s (command line / deep linked) arguments
  if (process.platform !== 'darwin') {
    deeplinkingUrl = argv[2]
    broadcastURI(deeplinkingUrl)
  }

  if (mainWindow) {
    if (mainWindow.isMinimized()) mainWindow.restore()
    mainWindow.focus()
  }
})

if (shouldQuit) {
  app.exit()
}

function createWindow () {
  // Create the browser window.t
  const iconpath = _path.resolve(__dirname, '/client/ark.png')
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

  mainWindow.webContents.on('did-finish-load', () => {
    if (deeplinkingUrl) broadcastURI(deeplinkingUrl)
  })

  const ledgerWorker = fork(`${__dirname}/ledger-worker.js`)

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
                const result = {
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
          const result = {
            connected: false,
            message: 'Cannot connect to Ark application'
          }
          event.returnValue = result
        }
      }
    }
  })

  // Create the Application's main menu
  const about = {
    role: 'about',
    click: () => openAboutWindow({
      icon_path: `${__dirname}/client/ark.png`,
      package_json_dir: __dirname,
      copyright: 'Copyright (c) 2017 ARK',
      homepage: 'https://ark.io/',
      bug_report_url: 'https://github.com/ArkEcosystem/ark-desktop/issues'
    })
  }

  const screenshotProtection = {
    label: getScreenshotProtectionLabel(),
    click: () => { updateScreenshotProtectionItem() }
  }

  template = [
    {
      label: 'File',
      submenu: [
        screenshotProtection,
        { type: 'separator' },
        { role: 'quit' }
      ]
    }, {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        { role: 'selectall' },
        { type: 'separator' },
        { label: 'Print Page', accelerator: 'CmdOrCtrl+P', click: function () { mainWindow.webContents.print({printBackground: true}) } }
      ]
    }, {
      role: 'window',
      submenu: [
        { role: 'minimize' },
        { role: 'close' }
      ]
    },
    {
      role: 'help',
      submenu: [
        {
          label: 'Learn More',
          click () { require('electron').shell.openExternal('https://ark.io') }
        },
        { label: 'Reload App', accelerator: 'CmdOrCtrl+R', click: function () { mainWindow.reload() } },
        { label: 'Open Dev Tools', accelerator: 'CmdOrCtrl+D', click: function () { mainWindow.webContents.openDevTools() } }
      ]
    }
  ]

  if (process.platform === 'darwin') {
    template[0] = {
      label: app.getName(),
      submenu: [
        about,
        { type: 'separator' },
        screenshotProtection,
        { type: 'separator' },
        { role: 'services', submenu: [] },
        { type: 'separator' },
        { role: 'hide' },
        { role: 'hideothers' },
        { role: 'unhide' },
        { type: 'separator' },
        { role: 'quit' }
      ]
    }
    template[2].submenu = [
      { role: 'minimize' },
      { role: 'zoom' },
      { role: 'togglefullscreen' }
    ]
  } else if (process.platform === 'linux') {
    template[0] = {
      label: 'File',
      submenu: [
        { role: 'quit' }
      ]
    }
    template[3].submenu.unshift(about, { type: 'separator' })
  } else {
    template[3].submenu.unshift(about, { type: 'separator' })
  }

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

function shouldDisableScreenshotProtection (arugments) {
  return arugments && arugments.some(v => v && typeof v === 'string' && v.toLowerCase() === '--disablescreenshotprotection')
}

app.setAsDefaultProtocolClient('ark', process.execPath, ['--'])

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
  createWindow()

  if (process.env.LIVE_RELOAD) {
    configureReload()
  }

  if (shouldDisableScreenshotProtection(process.argv)) {
    updateScreenshotProtectionItem()
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

app.on('open-url', (event, url) => {
  // Protocol handler for osx
  event.preventDefault()
  deeplinkingUrl = url

  broadcastURI(deeplinkingUrl)
})

// enables/disables and updates the screen shot protection item menu
function updateScreenshotProtectionItem () {
  if (menu == null || template == null) {
    return
  }

  enableScreenshotProtection = !enableScreenshotProtection
  mainWindow.setContentProtection(enableScreenshotProtection)

  let index = process.platform === 'darwin' ? 2 : 0
  template[0].submenu[index].label = getScreenshotProtectionLabel()

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

function broadcastURI (uri) {
  if (!uri || typeof uri !== 'string') return

  if (mainWindow && mainWindow.webContents) mainWindow.webContents.send('uri', uri)
}
