class ImagesManager {
  constructor () {
    this.context = require.context('../assets/images', true, /\.(png|jpg|svg)$/)
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

  inline (filter) {
    let result = []
    const tree = this.tree

    for (const item of filter) {
      result = result.concat(tree[item] || [])
    }

    return result
  }

  loadImage (filename) {
    return this.context(`./${filename}`)
  }
}

export default new ImagesManager()
