import path from 'path'
import fs from 'fs'

export function validatePluginPath (pluginPath) {
  const structureExists = [
    'package.json',
    'src',
    'src/index.js'
  ]

  for (const pathCheck of structureExists) {
    if (!fs.existsSync(path.resolve(pluginPath, pathCheck))) {
      throw new Error(`'${pathCheck}' does not exist`)
    }
  }
}
