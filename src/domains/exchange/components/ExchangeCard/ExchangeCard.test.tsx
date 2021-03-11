import { translations as pluginTranslations } from "domains/plugin/i18n";
import React from "react";
import { render } from "testing-library";

import { ExchangeCard } from "./ExchangeCard";

const exchange = { id: "test-exchange", title: "Test Exchange" };

describe("ExchangeCard", () => {
	it("should render", async () => {
		const { container, findByText } = render(<ExchangeCard exchange={exchange} />);

		expect(await findByText(exchange.title)).toBeTruthy();

		expect(container).toMatchSnapshot();
	});

	it("should render a blank card", async () => {
		const { container, findByText } = render(<ExchangeCard exchange={undefined} />);

		expect(await findByText(pluginTranslations.CATEGORIES.EXCHANGE)).toBeTruthy();

		expect(container).toMatchSnapshot();
	});
});
