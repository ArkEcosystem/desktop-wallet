import { ARK } from "@arkecosystem/platform-sdk-ark";
import { BIP39 } from "@arkecosystem/platform-sdk-crypto";
import { Environment, Profile, WalletSetting } from "@arkecosystem/platform-sdk-profiles";
import { act, renderHook } from "@testing-library/react-hooks";
import { EnvironmentProvider } from "app/contexts";
import { httpClient } from "app/services";
import { availableNetworksMock } from "domains/network/data";
import { createMemoryHistory } from "history";
import React from "react";
import { FormContext, useForm } from "react-hook-form";
import { Route } from "react-router-dom";
import envFixture from "tests/fixtures/env/data.json";
import { mockArkHttp, StubStorage } from "tests/mocks";
import { fireEvent, render, renderWithRouter, waitFor } from "utils/testing-library";

import { CreateWallet, FirstStep, FourthStep, SecondStep, ThirdStep } from "./CreateWallet";

let env: Environment;
let profile: Profile;
let bip39GenerateMock: any;

const passphrase = "power return attend drink piece found tragic fire liar page disease combine";

beforeAll(() => {
	mockArkHttp();

	bip39GenerateMock = jest.spyOn(BIP39, "generate").mockReturnValue(passphrase);
});

afterAll(() => {
	bip39GenerateMock.mockRestore();
});

