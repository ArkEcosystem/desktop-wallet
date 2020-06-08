import { messages } from "./messages";

export const config = {
	locale: "en-US",

	messages,

	dateTimeFormats: {
		short: {
			year: "numeric",
			month: "short",
			day: "numeric",
		},
		long: {
			year: "numeric",
			month: "short",
			day: "numeric",
			weekday: "short",
			hour: "numeric",
			minute: "numeric",
		},
		shortTime: {
			hour: "numeric",
			minute: "numeric",
		},
	},

	numberFormats: {
		currency: {
			style: "currency",
			currency: "USD",
			currencyDisplay: "symbol",
		},
	},
};
