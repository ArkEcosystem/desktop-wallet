import electron from 'electron'
import { readFile, writeFile } from 'fs'

export default {
  methods: {
    electron_openExternal (url) {
      electron.shell.openExternal(url)
    },

    electron_reload () {
      const win = electron.remote.getCurrentWindow()
      win.reload()
    },

    electron_writeFile (raw, defaultPath, extensions = ['json']) {
      return new Promise((resolve, reject) => {
        electron.remote.dialog.showSaveDialog({
          defaultPath,
          filters: [{ extensions }]
        }, fileName => {
          if (!fileName) return

          writeFile(fileName, raw, 'utf8', err => {
            if (err) reject(err)
            resolve(fileName)
          })
        })
      })
    },

    electron_readFile (extensions = ['json']) {
      return new Promise((resolve, reject) => {
        electron.remote.dialog.showOpenDialog({
          properties: ['openFile'],
          filters: [
            { extensions },
            { name: 'All Files', extensions: ['*'] }
          ]
        }, filePaths => {
          if (!filePaths) return

          readFile(filePaths[0], 'utf8', (err, data) => {
            if (err) reject(err)
            resolve([data, filePaths[0]])
          })
        })
      })
    }
  }
}
