/* eslint-disable @typescript-eslint/require-await */
import { act, renderHook } from "@testing-library/react-hooks";
import { createMemoryHistory } from "history";
import React from "react";
import { FormContext, useForm } from "react-hook-form";
import { Route } from "react-router-dom";
import { fireEvent, render, RenderResult, renderWithRouter, waitFor } from "testing-library";
import { identity } from "tests/fixtures/identity";
import nock from "nock";

import { EnvironmentProvider } from "app/contexts";
import { ARK } from "@arkecosystem/platform-sdk-ark";
import { Profile, Environment } from "@arkecosystem/platform-sdk-profiles";
import { httpClient } from "app/services";
import fixtureData from "tests/fixtures/env/storage.json";
import { StubStorage } from "tests/mocks";

import { FifthStep, FirstStep, FourthStep, SecondStep, ThirdStep, TransactionSend } from "../TransactionSend";

const onCopy = jest.fn();

const defaultFormValues = {
	maxAvailableAmount: 80,
	assetSymbol: "ARK",
	feeRange: {
		last: 10,
		min: 1,
		average: 14,
	},
	assets: [
		{
			icon: "Ark",
			name: "Ark Ecosystem",
			className: "text-theme-danger-400 border-theme-danger-light",
		},
		{
			icon: "Bitcoin",
			name: "Bitcoin",
			className: "text-theme-warning-400 border-theme-warning-200",
		},
		{
			icon: "Ethereum",
			name: "Ethereum",
			className: "text-theme-neutral-800 border-theme-neutral-600",
		},
	],
	defaultFee: 0,
	formDefaultData: {
		network: null,
		sender: null,
		amount: null,
		smartbridge: null,
		fee: 0,
	},
	senderList: [
		{
			address: "FJKDSALJFKASLJFKSDAJFKFKDSAJFKSAJFKLASJKDFJ",
			walletName: "My Wallet",
			avatarId: "FJKDSALJFKASLJFKSDAJFKFKDSAJFKSAJFKLASJKDFJ",
			formatted: "My Wallet FJKDSALJFKASL...SAJFKLASJKDFJ",
		},
	],
};

let env: Environment;
let profile: Profile;

describe("Transaction Send", () => {
	beforeAll(async () => {
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
			.get("/api/wallets/D8rr7B1d6TL6pf14LgMz4sKp1VBMs6YUYD")
			.reply(200, require("../../../../tests/fixtures/coins/ark/wallets/D8rr7B1d6TL6pf14LgMz4sKp1VBMs6YUYD.json"))
			.get("/api/wallets/D61mfSggzbvQgTUe6JhYKH2doHaqJ3Dyib")
			.reply(200, require("../../../../tests/fixtures/coins/ark/wallets/D61mfSggzbvQgTUe6JhYKH2doHaqJ3Dyib.json"))
			.persist();

		env = new Environment({ coins: { ARK }, httpClient, storage: new StubStorage() });
		await env.bootFromObject(fixtureData);

		profile = env.profiles().findById("b999d134-7a24-481e-a95d-bc47c543bfc9");
	});

	it("should render 1st step", async () => {
		const { result: form } = renderHook(() => useForm());

		const { getByTestId, asFragment } = render(
			<FormContext {...form.current}>
				<FirstStep formValues={defaultFormValues} profile={profile} />
			</FormContext>,
		);

		expect(getByTestId("TransactionSend__step--first")).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render 2nd step", async () => {
		const { getByTestId, asFragment } = render(<SecondStep />);

		expect(getByTestId("TransactionSend__step--second")).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render 3rd step", async () => {
		const { result: form } = renderHook(() => useForm());
		const { getByTestId, asFragment } = render(
			<FormContext {...form.current}>
				<ThirdStep />
			</FormContext>,
		);

		expect(getByTestId("TransactionSend__step--third")).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render 4th step", async () => {
		const { result: form } = renderHook(() => useForm());

		const { getByTestId, asFragment } = render(
			<FormContext {...form.current}>
				<FourthStep />
			</FormContext>,
		);

		expect(getByTestId("TransactionSend__step--fourth")).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render 5th step", async () => {
		const { result: form } = renderHook(() => useForm());

		const { getByTestId, asFragment } = render(
			<FormContext {...form.current}>
				<FifthStep />
			</FormContext>,
		);

		expect(getByTestId("TransactionSuccessful")).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render", async () => {
		const history = createMemoryHistory();
		const transferURL = `/profiles/${profile.id()}/transactions/transfer`;

		history.push(transferURL);

		let rendered: RenderResult;

		await act(async () => {
			rendered = renderWithRouter(
				<EnvironmentProvider env={env}>
					<Route path="/profiles/:profileId/transactions/transfer">
						<TransactionSend onCopy={onCopy} formValues={defaultFormValues} />
					</Route>
				</EnvironmentProvider>,
				{
					routes: [transferURL],
					history,
				},
			);

			await waitFor(() => expect(rendered.getByTestId(`TransactionSend__step--first`)).toBeTruthy());
		});

		const { getByTestId, asFragment } = rendered!;

		expect(asFragment()).toMatchSnapshot();

		await act(async () => {
			// 1st step form
			const submit1st = getByTestId("send-transaction-click-submit");
			fireEvent.click(submit1st);

			const continueButton = getByTestId(`TransactionSend__button--continue`);
			expect(getByTestId(`TransactionSend__step--second`)).toBeTruthy();

			fireEvent.click(continueButton);
			expect(getByTestId(`TransactionSend__step--third`)).toBeTruthy();

			fireEvent.click(continueButton);
			expect(getByTestId(`TransactionSend__step--fourth`)).toBeTruthy();

			// Back
			fireEvent.click(getByTestId(`TransactionSend__button--back`));
			expect(getByTestId(`TransactionSend__step--third`)).toBeTruthy();

			fireEvent.click(continueButton);
			fireEvent.click(continueButton);
			await waitFor(() => expect(getByTestId(`TransactionSend__button--back-to-wallet`)).toBeTruthy());
		});
	});
});
