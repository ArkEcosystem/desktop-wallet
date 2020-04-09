/**
 * This file is used specifically and only for development. It installs
 * `electron-debug` & `vue-devtools`. There shouldn't be any need to
 *  modify this file, but it can be used to extend your development
 *  environment.
 */

/* eslint-disable */

// Install `electron-debug` with `devtron`
require('electron-debug')({ showDevTools: true })

// It is necessary to require `electron-log` here to use it on the renderer process
require('electron-log')

// Install `vue-devtools`
require('electron').app.whenReady().then(() => {
  const { default: installExtension, VUEJS_DEVTOOLS } = require('electron-devtools-installer')
  installExtension(VUEJS_DEVTOOLS)
    .then(() => {})
    .catch(err => {
      console.log('Unable to install `vue-devtools`: \n', err)
    })
})

// Require `main` process to boot app
require('./index')
