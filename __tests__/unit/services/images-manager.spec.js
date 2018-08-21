import imagesManager from '@/services/images-manager'

describe('ImagesManager', () => {
  imagesManager.loadImage = jest.fn()

  it('should contain the context property', () => {
    expect(imagesManager.context).toBeDefined()
  })

  it('should return an array of images', () => {
    expect(imagesManager.images).toBeInstanceOf(Array)
    expect(imagesManager.images.length).toBeGreaterThan(0)
  })

  it('should return the bundled url', () => {
    const image = imagesManager.images[0]
    imagesManager.loadImage(image)
    expect(imagesManager.loadImage).toBeCalledWith(image)
  })

  it('should return an object with subdirs as keys', () => {
    expect(imagesManager.tree).toBeInstanceOf(Object)
    expect(Object.keys(imagesManager.tree).length).toBeGreaterThan(1)
  })

  it('should return an array of filtered', () => {
    expect(imagesManager.inline(['textures'])).toBeInstanceOf(Array)
  })
})
