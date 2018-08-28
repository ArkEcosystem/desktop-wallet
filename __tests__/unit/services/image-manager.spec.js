import imageManager from '@/services/image-manager'

describe('ImageManager', () => {
  imageManager.loadImage = jest.fn()

  it('should contain the context property', () => {
    expect(imageManager.context).toBeDefined()
  })

  it('should return an array of images', () => {
    expect(imageManager.images).toBeInstanceOf(Array)
    expect(imageManager.images.length).toBeGreaterThan(0)
  })

  it('should return the bundled url', () => {
    const image = imageManager.images[0]
    imageManager.loadImage(image)
    expect(imageManager.loadImage).toBeCalledWith(image)
  })

  it('should return an object with subdirs as keys', () => {
    expect(imageManager.tree).toBeInstanceOf(Object)
    expect(Object.keys(imageManager.tree).length).toBeGreaterThan(1)
  })

  it('should return an array of filtered', () => {
    expect(imageManager.inline(['textures'])).toBeInstanceOf(Array)
  })
})
