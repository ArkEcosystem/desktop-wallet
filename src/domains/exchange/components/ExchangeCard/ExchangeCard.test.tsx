import React from "react";
import { render } from "testing-library";

import { translations } from "../../i18n";
import { AddExchangeCard, BlankExchangeCard, ExchangeCard } from "./ExchangeCard";

const exchange = { id: "test-exchange", name: "Test Exchange" };

describe("ExchangeCard", () => {
	it("should render", async () => {
		const { container, findByText } = render(<ExchangeCard exchange={exchange} />);

		expect(await findByText(exchange.name)).toBeTruthy();
		expect(container).toMatchSnapshot();
	});
});

describe("BlankExchangeCard", () => {
	it("should render when blank", async () => {
		const { container, findByText } = render(<BlankExchangeCard />);

		expect(await findByText(translations.EXCHANGE_NAME)).toBeTruthy();
		expect(container).toMatchSnapshot();
	});
});

describe("AddExchangeCard", () => {
	it("should render", async () => {
		const { container, findByText } = render(<AddExchangeCard />);

		expect(await findByText(translations.ADD_EXCHANGE)).toBeTruthy();
		expect(container).toMatchSnapshot();
	});
});
