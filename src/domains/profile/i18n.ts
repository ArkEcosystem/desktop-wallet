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
			"By performing this action, all of your Profile settings will be restored to default. This won't delete your wallets or plugins. This action cannot be undone. Do you want to reset your settings?",
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
		SEARCH_PLACEHOLDER: "Enter name or address",
	},
	MODAL_SIGN_IN: {
		TITLE: "Sign In",
		DESCRIPTION: "Sign in to access your Profile.",
		MAX_ATTEMPTS_ERROR:
			"Maximum sign in attempts reached - please wait {{remainingTime}} seconds before trying again.",
	},
	PAGE_CREATE_PROFILE: {
		TITLE: "Create Profile",
		DESCRIPTION: "Create a new Profile below.",
		VALIDATION: {
			NAME_EXISTS: "A profile with this name already exists",
		},
	},
	PAGE_WELCOME: {
		WITH_PROFILES: {
			TITLE: "Select Profile",
			DESCRIPTION: "Choose from an existing Profile below or create a new Profile to get started.",
		},
		WITHOUT_PROFILES: {
			TITLE: "Create Profile",
			DESCRIPTION: "Create a new Profile to get started.",
		},
		HAS_EXPORTED_PROFILES: "Exported a Profile before?",
		IMPORT_PROFILE_TITLE: "Import Profile",
		IMPORT_PROFILE: "Import it here.",
	},
	IMPORT: {
		PASSWORD_TITLE: "Profile Password",
		PASSWORD_DESCRIPTION:
			"The profile you are importing contains a password that has been set for security purposes. Enter the password to confirm.",

		TITLE: "Import Profile",
		SELECT_FILE_STEP: {
			DESCRIPTION:
				"Select a {{fileFormat}} file with your Profile and related properties to start the import process.",
			DRAG_AND_DROP: "Drag & Drop or",
			BROWSE_FILES: "Browse Files",
			SUPPORTED_FORMAT: "Supported format is {{fileFormat}}",
			LEGACY_IMPORT: "Importing from Desktop Wallet v2?",
			CLICK_HERE: "Click here.",
			UPLOAD_TITLE: "Click here to upload",
			DEPRECATION_WARNING:
				"Please note that importing a Profile from Desktop Wallet v2 in .json format is provided temporarily and will soon be disabled. We recommend that you re-save your Profile in the new .dwe format.",
		},
		PROCESSING_IMPORT_STEP: {
			DESCRIPTION: "The file with name {{name}} is being imported.",
			PLEASE_WAIT: "Please wait...",
		},
		ERROR_STEP: {
			DESCRIPTION:
				"An error occurred while importing the profile, try importing again. Select Retry to re-import the profile. If the error occurs again, you can contact our support team.",
		},
		FORM_STEP: {
			DESCRIPTION: "Your profile addresses have been imported.",
		},
	},
};
