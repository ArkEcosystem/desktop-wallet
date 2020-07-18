/* eslint-disable @typescript-eslint/require-await */
import { ARK } from "@arkecosystem/platform-sdk-ark";
import { Environment } from "@arkecosystem/platform-sdk-profiles";
import { EnvironmentProvider } from "app/contexts";
import { httpClient } from "app/services";
import { createMemoryHistory } from "history";
import React from "react";
import { Route } from "react-router-dom";
import { act, RenderResult, renderWithRouter } from "testing-library";
import { identity } from "tests/fixtures/identity";
import { StubStorage } from "tests/mocks";

import { ImportWallet } from "./ImportWallet";

let rendered: RenderResult;
let env: Environment;

describe("Wallet / Import", () => {
	beforeEach(async () => {
		env = new Environment({ coins: { ARK }, httpClient, storage: new StubStorage() });

		const history = createMemoryHistory();
		//const profile = env.profiles().create("John Doe");
		const importURL = `/profiles/${identity.profiles.bob.id}/wallets/import`;

		history.push(importURL);

		await act(async () => {
			rendered = renderWithRouter(
				<Route path="/profiles/:profileId/wallets/import">
					<EnvironmentProvider env={env}>
						<ImportWallet />
					</EnvironmentProvider>
				</Route>,
				{
					routes: [importURL],
					history,
				},
			);
		});
	});

	it("should render", () => {
		const { container, asFragment } = rendered;

		expect(container).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});

	/*it("should navigate between steps", async () => {
		const { getByTestId } = rendered;

		const selectAssetInput = getByTestId("select-asset__input");
		expect(selectAssetInput).toBeTruthy();

		await act(async () => {
			fireEvent.change(selectAssetInput, { target: { value: "Bitco" } });
		});

		await act(async () => {
			fireEvent.keyDown(selectAssetInput, { key: "Enter", code: 13 });
		});

		// Check network is selected
		expect(getByTestId("select-asset__selected-Bitcoin")).toBeTruthy();

		const continueBtn = getByTestId("ImportWallet__next-step--button");
		expect(continueBtn).toBeTruthy();

		await act(async () => {
			// Click continue button to go to next step
			fireEvent.click(continueBtn);
		});

		// Check if second step is rendered
		const addressToggle = getByTestId("ImportWallet__address-toggle");
		expect(addressToggle).toBeTruthy();

		await act(async () => {
			// Toggle qr code (appear)
			fireEvent.click(addressToggle);
		});

		const passwordInput = getByTestId("ImportWallet__password");

		await act(async () => {
			// Change password input value
			fireEvent.keyUp(passwordInput, { key: "test" });
		});

		const previousBtn = getByTestId("ImportWallet__prev-step--button");

		await act(async () => {
			// Go to previous step
			fireEvent.click(previousBtn);
		});

		// Check if previous step is rendered
		expect(getByTestId("select-asset__input")).toBeTruthy();
	});

	it("should import a wallet", async () => {
		const { getByTestId } = rendered;

		const selectAssetInput = getByTestId("select-asset__input");
		expect(selectAssetInput).toBeTruthy();

		await act(async () => {
			fireEvent.change(selectAssetInput, { target: { value: "Ark" } });
		});

		await act(async () => {
			fireEvent.keyDown(selectAssetInput, { key: "Enter", code: 13 });
		});

		// Check network is selected
		expect(getByTestId("select-asset__selected-ARK Ecosystem")).toBeTruthy();

		const continueBtn = getByTestId("ImportWallet__next-step--button");
		expect(continueBtn).toBeTruthy();

		await act(async () => {
			// Click continue button to go to next step
			fireEvent.click(continueBtn);
		});

		// Check if second step is rendered
		expect(getByTestId("ImportWallet__address-toggle")).toBeTruthy();

		await act(async () => {
			fireEvent.input(getByTestId("ImportWallet__password-input"), { target: { value: identity.mnemonic } });
		});

		await act(async () => {
			fireEvent.click(getByTestId("ImportWallet__submit-button"));
		});
	});*/
});
