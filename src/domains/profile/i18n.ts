export const translations: { [key: string]: any } = {
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
		TITLE: "Reset Profile Settings",
		DESCRIPTION:
			"By performing this action, all of your Profile settings will be restored to default. This action won't delete your wallets or plugins. Do you want to reset settings? This action cannot be undone.",
		SUCCESS: "Your profile was reset successfully",
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
		SEARCH_PLACEHOLDER: "Enter the name or address for your wallet",
	},
	MODAL_SIGN_IN: {
		TITLE: "Sign In",
		DESCRIPTION: "Sign in to access your profile.",
		MAX_ATTEMPTS_ERROR:
			"Maximum sign in attempts reached - please wait {{remainingTime}} seconds before trying again.",
	},
	PAGE_CREATE_PROFILE: {
		TITLE: "Create Profile",
		DESCRIPTION: "Create a new Profile below.",
		NEW_PROFILE: "New Profile",
		VALIDATION: {
			NAME_EXISTS: "A profile with this name already exists",
		},
	},
	PAGE_WELCOME: {
		HAS_NO_PROFILES: "Create a new Profile to get started.",
		HAS_PROFILES: "Choose from an existing Profile below or create a new Profile to get started.",
	},
};
