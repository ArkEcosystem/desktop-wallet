import { ARK } from "@arkecosystem/platform-sdk-ark";
import { BIP39 } from "@arkecosystem/platform-sdk-crypto";
import { Environment, Profile, WalletSetting } from "@arkecosystem/platform-sdk-profiles";
import { act, renderHook } from "@testing-library/react-hooks";
import { EnvironmentProvider } from "app/contexts";
import { httpClient } from "app/services";
import { availableNetworksMock } from "domains/network/data";
import { createMemoryHistory } from "history";
import nock from "nock";
import React from "react";
import { FormContext, useForm } from "react-hook-form";
import { Route } from "react-router-dom";
import { StubStorage } from "tests/mocks";
import {
	act as actAsync,
	fireEvent,
	getDefaultProfileId,
	render,
	renderWithRouter,
	waitFor,
} from "utils/testing-library";

import { CreateWallet, FirstStep, FourthStep, SecondStep, ThirdStep } from "./CreateWallet";

jest.setTimeout(8000);

const fixtureProfileId = getDefaultProfileId();
const fixture = {
	profiles: {
		[fixtureProfileId]: {
			id: fixtureProfileId,
			contacts: {},
			data: {},
			notifications: {},
			plugins: { data: {}, blacklist: [] },
			settings: { NAME: "John Doe" },
			wallets: {},
		},
	},
	data: {},
};

