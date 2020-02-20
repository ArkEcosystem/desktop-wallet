import { BrowserWindow, ipcMain } from 'electron'

const url = process.env.NODE_ENV === 'development'
  ? 'http://localhost:9080/splashscreen.html'
  : `file://${__dirname}/splashscreen.html`

export const splashScreenWindow = (splashScreen, mainWindow) => {
  splashScreen = new BrowserWindow({
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

  splashScreen.loadURL(url)
  splashScreen.show()

  const hideSplashScreen = () => {
    console.log('MODIFY....')
    setTimeout(() => splashScreen.destroy(), 500)
    mainWindow.show()
  }

  ipcMain.on('splashscreen:app-ready', hideSplashScreen)

  return hideSplashScreen
}
