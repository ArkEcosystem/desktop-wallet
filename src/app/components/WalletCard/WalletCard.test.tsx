import { Profile, ReadWriteWallet, WalletData, WalletFlag, WalletSetting } from "@arkecosystem/platform-sdk-profiles";
import * as useRandomNumberHook from "app/hooks/use-random-number";
import { createMemoryHistory } from "history";
import React from "react";
import { Route } from "react-router-dom";
import { act, env, fireEvent, getDefaultProfileId, renderWithRouter } from "testing-library";

import { WalletCard } from "./WalletCard";

const dashboardURL = `/profiles/${getDefaultProfileId()}/dashboard`;
const history = createMemoryHistory();

let profile: Profile;
let wallet: ReadWriteWallet;

describe("Wallet Card", () => {
	beforeAll(() => {
		jest.spyOn(useRandomNumberHook, "useRandomNumber").mockImplementation(() => 1);

		history.push(dashboardURL);
	});

	beforeEach(() => {
		profile = env.profiles().findById(getDefaultProfileId());
		wallet = profile.wallets().findById("ac38fe6d-4b67-4ef1-85be-17c5f6841129");
		wallet.data().set(WalletFlag.Starred, true);
		wallet.data().set(WalletData.LedgerPath, "0");

		jest.spyOn(wallet, "isMultiSignature").mockReturnValue(true);
	});

	afterAll(() => {
		useRandomNumberHook.useRandomNumber.mockRestore();
	});

	it("should render", () => {
		const { container } = renderWithRouter(
			<Route path="/profiles/:profileId/dashboard">
				<WalletCard wallet={wallet} />
			</Route>,
			{
				routes: [dashboardURL],
				history,
			},
		);

		expect(container).toMatchSnapshot();
	});

	it("should render loading state", () => {
		const { container, getByTestId } = renderWithRouter(
			<Route path="/profiles/:profileId/dashboard">
				<WalletCard isLoading={true} wallet={wallet} />
			</Route>,
			{
				routes: [dashboardURL],
				history,
			},
		);

		expect(getByTestId("WalletCard__skeleton")).toBeTruthy();
		expect(container).toMatchSnapshot();
	});

	it("should render with actions", () => {
		const actions = [{ label: "show", value: "show" }];

		const { container } = renderWithRouter(
			<Route path="/profiles/:profileId/dashboard">
				<WalletCard wallet={wallet} actions={actions} />
			</Route>,
			{
				routes: [dashboardURL],
				history,
			},
		);

		expect(container).toMatchSnapshot();
	});

	it("should render blank", () => {
		const { container } = renderWithRouter(
			<Route path="/profiles/:profileId/dashboard">
				<WalletCard />
			</Route>,
			{
				routes: [dashboardURL],
				history,
			},
		);

		expect(container).toMatchSnapshot();
	});

	it("should render with wallet data", () => {
		wallet.settings().set(WalletSetting.Alias, "My wallet");

		const { container } = renderWithRouter(
			<Route path="/profiles/:profileId/dashboard">
				<WalletCard wallet={wallet} />,
			</Route>,
			{
				routes: [dashboardURL],
				history,
			},
		);

		expect(container).toMatchSnapshot();
	});

	it("should render with wallet data and optional icon", () => {
		wallet.settings().set(WalletSetting.Alias, "My wallet");

		const { container } = renderWithRouter(
			<Route path="/profiles/:profileId/dashboard">
				<WalletCard wallet={wallet} />
			</Route>,
			{
				routes: [dashboardURL],
				history,
			},
		);

		expect(container).toMatchSnapshot();
	});

	it("should click a wallet and redirect to it", () => {
		const { getByText } = renderWithRouter(
			<Route path="/profiles/:profileId/dashboard">
				<WalletCard wallet={wallet} />
			</Route>,
			{
				routes: [dashboardURL],
				history,
			},
		);

		expect(history.location.pathname).toBe(`/profiles/${profile.id()}/dashboard`);

		act(() => {
			fireEvent.click(getByText("D8rr7B1d6TL6pf14LgMz4sKp1VBMs6YUYD"));
		});

		expect(history.location.pathname).toBe(`/profiles/${profile.id()}/wallets/${wallet.id()}`);
	});
});
