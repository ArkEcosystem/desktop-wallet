import electron from 'electron'

export default {
  methods: {
    electron_openExternal (url) {
      electron.shell.openExternal(url)
    }
  }
}
