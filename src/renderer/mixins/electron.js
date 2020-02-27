import electron from 'electron'
import { readFileSync, writeFileSync } from 'fs'

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

    async electron_readFile (options = {}) {
      const { filePaths } = await electron.remote.dialog.showOpenDialog({
        properties: ['openFile'],
        filters: options.filters || [
          { name: 'JSON', extensions: ['json'] },
          { name: 'All Files', extensions: ['*'] }
        ]
      })

      if (!filePaths) return

      return readFileSync(filePaths[0], 'utf8')
    }
  }
}
