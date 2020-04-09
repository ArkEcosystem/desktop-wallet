import electron from 'electron'
import { readFileSync, writeFileSync } from 'fs'
import path from 'path'
import os from 'os'

const validatePath = (parentPath, filePath) => {
  const relative = path.relative(parentPath, filePath)
  return relative && !relative.startsWith('..') && !path.isAbsolute(relative)
}

const parseFilters = filters => {
  if (typeof filters === 'string') {
    filters = [filters]
  }

  if (Array.isArray(filters) && filters.length) {
    if (filters.every(filter => typeof filter === 'string')) {
      return filters.map(filter => ({
        name: filter.toUpperCase(), extensions: [filter]
      }))
    }
  }

  return filters || [
    { name: 'JSON', extensions: ['json'] },
    { name: 'All Files', extensions: ['*'] }
  ]
}

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
      const filters = parseFilters(options.filters)

      const { filePath } = await electron.remote.dialog.showSaveDialog({
        defaultPath,
        filters
      })

      if (!filePath) return

      if (options.restrictToPath && !validatePath(options.restrictToPath, filePath)) {
        throw new Error(`Path "${filePath}" not allowed`)
      }

      writeFileSync(filePath, raw, 'utf8')

      return filePath
    },

    async electron_readFile (defaultPath, options = {}) {
      const filters = parseFilters(options.filters)

      const { filePaths } = await electron.remote.dialog.showOpenDialog({
        defaultPath: defaultPath || os.homedir(),
        properties: ['openFile'],
        filters
      })

      if (!filePaths || !filePaths.length) return

      if (options.restrictToPath && !validatePath(options.restrictToPath, filePaths[0])) {
        throw new Error(`Path "${filePaths[0]}" not allowed`)
      }

      return readFileSync(filePaths[0], 'utf8')
    }
  }
}
