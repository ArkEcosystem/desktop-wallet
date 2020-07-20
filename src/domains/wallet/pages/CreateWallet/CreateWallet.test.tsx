/* eslint-disable @typescript-eslint/require-await */
import { ARK } from "@arkecosystem/platform-sdk-ark";
import { BIP39 } from "@arkecosystem/platform-sdk-crypto";
import { Environment, Profile, WalletSetting } from "@arkecosystem/platform-sdk-profiles";
import { act, renderHook } from "@testing-library/react-hooks";
import { EnvironmentProvider } from "app/contexts";
import { httpClient } from "app/services";
import { createMemoryHistory } from "history";
import nock from "nock";
import React from "react";
import { FormContext, useForm } from "react-hook-form";
import { Route } from "react-router-dom";
import { fireEvent, render, RenderResult, renderWithRouter, waitFor } from "testing-library";
import { profiles } from "tests/fixtures/env/data";
import { StubStorage } from "tests/mocks";

import { networks } from "../../data";
import { CreateWallet, FirstStep, FourthStep, SecondStep, ThirdStep } from "./CreateWallet";

let env: Environment;
let profile: Profile;
let bip39GenerateMock: any;

const passphrase = "power return attend drink piece found tragic fire liar page disease combine";

beforeAll(() => {
	nock.disableNetConnect();

	nock(/.+/)
		.get("/api/node/configuration/crypto")
		.reply(200, require("../../../../tests/fixtures/coins/ark/cryptoConfiguration.json"))
		.get("/api/node/syncing")
		.reply(200, require("../../../../tests/fixtures/coins/ark/syncing.json"))
		.get(/\/api\/main_net\/v1\/get_last_transactions_by_address\/.+/)
		.reply(200, [])
		.persist();
});

