import React from "react";
import { IntlProvider } from "react-intl";
import { act, fireEvent, render } from "@testing-library/react";
import { ImportWallet } from "../";
// i18n
import translations from "i18n/locales";

describe("Wallet / Import", () => {
	it("should render", () => {
		const networks = [
			{
				id: 1,
				name: "ARK Ecosystem",
				icon: "ark",
			},
			{
				id: 2,
				name: "Ethereum",
				icon: "eth",
			},
			{
				id: 3,
				name: "Bitcoin",
				icon: "btc",
			},
		];

		const { container, asFragment } = render(
			<IntlProvider locale="en-US" messages={translations["en-US"].messages}>
				<ImportWallet networks={networks} />
			</IntlProvider>,
		);

		expect(container).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should select a network", () => {
		const networks = [
			{
				id: 1,
				name: "ARK Ecosystem",
				icon: "ark",
			},
			{
				id: 2,
				name: "Ethereum",
				icon: "eth",
			},
			{
				id: 3,
				name: "Bitcoin",
				icon: "btc",
			},
		];

		const { getByTestId } = render(
			<IntlProvider locale="en-US" messages={translations["en-US"].messages}>
				<ImportWallet networks={networks} />
			</IntlProvider>,
		);

		const arkCard = getByTestId("card-control__ARK Ecosystem");

		act(() => {
			fireEvent.click(arkCard);
		});

		expect(arkCard.checked).toEqual(true);
	});
});
