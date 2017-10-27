const path = require('path')
const fs = require('fs')

const productName = require('../../package').productName

module.exports = {

  getTestPath: function () {
    return path.join(__dirname, 'data', 'userData')
  },

  clearSettings: function () {
    try {
      fs.unlinkSync(path.join(this.getTestPath(), 'Settings'))
    } catch (error) {
      if (error.code !== 'ENOENT') {
        throw error
      }
    }
  },

  getRealPath: function () {
    let userDataPath

    switch (process.platform) {
      case 'darwin':
        userDataPath = path.join(process.env.HOME, 'Library', 'Application Support', productName)
        break
      case 'win32':
        userDataPath = path.join(process.env.APPDATA, productName)
        break
      case 'freebsd':
      case 'linux':
      case 'sunos':
        userDataPath = path.join(process.env.HOME, '.config', productName)
        break
      default:
        throw new Error(`Unknown userDataPath path for platform ${process.platform}`)
    }

    return userDataPath
  }
}
