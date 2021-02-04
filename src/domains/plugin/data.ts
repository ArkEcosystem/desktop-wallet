export const comments = [
	{
		author: "Rok Cernec",
		score: "4.6",
		date: "2020-06-19T14:48:00.000Z",
		comment:
			"The way I see it, every life is a pile of good things and bad things.…hey.…the good things don't always soften the bad things; but vice-versa the bad things don't necessarily spoil the good things and make them unimportant. The way I see it, every life is a pile of good things and bad things.…hey.…the good things don't always soften the bad things; but vice-versa the bad things don't necessarily spoil the good things and make them unimportant.",
		votes: {
			up: 0,
			down: 0,
		},
	},
	{
		author: "Gerard Blezer",
		score: "4.6",
		date: "2020-06-19T14:48:00.000Z",
		comment:
			"It's a fez. I wear a fez now. Fezes are cool. All I've got to do is pass as an ordinary human being. Simple. What could possibly go wrong? I am the Doctor, and you are the Daleks! Father Christmas. Santa Claus. Or as I've always known him: Jeff.",
		votes: {
			up: 35,
			down: 7,
		},
		replies: [
			{
				date: "2020-06-19T14:48:00.000Z",
				content:
					"<a href='#'>@Gerard Blezer</a> You've swallowed a planet! Sorry, checking all the water in this area; there's an escaped fish. Aw, you're all Mr. Grumpy Face today. I'm nobody's taxi service; I'm not gonna be there to catch you every time you feel like jumping out of a spaceship.",
			},
		],
	},
	{
		author: "Rok Cernec",
		score: "4.6",
		date: "2020-06-19T14:48:00.000Z",
		comment:
			"I hate yogurt. It's just stuff with bits in. You know how I sometimes have really brilliant ideas? You know how I sometimes have really brilliant ideas? You hate me; you want to kill me! Well, go on! Kill me! KILL ME!",
		votes: {
			up: 0,
			down: 0,
		},
	},
	{
		author: "Rok Cernec",
		score: "4.6",
		date: "2020-06-19T14:48:00.000Z",
		comment:
			"Aw, you're all Mr. Grumpy Face today. I'm the Doctor. Well, they call me the Doctor. I don't know why. I call me the Doctor too. I still don't know why. Stop talking, brain thinking. Hush. Did I mention we have comfy chairs?",
		votes: {
			up: 0,
			down: 5,
		},
	},
];

export const ratings = [
	{
		rating: 5,
		votes: 156,
	},
	{
		rating: 4,
		votes: 194,
	},
	{
		rating: 3,
		votes: 25,
	},
	{
		rating: 2,
		votes: 42,
	},
	{
		rating: 1,
		votes: 7,
	},
];

export const pluginData = {
	name: "ARK Explorer",
	author: "ARK Ecosystem",
	about:
		"Use the ARK Explorer to get full visibility of critical data from the ARK network. Data such as the latest blocks, wallet addresses and transactions. Plus monitor delegate status, their position and more.",
	permissions: ["Embedded Webpages", "API Requests", "Access to Profiles"],
	screenshots: [1, 2, 3],
	category: "Utility",
	url: "github.com",
	averageRating: "4.6",
	version: "1.3.8",
	size: "4.2",
};

export const paths = {
	featured: "/?path=/story/domains-plugin-pages-plugins-category--featured",
	topRated: "/?path=/story/domains-plugin-pages-plugins-category--top-rated",
};

export const plugins = [
	{
		name: "ARK Explorer",
		author: "ARK Ecosystem",
		description: "This is a description",
		category: "Utility",
		rating: 4.6,
		version: "1.3.8",
		isOfficial: true,
		isGrant: true,
	},
	{
		name: "Animal Avatars",
		author: "Breno Polanski",
		description: "This is a description",
		category: "Utility",
		rating: 4.6,
		version: "1.3.8",
	},
	{
		name: "ChangeNOW Plugin",
		author: "ChangeNOW",
		description: "This is a description",
		category: "Other",
		rating: 4.8,
		version: "1.3.8",
	},
	{
		name: "Bold Ninja",
		author: "Delegate Fun",
		description: "This is a description",
		category: "Game",
		rating: 4.9,
		version: "2.0.0",
		isGrant: true,
	},
];
