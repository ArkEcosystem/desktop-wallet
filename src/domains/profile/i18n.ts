export const translations: { [key: string]: any } = {
	SIGN_IN: "Sign In via MarketSquare",
	CREATE_PROFILE: "Create Profile",
	MODAL_PROFILE_CREATED: {
		TITLE: "Profile Created!",
		DESCRIPTION_1: "If you are new to the ARK Desktop Wallet, view our tutorial to get started.",
		DESCRIPTION_2: "If not, you can skip the tutorial to go directly to your portfolio.",
		START_TUTORIAL: "Start Tutorial",
		SKIP_TUTORIAL: "Skip Tutorial",
	},
	MODAL_DELETE_PROFILE: {
		TITLE: "Delete Profile",
		DESCRIPTION: "Do you really want to delete this profile? Once deleted, you will not be able to restore it.",
	},
	MODAL_RESET_PROFILE: {
		TITLE: "Reset Profile Data",
		DESCRIPTION: "Do you really want to reset this profile? Once reset, you will not be able to restore it.",
		SUCCESS: "Your profile was reset successfully",
	},
	MODAL_REPOSITORIES: {
		TITLE: "Repository",
		BitBucket: "Bitbucket",
		GitHub: "GitHub",
		GitLab: "GitLab",
		Npm: "NPM",
	},
	MODAL_HISTORY: {
		TITLE: "History",
		TYPES: {
			REGISTRATION: "Registration",
			RESIGN: "Resign",
			UPDATE: "Update",
		},
	},
	MODAL_SELECT_SENDER: {
		TITLE: "Select Sender",
		DESCRIPTION: "Find and select the sender from your wallets",
	},
	MODAL_SIGN_IN: {
		TITLE: "Sign In",
		DESCRIPTION: "Sign in to access your profile.",
		MAX_ATTEMPTS_ERROR:
			"Maximum sign in attempts reached - please wait {{remainingTime}} seconds before trying again.",
	},
	PAGE_CREATE_PROFILE: {
		TITLE: "Create Profile",
		DESCRIPTION: "Sign in via MarketSquare or create a new Profile below.",
		VALIDATION: {
			MAXLENGTH_ERROR: "The Name should have less than {{maxLength}} characters",
		},
	},
	PAGE_MY_REGISTRATIONS: {
		TITLE: "My Registrations",
		SUBTITLE: "You can register a Delegate, Business and Bridgechain.",
		NO_REGISTRATIONS_MESSAGE: "Register Business, Bridgechain and Delegate in the most convenient way.",
		ADDRESS: "Address",
		BLOCKCHAIN: "Blockchain",
		BLOCKCHAIN_NAME: "Blockchain Name",
		BUSINESS: "Business",
		BUSINESS_NAME: "Business Name",
		PLUGINS: "Plugins",
		PLUGIN_NAME: "Plugin Name",
		DELEGATE: "Delegate",
		DELEGATE_NAME: "Delegate Name",
		FORGED_AMOUNT: "Forged Amount",
		HISTORY: "History",
		MSQ: "MSQ",
		RANK: "Rank",
		REPOSITORY: "Repository",
		SEED: "Seed",
		STATUS: "Status",
		VOTES: "Votes",
		WEBSITE: "Website",
	},
	PAGE_WELCOME: {
		TITLE: "Welcome to ARK",
		HAS_NO_PROFILES: "Sign in via MarketSquare or create a new Profile to get started.",
		HAS_PROFILES:
			"Choose from an existing Profile below, sign in via MarketSquare or create a new Profile to get started.",
	},
};
