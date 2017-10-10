const electron = require('electron')
const elemon = require('elemon')

// Module to control application life.
const app = electron.app
const ipcMain = electron.ipcMain
const Menu = electron.Menu
const openAboutWindow = require('about-window').default
const ledgerWorker = require('child_process').fork(`${__dirname}/AsyncLedger.js`);
const windowStateKeeper = require('electron-window-state');
const CONSTANTS = require('./LedgerAsyncConstants')

var ledgerPresent = false
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

// needed to create menu/update it.
var menu = null;
var enableScreenshotProtection = true;
var template = null;

function createWindow() {
  // Create the browser window.t
  var platform = require('os').platform();
  var iconpath = __dirname + "/client/ark.png";
  //if(platform == "linux" || platform == "freebsd" || platform == "sunos") iconpath = __dirname + "/client/ark_linux.png";
  //if(platform == "win32") iconpath = __dirname + "/client/ark_windows.png";
  //if(platform == "darwin") iconpath = __dirname + "/client/ark_mac.png";
  let {width,height} = electron.screen.getPrimaryDisplay().workAreaSize

  let mainWindowState = windowStateKeeper({
    defaultWidth: width-100,
    defaultHeight: height-100
  });

  mainWindow = new electron.BrowserWindow({width: mainWindowState.width, height: mainWindowState.height, x: mainWindowState.x, y: mainWindowState.y, center:true, icon: iconpath, resizable:true, frame:true, show:false})
  mainWindow.setContentProtection(true);
  mainWindowState.manage(mainWindow);
  // and load the index.html of the app.
  mainWindow.loadURL(`file://${__dirname}/client/app/index.html`)
  mainWindow.once('ready-to-show', () => {
    mainWindow.show()
  })

  ledgerWorker.on('message', args => {
    switch (args.action) {
      case CONSTANTS.FORWARD:
        var recipient = electron.webContents.fromId(args.recipient)
        if (args.value) {
          recipient.send(args.channel, {value: args.value})
        } else {
          recipient.send(args.channel, {error: args.error})
        }
        break
      case CONSTANTS.GET_CONFIGURATION:
        ledgerPresent = args.value
        break
      default:
        console.error('Unknown action [' + args.action + '] received from ledger worker (pid:' + ledgerWorker.pid + ")")
    }
  })

  ipcMain.on('ledger', (event, args) => {
    switch (args.action) {
      case CONSTANTS.DETECT_LEDGER:
        event.returnValue = {connected: ledgerPresent}
        break
      case CONSTANTS.GET_ADDRESSES:
        ledgerWorker.send({action: CONSTANTS.GET_ADDRESSES, id: event.sender.id, path: args.path})
        
        break
      case CONSTANTS.SIGN_TRANSACTION:
        ledgerWorker.send(({action: CONSTANTS.SIGN_TRANSACTION, id: event.sender.id, path: args.path, data: args.data}))
        break
      case CONSTANTS.SIGN_MESSAGE:
        ledgerWorker.send({action:CONSTANTS.SIGN_MESSAGE, id: event.sender.id, path: args.path, data: args.data})
        break
      default:
        console.error('Unknown action [' + args.action + '] received from WindowBrowser with id=' + event.sender.id)
    }
  })

  // Create the Application's main menu
  template = [
    {
      label: "Application",
      submenu: [
        {
            label: "About ArkClient",
            click: () => openAboutWindow({
              icon_path: __dirname+'/client/ark.png',
              package_json_dir: __dirname,
              copyright: 'Copyright (c) 2017 ARK',
              homepage: 'https://ark.io/',
              bug_report_url: 'https://github.com/ArkEcosystem/ark-desktop/issues'
            })
        },
        { type: "separator" },
        { label: "Disable screenshot protection (unsafe)", click: function() { updateScreenshotProtectionItem(); }},
        { type: "separator" },
        { label: "Minimize", click: function() { mainWindow.minimize(); }},
        { label: "Maximize", click: function() { mainWindow.maximize(); }},
        { label: "Full Screen", click: function() { mainWindow.setFullScreen(!mainWindow.isFullScreen()); }},
        { type: "separator" },
        { label: "Restart", accelerator: "Command+R", click: function() { mainWindow.reload(); }},
        { label: "Quit", accelerator: "Command+Q", click: function() { app.quit(); }},
      ]
    }, {
      label: "Edit",
      submenu: [
        { label: "Undo", accelerator: "CmdOrCtrl+Z", selector: "undo:" },
        { label: "Redo", accelerator: "Shift+CmdOrCtrl+Z", selector: "redo:" },
        { type: "separator" },
        { label: "Cut", accelerator: "CmdOrCtrl+X", selector: "cut:" },
        { label: "Copy", accelerator: "CmdOrCtrl+C", selector: "copy:" },
        { label: "Paste", accelerator: "CmdOrCtrl+V", selector: "paste:" },
        { label: "Select All", accelerator: "CmdOrCtrl+A", selector: "selectAll:" },
        { type: "separator" },
        { label: "Open Dev Tools", accelerator: "CmdOrCtrl+D", click: function() { mainWindow.webContents.openDevTools(); }},
        { label: "Reload App", accelerator: "CmdOrCtrl+R", click: function() { mainWindow.webContents.reload(); }},
        { label: "Print Page", accelerator: "CmdOrCtrl+P", click: function() { mainWindow.webContents.print({printBackground:true}); }}
      ]
    }
  ];

  menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);


  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })

}

function configureReload() {
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
app.on('ready', function () {
  createWindow()

  if (process.env.LIVE_RELOAD) {
    configureReload()
  }
})



// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

// enables/disables and updates the screen shot protection item menu 
function updateScreenshotProtectionItem() {
    if (menu == null || template == null) {
        return;
    }

    enableScreenshotProtection = !enableScreenshotProtection;
    mainWindow.setContentProtection(enableScreenshotProtection);
    if (enableScreenshotProtection) {
        template[0].submenu[2].label = "Disable screenshot protection (unsafe)";
    }

    else {
        template[0].submenu[2].label = "Enable screenshot protection (recommended)";
    }

    menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
}
// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
