import React from "react";
import { render } from "testing-library";

// i18n
import { AddExchangeCard, BlankCard, ExchangeCard } from "./ExchangeCard";

describe("ExchangeCard", () => {
	it("should render Exchange card", () => {
		const { container, getByTestId } = render(
			<ExchangeCard exchange={{ id: "test-exchange", name: "Test Exchange" }} />,
		);

		expect(getByTestId("Exchange__exchange-card-test-exchange")).toBeTruthy();
		expect(container).toMatchSnapshot();
	});

	it("should render Add Exchange card", () => {
		const { container, getByTestId } = render(<AddExchangeCard />);

		expect(getByTestId("Exchange__add-exchange-card")).toBeTruthy();
		expect(container).toMatchSnapshot();
	});

	it("should render Blank Exchange card", () => {
		const { container, getByTestId } = render(<BlankCard />);

		expect(getByTestId("Exchange__blank-card")).toBeTruthy();
		expect(container).toMatchSnapshot();
	});
});
