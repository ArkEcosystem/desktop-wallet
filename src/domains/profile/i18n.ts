export const translations: { [key: string]: any } = {
	CREATE_PROFILE: "Create Profile",
	IMPORT: {
		ERROR_STEP: {
			DESCRIPTION:
				"An error occurred while importing the profile, try importing again. Select Retry to re-import the profile. If the error occurs again, you can contact our support team.",
		},
		FORM_STEP: {
			DESCRIPTION: "Your profile addresses have been imported.",
		},

		PASSWORD_DESCRIPTION:
			"The profile you are importing contains a password that has been set for security purposes. Enter the password to confirm.",
		PASSWORD_TITLE: "Profile Password",
		PROCESSING_IMPORT_STEP: {
			DESCRIPTION: "The file with name {{name}} is being imported.",
			PLEASE_WAIT: "Please wait...",
		},
		SELECT_FILE_STEP: {
			BROWSE_FILES: "Browse Files",
			CLICK_HERE: "Click here.",
			DEPRECATION_WARNING:
				"Please note that importing a Profile from Desktop Wallet v2 in .json format is provided temporarily and will soon be disabled. We recommend that you re-save your Profile in the new .dwe format.",
			DESCRIPTION:
				"Select a {{fileFormat}} file with your Profile and related properties to start the import process.",
			DRAG_AND_DROP: "Drag & Drop or",
			LEGACY_IMPORT: "Importing from Desktop Wallet v2?",
			SUPPORTED_FORMAT: "Supported format is {{fileFormat}}",
			UPLOAD_TITLE: "Click here to upload",
		},
		TITLE: "Import Profile",
	},
	MODAL_DELETE_PROFILE: {
		DESCRIPTION: "Do you really want to delete this profile? Once deleted, you will not be able to restore it.",
		TITLE: "Delete Profile",
	},
	MODAL_HISTORY: {
		TITLE: "History",
		TYPES: {
			REGISTRATION: "Registration",
			RESIGN: "Resign",
			UPDATE: "Update",
		},
	},
	MODAL_PROFILE_CREATED: {
		DESCRIPTION_1: "If you are new to the ARK Desktop Wallet, view our tutorial to get started.",
		DESCRIPTION_2: "If not, you can skip the tutorial to go directly to your portfolio.",
		SKIP_TUTORIAL: "Skip Tutorial",
		START_TUTORIAL: "Start Tutorial",
		TITLE: "Profile Created!",
	},
	MODAL_RESET_PROFILE: {
		DESCRIPTION:
			"By performing this action, all of your Profile settings will be restored to default. This won't delete your wallets or plugins. This action cannot be undone. Do you want to reset your settings?",
		SUCCESS: "Your profile was reset successfully",
		TITLE: "Reset Profile Settings",
	},
	MODAL_SELECT_SENDER: {
		DESCRIPTION: "Find and select the sender from your wallets",
		SEARCH_PLACEHOLDER: "Enter name or address",
		TITLE: "Select Sender",
	},
	MODAL_SIGN_IN: {
		DESCRIPTION: "Sign in to access your Profile.",
		MAX_ATTEMPTS_ERROR:
			"Maximum sign in attempts reached - please wait {{remainingTime}} seconds before trying again.",
		TITLE: "Sign In",
	},
	PAGE_CREATE_PROFILE: {
		DESCRIPTION: "Create a new Profile below.",
		TITLE: "Create Profile",
		VALIDATION: {
			NAME_EXISTS: "A profile with this name already exists",
		},
	},
	PAGE_WELCOME: {
		HAS_EXPORTED_PROFILES: "Exported a Profile before?",
		IMPORT_PROFILE: "Import it here.",
		IMPORT_PROFILE_TITLE: "Import Profile",
		WITHOUT_PROFILES: {
			DESCRIPTION: "Create a new Profile to get started.",
			TITLE: "Create Profile",
		},
		WITH_PROFILES: {
			DESCRIPTION: "Choose from an existing Profile below or create a new Profile to get started.",
			TITLE: "Select Profile",
		},
	},
};
