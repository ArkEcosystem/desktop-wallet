import { ReactComponent as ProfileCreatedBanner } from "./profile-created-banner.svg";
import { ReactComponent as WelcomeBanner } from "./welcome-banner.svg";

export const profile = {
	components: {
		profileCreated: {
			ProfileCreatedBanner,
		},
	},
	pages: {
		welcome: {
			WelcomeBanner,
		},
	},
};