describe("CreateWallet", () => {
	beforeEach(async () => {
		env = new Environment({ coins: { ARK }, httpClient: httpClient, storage: new StubStorage() });
		await env.bootFromObject(envFixture);
		profile = env.profiles().findById("bob");
	});

	it("should render 1st step", () => {
		const { result: form } = renderHook(() => useForm());
		const { getByTestId, asFragment } = render(
			<FormContext {...form.current}>
				<FirstStep env={env} profile={profile} />
			</FormContext>,
		);

		expect(getByTestId(`CreateWallet__first-step`)).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();

		const selectAssetsInput = getByTestId("SelectNetworkInput__input");
		expect(selectAssetsInput).toBeTruthy();

		act(() => {
			fireEvent.change(selectAssetsInput, { target: { value: "ARK" } });
		});

		act(() => {
			fireEvent.keyDown(selectAssetsInput, { key: "Enter", code: 13 });
		});

		expect(selectAssetsInput).toHaveValue("Ark");
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
		// @ts-ignore
		navigator.clipboard = { writeText: writeTextMock };

		fireEvent.click(getByTestId(`CreateWallet__copy`));
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

		expect(getByTestId(`CreateWallet__third-step`)).toBeTruthy();
		expect(getAllByTestId(`MnemonicVerificationOptions__button`).length).toBeGreaterThan(1);

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

		expect(getByTestId(`CreateWallet__fourth-step`)).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();

		expect(getByTestId(`CreateWallet__network-name`)).toHaveTextContent("Ark");
		expect(getByTestId(`CreateWallet__wallet-address`)).toHaveTextContent("TEST-WALLET-ADDRESS");

		const walletNameInput = getByTestId("CreateWallet__wallet-name");

		// Submit
		act(() => {
			fireEvent.change(walletNameInput, { target: { value: "Test" } });
		});

		expect(form.current.getValues()).toEqual({ name: "Test" });
	});

	it("should render", async () => {
		const history = createMemoryHistory();
		const createURL = "/profiles/bob/wallets/create";
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

		await waitFor(() => expect(getByTestId(`CreateWallet__first-step`)).toBeTruthy());
		expect(asFragment()).toMatchSnapshot();

		const selectAssetsInput = getByTestId("SelectNetworkInput__input");
		await act(async () => {
			const continueButton = getByTestId("CreateWallet__continue-button");
			const backButton = getByTestId("CreateWallet__back-button");

			// Navigation between steps
			fireEvent.change(selectAssetsInput, { target: { value: "ARK" } });
			fireEvent.keyDown(selectAssetsInput, { key: "Enter", code: 13 });
			await waitFor(() => expect(continueButton).not.toHaveAttribute("disabled"));

			const previousWalletId = profile.wallets().values()[0].id();
			fireEvent.change(selectAssetsInput, { target: { value: "" } });
			await waitFor(() => expect(continueButton).toHaveAttribute("disabled"));

			fireEvent.change(selectAssetsInput, { target: { value: "ARK" } });
			fireEvent.keyDown(selectAssetsInput, { key: "Enter", code: 13 });
			await waitFor(() => expect(continueButton).not.toHaveAttribute("disabled"));

			await waitFor(() => expect(profile.wallets().values().length).toBe(1));
			await waitFor(() => expect(profile.wallets().values()[0].id()).not.toEqual(previousWalletId));

			fireEvent.click(continueButton);
			await waitFor(() => expect(getByTestId(`CreateWallet__second-step`)).toBeTruthy());

			fireEvent.click(backButton);
			await waitFor(() => expect(getByTestId(`CreateWallet__first-step`)).toBeTruthy());

			fireEvent.click(continueButton);
			await waitFor(() => expect(getByTestId(`CreateWallet__second-step`)).toBeTruthy());

			fireEvent.click(continueButton);
			await waitFor(() => expect(getByTestId(`CreateWallet__third-step`)).toBeTruthy());

			fireEvent.click(backButton);
			await waitFor(() => expect(getByTestId(`CreateWallet__second-step`)).toBeTruthy());

			fireEvent.click(continueButton);
			await waitFor(() => expect(getByTestId(`CreateWallet__third-step`)).toBeTruthy());

			const walletMnemonic = passphrase.split(" ");
			for (let i = 0; i < 3; i++) {
				const wordNumber = parseInt(getByText(/Select word #/).innerHTML.replace(/Select word #/, ""));

				fireEvent.click(getByText(walletMnemonic[wordNumber - 1]));

				if (i < 2) {
					await waitFor(() => expect(queryAllByText(/The #([0-9]+) word/).length === 2 - i));
				}
			}

			await waitFor(() => expect(continueButton).not.toHaveAttribute("disabled"));

			fireEvent.click(continueButton);
			await waitFor(() => expect(getByTestId(`CreateWallet__fourth-step`)).toBeTruthy());

			fireEvent.click(backButton);
			await waitFor(() => expect(getByTestId(`CreateWallet__third-step`)).toBeTruthy());
			await waitFor(() => expect(continueButton).not.toHaveAttribute("disabled"));

			fireEvent.click(getByTestId("CreateWallet__continue-button"));
			await waitFor(() => expect(getByTestId(`CreateWallet__fourth-step`)).toBeTruthy());

			fireEvent.change(getByTestId("CreateWallet__wallet-name"), { target: { value: "Test Wallet" } });
			fireEvent.click(getByTestId(`CreateWallet__save-button`));

			await waitFor(() =>
				expect(profile.wallets().values()[0].settings().get(WalletSetting.Alias)).toEqual("Test Wallet"),
			);
		});

		expect(asFragment()).toMatchSnapshot();
	});

	it("should not have a pending wallet if leaving on step 1", async () => {
		const history = createMemoryHistory();
		const createURL = "/profiles/bob/wallets/create";
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
		await waitFor(() => expect(getByTestId(`CreateWallet__first-step`)).toBeTruthy());

		history.push("/");
		await waitFor(() => expect(profile.wallets().values().length).toBe(0));

		expect(asFragment()).toMatchSnapshot();
	});

	it("should remove pending wallet if not submitted", async () => {
		const history = createMemoryHistory();
		const createURL = "/profiles/bob/wallets/create";
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
		await waitFor(() => expect(getByTestId(`CreateWallet__first-step`)).toBeTruthy());

		expect(asFragment()).toMatchSnapshot();

		const selectAssetsInput = getByTestId("SelectNetworkInput__input");
		await act(async () => {
			const continueButton = getByTestId("CreateWallet__continue-button");

			// Navigation between steps
			fireEvent.change(selectAssetsInput, { target: { value: "ARK" } });
			fireEvent.keyDown(selectAssetsInput, { key: "Enter", code: 13 });
			await waitFor(() => expect(continueButton).not.toHaveAttribute("disabled"));

			fireEvent.click(continueButton);
			await waitFor(() => expect(getByTestId(`CreateWallet__second-step`)).toBeTruthy());

			fireEvent.click(getByTestId(`CreateWallet__back-button`));
			await waitFor(() => expect(getByTestId(`CreateWallet__first-step`)).toBeTruthy());

			fireEvent.click(continueButton);
			await waitFor(() => expect(getByTestId(`CreateWallet__second-step`)).toBeTruthy());

			history.push("/");
			await waitFor(() => expect(profile.wallets().values().length).toBe(0));
		});

		expect(asFragment()).toMatchSnapshot();
	});
});
