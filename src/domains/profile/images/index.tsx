import { ReactComponent as WelcomeBanner } from "./welcome-banner.svg";
import { ReactComponent as ProfileCreated } from "./profile-created.svg";

export const profile = {
	components: {
		profileCreated: {
			ProfileCreated,
		},
	},
	pages: {
		welcome: {
			WelcomeBanner,
		},
	},
};
