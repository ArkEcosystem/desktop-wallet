interface Provider {
	id: string;
	displayName: string;
	validate: (value: string) => boolean;
}

// Source control

export const bitbucketProvider = {
	id: "bitbucket",
	displayName: "BitBucket",
	validate: (value: string) =>
		/(?:https?:)?\/\/(?:www\.)?(?:bitbucket\.org)\/([A-Za-z0-9-_.]+)(?:\/[A-z0-9_-]+)?\/?/.test(value),
};

export const githubProvider = {
	id: "github",
	displayName: "GitHub",
	validate: (value: string) =>
		/(?:https?:)?\/\/(?:www\.)?(?:github\.com)\/([A-Za-z0-9-_.]+)(?:\/[A-z0-9_-]+)?\/?/.test(value),
};

export const gitlabProvider = {
	id: "gitlab",
	displayName: "GitLab",
	validate: (value: string) =>
		/(?:https?:)?\/\/(?:www\.)?(?:gitlab\.com)\/([A-Za-z0-9-_.]+)(?:\/[A-z0-9_-]+)?\/?/.test(value),
};

export const npmProvider = {
	id: "npm",
	displayName: "NPM",
	validate: () => false,
};

// Social media

export const discordProvider = {
	id: "discord",
	displayName: "Discord",
	validate: () => false,
};

export const facebookProvider = {
	id: "facebook",
	displayName: "Facebook",
	validate: (value: string) => /(?:https?:)?\/\/(?:www\.)?(?:facebook\.com)\/([A-Za-z0-9-_.]+)/.test(value),
};

export const instagramProvider = {
	id: "instagram",
	displayName: "Instagram",
	validate: (value: string) => /(?:https?:)?\/\/(?:www\.)?(?:instagram\.com)\/([A-Za-z0-9-_.]+)/.test(value),
};

export const linkedinProvider = {
	id: "linkedin",
	displayName: "LinkedIn",
	validate: (value: string) =>
		/(?:https?:)?\/\/(?:www\.)?(?:linkedin\.com)\/(?:in|company)\/([\w\-_À-ÿ%]+)\/?/.test(value),
};

export const mediumProvider = {
	id: "medium",
	displayName: "Medium",
	validate: () => false,
};

export const redditProvider = {
	id: "reddit",
	displayName: "Reddit",
	validate: () => false,
};

export const slackProvider = {
	id: "slack",
	displayName: "Slack",
	validate: () => false,
};

export const telegramProvider = {
	id: "telegram",
	displayName: "Telegram",
	validate: () => false,
};

export const twitterProvider = {
	id: "twitter",
	displayName: "Twitter",
	validate: () => false,
};

export const wechatProvider = {
	id: "wechat",
	displayName: "WeChat",
	validate: () => false,
};

export const youtubeProvider = {
	id: "youtube",
	displayName: "YouTube",
	validate: (value: string) =>
		/(?:https?:)?\/\/(?:www\.)?(?:youtube\.com)\/(?:channel|user)\/([A-z0-9]+)\/?/.test(value),
};

// Photos

export const imgurProvider = {
	id: "imgur",
	displayName: "Imgur",
	validate: (value: string) => /(?:https?:)?\/\/(?:i\.)?(?:imgur\.com)\/([A-z0-9]*)(\.[A-z]{3,4})/.test(value),
};

export const githubImageProvider = {
	id: "github-image",
	displayName: "GitHub",
	validate: () => false,
};

export const gitlabImageProvider = {
	id: "gitlab-image",
	displayName: "GitLab",
	validate: () => false,
};

export const flickrProvider = {
	id: "flickr",
	displayName: "Flickr",
	validate: (value: string) =>
		/(?:https?:)?\/\/(?:\w+\.)(?:staticflickr\.com)\/([A-z0-9-_]+)(?:\/[A-z0-9_-]+)(\.[A-z]{3,4})/.test(value),
};

// Videos

export const vimeoProvider = {
	id: "vimeo",
	displayName: "Vimeo",
	validate: (value: string) =>
		/(?:https?:)?\/\/(?:www\.)?(?:vimeo\.com|player\.vimeo\.com\/video)\/([0-9]+)/.test(value),
};

export const youtubeVideoProvider = {
	id: "youtube-video",
	displayName: "YouTube",
	validate: (value: string) =>
		/(?:https?:)?\/\/(?:(?:www\.)?(?:youtube\.com)\/(?:watch\?v=|embed\/)|youtu\.be\/)([A-z0-9-_]+)\/?/.test(value),
};

export class EntityProvider {
	all(): Provider[] {
		return [...this.sourceControl(), ...this.socialMedia(), ...this.videos(), ...this.images()];
	}
	findById(id: string): Provider | undefined {
		return this.all().find((provider) => provider.id === id);
	}
	sourceControl(): Provider[] {
		return [bitbucketProvider, githubProvider, gitlabProvider, npmProvider];
	}
	socialMedia(): Provider[] {
		return [
			discordProvider,
			facebookProvider,
			instagramProvider,
			linkedinProvider,
			mediumProvider,
			redditProvider,
			slackProvider,
			telegramProvider,
			twitterProvider,
			wechatProvider,
			youtubeProvider,
		];
	}
	images(): Provider[] {
		return [imgurProvider, gitlabImageProvider, gitlabImageProvider, flickrProvider];
	}
	videos(): Provider[] {
		return [youtubeVideoProvider, vimeoProvider];
	}
	media(): Provider[] {
		return [...this.images(), ...this.videos()];
	}
}
