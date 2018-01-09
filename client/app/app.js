'use strict'

const appearanceConfig = require(require('path').resolve(__dirname, './config/appearance'))
const modules = [
  'ngMaterial',
  'md.data.table',
  'gettext',
  'monospaced.qrcode',
  'infinite-scroll',
  'arkclient.filters',
  'arkclient.services',
  'arkclient.components',
  'arkclient.directives',
  'arkclient.accounts',
  'arkclient.constants'
]

const app = angular.module('arkclient', modules)

app.config(($mdIconProvider) => {
  $mdIconProvider
    .icon('menu', './assets/svg/menu.svg', 24)
    .icon('ledger', './assets/svg/ledger.svg', 24)
    .icon('qrcode', './assets/svg/qrcode.svg', 24)
    .icon('bitcoin_toggle', './assets/svg/bitcoin_toggle.svg', 24)
})

app.config(($provide, $mdThemingProvider) => {
  const themes = appearanceConfig.themes
  const themeNames = Object.keys(themes)

  themeNames.forEach((key) => {
    const theme = $mdThemingProvider.theme(key)
      .primaryPalette(themes[key].primary)
      .accentPalette(themes[key].accent)
      .warnPalette(themes[key].warn)

    if (themes[key].background) theme.backgroundPalette(themes[key].background)
  })

  $mdThemingProvider.alwaysWatchTheme(true)

  $provide.value('$mdThemingProvider', $mdThemingProvider)
})

app.config(['$qProvider', function ($qProvider) {
  $qProvider.errorOnUnhandledRejections(false)
}])

const electron = require('electron')
const remote = electron.remote
const Menu = remote.Menu

const InputMenu = Menu.buildFromTemplate([
  {
    label: 'Undo',
    role: 'undo'
  }, {
    label: 'Redo',
    role: 'redo'
  }, {
    type: 'separator'
  }, {
    label: 'Cut',
    role: 'cut'
  }, {
    label: 'Copy',
    role: 'copy'
  }, {
    label: 'Paste',
    role: 'paste'
  }, {
    type: 'separator'
  }, {
    label: 'Select all',
    role: 'selectall'
  }
])

document.body.addEventListener('contextmenu', (e) => {
  e.preventDefault()
  e.stopPropagation()

  let node = e.target

  while (node) {
    if (node.nodeName.match(/^(input|textarea)$/i) || node.isContentEditable) {
      InputMenu.popup(remote.getCurrentWindow())
      break
    }
    node = node.parentNode
  }
})
