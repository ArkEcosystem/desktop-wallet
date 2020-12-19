import { ReadWriteWallet } from "@arkecosystem/platform-sdk-profiles";
import { createMemoryHistory } from "history";
import React from "react";
import { Route } from "react-router-dom";
import { env, getDefaultProfileId, renderWithRouter } from "testing-library";

import { WalletRegistrations } from "./WalletRegistrations";

const history = createMemoryHistory();

const delegate = {
	username: "test",
	isResigned: false,
};

let wallet: ReadWriteWallet;

let walletURL: string;

describe("WalletRegistrations", () => {
	beforeEach(() => {
		const profile = env.profiles().findById(getDefaultProfileId());
		wallet = profile.wallets().findById("ac38fe6d-4b67-4ef1-85be-17c5f6841129");

		walletURL = `/profiles/${profile.id()}/wallets/${wallet.id()}`;
		history.push(walletURL);
	});

	it("should render loading state", () => {
		const walletSpy = jest.spyOn(wallet, "hasSyncedWithNetwork").mockReturnValue(false);

		const { asFragment, getByTestId } = renderWithRouter(
			<Route path="/profiles/:profileId/wallets/:walletId">
				<WalletRegistrations onButtonClick={jest.fn()} />
			</Route>,
			{
				routes: [walletURL],
				history,
			},
		);

		expect(getByTestId("WalletRegistrations__skeleton")).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();

		walletSpy.mockRestore();
	});

	it("should render inactive icons without a delegate registration", () => {
		jest.spyOn(wallet, "isDelegate").mockReturnValue(false);
		jest.spyOn(wallet, "isMultiSignature").mockReturnValue(true);
		jest.spyOn(wallet, "isSecondSignature").mockReturnValue(true);

		const { asFragment, getByTestId } = renderWithRouter(
			<Route path="/profiles/:profileId/wallets/:walletId">
				<WalletRegistrations onButtonClick={jest.fn()} />
			</Route>,
			{
				routes: [walletURL],
				history,
			},
		);

		expect(getByTestId("WalletRegistrations__inactive")).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();

		jest.clearAllMocks();
	});

	it("should render inactive icons without a multisignature registration", () => {
		jest.spyOn(wallet, "isDelegate").mockReturnValue(true);
		jest.spyOn(wallet, "isMultiSignature").mockReturnValue(false);
		jest.spyOn(wallet, "isSecondSignature").mockReturnValue(true);

		const { asFragment, getByTestId } = renderWithRouter(
			<Route path="/profiles/:profileId/wallets/:walletId">
				<WalletRegistrations onButtonClick={jest.fn()} />
			</Route>,
			{
				routes: [walletURL],
				history,
			},
		);

		expect(getByTestId("WalletRegistrations__inactive")).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();

		jest.clearAllMocks();
	});

	it("should render inactive icons without a second signature registration", () => {
		jest.spyOn(wallet, "isDelegate").mockReturnValue(true);
		jest.spyOn(wallet, "isMultiSignature").mockReturnValue(true);
		jest.spyOn(wallet, "isSecondSignature").mockReturnValue(false);

		const { asFragment, getByTestId } = renderWithRouter(
			<Route path="/profiles/:profileId/wallets/:walletId">
				<WalletRegistrations onButtonClick={jest.fn()} />
			</Route>,
			{
				routes: [walletURL],
				history,
			},
		);

		expect(getByTestId("WalletRegistrations__inactive")).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();

		jest.clearAllMocks();
	});

	it("should render inactive icons without a multisignature registration", () => {
		jest.spyOn(wallet, "isDelegate").mockReturnValue(true);
		jest.spyOn(wallet, "isMultiSignature").mockReturnValue(false);
		jest.spyOn(wallet, "isSecondSignature").mockReturnValue(true);

		const { asFragment, getByTestId } = renderWithRouter(
			<Route path="/profiles/:profileId/wallets/:walletId">
				<WalletRegistrations onButtonClick={jest.fn()} />
			</Route>,
			{
				routes: [walletURL],
				history,
			},
		);

		expect(getByTestId("WalletRegistrations__inactive")).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();

		jest.clearAllMocks();
	});

	it("should show delegate icon", () => {
		jest.spyOn(wallet, "isDelegate").mockReturnValue(true);
		jest.spyOn(wallet, "isResignedDelegate").mockReturnValue(false);

		const { asFragment, getByText } = renderWithRouter(
			<Route path="/profiles/:profileId/wallets/:walletId">
				<WalletRegistrations onButtonClick={jest.fn()} />
			</Route>,
			{
				routes: [walletURL],
				history,
			},
		);

		expect(getByText("delegate.svg")).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();

		jest.clearAllMocks();
	});

	it("should show resigned delegate icon", () => {
		jest.spyOn(wallet, "isDelegate").mockReturnValue(true);
		jest.spyOn(wallet, "isResignedDelegate").mockReturnValue(true);

		const { asFragment, getByText } = renderWithRouter(
			<Route path="/profiles/:profileId/wallets/:walletId">
				<WalletRegistrations onButtonClick={jest.fn()} />
			</Route>,
			{
				routes: [walletURL],
				history,
			},
		);

		expect(getByText("delegate-resigned.svg")).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();

		jest.clearAllMocks();
	});

	it("should render empty state", () => {
		jest.spyOn(wallet, "isDelegate").mockReturnValue(false);
		jest.spyOn(wallet, "isMultiSignature").mockReturnValue(false);
		jest.spyOn(wallet, "isSecondSignature").mockReturnValue(false);

		const { asFragment, getByTestId } = renderWithRouter(
			<Route path="/profiles/:profileId/wallets/:walletId">
				<WalletRegistrations onButtonClick={jest.fn()} />
			</Route>,
			{
				routes: [walletURL],
				history,
			},
		);

		expect(getByTestId("WalletRegistrations__empty")).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();

		jest.clearAllMocks();
	});
});
