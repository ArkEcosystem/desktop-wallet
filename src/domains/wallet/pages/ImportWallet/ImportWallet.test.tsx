/* eslint-disable @typescript-eslint/require-await */
import { Profile } from "@arkecosystem/platform-sdk-profiles";
import { act, renderHook } from "@testing-library/react-hooks";
import { translations as commonTranslations } from "app/i18n/common/i18n";
import { createMemoryHistory } from "history";
import nock from "nock";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { Route } from "react-router-dom";
import {
	act as actAsync,
	env,
	fireEvent,
	getDefaultProfileId,
	render,
	RenderResult,
	renderWithRouter,
	waitFor,
} from "testing-library";

import { ImportWallet } from "./ImportWallet";
import { FirstStep } from "./Step1";
import { SecondStep } from "./Step2";
import { ThirdStep } from "./Step3";

let profile: Profile;
const fixtureProfileId = getDefaultProfileId();

const identityAddress = "DC8ghUdhS8w8d11K8cFQ37YsLBFhL3Dq2P";
const mnemonic = "buddy year cost vendor honey tonight viable nut female alarm duck symptom";
const randomAddress = "D61mfSggzbvQgTUe6JhYKH2doHaqJ3Dyib";

const route = `/profiles/${fixtureProfileId}/wallets/import`;

