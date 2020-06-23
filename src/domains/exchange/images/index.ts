import { ReactComponent as AddExchangeBanner } from "./add-exchange-banner.svg";
import { ReactComponent as ChangeNowLogo } from "./changenow-logo.svg";
import { ReactComponent as ExchangeCardsBanner } from "./exchange-cards-banner.svg";
import { ReactComponent as NoExchangesBanner } from "./no-exchanges-banner.svg";

export const exchange = {
	components: {
		AddExchange: {
			AddExchangeBanner,
			ChangeNowLogo,
		},
	},
	pages: {
		Exchange: {
			ExchangeCardsBanner,
			NoExchangesBanner,
		},
	},
};
