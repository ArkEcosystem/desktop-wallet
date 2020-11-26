import extractDomain from 'extract-domain'

export const bitbucketProvider = {
  id: 'bitbucket',
  displayName: 'BitBucket',
  domains: ['bitbucket.org'],
  validate: (value) =>
    /(?:https?:)?\/\/(?:www\.)?(?:bitbucket\.org)\/([A-Za-z0-9-_.]+)(?:\/[A-z0-9_-]+)?\/?/.test(value)
}

export const githubProvider = {
  id: 'github',
  displayName: 'GitHub',
  domains: ['github.com'],
  validate: (value) =>
    /(?:https?:)?\/\/(?:www\.)?(?:github\.com)\/([A-Za-z0-9-_.]+)(?:\/[A-z0-9_-]+)?\/?/.test(value)
}

export const gitlabProvider = {
  id: 'gitlab',
  displayName: 'GitLab',
  domains: ['gitlab.com'],
  validate: (value) =>
    /(?:https?:)?\/\/(?:www\.)?(?:gitlab\.com)\/([A-Za-z0-9-_.]+)(?:\/[A-z0-9_-]+)?\/?/.test(value)
}

export const npmProvider = {
  id: 'npm',
  displayName: 'NPM',
  domains: ['npmjs.com'],
  validate: (value) => /(?:https?:)?\/\/(?:www\.)?(?:npmjs\.com)\/package\/([A-Za-z0-9-_.@]+)/.test(value)
}

// Social media

export const discordProvider = {
  id: 'discord',
  displayName: 'Discord',
  domains: ['discord.com'],
  validate: (value) =>
    /(?:https?:)?\/\/(?:www\.)?(?:discord\.com\/invite|discord.gg(\/invite)?)\/([A-z0-9]+)/.test(value)
}

export const facebookProvider = {
  id: 'facebook',
  displayName: 'Facebook',
  domains: ['facebook.com'],
  validate: (value) => /(?:https?:)?\/\/(?:www\.)?(?:facebook\.com)\/([A-Za-z0-9-_.]+)/.test(value)
}

export const instagramProvider = {
  id: 'instagram',
  displayName: 'Instagram',
  domains: ['instagram.com'],
  validate: (value) => /(?:https?:)?\/\/(?:www\.)?(?:instagram\.com)\/([A-Za-z0-9-_.]+)/.test(value)
}

export const linkedinProvider = {
  id: 'linkedin',
  displayName: 'LinkedIn',
  domains: ['linkedin.com'],
  validate: (value) =>
    /(?:https?:)?\/\/(?:www\.)?(?:linkedin\.com)\/(?:in|company)\/([\w\-_À-ÿ%]+)\/?/.test(value)
}

export const mediumProvider = {
  id: 'medium',
  displayName: 'Medium',
  domains: ['medium.com'],
  validate: (value) => /(?:https?:)?\/\/(?:www\.)?(?:medium\.com)\/([A-Za-z0-9-_.@]+)/.test(value)
}

export const redditProvider = {
  id: 'reddit',
  displayName: 'Reddit',
  domains: ['reddit.com'],
  validate: (value) =>
    /(?:https?:)?\/\/(?:www\.)?(?:reddit\.com)\/(?:u(?:ser)?|r)\/([A-z0-9-_]+)\/?/.test(value)
}

export const slackProvider = {
  id: 'slack',
  displayName: 'Slack',
  domains: ['slack.com'],
  validate: (value) => /(?:https?:)?\/\/(?:[a-z]+)\.(?:slack\.com)/.test(value)
}

export const telegramProvider = {
  id: 'telegram',
  displayName: 'Telegram',
  domains: ['telegram.org', 't.me', 'telegram.me'],
  validate: (value) => /(?:https?:)?\/\/(?:t(?:elegram)?\.me|telegram\.org)\/([a-z0-9_]{5,32})/.test(value)
}

export const twitterProvider = {
  id: 'twitter',
  displayName: 'Twitter',
  domains: ['twitter.com'],
  validate: (value) => /(?:https?:)?\/\/(?:www\.)?(?:twitter\.com)\/@?([A-z0-9_]+)/.test(value)
}

export const wechatProvider = {
  id: 'wechat',
  displayName: 'WeChat',
  domains: ['wechat.com'],
  validate: () => false
}

export const youtubeProvider = {
  id: 'youtube',
  displayName: 'YouTube',
  domains: ['youtube.com'],
  validate: (value) =>
    /(?:https?:)?\/\/(?:www\.)?(?:youtube\.com)\/(?:channel|user)\/([A-z0-9]+)\/?/.test(value)
}

// Photos

export const imgurProvider = {
  id: 'imgur',
  displayName: 'Imgur',
  domains: ['imgur.com'],
  validate: (value) => /(?:https?:)?\/\/(?:i\.)?(?:imgur\.com)\/([A-z0-9]*)(\.[A-z]{3,4})/.test(value)
}

export const githubImageProvider = {
  id: 'github-image',
  displayName: 'GitHub',
  domains: ['githubusercontent.com'],
  validate: (value) =>
    /(?:https?:)?\/(?:raw\.githubusercontent\.com)\/([A-Za-z0-9-_.]+)(?:\/[A-z0-9_-].*)(\.(jpe?g|png|gif))$/.test(
      value
    )
}

export const gitlabImageProvider = {
  id: 'gitlab-image',
  displayName: 'GitLab',
  domains: ['gitlab.com'],
  validate: (value) =>
    /(?:https?:)?\/(?:gitlab\.com)\/([A-Za-z0-9-_.].*)(?:\/-\/raw)(?:\/[A-z0-9_-].*)(\.(jpe?g|png|gif))$/.test(
      value
    )
}

export const flickrProvider = {
  id: 'flickr',
  displayName: 'Flickr',
  domains: ['staticflickr.com'],
  validate: (value) =>
    /(?:https?:)?\/\/(?:\w+\.)(?:staticflickr\.com)\/([A-z0-9-_]+)(?:\/[A-z0-9_-]+)(\.[A-z]{3,4})/.test(value)
}

// Videos

export const vimeoProvider = {
  id: 'vimeo',
  displayName: 'Vimeo',
  domains: ['vimeo.com', 'player.vimeo.com'],
  validate: (value) =>
    /(?:https?:)?\/\/(?:www\.)?(?:vimeo\.com|player\.vimeo\.com\/video)\/([0-9]+)/.test(value)
}

export const youtubeVideoProvider = {
  id: 'youtube-video',
  displayName: 'YouTube',
  domains: ['youtube.com', 'youtu.be'],
  validate: (value) =>
    /(?:https?:)?\/\/(?:(?:www\.)?(?:youtube\.com)\/(?:watch\?v=|embed\/)|youtu\.be\/)([A-z0-9-_]+)\/?/.test(value)
}

export class EntityProvider {
  all () {
    return [...this.sourceControl(), ...this.socialMedia(), ...this.videos(), ...this.images()]
  }

  findByDomain (url) {
    const domain = extractDomain(url)
    return this.all().find((provider) => provider.domains.includes(domain))
  }

  findById (id) {
    return this.all().find((provider) => provider.id === id)
  }

  sourceControl () {
    return [bitbucketProvider, githubProvider, gitlabProvider, npmProvider]
  }

  socialMedia () {
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
      youtubeProvider
    ]
  }

  images () {
    return [imgurProvider, githubImageProvider, gitlabImageProvider, flickrProvider]
  }

  videos () {
    return [youtubeVideoProvider, vimeoProvider]
  }

  media () {
    return [...this.images(), ...this.videos()]
  }
}

export default EntityProvider
