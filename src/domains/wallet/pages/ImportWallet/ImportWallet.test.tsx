/* eslint-disable @typescript-eslint/require-await */
import { ARK } from "@arkecosystem/platform-sdk-ark";
import { Environment, Profile } from "@arkecosystem/platform-sdk-profiles";
import { renderHook } from "@testing-library/react-hooks";
import { EnvironmentProvider } from "app/contexts";
import { httpClient } from "app/services";
import { createMemoryHistory } from "history";
import nock from "nock";
import React from "react";
import { FormContext, useForm } from "react-hook-form";
import { Route } from "react-router-dom";
import TestRenderer from "react-test-renderer";
import { act, fireEvent, render, RenderResult, renderWithRouter, waitFor } from "testing-library";
import { profiles } from "tests/fixtures/env/data";
import { identity } from "tests/fixtures/identity";
import { StubStorage } from "tests/mocks";

import { FirstStep, ImportWallet, SecondStep } from "./ImportWallet";

let env: Environment;
let profile: Profile;

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
			.reply(200, require("../../../../tests/fixtures/coins/ark/wallet.json"))
			.persist();
	});

	beforeEach(async () => {
		env = new Environment({ coins: { ARK }, httpClient, storage: new StubStorage() });

		await env.bootFromObject({ data: {}, profiles });

		profile = env.profiles().findById("bob");
	});

	it("should render 1st step", async () => {
		const { act } = TestRenderer;
		const { result: form } = renderHook(() => useForm());
		const { getByTestId, asFragment } = render(
			<FormContext {...form.current}>
				<FirstStep />
			</FormContext>,
		);

		expect(getByTestId("ImportWallet__first-step")).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();

		const selectAssetsInput = getByTestId("select-asset__input");
		expect(selectAssetsInput).toBeTruthy();

		await act(async () => {
			fireEvent.change(selectAssetsInput, { target: { value: "ARK" } });
		});

		await act(async () => {
			fireEvent.keyDown(selectAssetsInput, { key: "Enter", code: 13 });
		});

		expect(getByTestId("select-asset__selected-ARK-Mainnet")).toBeTruthy();
	});

	it("should render 2st step", async () => {
		const { act } = TestRenderer;
		const { result: form } = renderHook(() => useForm());
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

		await act(async () => {
			fireEvent.change(passphraseInput, { target: { value: identity.mnemonic } });
		});

		expect(form.current.getValues()).toEqual({ passphrase: identity.mnemonic });

		await act(async () => {
			fireEvent.click(addressToggle);
		});

		const addressInput = getByTestId("ImportWallet__address-input");
		expect(addressInput).toBeTruthy();
	});

	it("should go to previous step", async () => {
		let rendered: RenderResult;
		const route = "/profiles/bob/wallets/import";

		await act(async () => {
			rendered = renderWithRouter(
				<EnvironmentProvider env={env}>
					<Route path="/profiles/:profileId/wallets/import">
						<ImportWallet />
					</Route>
				</EnvironmentProvider>,
				{
					routes: [route],
				},
			);

			await waitFor(() => expect(rendered.getByTestId("ImportWallet__first-step")).toBeTruthy());
		});

		const { getByTestId, asFragment } = rendered;

		expect(asFragment()).toMatchSnapshot();

		await act(async () => {
			const selectAssetsInput = getByTestId("select-asset__input");
			const continueButton = getByTestId("ImportWallet__continue-button");

			await fireEvent.change(selectAssetsInput, { target: { value: "DARK" } });
			await fireEvent.keyDown(selectAssetsInput, { key: "Enter", code: 13 });

			expect(getByTestId("select-asset__selected-DARK-Devnet")).toBeTruthy();

			await fireEvent.click(continueButton);
			await waitFor(() => expect(getByTestId("ImportWallet__second-step")).toBeTruthy());

			await fireEvent.click(getByTestId("ImportWallet__back-button"));
			await waitFor(() => expect(getByTestId("ImportWallet__first-step")).toBeTruthy());
		});
	});

	it("should render", async () => {
		let rendered: RenderResult;
		const history = createMemoryHistory();
		const route = "/profiles/bob/wallets/import";

		history.push(route);

		await act(async () => {
			rendered = renderWithRouter(
				<EnvironmentProvider env={env}>
					<Route path="/profiles/:profileId/wallets/import">
						<ImportWallet />
					</Route>
				</EnvironmentProvider>,
				{
					routes: [route],
					history,
				},
			);

			await waitFor(() => expect(rendered.getByTestId("ImportWallet__first-step")).toBeTruthy());
		});

		const { getByTestId, asFragment } = rendered;

		expect(asFragment()).toMatchSnapshot();

		await act(async () => {
			const selectAssetsInput = getByTestId("select-asset__input");
			const continueButton = getByTestId("ImportWallet__continue-button");

			await fireEvent.change(selectAssetsInput, { target: { value: "DARK" } });
			await fireEvent.keyDown(selectAssetsInput, { key: "Enter", code: 13 });

			expect(getByTestId("select-asset__selected-DARK-Devnet")).toBeTruthy();

			await fireEvent.click(continueButton);
			await waitFor(() => expect(getByTestId("ImportWallet__second-step")).toBeTruthy());

			const passphraseInput = getByTestId("ImportWallet__passphrase-input");
			expect(passphraseInput).toBeTruthy();

			await fireEvent.change(passphraseInput, { target: { value: identity.mnemonic } });

			await fireEvent.click(getByTestId("ImportWallet__submit-button"));

			await waitFor(() =>
				expect(profile.wallets().values()[0].address()).toEqual("D61mfSggzbvQgTUe6JhYKH2doHaqJ3Dyib"),
			);
		});
	});
});
