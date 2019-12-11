import path from 'path'
import { PLUGINS } from '../../config'
import { download } from 'electron-dl'
import decompress from 'decompress'
import trash from 'trash'
import { ensureDirSync } from 'fs-extra'

const logger = require('electron-log')

export const setupPluginManager = ({ sendToWindow, mainWindow, ipcMain }) => {
  let downloadItem
  let savePath

  const pluginsPath = `${process.env.NODE_ENV !== 'development' ? PLUGINS.path : PLUGINS.devPath}`
  const cachePath = path.join(pluginsPath, '.cache')

  ensureDirSync(cachePath)

  const prefix = 'plugin-manager:'

  ipcMain.on(prefix + 'download', async (_, { url }) => {
    downloadItem = undefined

    const options = {
      directory: cachePath,
      onStarted: item => {
        logger.log(`${prefix} Download started`)
        downloadItem = item
        savePath = item.getSavePath()
      },
      onProgress: progress => sendToWindow(prefix + 'download-progress', progress)
    }

    try {
      await download(mainWindow, url, options)
      logger.log(`${prefix} Download complete`)
      sendToWindow(prefix + 'plugin-downloaded', savePath)
    } catch (error) {
      sendToWindow(prefix + 'error', error)
    }
  })

  ipcMain.on(prefix + 'install', async (_, { pluginId, pluginPath }) => {
    try {
      if (pluginPath) {
        await trash(pluginPath)
      }

      pluginPath = path.join(pluginsPath, pluginId)
      await decompress(savePath, pluginPath, {
        map: file => {
          file.path = path.join(...file.path.split(path.sep).slice(1))
          return file
        }
      })

      await trash(savePath)

      sendToWindow(prefix + 'plugin-installed', pluginPath)
    } catch (error) {
      sendToWindow(prefix + 'error', error)
    }
  })

  ipcMain.on(prefix + 'cancel', async () => {
    const wait = async () => {
      if (downloadItem) {
        try {
          const state = downloadItem.getState()

          if (state === 'progressing') {
            downloadItem.cancel()
          }
        } catch (error) {
          await trash(savePath)
        } finally {
          logger.log(`${prefix} Download cancelled`)
        }
      } else {
        logger.log(`${prefix} Trying to cancel download...`)
        setTimeout(wait, 100)
      }
    }

    await wait()
  })

  ipcMain.on(prefix + 'cleanup', async () => {
    await trash(savePath)
  })
}
