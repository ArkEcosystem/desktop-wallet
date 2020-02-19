import { BrowserWindow, ipcMain } from 'electron'

export const splashScreenWindow = ({
  mainWindow,
  width = 600,
  height = 400
}) => {
  const splashScreen = new BrowserWindow({
    width,
    height,
    parent: mainWindow,
    modal: true,
    transparent: true,
    skipTaskbar: true,
    frame: false,
    autoHideMenuBar: true,
    alwaysOnTop: true,
    resizable: false,
    movable: false
  })

  splashScreen.show()

  const hide = () => {
    setTimeout(() => splashScreen.destroy(), 500)
    mainWindow.show()
  }

  ipcMain.on('splashscreen:app-is-ready', hide)

  return hide
}
