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
let dashboardURL: string;

let env: Environment;
let profile: Profile;
let wallet: Wallet;
let wallets: Wallet[];

const passphrase2 = "power return attend drink piece found tragic fire liar page disease combine";

beforeAll(() => {
	mockArkHttp();
});

describe("WalletDetails", () => {
	beforeEach(async () => {
		env = new Environment({ coins: { ARK }, httpClient, storage: new StubStorage() });
		await env.bootFromObject(fixtureData);

		profile = env.profiles().all()[0];

		wallet = profile.wallets().values()[0];
		wallets = [wallet, await profile.wallets().importByMnemonic(passphrase2, "ARK", "mainnet")];

		dashboardURL = `/profiles/${profile.id()}/wallets/${wallet.id()}`;
		history.push(dashboardURL);
	});

	it("should render", async () => {
		const { asFragment, getByTestId } = renderWithRouter(
			<EnvironmentProvider env={env}>
				<Route path="/profiles/:profileId/wallets/:walletId">
					<WalletDetails />
				</Route>
			</EnvironmentProvider>,
			{
				routes: [dashboardURL],
				history,
			},
		);

		await waitFor(() => expect(getByTestId("WalletHeader")).toBeTruthy());
		await waitFor(() => expect(asFragment()).toMatchSnapshot());
	});

	it("should render wallet data", async () => {
		await Promise.resolve().then(() => jest.useFakeTimers());

		const { asFragment, getByTestId } = renderWithRouter(
			<EnvironmentProvider env={env}>
				<Route path="/profiles/:profileId/wallets/:walletId">
					<WalletDetails />
				</Route>
			</EnvironmentProvider>,
			{
				routes: [dashboardURL],
				history,
			},
		);

		jest.runOnlyPendingTimers();

		await waitFor(() => expect(getByTestId("WalletHeader__address-publickey")).toHaveTextContent(wallet.address()));
		await waitFor(() => expect(asFragment()).toMatchSnapshot());
	});

	it("should render without wallet", async () => {
		const { asFragment, getByTestId } = renderWithRouter(<WalletDetails />);

		expect(getByTestId("WalletHeader")).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should not render the bottom sheet menu when there is only one wallet", () => {
		wallets = [wallet];
		const { asFragment, getByTestId } = renderWithRouter(<WalletDetails />);

		expect(() => getByTestId("WalletBottomSheetMenu")).toThrow(/Unable to find an element by/);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should delete wallet", async () => {
		let rendered: RenderResult;
		const route = `/profiles/${profile.id()}/wallets/${wallet.id()}`;

		await act(async () => {
			rendered = renderWithRouter(
				<EnvironmentProvider env={env}>
					<Route path="/profiles/:profileId/wallets/:walletId">
						<WalletDetails />
					</Route>
				</EnvironmentProvider>,
				{
					routes: [route],
				},
			);

			await waitFor(() => expect(rendered.getByTestId("WalletHeader")).toBeTruthy());
		});

		const { getByTestId, getAllByTestId, asFragment } = rendered;

		await waitFor(() => expect(getByTestId("WalletHeader")).toBeTruthy());

		expect(asFragment()).toMatchSnapshot();

		await act(async () => {
			const dropdown = getAllByTestId("dropdown__toggle")[2];
			expect(dropdown).toBeTruthy();

			await fireEvent.click(dropdown);

			const deleteWalletOption = getByTestId("dropdown__option--3");
			expect(deleteWalletOption).toBeTruthy();

			await fireEvent.click(deleteWalletOption);
			expect(getByTestId("modal__inner")).toBeTruthy();

			await waitFor(() => expect(profile.wallets().count()).toEqual(2));

			await fireEvent.click(getByTestId("DeleteResource__submit-button"));

			await waitFor(() => expect(profile.wallets().count()).toEqual(1));
		});
	});

	it("should update wallet name", async () => {
		let rendered: RenderResult;
		const route = `/profiles/${profile.id()}/wallets/${wallet.id()}`;

		await act(async () => {
			rendered = renderWithRouter(
				<EnvironmentProvider env={env}>
					<Route path="/profiles/:profileId/wallets/:walletId">
						<WalletDetails />
					</Route>
				</EnvironmentProvider>,
				{
					routes: [route],
				},
			);

			await waitFor(() => expect(rendered.getByTestId("WalletHeader")).toBeTruthy());
		});

		const { getByTestId, getAllByTestId, asFragment } = rendered;

		expect(asFragment()).toMatchSnapshot();

		await act(async () => {
			const dropdown = getAllByTestId("dropdown__toggle")[2];
			expect(dropdown).toBeTruthy();

			await fireEvent.click(dropdown);

			const updateWalletNameOption = getByTestId("dropdown__option--0");
			await waitFor(() => expect(updateWalletNameOption).toBeTruthy());

			fireEvent.click(updateWalletNameOption);
			await waitFor(() => expect(getByTestId("modal__inner")).toBeTruthy());

			const name = "Sample label name";
			const updateNameInput = getByTestId("UpdateWalletName__input");
			act(() => {
				fireEvent.change(updateNameInput, { target: { value: name } });
			});

			await waitFor(() => expect(updateNameInput).toHaveValue(name));

			const submitBtn = getByTestId("UpdateWalletName__submit");

			fireEvent.click(submitBtn);

			await waitFor(() => {
				expect(wallet.settings().get(WalletSetting.Alias)).toEqual(name);
			});
		});
	});

	it("should delete wallet", async () => {
		let rendered: RenderResult;
		const route = `/profiles/${profile.id()}/wallets/${wallet.id()}`;

		await act(async () => {
			rendered = renderWithRouter(
				<EnvironmentProvider env={env}>
					<Route path="/profiles/:profileId/wallets/:walletId">
						<WalletDetails wallets={[wallets[0]]} wallet={walletData} />
					</Route>
				</EnvironmentProvider>,
				{
					routes: [route],
				},
			);

			await waitFor(() => expect(rendered.getByTestId("WalletHeader")).toBeTruthy());
		});

		const { getByTestId, getAllByTestId, asFragment } = rendered;

		expect(asFragment()).toMatchSnapshot();

		await act(async () => {
			const dropdown = getAllByTestId("dropdown__toggle")[2];
			expect(dropdown).toBeTruthy();

			await fireEvent.click(dropdown);

			const deleteWalletOption = getByTestId("dropdown__option--3");
			expect(deleteWalletOption).toBeTruthy();

			await fireEvent.click(deleteWalletOption);
			expect(getByTestId("modal__inner")).toBeTruthy();

			await fireEvent.click(getByTestId("DeleteResource__submit-button"));

			await waitFor(() => expect(profile.wallets().count()).toEqual(0));
		});
	});
});
