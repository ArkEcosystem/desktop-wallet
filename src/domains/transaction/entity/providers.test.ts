import { EntityProvider } from "./providers";

describe("EntityProvider", () => {
	let subject: EntityProvider;

	beforeEach(() => {
		subject = new EntityProvider();
	});

	it("#all", () => {
		expect(subject.all().length).toBeGreaterThan(1);
	});

	it("#findByDomain", () => {
		expect(subject.findByDomain("https://arkecosystem.slack.com")?.displayName).toEqual("Slack");
		expect(subject.findByDomain("https://instagram.com")?.displayName).toEqual("Instagram");
		expect(
			subject.findByDomain("https://raw.githubusercontent.com/ArkEcosystem/peers/master/logo.png")?.displayName,
		).toEqual("GitHub");
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

		["github", "https://github.com/arkecosystem/core", true],
		["github", "https://github.com/arkecosystem", true],
		["github", "https://github.com/ark.ecosystem", true],
		["github", "https://github.com", false],
		["github", "https://github.com/@ark.ecosystem", false],

		["gitlab", "https://gitlab.com/arkecosystem/core", true],
		["gitlab", "https://gitlab.com/arkecosystem", true],
		["gitlab", "https://gitlab.com/ark.ecosystem", true],
		["gitlab", "https://gitlab.com", false],
		["gitlab", "https://gitlab.com/@ark.ecosystem", false],

		["npm", "https://npmjs.com/package/arkecosystem/core", true],
		["npm", "https://npmjs.com/package/@arkecosystem/platform-sdk", true],
		["npm", "https://npmjs.com/package/arkecosystem", true],
		["npm", "https://npmjs.com/ark.ecosystem", false],
		["npm", "https://npmjs.com", false],
		["npm", "https://npmjs.com/@ark.ecosystem", false],

		["discord", "https://discord.com/invite/VNRfxwQ", true],
		["discord", "https://discord.gg/invite/VNRfxwQ", true],
		["discord", "https://discord.gg/ps1h6QT", true],
		["discord", "https://discord.com/ps1h6QT", false],
		["discord", "https://discord.com", false],

		["facebook", "https://facebook.com/arkecosystem", true],
		["facebook", "https://facebook.com/ark.ecosystem", true],
		["facebook", "http://facebook.com/ark", true],
		["facebook", "http://facebook.in/ark", false],
		["facebook", "http://facebook.com/@ark", false],

		["instagram", "https://instagram.com/arkecosystem", true],
		["instagram", "https://instagram.com/ark.ecosystem", true],
		["instagram", "http://instagram.com/ark", true],
		["instagram", "http://instagran.com/ark", false],
		["instagram", "http://instagram.com/@ark", false],

		["linkedin", "https://linkedin.com/in/arkecosystem", true],
		["linkedin", "https://linkedin.com/in/ark.ecosystem", true],
		["linkedin", "http://linkedin.com/in/ark", true],
		["linkedin", "http://linkedin.com/company/ark/", true],
		["linkedin", "http://linkedin.com/ark", false],
		["linkedin", "http://linkedin.org/in/@ark", false],

		["medium", "https://medium.com/@arkecosystem", true],
		["medium", "https://medium.com", false],

		["reddit", "https://reddit.com/r/arkecosystem", true],
		["reddit", "https://reddit.com/r/ArkEcosystem/", true],
		["reddit", "https://reddit.com/user/ark1", true],
		["reddit", "https://reddit.com/u/", false],
		["reddit", "https://reddit.com/r/", false],
		["reddit", "https://reddit.com", false],

		["slack", "https://arkecosystem.slack.com", true],
		["slack", "https://slack.com", false],

		["telegram", "https://t.me/arkannouncements", true],
		["telegram", "https://telegram.me/arkannouncements", true],
		["telegram", "https://telegram.org/ark123", true],
		["telegram", "https://t.org/ark123", false],
		["telegram", "https://telegram.org", false],
		["telegram", "https://t.me", false],

		["twitter", "https://twitter.com/arkecosystem", true],
		["twitter", "https://twitter.com/@arkecosystem", true],
		["twitter", "https://twitter.com/@ark_ecosystem", true],
		["twitter", "https://twitter.com", false],

		["wechat", "https://www.wechat.com", false],

		["youtube", "https://www.youtube.com/channel/UCpc2k6zOOutGT9y56urDClg", true],
		["youtube", "https://youtube.com/channel/UCpc2k6zOOutGT9y56urDClg", true],
		["youtube", "http://youtube.com/channel/UCpc2k6zOOutGT9y56urDClg", true],
		["youtube", "https://www.youtube.com/user/UCpc2k6zOOutGT9y56urDClg", true],
		["youtube", "https://www.youtube.com", false],
		["youtube", "http://youtube.com/channel", false],

		["imgur", "https://i.imgur.com/123456.png", true],
		["imgur", "https://i.imgur.com/123456.jpeg", true],
		["imgur", "https://imgur.com/gallery/abc123", false],

		["github-image", "https://raw.githubusercontent.com/ArkEcosystem/peers/master/logo.png", true],
		["github-image", "https://raw.githubusercontent.com/ArkEcosystem/peers/master/image-1.jpeg", true],
		["github-image", "https://raw.githubusercontent.com/ArkEcosystem/peers/master/image-2.jpg", true],
		["github-image", "https://raw.githubusercontent.com/ArkEcosystem/peers/master/image-3", false],
		["github-image", "https://raw.githubusercontent.com/ArkEcosystem/peers/master/src/index.php", false],
		["github-image", "https://raw.githubusercontent.com/image.png", false],
		["github-image", "https://raw.githubusercontent.com/", false],
		["github-image", "https://github.com/arkecosystem", false],

		["gitlab-image", "https://gitlab.com/pages/arkecosystem/-/raw/master/static/logo.png", true],
		["gitlab-image", "https://gitlab.com/pages/arkecosystem/-/raw/master/static/image-1.jpeg", true],
		["gitlab-image", "https://gitlab.com/pages/arkecosystem/-/raw/master/static/index.php", false],
		["gitlab-image", "https://gitlab.com/pages/arkecosystem/master/static/image-2.jpeg", false],
		["gitlab-image", "https://gitlab.com", false],

		["flickr", "https://live.staticflickr.com/12345/50287053112_b0f1d60cd2_1k.jpg", true],
		["flickr", "https://farm1.staticflickr.com/0/1418878_1e92283336_m.jpg", true],
		["flickr", "https://www.flickr.com/photos/1@N06/50287053112/in/explore-2020-08-31/", false],
		["flickr", "https://farm1.staticflickr.com", false],

		["vimeo", "https://vimeo.com/123456", true],
		["vimeo", "http://vimeo.com/54321", true],
		["vimeo", "http://www.vimeo.com/54321", true],
		["vimeo", "https://player.vimeo.com/video/45054101", true],
		["vimeo", "http://www.vimeo.com", false],
		["vimeo", "https://player.vimeo.com", false],

		["youtube-video", "https://youtube.com/watch?v=123456", true],
		["youtube-video", "https://www.youtube.com/watch?v=at5215", true],
		["youtube-video", "https://youtu.be/dQ12W3r5", true],
		["youtube-video", "https://youtu.be/w_1x521ui", true],
		["youtube-video", "https://youtu.be", false],
		["youtube-video", "https://youtube.com/watch", false],
	])("should validate urls (%s, %s, %s)", (provider, url, expected) => {
		expect(entityProvider.findById(provider)?.validate(url)).toBe(expected);
	});
});
