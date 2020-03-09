import { PLUGINS } from '@config'
import electron from '@/mixins/electron'
import { ensureDirSync } from 'fs-extra'
import path from 'path'

export function create (walletApi) {
  return () => {
    walletApi.dialogs = {
      save: async (raw, filename, filters) => {
        ensureDirSync(PLUGINS.sharePath)

        return electron.methods.electron_writeFile(raw, path.resolve(PLUGINS.sharePath, filename), {
          restrictToPath: PLUGINS.sharePath,
          filters
        })
      },

      open: async (filters) => {
        return electron.methods.electron_readFile(PLUGINS.sharePath, { filters })
      }
    }
  }
}
