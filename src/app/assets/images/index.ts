import { error } from "domains/error/images";
import { news } from "domains/news/images";
import { plugin } from "domains/plugin/images";
import { profile } from "domains/profile/images";
import { transaction } from "domains/transaction/images";
import { wallet } from "domains/wallet/images";

import { ReactComponent as ARKLogo } from "./ark-logo.svg";
import { ReactComponent as ChangeNowLogo } from "./changenow-logo.svg";
import { ImagesDark } from "./dark";
import { ReactComponent as DeleteBanner } from "./delete-banner.svg";
import { ReactComponent as EmptyNotifications } from "./empty-notifications.svg";
import { ReactComponent as ErrorBanner } from "./error-banner.svg";
import { ReactComponent as GenericWarning } from "./generic-warning.svg";
import { ReactComponent as NoResultsBanner } from "./no-results-banner.svg";
import { ReactComponent as SuccessBanner } from "./success-banner.svg";
import { ReactComponent as WarningBanner } from "./warning-banner.svg";
import { ReactComponent as WelcomeBanner } from "./welcome-banner.svg";

export const images = {
	common: {
		ARKLogo,
		ChangeNowLogo,
		DeleteBanner,
		EmptyNotifications,
		ErrorBanner,
		GenericWarning,
		NoResultsBanner,
		SuccessBanner,
		WarningBanner,
		WelcomeBanner,
		...ImagesDark,
	},
	error,
	news,
	plugin,
	profile,
	transaction,
	wallet,
};
