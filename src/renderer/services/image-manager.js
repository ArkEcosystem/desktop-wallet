class ImageManager {
  /**
   * All the SVG images that are used in more than 1 place
   */
  static get svg () {
    return {
      'theme.light': '<svg viewBox="0 0 30 30"><path fill-rule="evenodd" d="M28.999,16.000 L26.999,16.000 C26.447,16.000 25.999,15.552 25.999,15.000 C25.999,14.447 26.447,14.000 26.999,14.000 L28.999,14.000 C29.552,14.000 29.999,14.447 29.999,15.000 C29.999,15.552 29.552,16.000 28.999,16.000 ZM23.485,24.899 L22.777,24.192 C22.387,23.801 22.387,23.168 22.777,22.778 C23.168,22.387 23.801,22.387 24.192,22.778 L24.899,23.485 C25.290,23.875 25.290,24.508 24.899,24.899 C24.508,25.289 23.875,25.289 23.485,24.899 ZM24.192,7.221 C23.801,7.612 23.168,7.612 22.777,7.221 C22.387,6.831 22.387,6.198 22.777,5.807 L23.485,5.100 C23.875,4.709 24.508,4.709 24.899,5.100 C25.290,5.491 25.290,6.124 24.899,6.514 L24.192,7.221 ZM14.999,24.000 C10.029,24.000 5.999,19.970 5.999,15.000 C5.999,10.029 10.029,6.000 14.999,6.000 C19.970,6.000 23.999,10.029 23.999,15.000 C23.999,19.970 19.970,24.000 14.999,24.000 ZM14.999,4.000 C14.447,4.000 13.999,3.552 13.999,3.000 L13.999,1.000 C13.999,0.447 14.447,-0.000 14.999,-0.000 C15.552,-0.000 15.999,0.447 15.999,1.000 L15.999,3.000 C15.999,3.552 15.552,4.000 14.999,4.000 ZM5.807,7.221 L5.100,6.514 C4.709,6.124 4.709,5.491 5.100,5.100 C5.490,4.709 6.123,4.709 6.514,5.100 L7.221,5.807 C7.612,6.198 7.612,6.831 7.221,7.221 C6.831,7.612 6.198,7.612 5.807,7.221 ZM2.999,16.000 L0.999,16.000 C0.447,16.000 -0.001,15.552 -0.001,15.000 C-0.001,14.447 0.447,14.000 0.999,14.000 L2.999,14.000 C3.552,14.000 3.999,14.447 3.999,15.000 C3.999,15.552 3.552,16.000 2.999,16.000 ZM5.807,22.778 C6.198,22.387 6.831,22.387 7.221,22.778 C7.612,23.168 7.612,23.801 7.221,24.192 L6.514,24.899 C6.123,25.289 5.490,25.289 5.100,24.899 C4.709,24.508 4.709,23.875 5.100,23.485 L5.807,22.778 ZM14.999,26.000 C15.552,26.000 15.999,26.447 15.999,27.000 L15.999,29.000 C15.999,29.552 15.552,30.000 14.999,30.000 C14.447,30.000 13.999,29.552 13.999,29.000 L13.999,27.000 C13.999,26.447 14.447,26.000 14.999,26.000 Z"/></svg>',
      'theme.dark': '<svg viewBox="0 0 30 30"><g transform="translate(224 -82)"><path transform="translate(-218 88)" fill-rule="evenodd" d="M 11.5526 13.2476C 8.46458 12.8656 5.99758 10.4096 5.66158 7.39164C 5.35158 4.61464 6.79658 2.13864 9.04758 0.875643C 9.48558 0.630643 9.30458 -0.0233567 8.80058 0.000643327C 8.23558 0.0266433 7.65958 0.105643 7.07558 0.243643C 3.18158 1.16764 0.283576 4.48664 0.0205759 8.38664C -0.333424 13.6366 3.92658 18.0016 9.23358 18.0016C 13.2796 18.0016 16.7166 15.4636 17.9646 11.9316C 18.1306 11.4596 17.5376 11.1046 17.1696 11.4496C 15.7466 12.7816 13.7346 13.5186 11.5526 13.2476Z"/></g></svg>'
    }
  }

  constructor () {
    this.context = require.context('../assets/images', true, /\.(png|jpe?g|svg)$/)
  }

  get images () {
    return this.context.keys()
  }

  // Make an object with the categories in the key,
  // and filenames as child. Eg: { textures: [...] }
  get tree () {
    return this.images.reduce((acc, img) => {
      const path = img.replace('./', '')
      const [category, filename] = path.split('/')

      if (category && filename) {
        const previous = acc[category] || []

        acc[category] = [
          ...previous,
          `${category}/${filename}`
        ]
      }

      return acc
    }, {})
  }

  inline (...filter) {
    let result = []
    const tree = this.tree

    for (const item of filter) {
      result = result.concat(tree[item] || [])
    }

    return result
  }

  // FIXME: this (or svg get()) needs to be refactored so it properly works
  // Rights now it will check for .svg[filename], but the svgs in that
  // array have no filepath or extension, so the fallback will never succeed
  // to find the image in the actual folder
  loadImage (filename) {
    if (ImageManager.svg[filename]) {
      return ImageManager.svg[filename]
    }

    try {
      return this.context(`./${filename}`)
    } catch (error) {
      // In case the image could not be found:

      if (filename.startsWith('flags/')) {
        return this.context('./flags/default.svg')
      }

      return this.context('./default.svg')
    }
  }
}

if (process.env.NODE_ENV !== 'test') {
  // Load all SVGs to be injected into the browser
  const svgs = require.context('../assets/svg', true, /\.svg$/)
  svgs.keys().forEach(svgs)
}

export default new ImageManager()
