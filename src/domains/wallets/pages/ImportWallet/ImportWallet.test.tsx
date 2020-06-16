import React from "react";
import { act, fireEvent, render, RenderResult } from "@testing-library/react";
import { I18nextProvider } from "react-i18next";

import { i18n } from "app/i18n";

import { ImportWallet } from "./";

describe("Wallet / Import", () => {
	let rendered: RenderResult;
	const networks = [
		{
			id: 1,
			name: "ARK Ecosystem",
			icon: "Ark",
		},
		{
			id: 2,
			name: "Ethereum",
			icon: "Eth",
		},
		{
			id: 3,
			name: "Bitcoin",
			icon: "Btc",
		},
	];

	beforeEach(() => {
		rendered = render(
			<I18nextProvider i18n={i18n}>
				<ImportWallet networks={networks} />
			</I18nextProvider>,
		);
	});

	it("should render", () => {
		const { container, asFragment } = rendered;

		expect(container).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should navigate between steps", () => {
		const { getByTestId } = rendered;

		const arkCard = getByTestId("card-control__ARK Ecosystem");
		expect(arkCard).toBeTruthy();

		act(() => {
			// Select network
			fireEvent.click(arkCard);
		});

		// Check network is selected
		expect(arkCard.checked).toEqual(true);

		const continueBtn = getByTestId("import-wallet__next-step--button");
		expect(continueBtn).toBeTruthy();

		act(() => {
			// Click continue button to go to next step
			fireEvent.click(continueBtn);
		});

		// Check if second step is rendered
		const addressToggle = getByTestId("import-wallet__address-toggle");
		expect(addressToggle).toBeTruthy();

		act(() => {
			// Toggle qr code (appear)
			fireEvent.click(addressToggle);
		});

		const passwordInput = getByTestId("import-wallet__password");

		act(() => {
			// Change password input value
			fireEvent.keyUp(passwordInput, { key: "test" });
		});

		const previousBtn = getByTestId("import-wallet__prev-step--button");

		act(() => {
			// Go to previous step
			fireEvent.click(previousBtn);
		});

		// Check if previous step is rendered
		const arkCardSelected = getByTestId("card-control__ARK Ecosystem");
		expect(arkCardSelected).toBeTruthy();

		// check ark is selectedd
		expect(arkCardSelected.checked).toEqual(true);
	});
});
