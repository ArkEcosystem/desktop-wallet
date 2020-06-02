import { ImageManager } from "@/support/services/image-manager";

let subject: ImageManager;
beforeAll(() => (subject = new ImageManager()));

describe("ImageManager", () => {
	it("should return an array of images", () => {
		expect(subject.images()).toBeInstanceOf(Array);
		expect(subject.images().length).toBeGreaterThan(0);
	});

	it("should return the bundled url", () => {
		const spy = jest.spyOn(subject, "loadImage");

		const image = subject.images()[0];
		subject.loadImage(image);

		expect(spy).toHaveBeenCalledWith(image);
	});

	it("should return an object with subdirs as keys", () => {
		expect(subject.tree()).toBeInstanceOf(Object);
	});

	it("should return an array of filtered", () => {
		expect(subject.inline(["textures"])).toBeInstanceOf(Array);
	});
});
