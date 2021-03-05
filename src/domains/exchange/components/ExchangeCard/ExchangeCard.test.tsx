import { translations as commonTranslations } from "app/i18n/common/i18n";
import React from "react";
import { render } from "testing-library";

import { BlankExchangeCard, ExchangeCard } from "./ExchangeCard";

const exchange = { id: "test-exchange", title: "Test Exchange" };

describe("ExchangeCard", () => {
	it("should render", async () => {
		const { container, findByText } = render(<ExchangeCard exchange={exchange} />);

		expect(await findByText(exchange.title)).toBeTruthy();

		expect(container).toMatchSnapshot();
	});
});

describe("BlankExchangeCard", () => {
	it("should render when blank", async () => {
		const { container, findByText } = render(<BlankExchangeCard />);

		expect(await findByText(commonTranslations.AUTHOR)).toBeTruthy();
		expect(await findByText(commonTranslations.EXCHANGE)).toBeTruthy();

		expect(container).toMatchSnapshot();
	});
});
