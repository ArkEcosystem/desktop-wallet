import { BigNumber } from "@arkecosystem/platform-sdk-support";
import { number, select, withKnobs } from "@storybook/addon-knobs";
import React from "react";

import { Amount } from "./Amount";

export default {
	title: "App / Components / Amount",
	decorators: [withKnobs],
};

export const Default = () => {
	const ticker = select("Ticker", ["BTC", "EUR", "USD"], "BTC");
	const amount = number("Amount", 123.456);
	const locale = select("Locale", ["en-US", "pt-BR", "ja-JP", "de-DE"], "en-US");
	const value = BigNumber.make(amount);

	return <Amount ticker={ticker} value={value} locale={locale} />;
};
