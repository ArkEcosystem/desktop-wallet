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
		["instagram", "https://instagram.com/arkecosystem", true],
		["instagram", "https://instagram.com/ark.ecosystem", true],
		["instagram", "http://instagram.com/ark", true],
		["instagram", "http://instagran.com/ark", false],
		["instagram", "http://instagram.com/@ark", false],
		["instagram", "http://youtube.com/arkecosystem", false],

		["linkedin", "https://linkedin.com/in/arkecosystem", true],
		["linkedin", "https://linkedin.com/in/ark.ecosystem", true],
		["linkedin", "http://linkedin.com/in/ark", true],
		["linkedin", "http://linkedin.com/company/ark/", true],
		["linkedin", "http://linkedin.com/ark", false],
		["linkedin", "http://linkedin.org/in/@ark", false],
		["linkedin", "http://youtube.com/arkecosystem", false],
	])("should validate urls (%s, %s, %s)", (provider, url, expected) => {
		expect(entityProvider.findById(provider)?.validate(url)).toBe(expected);
	});
});
