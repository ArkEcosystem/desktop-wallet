import { EntityProvider } from "./providers";

describe("EntityProvider", () => {
	let subject: EntityProvider;

	beforeEach(() => {
		subject = new EntityProvider();
	});

	it("#all", () => {
		expect(subject.all().length).toBeGreaterThan(1);
	});

	it("#findById", () => {
		expect(subject.findById("instagram")?.displayName).toEqual("Instagram");
	});

	it("#sourceControl", () => {
		expect(subject.sourceControl().length).toBeGreaterThan(1);
	});

	it("#socialMedia", () => {
		expect(subject.socialMedia().length).toBeGreaterThan(1);
	});

	it("#videos", () => {
		expect(subject.videos().length).toBeGreaterThan(1);
	});

	it("#images", () => {
		expect(subject.images().length).toBeGreaterThan(1);
	});

	it("#media", () => {
		expect(subject.media().length).toBeGreaterThan(1);
	});
});

describe("Validate URLs", () => {
	const entityProvider = new EntityProvider();

	it.each([
		["bitbucket", "https://bitbucket.org/arkecosystem/workspace/projects/core", true],
		["bitbucket", "https://bitbucket.org/arkecosystem", true],
		["bitbucket", "https://bitbucket.org/ark.ecosystem", true],
		["bitbucket", "https://bitbucket.org", false],
		["bitbucket", "https://bitbucket.com/@ark.ecosystem", false],
		["bitbucket", "https://ark.io", false],

		["facebook", "https://facebook.com/arkecosystem", true],
		["facebook", "https://facebook.com/ark.ecosystem", true],
		["facebook", "http://facebook.com/ark", true],
		["facebook", "http://facebook.in/ark", false],
		["facebook", "http://facebook.com/@ark", false],
		["facebook", "https://ark.io", false],

		["github", "https://github.com/arkecosystem/core", true],
		["github", "https://github.com/arkecosystem", true],
		["github", "https://github.com/ark.ecosystem", true],
		["github", "https://github.com", false],
		["github", "https://github.com/@ark.ecosystem", false],
		["github", "https://ark.io", false],

		["gitlab", "https://gitlab.com/arkecosystem/core", true],
		["gitlab", "https://gitlab.com/arkecosystem", true],
		["gitlab", "https://gitlab.com/ark.ecosystem", true],
		["gitlab", "https://gitlab.com", false],
		["gitlab", "https://gitlab.com/@ark.ecosystem", false],
		["gitlab", "https://ark.io", false],

		["instagram", "https://instagram.com/arkecosystem", true],
		["instagram", "https://instagram.com/ark.ecosystem", true],
		["instagram", "http://instagram.com/ark", true],
		["instagram", "http://instagran.com/ark", false],
		["instagram", "http://instagram.com/@ark", false],
		["instagram", "https://ark.io", false],

		["linkedin", "https://linkedin.com/in/arkecosystem", true],
		["linkedin", "https://linkedin.com/in/ark.ecosystem", true],
		["linkedin", "http://linkedin.com/in/ark", true],
		["linkedin", "http://linkedin.com/company/ark/", true],
		["linkedin", "http://linkedin.com/ark", false],
		["linkedin", "http://linkedin.org/in/@ark", false],
		["linkedin", "http://ark.io", false],

		["imgur", "https://i.imgur.com/123456.png", true],
		["imgur", "https://i.imgur.com/123456.jpeg", true],
		["imgur", "https://imgur.com/gallery/abc123", false],
		["imgur", "https://ark.io", false],

		["flickr", "https://live.staticflickr.com/12345/50287053112_b0f1d60cd2_1k.jpg", true],
		["flickr", "https://farm1.staticflickr.com/0/1418878_1e92283336_m.jpg", true],
		["imgur", "https://www.flickr.com/photos/1@N06/50287053112/in/explore-2020-08-31/", false],
		["imgur", "https://ark.io", false],
	])("should validate urls (%s, %s, %s)", (provider, url, expected) => {
		expect(entityProvider.findById(provider)?.validate(url)).toBe(expected);
	});
});
