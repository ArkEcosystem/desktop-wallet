interface Provider {
	id: string;
	displayName: string;
	validate: (value: string) => boolean;
}

export const bitbucketProvider = {
	id: "bitbucket",
	displayName: "BitBucket",
	validate: (value: string) => false,
};

export const facebookProvider = {
	id: "facebook",
	displayName: "Facebook",
	validate: (value: string) => false,
};

export const flickrProvider = {
	id: "flickr",
	displayName: "Flickr",
	validate: (value: string) => false,
};

export const githubProvider = {
	id: "github",
	displayName: "GitHub",
	validate: (value: string) => false,
};

export const gitlabProvider = {
	id: "gitlab",
	displayName: "GitLab",
	validate: (value: string) => false,
};

export const imgurProvider = {
	id: "imgur",
	displayName: "Imgur",
	validate: (value: string) => false,
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
	validate: (value: string) => false,
};

export const youtubeProvider = {
	id: "youtube",
	displayName: "YouTube",
	validate: (value: string) => false,
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
		return [youtubeProvider, vimeoProvider];
	}
	media(): Provider[] {
		return [...this.images(), ...this.videos()];
	}
}
