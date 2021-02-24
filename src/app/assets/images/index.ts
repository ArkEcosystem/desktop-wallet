import { contacts } from "domains/contact/images";
import { error } from "domains/error/images";
import { exchange } from "domains/exchange/images";
import { news } from "domains/news/images";
import { plugin } from "domains/plugin/images";
import { profile } from "domains/profile/images";
import { transaction } from "domains/transaction/images";
import { wallet } from "domains/wallet/images";

import { ReactComponent as ARKLogo } from "./ark-logo.svg";
import { ReactComponent as ConfirmedBanner } from "./confirmed-banner.svg";
import { ImagesDark } from "./dark";
import { ReactComponent as DeleteBanner } from "./delete-banner.svg";
import { ReactComponent as MistakeBanner } from "./mistake-banner.svg";
import { ReactComponent as NoResultsBanner } from "./no-results.svg";
import { ReactComponent as RegisterBanner } from "./register-banner.svg";
import { ReactComponent as WarningBanner } from "./warning-banner.svg";
import { ReactComponent as WelcomeBanner } from "./welcome-banner.svg";

export const images = {
	common: {
		ARKLogo,
		ConfirmedBanner,
		DeleteBanner,
		MistakeBanner,
		RegisterBanner,
		WarningBanner,
		WelcomeBanner,
		NoResultsBanner,
		...ImagesDark,
	},
	contacts,
	exchange,
	news,
	error,
	plugin,
	profile,
	transaction,
	wallet,
};
