import { BrowserWindow, ipcMain } from 'electron'
// import path from 'path'

export { default as darkArkTemplate } from './templates/darkArk'

// const isProduction = process.env.NODE_ENV === 'production'
// const logo = isProduction
//   ? path.resolve(__dirname, '../static/128x128.png')
//   : path.resolve(__dirname, '../../../build/icons/128x128.png')

export const splashScreenWindow = ({
  mainWindow,
  width = 600,
  height = 400,
  template,
  color,
  brand,
  productName,
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
    // logo,
    color,
    brand,
    productName,
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