describe("ImportWallet", () => {
	beforeAll(() => {
		nock.disableNetConnect();

		nock("https://dwallets.ark.io")
			.get("/api/wallets/DC8ghUdhS8w8d11K8cFQ37YsLBFhL3Dq2P")
			.reply(200, require("tests/fixtures/coins/ark/wallets/DC8ghUdhS8w8d11K8cFQ37YsLBFhL3Dq2P.json"))
			.persist();
	});

	beforeEach(() => {
		profile = env.profiles().findById(fixtureProfileId);

		const walletId = profile.wallets().findByAddress(randomAddress)?.id();

		if (walletId) {
			profile.wallets().forget(walletId);
		}
	});

	it("should render 1st step", async () => {
		const { result: form } = renderHook(() => useForm());
		const { getByTestId, asFragment } = render(
			<FormProvider {...form.current}>
				<FirstStep />
			</FormProvider>,
		);

		expect(getByTestId("ImportWallet__first-step")).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();

		const selectNetworkInput = getByTestId("SelectNetworkInput__input");
		expect(selectNetworkInput).toBeTruthy();

		await act(async () => {
			fireEvent.change(selectNetworkInput, { target: { value: "ARK D" } });
		});

		await act(async () => {
			fireEvent.keyDown(selectNetworkInput, { key: "Enter", code: 13 });
		});

		expect(selectNetworkInput).toHaveValue("ARK Devnet");
	});

	it("should render 2st step", async () => {
		const { result: form } = renderHook(() =>
			useForm({
				defaultValues: {
					network: {
						id: () => "ark.devnet",
						coin: () => "ARK",
					},
				},
			}),
		);
		const { getByTestId, asFragment } = render(
			<FormProvider {...form.current}>
				<SecondStep profile={profile} />
			</FormProvider>,
		);

		expect(getByTestId("ImportWallet__second-step")).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();

		const addressToggle = getByTestId("ImportWallet__address-toggle");
		expect(addressToggle).toBeTruthy();

		const passphraseInput = getByTestId("ImportWallet__passphrase-input");
		expect(passphraseInput).toBeTruthy();

		act(() => {
			fireEvent.change(passphraseInput, { target: { value: mnemonic } });
		});

		await waitFor(() => {
			expect(form.current.getValues()).toEqual({ passphrase: mnemonic });
		});

		act(() => {
			fireEvent.click(addressToggle);
		});

		await waitFor(() => {
			const addressInput = getByTestId("ImportWallet__address-input");
			expect(addressInput).toBeTruthy();
		});
	});

	it("should render 3st step", async () => {
		const { result: form } = renderHook(() =>
			useForm({
				defaultValues: {
					network: {
						id: () => "ark.devnet",
						coin: () => "ARK",
					},
				},
			}),
		);
		const { getByTestId, asFragment } = render(
			<FormProvider {...form.current}>
				<ThirdStep address={identityAddress} nameMaxLength={42} />
			</FormProvider>,
		);

		expect(getByTestId("ImportWallet__third-step")).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();

		expect(getByTestId("ImportWallet__network-name")).toHaveTextContent("ARK Devnet");
		expect(getByTestId("ImportWallet__wallet-address")).toHaveTextContent(identityAddress);

		const walletNameInput = getByTestId("ImportWallet__name-input");

		await act(async () => {
			fireEvent.change(walletNameInput, { target: { value: "Test" } });
		});

		expect(form.current.getValues()).toEqual({ name: "Test" });
	});

	it("should go to previous step", async () => {
		const history = createMemoryHistory();
		history.push(route);

		let rendered: RenderResult;

		await actAsync(async () => {
			rendered = renderWithRouter(
				<Route path="/profiles/:profileId/wallets/import">
					<ImportWallet />
				</Route>,
				{
					routes: [route],
					history,
				},
			);
			await waitFor(() => expect(rendered.getByTestId("ImportWallet__first-step")).toBeTruthy());
		});

		const { getByTestId, asFragment } = rendered;

		expect(asFragment()).toMatchSnapshot();

		await actAsync(async () => {
			const selectNetworkInput = getByTestId("SelectNetworkInput__input");
			expect(selectNetworkInput).toBeTruthy();

			await fireEvent.change(selectNetworkInput, { target: { value: "ARK D" } });
			await fireEvent.keyDown(selectNetworkInput, { key: "Enter", code: 13 });

			expect(selectNetworkInput).toHaveValue("ARK Devnet");

			const continueButton = getByTestId("ImportWallet__continue-button");
			expect(continueButton).toBeTruthy();
			expect(continueButton).not.toHaveAttribute("disabled");

			await fireEvent.click(continueButton);

			await waitFor(() => {
				expect(getByTestId("ImportWallet__second-step")).toBeTruthy();
			});

			await fireEvent.click(getByTestId("ImportWallet__back-button"));

			await waitFor(() => {
				expect(getByTestId("ImportWallet__first-step")).toBeTruthy();
			});
		});
	});

	it("should import by mnemonic", async () => {
		const history = createMemoryHistory();
		history.push(route);

		let rendered: RenderResult;

		await actAsync(async () => {
			rendered = renderWithRouter(
				<Route path="/profiles/:profileId/wallets/import">
					<ImportWallet />
				</Route>,
				{
					routes: [route],
					history,
				},
			);
			await waitFor(() => expect(rendered.getByTestId("ImportWallet__first-step")).toBeTruthy());
		});

		const { getByTestId, asFragment } = rendered;

		expect(asFragment()).toMatchSnapshot();

		await actAsync(async () => {
			const selectNetworkInput = getByTestId("SelectNetworkInput__input");
			expect(selectNetworkInput).toBeTruthy();

			await fireEvent.change(selectNetworkInput, { target: { value: "ARK D" } });
			await fireEvent.keyDown(selectNetworkInput, { key: "Enter", code: 13 });

			expect(selectNetworkInput).toHaveValue("ARK Devnet");

			const continueButton = getByTestId("ImportWallet__continue-button");
			expect(continueButton).toBeTruthy();
			expect(continueButton).not.toHaveAttribute("disabled");

			await fireEvent.click(continueButton);

			await waitFor(() => {
				expect(getByTestId("ImportWallet__second-step")).toBeTruthy();
			});

			const passphraseInput = getByTestId("ImportWallet__passphrase-input");
			expect(passphraseInput).toBeTruthy();

			await fireEvent.input(passphraseInput, { target: { value: mnemonic } });

			const goToWalletButton = getByTestId("ImportWallet__gotowallet-button");
			expect(goToWalletButton).toBeTruthy();
			await waitFor(() => {
				expect(goToWalletButton).not.toHaveAttribute("disabled");
			});

			await fireEvent.click(goToWalletButton);

			await waitFor(() => {
				expect(getByTestId("ImportWallet__third-step")).toBeTruthy();
			});

			const submitButton = getByTestId("ImportWallet__save-button");
			expect(submitButton).toBeTruthy();
			await waitFor(() => {
				expect(submitButton).not.toHaveAttribute("disabled");
			});

			await fireEvent.click(submitButton);

			await waitFor(() => {
				expect(profile.wallets().findByAddress(identityAddress)).toBeTruthy();
			});
		});
	});

	it("should import by address", async () => {
		const history = createMemoryHistory();
		history.push(route);

		let rendered: RenderResult;

		history.push(route);

		await actAsync(async () => {
			rendered = renderWithRouter(
				<Route path="/profiles/:profileId/wallets/import">
					<ImportWallet />
				</Route>,
				{
					routes: [route],
					history,
				},
			);
			await waitFor(() => expect(rendered.getByTestId("ImportWallet__first-step")).toBeTruthy());
		});

		const { getByTestId, asFragment } = rendered;

		expect(asFragment()).toMatchSnapshot();

		await actAsync(async () => {
			const selectNetworkInput = getByTestId("SelectNetworkInput__input");
			expect(selectNetworkInput).toBeTruthy();

			await fireEvent.change(selectNetworkInput, { target: { value: "ARK D" } });
			await fireEvent.keyDown(selectNetworkInput, { key: "Enter", code: 13 });

			expect(selectNetworkInput).toHaveValue("ARK Devnet");

			const continueButton = getByTestId("ImportWallet__continue-button");
			expect(continueButton).toBeTruthy();
			expect(continueButton).not.toHaveAttribute("disabled");

			await fireEvent.click(continueButton);

			await waitFor(() => {
				expect(getByTestId("ImportWallet__second-step")).toBeTruthy();
			});

			const addressToggle = getByTestId("ImportWallet__address-toggle");
			expect(addressToggle).toBeTruthy();

			await fireEvent.click(addressToggle);

			const addressInput = getByTestId("ImportWallet__address-input");
			expect(addressInput).toBeTruthy();

			await fireEvent.input(addressInput, { target: { value: randomAddress } });

			const goToWalletButton = getByTestId("ImportWallet__gotowallet-button");
			expect(goToWalletButton).toBeTruthy();
			await waitFor(() => {
				expect(goToWalletButton).not.toHaveAttribute("disabled");
			});

			await fireEvent.click(goToWalletButton);

			await waitFor(() => {
				expect(getByTestId("ImportWallet__third-step")).toBeTruthy();
			});

			const submitButton = getByTestId("ImportWallet__save-button");
			expect(submitButton).toBeTruthy();
			await waitFor(() => {
				expect(submitButton).not.toHaveAttribute("disabled");
			});

			await fireEvent.click(submitButton);

			await waitFor(() => {
				expect(profile.wallets().findByAddress(randomAddress)).toBeTruthy();
			});
		});
	});

	it("should import by address and fill a wallet name", async () => {
		const history = createMemoryHistory();
		history.push(route);

		let rendered: RenderResult;

		history.push(route);

		await actAsync(async () => {
			rendered = renderWithRouter(
				<Route path="/profiles/:profileId/wallets/import">
					<ImportWallet />
				</Route>,
				{
					routes: [route],
					history,
				},
			);
			await waitFor(() => expect(rendered.getByTestId("ImportWallet__first-step")).toBeTruthy());
		});

		const { getByTestId, asFragment } = rendered;

		expect(asFragment()).toMatchSnapshot();

		await actAsync(async () => {
			const selectNetworkInput = getByTestId("SelectNetworkInput__input");
			expect(selectNetworkInput).toBeTruthy();

			await fireEvent.change(selectNetworkInput, { target: { value: "ARK D" } });
			await fireEvent.keyDown(selectNetworkInput, { key: "Enter", code: 13 });

			expect(selectNetworkInput).toHaveValue("ARK Devnet");

			const continueButton = getByTestId("ImportWallet__continue-button");
			expect(continueButton).toBeTruthy();
			expect(continueButton).not.toHaveAttribute("disabled");

			await fireEvent.click(continueButton);

			await waitFor(() => {
				expect(getByTestId("ImportWallet__second-step")).toBeTruthy();
			});

			const addressToggle = getByTestId("ImportWallet__address-toggle");
			expect(addressToggle).toBeTruthy();

			await fireEvent.click(addressToggle);

			const addressInput = getByTestId("ImportWallet__address-input");
			expect(addressInput).toBeTruthy();

			await fireEvent.input(addressInput, { target: { value: randomAddress } });

			const goToWalletButton = getByTestId("ImportWallet__gotowallet-button");
			expect(goToWalletButton).toBeTruthy();
			await waitFor(() => {
				expect(goToWalletButton).not.toHaveAttribute("disabled");
			});

			await fireEvent.click(goToWalletButton);

			await waitFor(() => {
				expect(getByTestId("ImportWallet__third-step")).toBeTruthy();
			});

			const walletNameInput = getByTestId("ImportWallet__name-input");
			expect(walletNameInput).toBeTruthy();

			await fireEvent.input(walletNameInput, { target: { value: "Test" } });

			const submitButton = getByTestId("ImportWallet__save-button");
			expect(submitButton).toBeTruthy();
			await waitFor(() => {
				expect(submitButton).not.toHaveAttribute("disabled");
			});

			await fireEvent.click(submitButton);

			await waitFor(() => {
				expect(profile.wallets().findByAddress(randomAddress)).toBeTruthy();
			});
		});
	});

	it("should show an error message for invalid address", async () => {
		const history = createMemoryHistory();
		history.push(route);

		let rendered: RenderResult;

		history.push(route);

		await actAsync(async () => {
			rendered = renderWithRouter(
				<Route path="/profiles/:profileId/wallets/import">
					<ImportWallet />
				</Route>,
				{
					routes: [route],
					history,
				},
			);
			await waitFor(() => expect(rendered.getByTestId("ImportWallet__first-step")).toBeTruthy());
		});

		const { getByTestId, asFragment, getByText } = rendered;

		expect(asFragment()).toMatchSnapshot();

		await actAsync(async () => {
			const selectNetworkInput = getByTestId("SelectNetworkInput__input");
			expect(selectNetworkInput).toBeTruthy();

			await fireEvent.change(selectNetworkInput, { target: { value: "ARK D" } });
			await fireEvent.keyDown(selectNetworkInput, { key: "Enter", code: 13 });

			expect(selectNetworkInput).toHaveValue("ARK Devnet");

			const continueButton = getByTestId("ImportWallet__continue-button");
			expect(continueButton).toBeTruthy();
			expect(continueButton).not.toHaveAttribute("disabled");

			await fireEvent.click(continueButton);

			await waitFor(() => {
				expect(getByTestId("ImportWallet__second-step")).toBeTruthy();
			});

			const addressToggle = getByTestId("ImportWallet__address-toggle");
			expect(addressToggle).toBeTruthy();

			await fireEvent.click(addressToggle);

			const addressInput = getByTestId("ImportWallet__address-input");
			expect(addressInput).toBeTruthy();

			await fireEvent.input(addressInput, { target: { value: "123" } });

			await waitFor(() => {
				expect(getByText(commonTranslations.INPUT_ADDRESS.VALIDATION.NOT_VALID)).toBeVisible();
			});

			const goToWalletButton = getByTestId("ImportWallet__gotowallet-button");
			expect(goToWalletButton).toBeTruthy();
			await waitFor(() => {
				expect(goToWalletButton).toBeDisabled();
			});
		});
	});

	it("should show an error message for duplicate address", async () => {
		const history = createMemoryHistory();
		history.push(route);

		let rendered: RenderResult;

		history.push(route);

		await actAsync(async () => {
			rendered = renderWithRouter(
				<Route path="/profiles/:profileId/wallets/import">
					<ImportWallet />
				</Route>,
				{
					routes: [route],
					history,
				},
			);
			await waitFor(() => expect(rendered.getByTestId("ImportWallet__first-step")).toBeTruthy());
		});

		const { getByTestId, asFragment, getByText } = rendered;

		expect(asFragment()).toMatchSnapshot();

		await actAsync(async () => {
			const selectNetworkInput = getByTestId("SelectNetworkInput__input");
			expect(selectNetworkInput).toBeTruthy();

			await fireEvent.change(selectNetworkInput, { target: { value: "ARK D" } });
			await fireEvent.keyDown(selectNetworkInput, { key: "Enter", code: 13 });

			expect(selectNetworkInput).toHaveValue("ARK Devnet");

			const continueButton = getByTestId("ImportWallet__continue-button");
			expect(continueButton).toBeTruthy();
			expect(continueButton).not.toHaveAttribute("disabled");

			await fireEvent.click(continueButton);

			await waitFor(() => {
				expect(getByTestId("ImportWallet__second-step")).toBeTruthy();
			});

			const passphraseInput = getByTestId("ImportWallet__passphrase-input");
			expect(passphraseInput).toBeTruthy();

			await fireEvent.input(passphraseInput, { target: { value: mnemonic } });

			await waitFor(() => {
				expect(getByText(`Address ${identityAddress} already exists`)).toBeVisible();
			});

			const addressToggle = getByTestId("ImportWallet__address-toggle");
			expect(addressToggle).toBeTruthy();

			await fireEvent.click(addressToggle);

			const addressInput = getByTestId("ImportWallet__address-input");
			expect(addressInput).toBeTruthy();

			await fireEvent.input(addressInput, { target: { value: identityAddress } });

			await waitFor(() => {
				expect(getByText(`Address ${identityAddress} already exists`)).toBeVisible();
			});

			const goToWalletButton = getByTestId("ImportWallet__gotowallet-button");
			expect(goToWalletButton).toBeTruthy();
			await waitFor(() => {
				expect(goToWalletButton).toBeDisabled();
			});
		});
	});

	it("should forget all wallets and import by address", async () => {
		profile.wallets().flush();

		const history = createMemoryHistory();
		history.push(route);

		let rendered: RenderResult;

		history.push(route);

		await actAsync(async () => {
			rendered = renderWithRouter(
				<Route path="/profiles/:profileId/wallets/import">
					<ImportWallet />
				</Route>,
				{
					routes: [route],
					history,
				},
			);
			await waitFor(() => expect(rendered.getByTestId("ImportWallet__first-step")).toBeTruthy());
		});

		const { getByTestId, asFragment } = rendered;

		expect(asFragment()).toMatchSnapshot();

		await actAsync(async () => {
			const selectNetworkInput = getByTestId("SelectNetworkInput__input");
			expect(selectNetworkInput).toBeTruthy();

			await fireEvent.change(selectNetworkInput, { target: { value: "ARK D" } });
			await fireEvent.keyDown(selectNetworkInput, { key: "Enter", code: 13 });

			expect(selectNetworkInput).toHaveValue("ARK Devnet");

			const continueButton = getByTestId("ImportWallet__continue-button");
			expect(continueButton).toBeTruthy();
			expect(continueButton).not.toHaveAttribute("disabled");

			await fireEvent.click(continueButton);

			await waitFor(() => {
				expect(getByTestId("ImportWallet__second-step")).toBeTruthy();
			});

			const addressToggle = getByTestId("ImportWallet__address-toggle");
			expect(addressToggle).toBeTruthy();

			await fireEvent.click(addressToggle);

			const addressInput = getByTestId("ImportWallet__address-input");
			expect(addressInput).toBeTruthy();

			await fireEvent.input(addressInput, { target: { value: randomAddress } });

			const goToWalletButton = getByTestId("ImportWallet__gotowallet-button");
			expect(goToWalletButton).toBeTruthy();
			await waitFor(() => {
				expect(goToWalletButton).not.toHaveAttribute("disabled");
			});

			await fireEvent.click(goToWalletButton);

			await waitFor(() => {
				expect(getByTestId("ImportWallet__third-step")).toBeTruthy();
			});

			const submitButton = getByTestId("ImportWallet__save-button");
			expect(submitButton).toBeTruthy();
			await waitFor(() => {
				expect(submitButton).not.toHaveAttribute("disabled");
			});

			await fireEvent.click(submitButton);

			await waitFor(() => {
				expect(profile.wallets().findByAddress(randomAddress)).toBeTruthy();
			});
		});
	});
});