describe("CreateWallet", () => {
	let env: Environment;
	let profile: Profile;
	let bip39GenerateMock: any;

	const passphrase = "power return attend drink piece found tragic fire liar page disease combine";

	beforeAll(() => {
		nock.disableNetConnect();

		nock("https://wallets.ark.io")
			.get("/api/node/configuration")
			.reply(200, require("../../../../tests/fixtures/coins/ark/configuration.json"))
			.get("/api/peers")
			.reply(200, require("../../../../tests/fixtures/coins/ark/peers.json"))
			.get("/api/node/configuration/crypto")
			.reply(200, require("../../../../tests/fixtures/coins/ark/cryptoConfiguration.json"))
			.get("/api/node/syncing")
			.reply(200, require("../../../../tests/fixtures/coins/ark/syncing.json"))
			.persist();

		nock("https://neoscan.io")
			.get(/\/api\/main_net\/v1\/get_last_transactions_by_address\/.+/)
			.reply(200, [])
			.persist();
	});

	beforeEach(async () => {
		env = new Environment({ coins: { ARK }, httpClient: httpClient, storage: new StubStorage() });
		await env.bootFromObject(fixture);
		profile = env.profiles().findById(fixtureProfileId);

		bip39GenerateMock = jest.spyOn(BIP39, "generate").mockReturnValue(passphrase);
	});

	afterEach(() => {
		bip39GenerateMock.mockRestore();
	});

	it("should render 1st step", async () => {
		const { result: form } = renderHook(() => useForm());
		const { getByTestId, asFragment } = render(
			<FormContext {...form.current}>
				<FirstStep env={env} profile={profile} />
			</FormContext>,
		);

		expect(getByTestId("CreateWallet__first-step")).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();

		const selectAssetsInput = getByTestId("SelectNetworkInput__input");
		expect(selectAssetsInput).toBeTruthy();

		act(() => {
			fireEvent.change(selectAssetsInput, { target: { value: "ARK" } });
		});

		act(() => {
			fireEvent.keyDown(selectAssetsInput, { key: "Enter", code: 13 });
		});

		expect(selectAssetsInput).toHaveAttribute("disabled");

		expect(selectAssetsInput).toHaveValue("Ark");

		await waitFor(() => expect(selectAssetsInput).not.toHaveAttribute("disabled"));
	});

	it("should render 2nd step", async () => {
		const { result: form } = renderHook(() =>
			useForm({
				defaultValues: {
					mnemonic: "test mnemonic",
				},
			}),
		);
		const { getByTestId, asFragment } = render(
			<FormContext {...form.current}>
				<SecondStep />
			</FormContext>,
		);

		expect(getByTestId("CreateWallet__second-step")).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();

		const writeTextMock = jest.fn();
		const clipboardOriginal = navigator.clipboard;
		// @ts-ignore
		navigator.clipboard = { writeText: writeTextMock };

		act(() => {
			fireEvent.click(getByTestId(`CreateWallet__copy`));
		});

		await waitFor(() => expect(writeTextMock).toHaveBeenCalledWith("test mnemonic"));
		// @ts-ignore
		navigator.clipboard = clipboardOriginal;
	});

	it("should render 3rd step", () => {
		const { result: form } = renderHook(() =>
			useForm({
				defaultValues: {
					mnemonic: "hamster giggle left flush sock appear mule either order solve spirit neutral",
				},
			}),
		);
		const { getByTestId, getAllByTestId } = render(
			<FormContext {...form.current}>
				<ThirdStep />
			</FormContext>,
		);

		expect(getByTestId("CreateWallet__third-step")).toBeTruthy();
		expect(getAllByTestId("MnemonicVerificationOptions__button").length).toBeGreaterThan(1);

		expect(form.current.getValues()).toEqual({ verification: undefined });
	});

	it("should render 4th step", () => {
		const { result: form } = renderHook(() =>
			useForm({
				defaultValues: {
					network: availableNetworksMock[0],
					wallet: {
						address: () => "TEST-WALLET-ADDRESS",
					},
				},
			}),
		);

		const { getByTestId, asFragment } = render(
			<FormContext {...form.current}>
				<FourthStep />
			</FormContext>,
		);

		expect(getByTestId("CreateWallet__fourth-step")).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();

		expect(getByTestId("CreateWallet__network-name")).toHaveTextContent("Ark");
		expect(getByTestId("CreateWallet__wallet-address")).toHaveTextContent("TEST-WALLET-ADDRESS");

		const walletNameInput = getByTestId("CreateWallet__wallet-name");

		// Submit
		act(() => {
			fireEvent.change(walletNameInput, { target: { value: "Test" } });
		});

		expect(form.current.getValues()).toEqual({ name: "Test" });
	});

	it("should not allow quick swapping of networks", async () => {
		const history = createMemoryHistory();
		const createURL = `/profiles/${fixtureProfileId}/wallets/create`;
		history.push(createURL);

		const { queryAllByText, getAllByTestId, getByTestId, getByText, asFragment } = renderWithRouter(
			<Route path="/profiles/:profileId/wallets/create">
				<CreateWallet />
			</Route>,
			{
				routes: [createURL],
				history,
			},
		);

		await waitFor(() => expect(getByTestId(`CreateWallet__first-step`)).toBeTruthy());
		expect(asFragment()).toMatchSnapshot();

		const continueButton = getByTestId("CreateWallet__continue-button");
		const networkIcons = getAllByTestId("SelectNetwork__NetworkIcon--container");

		fireEvent.click(networkIcons[0]); // click ARK
		fireEvent.click(networkIcons[1]); // click DARK

		expect(getByTestId("SelectNetworkInput__input")).toHaveAttribute("disabled");
		for (const networkIcon of getAllByTestId("SelectNetwork__NetworkIcon--container")) {
			expect(networkIcon).toHaveAttribute("disabled");
		}
		expect(continueButton).toHaveAttribute("disabled");

		expect(getByTestId("NetworkIcon-ARK-mainnet")).toHaveClass("border-theme-success-200");

		await waitFor(() => expect(continueButton).not.toHaveAttribute("disabled"));
	});

	it("should render", async () => {
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

		await waitFor(() => expect(getByTestId("CreateWallet__first-step")).toBeTruthy());
		expect(asFragment()).toMatchSnapshot();

		const selectAssetsInput = getByTestId("SelectNetworkInput__input");
		const continueButton = getByTestId("CreateWallet__continue-button");
		const backButton = getByTestId("CreateWallet__back-button");

		act(() => {
			fireEvent.change(selectAssetsInput, { target: { value: "ARK" } });
			fireEvent.keyDown(selectAssetsInput, { key: "Enter", code: 13 });
		});
		await waitFor(() => expect(continueButton).not.toHaveAttribute("disabled"));

		act(() => {
			fireEvent.change(selectAssetsInput, { target: { value: "" } });
		});
		await waitFor(() => expect(continueButton).toHaveAttribute("disabled"));

		act(() => {
			fireEvent.change(selectAssetsInput, { target: { value: "ARK" } });
			fireEvent.keyDown(selectAssetsInput, { key: "Enter", code: 13 });
		});
		await waitFor(() => expect(continueButton).not.toHaveAttribute("disabled"));
		await waitFor(() => expect(profile.wallets().values().length).toBe(1));

		act(() => {
			fireEvent.click(continueButton);
		});

		await waitFor(() => expect(getByTestId(`CreateWallet__second-step`)).toBeTruthy());

		act(() => {
			fireEvent.click(backButton);
		});

		await waitFor(() => expect(getByTestId(`CreateWallet__first-step`)).toBeTruthy());

		act(() => {
			fireEvent.click(continueButton);
		});

		await waitFor(() => expect(getByTestId(`CreateWallet__second-step`)).toBeTruthy());

		act(() => {
			fireEvent.click(continueButton);
		});

		await waitFor(() => expect(getByTestId(`CreateWallet__third-step`)).toBeTruthy());

		act(() => {
			fireEvent.click(backButton);
		});

		await waitFor(() => expect(getByTestId(`CreateWallet__second-step`)).toBeTruthy());

		act(() => {
			fireEvent.click(continueButton);
		});

		await waitFor(() => expect(getByTestId(`CreateWallet__third-step`)).toBeTruthy());

		const walletMnemonic = passphrase.split(" ");
		for (let i = 0; i < 3; i++) {
			const wordNumber = parseInt(getByText(/Select word #/).innerHTML.replace(/Select word #/, ""));

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

		await waitFor(() => expect(getByTestId(`CreateWallet__fourth-step`)).toBeTruthy());

		act(() => {
			fireEvent.click(backButton);
		});

		await waitFor(() => expect(getByTestId(`CreateWallet__third-step`)).toBeTruthy());
		await waitFor(() => expect(continueButton).not.toHaveAttribute("disabled"));

		act(() => {
			fireEvent.click(getByTestId("CreateWallet__continue-button"));
		});

		await waitFor(() => expect(getByTestId(`CreateWallet__fourth-step`)).toBeTruthy());

		const historySpy = jest.spyOn(history, "push");
		act(() => {
			fireEvent.change(getByTestId("CreateWallet__wallet-name"), { target: { value: "Test Wallet" } });
			fireEvent.click(getByTestId(`CreateWallet__save-button`));
		});

		await waitFor(() => expect(historySpy).toHaveBeenCalledWith(`/profiles/${profile?.id()}/dashboard`));
		expect(profile.wallets().values()[0].settings().get(WalletSetting.Alias)).toEqual("Test Wallet");

		expect(asFragment()).toMatchSnapshot();
	});

	it("should not have a pending wallet if leaving on step 1", async () => {
		const history = createMemoryHistory();
		const createURL = `/profiles/${fixtureProfileId}/wallets/create`;
		history.push(createURL);

		const { getByTestId, asFragment } = renderWithRouter(
			<EnvironmentProvider env={env}>
				<Route path="/profiles/:profileId/wallets/create">
					<CreateWallet />
				</Route>
			</EnvironmentProvider>,
			{
				routes: [createURL, "/"],
				history,
			},
		);
		await waitFor(() => expect(getByTestId("CreateWallet__first-step")).toBeTruthy());

		history.push("/");
		await waitFor(() => expect(profile.wallets().values().length).toBe(0));

		expect(asFragment()).toMatchSnapshot();
	});

	it("should remove pending wallet if not submitted", async () => {
		const history = createMemoryHistory();
		const createURL = `/profiles/${fixtureProfileId}/wallets/create`;
		history.push(createURL);

		const { getByTestId, asFragment } = renderWithRouter(
			<EnvironmentProvider env={env}>
				<Route path="/profiles/:profileId/wallets/create">
					<CreateWallet />
				</Route>
			</EnvironmentProvider>,
			{
				routes: [createURL, "/"],
				history,
			},
		);
		await waitFor(() => expect(getByTestId("CreateWallet__first-step")).toBeTruthy());

		const selectAssetsInput = getByTestId("SelectNetworkInput__input");
		const continueButton = getByTestId("CreateWallet__continue-button");
		expect(asFragment()).toMatchSnapshot();

		act(() => {
			fireEvent.change(selectAssetsInput, { target: { value: "ARK" } });
			fireEvent.keyDown(selectAssetsInput, { key: "Enter", code: 13 });
		});
		await waitFor(() => expect(continueButton).not.toHaveAttribute("disabled"));

		act(() => {
			fireEvent.click(continueButton);
		});

		await waitFor(() => expect(getByTestId(`CreateWallet__second-step`)).toBeTruthy());

		act(() => {
			fireEvent.click(getByTestId(`CreateWallet__back-button`));
		});

		await waitFor(() => expect(getByTestId(`CreateWallet__first-step`)).toBeTruthy());

		act(() => {
			fireEvent.click(continueButton);
		});

		await waitFor(() => expect(getByTestId(`CreateWallet__second-step`)).toBeTruthy());

		act(() => {
			history.push("/");
		});
		await waitFor(() => expect(profile.wallets().values().length).toBe(0));

		expect(asFragment()).toMatchSnapshot();
	});
});
