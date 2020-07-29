/* eslint-disable @typescript-eslint/require-await */
import { ARK } from "@arkecosystem/platform-sdk-ark";
import { Environment, Profile, Wallet, WalletSetting } from "@arkecosystem/platform-sdk-profiles";
import { EnvironmentProvider } from "app/contexts";
import { httpClient } from "app/services";
import { createMemoryHistory } from "history";
import React from "react";
import { Route } from "react-router-dom";
import { act, fireEvent, RenderResult, renderWithRouter, waitFor } from "testing-library";
import fixtureData from "tests/fixtures/env/storage-mainnet.json";
import { mockArkHttp, StubStorage } from "tests/mocks";

import { WalletDetails } from "./WalletDetails";

const history = createMemoryHistory();
let route: string;

let env: Environment;
let profile: Profile;
let wallet: Wallet;
let wallets: Wallet[];

const passphrase2 = "power return attend drink piece found tragic fire liar page disease combine";

beforeAll(() => {
	mockArkHttp();
});

jest.useFakeTimers();

describe("WalletDetails", () => {
	beforeEach(async () => {
		env = new Environment({ coins: { ARK }, httpClient, storage: new StubStorage() });
		await env.bootFromObject(fixtureData);

		profile = env.profiles().all()[0];

		wallet = profile.wallets().values()[0];
		wallets = [wallet, await profile.wallets().importByMnemonic(passphrase2, "ARK", "mainnet")];

		route = `/profiles/${profile.id()}/wallets/${wallet.id()}`;
		history.push(route);
	});

	it("should render", async () => {
		let rendered: any;
		await act(async () => {
			rendered = renderWithRouter(
				<EnvironmentProvider env={env}>
					<Route path="/profiles/:profileId/wallets/:walletId">
						<WalletDetails />
					</Route>
				</EnvironmentProvider>,
				{
					routes: [route],
					history,
				},
			);
		});

		await waitFor(() => expect(rendered.getByTestId("WalletHeader")).toBeTruthy());
		await waitFor(() =>
			expect(rendered.getByTestId("WalletHeader__address-publickey")).toHaveTextContent(wallet.address()),
		);
		await waitFor(() => expect(rendered.asFragment()).toMatchSnapshot());

		jest.runOnlyPendingTimers();
	});

	it("should not render the bottom sheet menu when there is only one wallet", async () => {
		profile.wallets().forget(wallets[1].id());

		let rendered: any;
		await act(async () => {
			rendered = renderWithRouter(
				<EnvironmentProvider env={env}>
					<Route path="/profiles/:profileId/wallets/:walletId">
						<WalletDetails />
					</Route>
				</EnvironmentProvider>,
				{
					routes: [route],
					history,
				},
			);
		});

		await waitFor(() => expect(rendered.getByTestId("WalletHeader")).toBeTruthy());
		await waitFor(() =>
			expect(rendered.getByTestId("WalletHeader__address-publickey")).toHaveTextContent(wallet.address()),
		);

		expect(() => rendered.getByTestId("WalletBottomSheetMenu")).toThrow(/Unable to find an element by/);
		await waitFor(() => expect(rendered.asFragment()).toMatchSnapshot());

		jest.runOnlyPendingTimers();
	});

	it("should update wallet name", async () => {
		let rendered: RenderResult;

		await act(async () => {
			rendered = renderWithRouter(
				<EnvironmentProvider env={env}>
					<Route path="/profiles/:profileId/wallets/:walletId">
						<WalletDetails />
					</Route>
				</EnvironmentProvider>,
				{
					routes: [route],
					history,
				},
			);

			await waitFor(() => expect(rendered.getByTestId("WalletHeader")).toBeTruthy());
		});

		const { getByTestId, getAllByTestId, asFragment } = rendered;

		jest.runOnlyPendingTimers();

		const dropdown = getAllByTestId("dropdown__toggle")[2];
		await waitFor(() => expect(dropdown).toBeTruthy());
		fireEvent.click(dropdown);

		const updateWalletNameOption = getByTestId("dropdown__option--0");
		await waitFor(() => expect(updateWalletNameOption).toBeTruthy());

		fireEvent.click(updateWalletNameOption);
		await waitFor(() => expect(getByTestId("modal__inner")).toBeTruthy());

		const name = "Sample label name";
		const updateNameInput = getByTestId("UpdateWalletName__input");
		fireEvent.change(updateNameInput, { target: { value: name } });
		await waitFor(() => expect(updateNameInput).toHaveValue(name));

		fireEvent.click(getByTestId("UpdateWalletName__submit"));
		await waitFor(() => expect(wallet.settings().get(WalletSetting.Alias)).toEqual(name));

		await waitFor(() => expect(asFragment()).toMatchSnapshot());

		jest.runOnlyPendingTimers();
	});

	it("should delete wallet", async () => {
		let rendered: RenderResult;

		await act(async () => {
			rendered = renderWithRouter(
				<EnvironmentProvider env={env}>
					<Route path="/profiles/:profileId/wallets/:walletId">
						<WalletDetails />
					</Route>
				</EnvironmentProvider>,
				{
					routes: [route],
					history,
				},
			);

			await waitFor(() => expect(rendered.getByTestId("WalletHeader")).toBeTruthy());
		});

		const { getByTestId, getAllByTestId, asFragment } = rendered;

		const dropdown = getAllByTestId("dropdown__toggle")[2];
		await waitFor(() => expect(dropdown).toBeTruthy());
		fireEvent.click(dropdown);

		const deleteWalletOption = getByTestId("dropdown__option--3");
		await waitFor(() => expect(deleteWalletOption).toBeTruthy());

		fireEvent.click(deleteWalletOption);
		await waitFor(() => expect(getByTestId("modal__inner")).toBeTruthy());

		await waitFor(() => expect(profile.wallets().count()).toEqual(2));

		fireEvent.click(getByTestId("DeleteResource__submit-button"));

		await waitFor(() => expect(profile.wallets().count()).toEqual(1));
		await waitFor(() => expect(asFragment()).toMatchSnapshot());

		jest.runOnlyPendingTimers();
	});
});
