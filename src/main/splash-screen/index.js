import { BrowserWindow, ipcMain } from 'electron'

export const splashScreenWindow = ({
  mainWindow,
  width = 600,
  height = 400,
  template,
  color,
  brand,
  appName,
  text,
  version
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

  const props = {
    color,
    brand,
    appName,
    text,
    version
  }

  const file = `data:text/html;charset=UTF-8,${encodeURIComponent(template(props))}`

  splashScreen.loadURL(file)
  splashScreen.show()

  const hide = () => {
    setTimeout(() => splashScreen.destroy(), 500)
    mainWindow.show()
  }

  ipcMain.on('splashscreen:app-ready', hide)

  return hide
}
