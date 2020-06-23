import { render } from "@testing-library/react";
import { i18n } from "app/i18n";
import React from "react";
import { I18nextProvider } from "react-i18next";

// i18n
import { AddExchangeCard, BlankCard, ExchangeCard } from "./ExchangeCard";

describe("ExchangeCard", () => {
	it("should render Exchange card", () => {
		const { container, getByTestId } = render(
			<I18nextProvider i18n={i18n}>
				<ExchangeCard exchange={{ id: "test-exchange", name: "Test Exchange" }} />
			</I18nextProvider>,
		);

		expect(getByTestId("Exchange__exchange-card-test-exchange")).toBeTruthy();
		expect(container).toMatchSnapshot();
	});

	it("should render Add Exchange card", () => {
		const { container, getByTestId } = render(
			<I18nextProvider i18n={i18n}>
				<AddExchangeCard />
			</I18nextProvider>,
		);

		expect(getByTestId("Exchange__add-exchange-card")).toBeTruthy();
		expect(container).toMatchSnapshot();
	});

	it("should render Blank Exchange card", () => {
		const { container, getByTestId } = render(
			<I18nextProvider i18n={i18n}>
				<BlankCard />
			</I18nextProvider>,
		);

		expect(getByTestId("Exchange__blank-card")).toBeTruthy();
		expect(container).toMatchSnapshot();
	});
});
