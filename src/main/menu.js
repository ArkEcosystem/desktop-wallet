/* eslint-disable @typescript-eslint/no-var-requires */
const { Menu, shell } = require('electron')
const { APP } = require('../../config')
const aboutWindow = require('about-window').default
const path = require('path')
const packageJson = require('../../package.json')
const releaseService = require('../renderer/services/release').default

const isProduction = process.env.NODE_ENV === 'production'

export default function ({ createLoadingWindow }) {
  const about = {
    label: 'About',
    click: () => aboutWindow({
      adjust_window_size: true,
      icon_path: isProduction
        ? path.resolve(__dirname, './static/128x128.png')
        : path.resolve(__dirname, '../../build/icons/128x128.png'),
      copyright: [
        `<p style="text-align: center">Distributed under ${packageJson.license} license</p>`,
        '<p>Flag icons made by <a href="https://www.freepik.com/" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon">flaticon.com</a> are licensed by <a href="https://creativecommons.org/licenses/by/3.0/" title="Creative Commons BY 3.0">CC 3.0 BY</a></p>'
      ],
      package_json_dir: path.resolve(__dirname, '../../'),
      css_path: isProduction ? path.resolve(__dirname, 'styles.css') : null,
      use_inner_html: true
    })
  }

  const preferences = {
    label: 'Preferences',
    submenu: [
      {
        label: 'Settings',
        accelerator: 'CmdOrCtrl+,',
        click: (_, focusedWindow) => {
          if (focusedWindow && focusedWindow.webContents) {
            focusedWindow.webContents.send('app:preferences')
          }
        }
      }
    ]
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
        {
          label: 'Reload',
          accelerator: 'CmdOrCtrl+R',
          click: (_, focusedWindow) => {
            focusedWindow.reload()
            focusedWindow.webContents.clearHistory()
            if (focusedWindow && focusedWindow.isMain) {
              focusedWindow.hide()
              createLoadingWindow()
            }
          }
        },
        {
          label: 'Force Reload',
          accelerator: 'CmdOrCtrl+Shift+R',
          click: (_, focusedWindow) => {
            focusedWindow.reload()
            focusedWindow.webContents.clearHistory()
            focusedWindow.webContents.session.clearCache()
            if (focusedWindow && focusedWindow.isMain) {
              focusedWindow.hide()
              createLoadingWindow()
            }
          }
        },
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
      role: 'appMenu',
      label: packageJson.build.productName,
      submenu: [
        about,
        { type: 'separator' },
        preferences,
        { type: 'separator' },
        { role: 'services', submenu: [] },
        { type: 'separator' },
        {
          label: 'Hide',
          role: 'hide'
        },
        { role: 'hideothers' },
        { role: 'unhide' },
        { type: 'separator' },
        {
          label: 'Quit',
          role: 'quit'
        }
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
    template[1].submenu.push(
      { type: 'separator' },
      preferences
    )
    template[4].submenu.unshift(about, { type: 'separator' })
  }

  Menu.setApplicationMenu(Menu.buildFromTemplate(template))
}
