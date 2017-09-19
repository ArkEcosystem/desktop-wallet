const electron = require('electron')
// Module to control application life.
const app = electron.app
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow
const ipcMain = electron.ipcMain
const Menu = electron.Menu
const openAboutWindow = require('about-window').default

const ledger = require('ledgerco')
const LedgerArk = require('./LedgerArk')
const fork = require('child_process').fork;


// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

var ledgercomm

function createWindow () {
    // Create the browser window.t
  var platform = require('os').platform();
  var iconpath = __dirname + "/client/ark.png";
  if(platform == "linux" || platform == "freebsd" || platform == "sunos") iconpath = __dirname + "/client/ark_linux.png";
  //if(platform == "win32") iconpath = __dirname + "/client/ark_windows.png";
  //if(platform == "darwin") iconpath = __dirname + "/client/ark_mac.png";
  let {width,height} = electron.screen.getPrimaryDisplay().workAreaSize
  mainWindow = new BrowserWindow({width: width-100, height: height-100, center:true, icon: iconpath, resizable:true, frame:true, show:false})
  mainWindow.setContentProtection(true);
  // and load the index.html of the app.
  mainWindow.loadURL(`file://${__dirname}/client/app/index.html`)
  mainWindow.once('ready-to-show', () => {
    mainWindow.show()
  })
  
  var ledgerWorker = fork('./ledger-worker');
  
  ledgerWorker.on('message', function (message) {
    if(message.connected && !ledgercomm){
      ledger.comm_node.create_async().then((comm) => {
        ledgercomm = comm
      }).fail((error) => {
        console.log(error)
      })
    }
    else if(!message.connected && ledgercomm){
      ledgercomm.close_async()
      ledgercomm = null
    }
  });

  ipcMain.on('ledger', (event, arg) => {
    if(arg.action == "detect"){
      event.returnValue = {
        status: ledgercomm ? "Success" : "Failure"
      }
    }
    else {
      if(!ledgercomm){
        console.log("connection not initialised")
        event.returnValue = "connection not initialised"
      }
      else try{
        ark = new LedgerArk(ledgercomm)
        if(arg.action == "signMessage"){
          ark.signPersonalMessage_async(arg.path, Buffer.from(arg.data).toString("hex")).then(
            (result) => {  event.sender.send('messageSigned', result) }
          ).fail(
            (error) => { event.sender.send('messageSigned', {error:error}) }
          )
        }
        else if(arg.action == "signTransaction"){
          ark.signTransaction_async(arg.path, arg.data).then(
            (result) => { event.sender.send('transactionSigned', result) }
          ).fail(
            (error) => { event.sender.send('transactionSigned', {error:error}) }
          )
        }
        else if(arg.action == "getAddress"){
          ark.getAddress_async(arg.path).then(
            (result) => { event.returnValue = result }
          ).fail(
            (error) => { event.returnValue = error }
          )
        }
        else if(arg.action == "getConfiguration"){
          ark.getAppConfiguration_async().then((result) => {
              console.log(result)
              result.connected = true
              event.returnValue = result
            }
          ).fail((error) => {
              var result = {
                connected: false,
                message: error
              }
              if(ledgercomm && ledgercomm.close_async){
                ledgercomm.close_async()
              }
              ledgercomm = null
              event.returnValue = result
            }
          )
        }
      } catch(error){
        if(ledgercomm && ledgercomm.close_async){
          ledgercomm.close_async()
        }
        ledgercomm = null
        var result = {
          connected: false,
          message: "Cannot connect to Ark application"
        }
        event.returnValue = result
      }
    }

});


  // Create the Application's main menu
  var template = [
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