describe("CreateWallet", () => {
	beforeEach(async () => {
		env = new Environment({
			coins: { ARK },
			httpClient,
			storage: new StubStorage(),
		});

		await env.bootFromObject({ data: {}, profiles });

		profile = env.profiles().findById("bob");

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

		expect(getByTestId(`CreateWallet__first-step`)).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();

		const selectAssetsInput = getByTestId("select-asset__input");
		expect(selectAssetsInput).toBeTruthy();

		await act(async () => {
			fireEvent.change(selectAssetsInput, { target: { value: "ARK" } });
		});

		await act(async () => {
			fireEvent.keyDown(selectAssetsInput, { key: "Enter", code: 13 });
		});

		expect(getByTestId("select-asset__selected-ARK - Mainnet")).toBeTruthy();
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

		expect(getByTestId(`CreateWallet__second-step`)).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();

		const writeTextMock = jest.fn();
		const clipboardOriginal = navigator.clipboard;
		navigator.clipboard = { writeText: writeTextMock };

		fireEvent.click(getByTestId(`CreateWallet__copy`));
		await waitFor(async () => {
			expect(writeTextMock).toHaveBeenCalledWith("test mnemonic");
		});
		navigator.clipboard = clipboardOriginal;
	});

	it("should render 3rd step", async () => {
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

		expect(getByTestId(`CreateWallet__third-step`)).toBeTruthy();
		expect(getAllByTestId(`MnemonicVerificationOptions__button`).length).toBeGreaterThan(1);

		expect(form.current.getValues()).toEqual({ verification: undefined });
	});

	it("should render 4th step", async () => {
		const { result: form } = renderHook(() =>
			useForm({
				defaultValues: {
					network: networks[0],
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

		expect(getByTestId(`CreateWallet__fourth-step`)).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();

		expect(getByTestId(`CreateWallet__network-name`)).toHaveTextContent(networks[0].name);
		expect(getByTestId(`CreateWallet__wallet-address`)).toHaveTextContent("TEST-WALLET-ADDRESS");

		const walletNameInput = getByTestId("CreateWallet__wallet-name");

		// Submit
		await act(async () => {
			fireEvent.change(walletNameInput, { target: { value: "Test" } });
		});

		expect(form.current.getValues()).toEqual({ name: "Test" });
	});

	it("should render", async () => {
		let rendered: RenderResult;
		const history = createMemoryHistory();
		const createURL = "/profiles/bob/wallets/create";
		history.push(createURL);

		await act(async () => {
			rendered = renderWithRouter(
				<EnvironmentProvider env={env}>
					<Route path="/profiles/:profileId/wallets/create">
						<CreateWallet />
					</Route>
				</EnvironmentProvider>,
				{
					routes: [createURL],
					history,
				},
			);

			await waitFor(() => expect(rendered.getByTestId(`CreateWallet__first-step`)).toBeTruthy());
		});

		const { findAllByText, getByTestId, getByText, asFragment } = rendered!;

		expect(asFragment()).toMatchSnapshot();

		const selectAssetsInput = getByTestId("select-asset__input");
		await act(async () => {
			const continueButton = getByTestId("CreateWallet__continue-button");

			// Navigation between steps
			fireEvent.change(selectAssetsInput, { target: { value: "ARK" } });
			fireEvent.keyDown(selectAssetsInput, { key: "Enter", code: 13 });
			await waitFor(() => expect(continueButton).not.toHaveAttribute("disabled"));

			const previousWalletId = profile.wallets().values()[0].id();
			fireEvent.change(selectAssetsInput, { target: { value: "ARK" } });
			fireEvent.keyDown(selectAssetsInput, { key: "Enter", code: 13 });
			await waitFor(() => expect(continueButton).not.toHaveAttribute("disabled"));
			await waitFor(() => expect(profile.wallets().values().length).toBe(1));
			await waitFor(() => expect(profile.wallets().values()[0].id()).not.toEqual(previousWalletId));

			fireEvent.click(continueButton);
			await waitFor(() => expect(getByTestId(`CreateWallet__second-step`)).toBeTruthy());

			fireEvent.click(getByTestId(`CreateWallet__back-button`));
			await waitFor(() => expect(rendered.getByTestId(`CreateWallet__first-step`)).toBeTruthy());

			fireEvent.click(continueButton);
			await waitFor(() => expect(getByTestId(`CreateWallet__second-step`)).toBeTruthy());

			fireEvent.click(continueButton);
			await waitFor(() => expect(getByTestId(`CreateWallet__third-step`)).toBeTruthy());

			const walletMnemonic = passphrase.split(" ");
			for (let i = 0; i < 3; i++) {
				const wordNumber = getByText(/Select word #/).innerHTML.replace(/Select word #/, "");

				fireEvent.click(getByText(walletMnemonic[wordNumber - 1]));

				if (i < 2) {
					await waitFor(async () => (await findAllByText(/The #([0-9]+) word/)).length === 2 - i);
				}
			}

			await waitFor(() => expect(continueButton).not.toHaveAttribute("disabled"));

			fireEvent.click(continueButton);
			await waitFor(() => expect(getByTestId(`CreateWallet__fourth-step`)).toBeTruthy());

			await fireEvent.change(getByTestId("CreateWallet__wallet-name"), { target: { value: "Test Wallet" } });
			await fireEvent.click(getByTestId(`CreateWallet__save-button`));

			await waitFor(() =>
				expect(profile.wallets().values()[0].settings().get(WalletSetting.Alias)).toEqual("Test Wallet"),
			);
		});

		expect(asFragment()).toMatchSnapshot();
	});

	it("should not have a pending wallet if leaving on step 1", async () => {
		let rendered: RenderResult;
		const history = createMemoryHistory();
		const createURL = "/profiles/bob/wallets/create";
		history.push(createURL);

		await act(async () => {
			rendered = renderWithRouter(
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

			await waitFor(() => expect(rendered.getByTestId(`CreateWallet__first-step`)).toBeTruthy());
		});

		const { getByTestId, asFragment } = rendered!;

		history.push("/");
		await waitFor(() => expect(profile.wallets().values().length).toBe(0));

		expect(asFragment()).toMatchSnapshot();
	});

	it("should remove pending wallet if not submitted", async () => {
		let rendered: RenderResult;
		const history = createMemoryHistory();
		const createURL = "/profiles/bob/wallets/create";
		history.push(createURL);

		await act(async () => {
			rendered = renderWithRouter(
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

			await waitFor(() => expect(rendered.getByTestId(`CreateWallet__first-step`)).toBeTruthy());
		});

		const { getByTestId, asFragment } = rendered!;

		expect(asFragment()).toMatchSnapshot();

		const selectAssetsInput = getByTestId("select-asset__input");
		await act(async () => {
			const continueButton = getByTestId("CreateWallet__continue-button");

			// Navigation between steps
			fireEvent.change(selectAssetsInput, { target: { value: "ARK" } });
			fireEvent.keyDown(selectAssetsInput, { key: "Enter", code: 13 });
			await waitFor(() => expect(continueButton).not.toHaveAttribute("disabled"));

			fireEvent.click(continueButton);
			await waitFor(() => expect(getByTestId(`CreateWallet__second-step`)).toBeTruthy());

			fireEvent.click(getByTestId(`CreateWallet__back-button`));
			await waitFor(() => expect(rendered.getByTestId(`CreateWallet__first-step`)).toBeTruthy());

			fireEvent.click(continueButton);
			await waitFor(() => expect(getByTestId(`CreateWallet__second-step`)).toBeTruthy());

			history.push("/");
			await waitFor(() => expect(profile.wallets().values().length).toBe(0));
		});

		expect(asFragment()).toMatchSnapshot();
	});
});
