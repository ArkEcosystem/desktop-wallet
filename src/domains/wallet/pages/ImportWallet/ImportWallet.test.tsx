/* eslint-disable @typescript-eslint/require-await */
import { Profile } from "@arkecosystem/platform-sdk-profiles";
import { act, renderHook } from "@testing-library/react-hooks";
import { createMemoryHistory } from "history";
import nock from "nock";
import React from "react";
import { FormContext, useForm } from "react-hook-form";
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

import { FirstStep, ImportWallet, SecondStep } from "./ImportWallet";

let profile: Profile;
const fixtureProfileId = getDefaultProfileId();

const identityAddress = "DSzj2pHzzM2vks8JU181VsWpoUtLMrT9Sq";
const mnemonic = "quantum sketch safe large poet space fortune wide vapor jealous dwarf step";

const route = `/profiles/${fixtureProfileId}/wallets/import`;

describe("ImportWallet", () => {
	beforeAll(() => {
		nock.disableNetConnect();

		nock("https://dwallets.ark.io")
			.get("/api/node/configuration")
			.reply(200, require("../../../../tests/fixtures/coins/ark/configuration-devnet.json"))
			.get("/api/peers")
			.reply(200, require("../../../../tests/fixtures/coins/ark/peers.json"))
			.get("/api/node/configuration/crypto")
			.reply(200, require("../../../../tests/fixtures/coins/ark/cryptoConfiguration.json"))
			.get("/api/node/syncing")
			.reply(200, require("../../../../tests/fixtures/coins/ark/syncing.json"))
			.get("/api/wallets/D61mfSggzbvQgTUe6JhYKH2doHaqJ3Dyib")
			.reply(200, require("../../../../tests/fixtures/coins/ark/wallets/D61mfSggzbvQgTUe6JhYKH2doHaqJ3Dyib.json"))
			.persist();
	});

	beforeEach(async () => {
		profile = env.profiles().findById(fixtureProfileId);
	});

	it("should render 1st step", async () => {
		const { result: form } = renderHook(() => useForm());
		const { getByTestId, asFragment } = render(
			<FormContext {...form.current}>
				<FirstStep />
			</FormContext>,
		);

		expect(getByTestId("ImportWallet__first-step")).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();

		const selectAssetsInput = getByTestId("SelectNetworkInput__input");
		expect(selectAssetsInput).toBeTruthy();

		await act(async () => {
			fireEvent.change(selectAssetsInput, { target: { value: "ARK D" } });
		});

		await act(async () => {
			fireEvent.keyDown(selectAssetsInput, { key: "Enter", code: 13 });
		});

		expect(selectAssetsInput).toHaveValue("Ark Devnet");
	});

	it("should render 2st step", async () => {
		const { result: form } = renderHook(() =>
			useForm({
				defaultValues: {
					network: {
						id: () => "devnet",
						coin: () => "ARK",
					},
				},
			}),
		);
		const { getByTestId, asFragment } = render(
			<FormContext {...form.current}>
				<SecondStep />
			</FormContext>,
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
			const selectAssetsInput = getByTestId("SelectNetworkInput__input");
			expect(selectAssetsInput).toBeTruthy();

			await fireEvent.change(selectAssetsInput, { target: { value: "ARK D" } });
			await fireEvent.keyDown(selectAssetsInput, { key: "Enter", code: 13 });

			expect(selectAssetsInput).toHaveValue("Ark Devnet");

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
			const selectAssetsInput = getByTestId("SelectNetworkInput__input");
			expect(selectAssetsInput).toBeTruthy();

			await fireEvent.change(selectAssetsInput, { target: { value: "ARK D" } });
			await fireEvent.keyDown(selectAssetsInput, { key: "Enter", code: 13 });

			expect(selectAssetsInput).toHaveValue("Ark Devnet");

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

			const submitButton = getByTestId("ImportWallet__submit-button");
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

		const randomAddress = "D8vwEEvKgMPVvvK2Zwzyb5uHzRadurCcKq";

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
			const selectAssetsInput = getByTestId("SelectNetworkInput__input");
			expect(selectAssetsInput).toBeTruthy();

			await fireEvent.change(selectAssetsInput, { target: { value: "ARK D" } });
			await fireEvent.keyDown(selectAssetsInput, { key: "Enter", code: 13 });

			expect(selectAssetsInput).toHaveValue("Ark Devnet");

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

			const submitButton = getByTestId("ImportWallet__submit-button");
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
			const selectAssetsInput = getByTestId("SelectNetworkInput__input");
			expect(selectAssetsInput).toBeTruthy();

			await fireEvent.change(selectAssetsInput, { target: { value: "ARK D" } });
			await fireEvent.keyDown(selectAssetsInput, { key: "Enter", code: 13 });

			expect(selectAssetsInput).toHaveValue("Ark Devnet");

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
				expect(getByText(/The address is not valid/i)).toBeVisible();
			});

			const submitButton = getByTestId("ImportWallet__submit-button");
			expect(submitButton).toBeTruthy();
			await waitFor(() => {
				expect(submitButton).toBeDisabled();
			});
		});
	});
});
