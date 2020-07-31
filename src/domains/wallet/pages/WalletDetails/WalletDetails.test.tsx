/* eslint-disable @typescript-eslint/require-await */
import { ARK } from "@arkecosystem/platform-sdk-ark";
import { Environment, Profile, Wallet, WalletSetting } from "@arkecosystem/platform-sdk-profiles";
import { EnvironmentProvider } from "app/contexts";
import { httpClient } from "app/services";
import { createMemoryHistory } from "history";
import nock from "nock";
import React from "react";
import { Route } from "react-router-dom";
import walletMock from "tests/fixtures/coins/ark/wallet.json";
import fixtureData from "tests/fixtures/env/storage-mainnet.json";
import { mockArkHttp, StubStorage } from "tests/mocks";
import { act, cleanup, fireEvent, renderWithRouter, waitFor } from "utils/testing-library";

import { WalletDetails } from "./WalletDetails";

const history = createMemoryHistory();
let dashboardURL: string;

let env: Environment;
let profile: Profile;
let wallet: Wallet;
let secondWallet: Wallet;

const passphrase2 = "power return attend drink piece found tragic fire liar page disease combine";

const renderPage = async () => {
	const rendered = renderWithRouter(
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

	jest.useRealTimers();

	await waitFor(() => expect(rendered.getByTestId("WalletHeader")).toBeInTheDocument());
	await waitFor(() => expect(rendered.getByTestId("WalletRegistrations")).toBeTruthy());

	return rendered;
};

describe("WalletDetails", () => {
	afterEach(() => {
		cleanup();
		nock.cleanAll();
	});

	beforeEach(() => {
		mockArkHttp();
	});

	beforeEach(async () => {
		env = new Environment({ coins: { ARK }, httpClient, storage: new StubStorage() });
		await env.bootFromObject(fixtureData);

		profile = env.profiles().values()[0];

		wallet = profile.wallets().values()[0];
		secondWallet = await profile.wallets().importByMnemonic(passphrase2, "ARK", "mainnet");

		dashboardURL = `/profiles/${profile.id()}/wallets/${wallet.id()}`;
		history.push(dashboardURL);
	});

	it("should render", async () => {
		const { asFragment, getByTestId } = await renderPage();
		expect(getByTestId("WalletHeader__address-publickey")).toHaveTextContent(wallet.address());
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render with timers", async () => {
		jest.useFakeTimers();
		const { asFragment } = await renderPage();

		act(() => {
			jest.useFakeTimers();
			jest.advanceTimersByTime(30000);
			jest.useRealTimers();
		});

		// Wait for fetch before unmount
		await act(async () => {
			await new Promise((resolve) => setTimeout(resolve, 1000));
		});

		expect(asFragment()).toMatchSnapshot();
	});

	it("should render when wallet not found for votes", async () => {
		dashboardURL = `/profiles/${profile.id()}/wallets/${secondWallet.id()}`;
		history.push(dashboardURL);

		const { asFragment, getByTestId } = await renderPage();

		expect(getByTestId("WalletHeader__address-publickey")).toHaveTextContent(secondWallet.address());
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render when wallet hasn't voted", async () => {
		const unvotedWallet = await profile.wallets().importByMnemonic("test wallet", "ARK", "mainnet");

		nock.cleanAll();

		nock("https://wallets.ark.io")
			.get(`/api/wallets/${unvotedWallet.address()}`)
			.reply(200, walletMock)
			.get(`/api/wallets/${unvotedWallet.address()}/votes`)
			.reply(200, {
				meta: {
					totalCountIsEstimate: false,
					count: 0,
					pageCount: 1,
					totalCount: 0,
					next: null,
					previous: null,
					self: "/wallets/AXzxJ8Ts3dQ2bvBR1tPE7GUee9iSEJb8HX/votes?transform=true&page=1&limit=100",
					first: "/wallets/AXzxJ8Ts3dQ2bvBR1tPE7GUee9iSEJb8HX/votes?transform=true&page=1&limit=100",
					last: null,
				},
				data: [],
			})
			.persist();

		dashboardURL = `/profiles/${profile.id()}/wallets/${unvotedWallet.id()}`;
		history.push(dashboardURL);

		const { asFragment, getByTestId } = await renderPage();

		expect(getByTestId("WalletHeader__address-publickey")).toHaveTextContent(unvotedWallet.address());
		expect(asFragment()).toMatchSnapshot();
	});

	it("should not render the bottom sheet menu when there is only one wallet", async () => {
		profile.wallets().forget(secondWallet.id());
		const { asFragment, queryByTestId } = await renderPage();

		expect(queryByTestId("WalletBottomSheetMenu")).toBeNull();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should delete wallet", async () => {
		const { getByTestId, getAllByTestId, asFragment } = await renderPage();

		expect(asFragment()).toMatchSnapshot();

		const dropdown = getAllByTestId("dropdown__toggle")[2];
		expect(dropdown).toBeTruthy();

		act(() => {
			fireEvent.click(dropdown);
		});

		const deleteWalletOption = getByTestId("dropdown__option--4");
		expect(deleteWalletOption).toBeTruthy();

		act(() => {
			fireEvent.click(deleteWalletOption);
		});

		expect(profile.wallets().count()).toEqual(2);
		await waitFor(() => expect(getByTestId("modal__inner")).toBeTruthy());

		act(() => {
			fireEvent.click(getByTestId("DeleteResource__submit-button"));
		});

		await waitFor(() => expect(profile.wallets().count()).toEqual(1));
	});

	it("should update wallet name", async () => {
		const { getByTestId, getAllByTestId, asFragment } = await renderPage();

		const dropdown = getAllByTestId("dropdown__toggle")[2];
		expect(dropdown).toBeTruthy();

		act(() => {
			fireEvent.click(dropdown);
		});

		const updateWalletNameOption = getByTestId("dropdown__option--0");
		expect(updateWalletNameOption).toBeTruthy();

		act(() => {
			fireEvent.click(updateWalletNameOption);
		});

		await waitFor(() => expect(getByTestId("modal__inner")).toBeTruthy());

		const name = "Sample label name";
		const updateNameInput = getByTestId("UpdateWalletName__input");

		act(() => {
			fireEvent.change(updateNameInput, { target: { value: name } });
		});

		expect(updateNameInput).toHaveValue(name);

		const submitBtn = getByTestId("UpdateWalletName__submit");

		act(() => {
			fireEvent.click(submitBtn);
		});

		wallet.settings().set(WalletSetting.Alias, name);
		await waitFor(() => expect(wallet.settings().get(WalletSetting.Alias)).toEqual(name));

		expect(asFragment()).toMatchSnapshot();
	});
});
