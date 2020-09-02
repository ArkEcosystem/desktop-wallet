interface Provider {
	id: string;
	displayName: string;
	validate: (value: string) => boolean;
}

export const bitbucketProvider = {
	id: "bitbucket",
	displayName: "BitBucket",
	validate: (value: string) =>
		/(?:https?:)?\/\/(?:www\.)?(?:bitbucket\.org)\/([A-Za-z0-9-_.]+)(?:\/[A-z0-9_-]+)?\/?/.test(value),
};

export const facebookProvider = {
	id: "facebook",
	displayName: "Facebook",
	validate: (value: string) => /(?:https?:)?\/\/(?:www\.)?(?:facebook\.com)\/([A-Za-z0-9-_.]+)/.test(value),
};

export const flickrProvider = {
	id: "flickr",
	displayName: "Flickr",
	validate: (value: string) =>
		/(?:https?:)?\/\/(?:\w+\.)(?:staticflickr\.com)\/([A-z0-9-_]+)(?:\/[A-z0-9_-]+)(\.[A-z]{3,4})/.test(value),
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

export const imgurProvider = {
	id: "imgur",
	displayName: "Imgur",
	validate: (value: string) => /(?:https?:)?\/\/(?:i\.)?(?:imgur\.com)\/([A-z0-9]*)(\.[A-z]{3,4})/.test(value),
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

export const vimeoProvider = {
	id: "vimeo",
	displayName: "Vimeo",
	validate: (value: string) =>
		/(?:https?:)?\/\/(?:www\.)?(?:vimeo\.com|player\.vimeo\.com\/video)\/([0-9]+)/.test(value),
};

export const youtubeProvider = {
	id: "youtube",
	displayName: "YouTube",
	validate: (value: string) =>
		/(?:https?:)?\/\/(?:www\.)?(?:youtube\.com)\/(?:channel|user)\/([A-z0-9]+)\/?/.test(value),
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
		return [githubProvider, gitlabProvider, bitbucketProvider];
	}
	socialMedia(): Provider[] {
		return [facebookProvider, instagramProvider, linkedinProvider, youtubeProvider];
	}
	images(): Provider[] {
		return [flickrProvider, imgurProvider];
	}
	videos(): Provider[] {
		return [youtubeVideoProvider, vimeoProvider];
	}
	media(): Provider[] {
		return [...this.images(), ...this.videos()];
	}
}
