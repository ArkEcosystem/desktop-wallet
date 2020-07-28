/* eslint-disable @typescript-eslint/require-await */
import { ARK } from "@arkecosystem/platform-sdk-ark";
import { Environment, Profile, Wallet, WalletSetting } from "@arkecosystem/platform-sdk-profiles";
import { EnvironmentProvider } from "app/contexts";
import { httpClient } from "app/services";
import nock from "nock";
import React from "react";
import { Route } from "react-router-dom";
import { act, fireEvent, RenderResult, renderWithRouter, waitFor } from "testing-library";
import fixtureData from "tests/fixtures/env/storage.json";
import { StubStorage } from "tests/mocks";

import { wallet as walletData, wallets } from "../../data";
import { WalletDetails } from "./WalletDetails";

let env: Environment;
let profile: Profile;
let wallet: Wallet;

let signedMessage: any;
let signedMessageText: string;
let signedMessageMnemonic: string;

describe("WalletDetails", () => {
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

		await env.bootFromObject(fixtureData);
		await env.persist();

		profile = env.profiles().findById("b999d134-7a24-481e-a95d-bc47c543bfc9");
		wallet = profile.wallets().findById("ac38fe6d-4b67-4ef1-85be-17c5f6841129");

		signedMessageText = "Hello world";
		signedMessageMnemonic = "top secret";

		signedMessage = await wallet.message().sign({
			message: signedMessageText,
			mnemonic: signedMessageMnemonic,
		});

		// signed message {
		//         message: 'Hello world',
		//         signatory: '03600a30cb66c6f6275ead993078d691764629c4f9244e5d38fea73483f31821cc',
		//         signature: '3044022027fdda09a4bc3e2215b56d7f0cedda8bfdc4fb97507bef3b7e74505f2e988e3102205e4aa5afa72d2011ac0c3e05bbcb72dccb17ad63f0c77a097b0046066c8030ff'
		//       }
	});

	it("should render", () => {
		const { asFragment, getByTestId } = renderWithRouter(<WalletDetails wallets={wallets} wallet={walletData} />);

		expect(getByTestId("WalletBottomSheetMenu")).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should not render the bottom sheet menu when there is only one wallet", () => {
		const { asFragment, getByTestId } = renderWithRouter(
			<WalletDetails wallets={[wallets[0]]} wallet={walletData} />,
		);

		expect(() => getByTestId("WalletBottomSheetMenu")).toThrow(/Unable to find an element by/);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should delete wallet", async () => {
		const route = `/profiles/${profile.id()}/wallets/${wallet.id()}`;

		const { getByTestId, getAllByTestId, asFragment } = renderWithRouter(
			<EnvironmentProvider env={env}>
				<Route path="/profiles/:profileId/wallets/:walletId">
					<WalletDetails wallets={[wallets[0]]} wallet={walletData} />
				</Route>
			</EnvironmentProvider>,
			{
				routes: [route],
			},
		);

		await waitFor(() => expect(getByTestId("WalletHeader")).toBeTruthy());

		expect(asFragment()).toMatchSnapshot();

		await act(async () => {
			const dropdown = getAllByTestId("dropdown__toggle")[2];
			expect(dropdown).toBeTruthy();

			await fireEvent.click(dropdown);

			const deleteWalletOption = getByTestId("dropdown__option--4");
			expect(deleteWalletOption).toBeTruthy();

			await fireEvent.click(deleteWalletOption);
			expect(getByTestId("modal__inner")).toBeTruthy();

			await fireEvent.click(getByTestId("DeleteResource__submit-button"));

			await waitFor(() => expect(profile.wallets().count()).toEqual(0));
		});
	});

	it("should open verify message modal and verify", async () => {
		const route = `/profiles/${profile.id()}/wallets/${wallet.id()}`;

		const { getByTestId, getAllByTestId, asFragment } = renderWithRouter(
			<EnvironmentProvider env={env}>
				<Route path="/profiles/:profileId/wallets/:walletId">
					<WalletDetails wallets={[wallets[0]]} wallet={walletData} />
				</Route>
			</EnvironmentProvider>,
			{
				routes: [route],
			},
		);

		await waitFor(() => expect(getByTestId("WalletHeader")).toBeTruthy());

		expect(asFragment()).toMatchSnapshot();

		await act(async () => {
			const dropdown = getAllByTestId("dropdown__toggle")[2];
			expect(dropdown).toBeTruthy();

			await fireEvent.click(dropdown);

			const deleteWalletOption = getByTestId("dropdown__option--2");
			expect(deleteWalletOption).toBeTruthy();

			await fireEvent.click(deleteWalletOption);
			expect(getByTestId("modal__inner")).toBeTruthy();

			const verifyAddressToggle = getByTestId("verify-address__toggle");

			act(() => {
				fireEvent.click(verifyAddressToggle);
			});

			const verifyMessageInput = getByTestId("VerifyMessage__message-input");
			const verifySignatureInput = getByTestId("VerifyMessage__signature-input");

			act(() => {
				fireEvent.change(verifyMessageInput, { target: { value: signedMessage.message } });
			});
			act(() => {
				fireEvent.change(verifySignatureInput, { target: { value: signedMessage.signature } });
			});

			const submitButton = getByTestId("VerifyMessage__submit");

			act(() => {
				fireEvent.click(submitButton);
			});
		});

		waitFor(() => expect(getByTestId("modal__inner")).toBeFalsy());
	});

	it("should update wallet name", async () => {
		let rendered: RenderResult;
		const route = `/profiles/${profile.id()}/wallets/${wallet.id()}`;

		await act(async () => {
			rendered = renderWithRouter(
				<EnvironmentProvider env={env}>
					<Route path="/profiles/:profileId/wallets/:walletId">
						<WalletDetails wallets={[wallets[0]]} wallet={walletData} />
					</Route>
				</EnvironmentProvider>,
				{
					routes: [route],
				},
			);

			await waitFor(() => expect(rendered.getByTestId("WalletHeader")).toBeTruthy());
		});

		const { getByTestId, getAllByTestId, asFragment } = rendered;

		expect(asFragment()).toMatchSnapshot();

		await act(async () => {
			const dropdown = getAllByTestId("dropdown__toggle")[2];
			expect(dropdown).toBeTruthy();

			await fireEvent.click(dropdown);

			const updateWalletNameOption = getByTestId("dropdown__option--0");
			expect(updateWalletNameOption).toBeTruthy();

			await fireEvent.click(updateWalletNameOption);
			expect(getByTestId("modal__inner")).toBeTruthy();

			const name = "Sample label name";
			const updateNameInput = getByTestId("UpdateWalletName__input");
			act(() => {
				fireEvent.change(updateNameInput, { target: { value: name } });
			});

			expect(updateNameInput).toHaveValue(name);

			const submitBtn = getByTestId("UpdateWalletName__submit");

			act(() => {
				fireEvent.click(submitBtn);
			});

			await waitFor(() => {
				wallet.settings().set(WalletSetting.Alias, name);
				expect(wallet.settings().get(WalletSetting.Alias)).toEqual(name);
			});
		});
	});
});
