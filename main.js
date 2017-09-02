const electron = require('electron')
// Module to control application life.
const app = electron.app
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow


const Menu = electron.Menu
const openAboutWindow = require('about-window').default

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow
//console.log(require.resolve('electron'));
function createWindow () {
  // Create the browser window.
  let {width,height} = electron.screen.getPrimaryDisplay().workAreaSize
  mainWindow = new BrowserWindow({width: width-100, height: height-100, center:true, icon: __dirname + "/client/ark.png", resizable:true, frame:true, show:false})
  mainWindow.setContentProtection(true);
  // and load the index.html of the app.
  mainWindow.loadURL(`file://${__dirname}/client/app/index.html`)
  mainWindow.once('ready-to-show', () => {
    mainWindow.show()
  })

  // Create the Application's main menu
  var template = [
    {
      label: "Application",
      submenu: [
       {
            label: "About KapuClient",
            click: () => openAboutWindow({
              icon_path: __dirname+'/client/ark.ico',
              package_json_dir: __dirname,
              copyright: 'Copyright (c) 2017 KAPU',
              homepage: 'https://kapu.one/',
              bug_report_url: 'https://github.com/kapucoin/kapu-desktop/issues'
            })
        },
        { type: "separator" },
        { label: "Disable screenshot protection (unsafe)", click: function() { mainWindow.setContentProtection(false) }},
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

  Menu.setApplicationMenu(Menu.buildFromTemplate(template));


  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })

}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)



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

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
