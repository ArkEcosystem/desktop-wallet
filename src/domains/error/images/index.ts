import { ReactComponent as CannotConnectBanner } from "./cannot-connect-banner.svg";
import { ReactComponent as ErrorBanner } from "./error-banner.svg";

export const error = {
	pages: {
		ApplicationError: {
			ErrorBanner,
		},
		Offline: {
			CannotConnectBanner,
		},
	},
};
