import { PLUGINS } from '../../config'
import { download } from 'electron-dl'
import decompress from 'decompress'
import trash from 'trash'
import { ensureDirSync } from 'fs-extra'

export const setupPluginManager = ({ sendToWindow, mainWindow, ipcMain }) => {
  let downloadItem
  let savePath

  const pluginsPath = `${process.env.NODE_ENV !== 'development' ? PLUGINS.path : PLUGINS.devPath}`
  const cachePath = `${pluginsPath}/.cache`

  ensureDirSync(cachePath)

  const prefix = 'plugin-manager:'

  ipcMain.on(prefix + 'download', async (_, { url }) => {
    const options = {
      directory: cachePath,
      onStarted: item => {
        downloadItem = item
        savePath = item.getSavePath()
        sendToWindow(prefix + 'download-started', item)
      },
      onProgress: progress => {
        sendToWindow(prefix + 'download-progress', progress)
      }
    }

    try {
      await download(mainWindow, url, options)
      sendToWindow(prefix + 'download-complete', savePath)
    } catch (error) {
      sendToWindow(prefix + 'error', error)
    }
  })

  ipcMain.on(prefix + 'install', async (_, pluginId) => {
    const dest = [pluginsPath, pluginId].join('/')

    try {
      await decompress(savePath, dest, {
        map: file => {
          file.path = file.path.split('/').slice(1).join('/')
          return file
        }
      })

      await trash(savePath)

      sendToWindow(prefix + 'install-complete', dest)
    } catch (error) {
      sendToWindow(prefix + 'error', error)
    }
  })

  ipcMain.on(prefix + 'cancel', () => {
    downloadItem.cancel()
  })

  ipcMain.on(prefix + 'cleanup', async () => {
    await trash(savePath)
  })
}
