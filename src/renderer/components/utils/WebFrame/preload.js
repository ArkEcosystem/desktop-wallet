const { ipcRenderer } = require('electron')

window.triggerPluginEvent = function (event, data) {
  ipcRenderer.sendToHost(event, data)
}
