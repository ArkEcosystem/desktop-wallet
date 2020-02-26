import electron from 'electron'
import { readFile, writeFileSync } from 'fs'

export default {
  methods: {
    electron_openExternal (url) {
      electron.shell.openExternal(url)
    },

    electron_reload () {
      const win = electron.remote.getCurrentWindow()
      win.reload()
    },

    async electron_writeFile (raw, defaultPath, options = {}) {
      const { filePath } = await electron.remote.dialog.showSaveDialog({
        defaultPath,
        filters: options.filters || [
          { name: 'JSON', extensions: ['json'] },
          { name: 'All Files', extensions: ['*'] }
        ]
      })

      if (!filePath) return

      writeFileSync(filePath, raw, 'utf8')

      return filePath
    },

    electron_readFile (options = {}) {
      const filters = options.filters || [
        { name: 'JSON', extensions: ['json'] },
        { name: 'All Files', extensions: ['*'] }
      ]

      return new Promise((resolve, reject) => {
        electron.remote.dialog.showOpenDialog({
          properties: ['openFile'],
          filters
        }, filePaths => {
          if (!filePaths) return

          readFile(filePaths[0], 'utf8', (err, data) => {
            if (err) reject(err)
            resolve(data)
          })
        })
      })
    }
  }
}
