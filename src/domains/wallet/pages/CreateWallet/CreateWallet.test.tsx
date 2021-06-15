/* eslint-disable @typescript-eslint/require-await */
import { BIP39 } from "@arkecosystem/platform-sdk-crypto";
import { Contracts } from "@arkecosystem/platform-sdk-profiles";
import { act } from "@testing-library/react-hooks";
import { translations as walletTranslations } from "domains/wallet/i18n";
import { createMemoryHistory } from "history";
import React from "react";
import { Route } from "react-router-dom";
import {
	act as actAsync,
	env,
	fireEvent,
	getDefaultProfileId,
	renderWithRouter,
	screen,
	waitFor,
} from "utils/testing-library";

import { CreateWallet } from "./CreateWallet";

jest.setTimeout(8000);

let profile: Contracts.IProfile;
let bip39GenerateMock: any;

const fixtureProfileId = getDefaultProfileId();
const passphrase = "power return attend drink piece found tragic fire liar page disease combine";

describe("CreateWallet", () => {
	beforeAll(() => {
		bip39GenerateMock = jest.spyOn(BIP39, "generate").mockReturnValue(passphrase);
	});

	afterAll(() => {
		bip39GenerateMock.mockRestore();
	});

	beforeEach(() => {
		profile = env.profiles().findById(fixtureProfileId);

		for (const wallet of profile.wallets().values()) {
			profile.wallets().forget(wallet.id());
		}

		bip39GenerateMock = jest.spyOn(BIP39, "generate").mockReturnValue(passphrase);
	});

	afterEach(() => {
		bip39GenerateMock.mockRestore();
	});

	it.each([
		["with alias", "Test Wallet"],
		["without alias", undefined],
	])("should create a wallet %s", async (type, alias) => {
		const history = createMemoryHistory();
		const createURL = `/profiles/${fixtureProfileId}/wallets/create`;
		history.push(createURL);

		const { queryAllByText, getByTestId, getByText, asFragment } = renderWithRouter(
			<Route path="/profiles/:profileId/wallets/create">
				<CreateWallet />
			</Route>,
			{
				routes: [createURL],
				history,
			},
		);

		await waitFor(() => expect(getByTestId("NetworkStep")).toBeTruthy());
		expect(asFragment()).toMatchSnapshot();

		const selectNetworkInput = getByTestId("SelectNetworkInput__input");
		const continueButton = getByTestId("CreateWallet__continue-button");
		const backButton = getByTestId("CreateWallet__back-button");

		const historySpy = jest.spyOn(history, "push").mockImplementation();

		expect(backButton).not.toHaveAttribute("disabled");
		act(() => {
			fireEvent.click(backButton);
		});

		expect(historySpy).toHaveBeenCalledWith(`/profiles/${fixtureProfileId}/dashboard`);

		act(() => {
			fireEvent.change(selectNetworkInput, { target: { value: "Ark Dev" } });
			fireEvent.keyDown(selectNetworkInput, { key: "Enter", code: 13 });
		});
		await waitFor(() => expect(continueButton).not.toHaveAttribute("disabled"));

		act(() => {
			fireEvent.change(selectNetworkInput, { target: { value: "" } });
		});
		await waitFor(() => expect(continueButton).toHaveAttribute("disabled"));

		act(() => {
			fireEvent.change(selectNetworkInput, { target: { value: "Ark Dev" } });
			fireEvent.keyDown(selectNetworkInput, { key: "Enter", code: 13 });
		});

		await waitFor(() => expect(continueButton).not.toHaveAttribute("disabled"));

		act(() => {
			fireEvent.click(continueButton);
		});

		await waitFor(() => expect(profile.wallets().values().length).toBe(1));

		await waitFor(() => expect(getByTestId("CreateWallet__WalletOverviewStep")).toBeTruthy());

		act(() => {
			fireEvent.click(backButton);
		});

		await waitFor(() => expect(getByTestId("NetworkStep")).toBeTruthy());

		act(() => {
			fireEvent.click(continueButton);
		});

		await waitFor(() => expect(getByTestId("CreateWallet__WalletOverviewStep")).toBeTruthy());

		act(() => {
			fireEvent.click(continueButton);
		});

		await waitFor(() => expect(getByTestId("CreateWallet__ConfirmPassphraseStep")).toBeTruthy());

		act(() => {
			fireEvent.click(backButton);
		});

		await waitFor(() => expect(getByTestId("CreateWallet__WalletOverviewStep")).toBeTruthy());

		act(() => {
			fireEvent.click(continueButton);
		});

		await waitFor(() => expect(getByTestId("CreateWallet__ConfirmPassphraseStep")).toBeTruthy());

		const walletMnemonic = passphrase.split(" ");
		for (let i = 0; i < 3; i++) {
			const wordNumber = parseInt(getByText(/Select the/).innerHTML.replace(/Select the/, ""));

			await actAsync(async () => {
				fireEvent.click(getByText(walletMnemonic[wordNumber - 1]));
				if (i < 2) {
					await waitFor(() => expect(queryAllByText(/The #([0-9]+) word/).length === 2 - i));
				}
			});
		}
		await waitFor(() => expect(continueButton).not.toHaveAttribute("disabled"));

		act(() => {
			fireEvent.click(continueButton);
		});

		await waitFor(() => expect(getByTestId("EncryptPassword")).toBeTruthy());

		act(() => {
			fireEvent.click(getByTestId("CreateWallet__skip-button"));
		});

		await waitFor(() => expect(getByTestId("CreateWallet__SuccessStep")).toBeTruthy());

		act(() => {
			fireEvent.click(backButton);
		});

		await waitFor(() => expect(getByTestId("EncryptPassword")).toBeTruthy());

		act(() => {
			fireEvent.click(getByTestId("CreateWallet__skip-button"));
		});

		await waitFor(() => expect(getByTestId("CreateWallet__SuccessStep")).toBeTruthy());

		act(() => {
			if (alias) {
				fireEvent.change(getByTestId("CreateWallet__wallet-name"), { target: { value: alias } });
			}

			fireEvent.click(getByTestId("CreateWallet__save-button"));
		});

		const wallet = profile.wallets().first();

		await waitFor(() =>
			expect(historySpy).toHaveBeenCalledWith(`/profiles/${profile.id()}/wallets/${wallet.id()}`),
		);

		expect(wallet.alias()).toEqual(alias);

		expect(asFragment()).toMatchSnapshot();

		historySpy.mockRestore();
	});

	it("should not have a pending wallet if leaving on step 1", async () => {
		const history = createMemoryHistory();
		const createURL = `/profiles/${fixtureProfileId}/wallets/create`;
		history.push(createURL);

		const { getByTestId, asFragment } = renderWithRouter(
			<Route path="/profiles/:profileId/wallets/create">
				<CreateWallet />
			</Route>,
			{
				routes: [createURL, "/"],
				history,
			},
		);
		await waitFor(() => expect(getByTestId("NetworkStep")).toBeTruthy());

		history.push("/");
		await waitFor(() => expect(profile.wallets().values().length).toBe(0));

		expect(asFragment()).toMatchSnapshot();
	});

	it("should remove pending wallet if not submitted", async () => {
		const history = createMemoryHistory();
		const createURL = `/profiles/${fixtureProfileId}/wallets/create`;
		history.push(createURL);

		const { getByTestId, asFragment } = renderWithRouter(
			<Route path="/profiles/:profileId/wallets/create">
				<CreateWallet />
			</Route>,
			{
				routes: [createURL, "/"],
				history,
			},
		);
		await waitFor(() => expect(getByTestId("NetworkStep")).toBeTruthy());

		const selectNetworkInput = getByTestId("SelectNetworkInput__input");
		const continueButton = getByTestId("CreateWallet__continue-button");
		expect(asFragment()).toMatchSnapshot();

		act(() => {
			fireEvent.change(selectNetworkInput, { target: { value: "Ark Dev" } });
			fireEvent.keyDown(selectNetworkInput, { key: "Enter", code: 13 });
		});
		await waitFor(() => expect(continueButton).not.toHaveAttribute("disabled"));

		act(() => {
			fireEvent.click(continueButton);
		});

		await waitFor(() => expect(getByTestId("CreateWallet__WalletOverviewStep")).toBeTruthy());

		act(() => {
			fireEvent.click(getByTestId("CreateWallet__back-button"));
		});

		await waitFor(() => expect(getByTestId("NetworkStep")).toBeTruthy());

		act(() => {
			fireEvent.click(continueButton);
		});

		await waitFor(() => expect(getByTestId("CreateWallet__WalletOverviewStep")).toBeTruthy());

		act(() => {
			history.push("/");
		});
		await waitFor(() => expect(profile.wallets().values().length).toBe(0));

		expect(asFragment()).toMatchSnapshot();
	});

	it("should show an error message if wallet generation failed", async () => {
		bip39GenerateMock.mockRestore();
		bip39GenerateMock = jest.spyOn(BIP39, "generate").mockImplementation(() => {
			throw new Error("test");
		});

		const history = createMemoryHistory();
		const createURL = `/profiles/${fixtureProfileId}/wallets/create`;
		history.push(createURL);

		const { asFragment } = renderWithRouter(
			<Route path="/profiles/:profileId/wallets/create">
				<CreateWallet />
			</Route>,
			{
				routes: [createURL, "/"],
				history,
			},
		);

		await waitFor(() => expect(screen.getByTestId("NetworkStep")).toBeTruthy());

		const selectNetworkInput = screen.getByTestId("SelectNetworkInput__input");

		await actAsync(async () => {
			fireEvent.change(selectNetworkInput, { target: { value: "ARK D" } });
		});

		await actAsync(async () => {
			fireEvent.keyDown(selectNetworkInput, { key: "Enter", code: 13 });
		});

		expect(selectNetworkInput).toHaveValue("ARK Devnet");

		const continueButton = screen.getByTestId("CreateWallet__continue-button");

		await waitFor(() => {
			expect(continueButton).not.toBeDisabled();
		});

		actAsync(() => {
			fireEvent.click(continueButton);
		});

		await waitFor(() =>
			expect(screen.getByText(walletTranslations.PAGE_CREATE_WALLET.NETWORK_STEP.GENERATION_ERROR)).toBeTruthy(),
		);

		expect(asFragment()).toMatchSnapshot();

		bip39GenerateMock.mockRestore();
	});

	it("should show an error message for duplicate name", async () => {
		const wallet = await profile.walletFactory().fromAddress({
			address: "D8rr7B1d6TL6pf14LgMz4sKp1VBMs6YUYD",
			coin: "ARK",
			network: "ark.devnet",
		});

		profile.wallets().push(wallet);
		wallet.settings().set(Contracts.WalletSetting.Alias, "Test");

		const history = createMemoryHistory();
		const createURL = `/profiles/${fixtureProfileId}/wallets/create`;
		history.push(createURL);

		const { queryAllByText, getByTestId, getByText, asFragment } = renderWithRouter(
			<Route path="/profiles/:profileId/wallets/create">
				<CreateWallet />
			</Route>,
			{
				routes: [createURL],
				history,
			},
		);

		await waitFor(() => expect(getByTestId("NetworkStep")).toBeTruthy());
		expect(asFragment()).toMatchSnapshot();

		const selectNetworkInput = getByTestId("SelectNetworkInput__input");
		const continueButton = getByTestId("CreateWallet__continue-button");

		act(() => {
			fireEvent.change(selectNetworkInput, { target: { value: "Ark Dev" } });
			fireEvent.keyDown(selectNetworkInput, { key: "Enter", code: 13 });
		});
		await waitFor(() => expect(continueButton).not.toHaveAttribute("disabled"));

		act(() => {
			fireEvent.change(selectNetworkInput, { target: { value: "" } });
		});
		await waitFor(() => expect(continueButton).toHaveAttribute("disabled"));

		act(() => {
			fireEvent.change(selectNetworkInput, { target: { value: "Ark Dev" } });
			fireEvent.keyDown(selectNetworkInput, { key: "Enter", code: 13 });
		});
		await waitFor(() => expect(continueButton).not.toHaveAttribute("disabled"));

		act(() => {
			fireEvent.click(continueButton);
		});

		await waitFor(() => expect(getByTestId("CreateWallet__WalletOverviewStep")).toBeTruthy());

		act(() => {
			fireEvent.click(continueButton);
		});

		await waitFor(() => expect(getByTestId("CreateWallet__ConfirmPassphraseStep")).toBeTruthy());

		const walletMnemonic = passphrase.split(" ");
		for (let i = 0; i < 3; i++) {
			const wordNumber = parseInt(getByText(/Select the/).innerHTML.replace(/Select the/, ""));

			await actAsync(async () => {
				fireEvent.click(getByText(walletMnemonic[wordNumber - 1]));
				if (i < 2) {
					await waitFor(() => expect(queryAllByText(/The #([0-9]+) word/).length === 2 - i));
				}
			});
		}
		await waitFor(() => expect(continueButton).not.toHaveAttribute("disabled"));

		act(() => {
			fireEvent.click(continueButton);
		});

		await waitFor(() => expect(getByTestId("EncryptPassword")).toBeTruthy());

		act(() => {
			fireEvent.click(getByTestId("CreateWallet__skip-button"));
		});

		await waitFor(() => expect(getByTestId("CreateWallet__SuccessStep")).toBeTruthy());

		const walletNameInput = getByTestId("CreateWallet__wallet-name");
		expect(walletNameInput).toBeTruthy();

		act(() => {
			fireEvent.input(walletNameInput, { target: { value: "Test" } });
		});

		const submitButton = getByTestId("CreateWallet__save-button");

		expect(submitButton).toBeTruthy();
		await waitFor(() => {
			expect(submitButton).toBeDisabled();
		});
	});
});
