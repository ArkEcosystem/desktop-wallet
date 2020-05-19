import imageManager from '@/services/image-manager';
describe('ImageManager', function () {
    imageManager.loadImage = jest.fn();
    it('should contain the context property', function () {
        expect(imageManager.context).toBeDefined();
    });
    it('should return an array of images', function () {
        expect(imageManager.images).toBeInstanceOf(Array);
        expect(imageManager.images.length).toBeGreaterThan(0);
    });
    it('should return the bundled url', function () {
        var image = imageManager.images[0];
        imageManager.loadImage(image);
        expect(imageManager.loadImage).toBeCalledWith(image);
    });
    it('should return an object with subdirs as keys', function () {
        expect(imageManager.tree).toBeInstanceOf(Object);
        expect(Object.keys(imageManager.tree).length).toBeGreaterThan(1);
    });
    it('should return an array of filtered', function () {
        expect(imageManager.inline(['textures'])).toBeInstanceOf(Array);
    });
});
//# sourceMappingURL=image-manager.spec.js.map