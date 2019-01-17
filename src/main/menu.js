const { Menu, shell } = require('electron')
const { APP } = require('../../config')
const aboutWindow = require('about-window').default
const path = require('path')
const packageJson = require('../../package.json')
const releaseService = require('../renderer/services/release').default

const isProduction = process.env.NODE_ENV === 'production'

const about = {
  label: 'About',
  click: () => aboutWindow({
    icon_path: isProduction
      ? path.resolve(__dirname, './static/128x128.png')
      : path.resolve(__dirname, '../../build/icons/128x128.png'),
    package_json_dir: path.resolve(__dirname, '../../'),
    css_path: isProduction ? path.resolve(__dirname, 'styles.css') : null
  })
}

const template = [
  {
    label: 'File',
    submenu: [
      { role: 'quit' }
    ]
  },
  {
    label: 'Edit',
    submenu: [
      { role: 'undo' },
      { role: 'redo' },
      { type: 'separator' },
      { role: 'cut' },
      { role: 'copy' },
      { role: 'paste' },
      { role: 'pasteandmatchstyle' },
      { role: 'delete' },
      { role: 'selectall' }
    ]
  },
  {
    label: 'View',
    submenu: [
      { role: 'reload' },
      { role: 'forcereload' },
      { role: 'toggledevtools' },
      { type: 'separator' },
      { role: 'resetzoom' },
      { role: 'zoomin' },
      { role: 'zoomout' },
      { type: 'separator' },
      { role: 'togglefullscreen' }
    ]
  },
  {
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
        click () {
          shell.openExternal(APP.website)
        }
      },
      {
        label: `Version ${packageJson.version}`,
        click () {
          shell.openExternal(releaseService.latestReleaseUrl)
        }
      }
    ]
  }
]

if (process.platform === 'darwin') {
  // File menu
  template[0] = {
    label: packageJson.build.productName,
    submenu: [
      about,
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

  // Edit menu
  template[1].submenu.push(
    { type: 'separator' },
    {
      label: 'Speech',
      submenu: [
        { role: 'startspeaking' },
        { role: 'stopspeaking' }
      ]
    }
  )

  // Window menu
  template[3].submenu = [
    { role: 'close' },
    { role: 'minimize' },
    { role: 'zoom' },
    { type: 'separator' },
    { role: 'front' }
  ]
} else {
  template[4].submenu.unshift(about, { type: 'separator' })
}

const menu = Menu.buildFromTemplate(template)
Menu.setApplicationMenu(menu)
