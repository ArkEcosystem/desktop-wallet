/* eslint-disable @typescript-eslint/require-await */
import { ARK } from "@arkecosystem/platform-sdk-ark";
import { Environment, Profile, Wallet } from "@arkecosystem/platform-sdk-profiles";
import { EnvironmentProvider } from "app/contexts";
import { httpClient } from "app/services";
import nock from "nock";
import React from "react";
import { Route } from "react-router-dom";
import { act, fireEvent, RenderResult, renderWithRouter, waitFor } from "testing-library";
import { profiles } from "tests/fixtures/env/data";
import { identity } from "tests/fixtures/identity";
import { StubStorage } from "tests/mocks";

import { wallet as walletData, wallets } from "../../data";
import { WalletDetails } from "./WalletDetails";

let env: Environment;
let profile: Profile;
let wallet: Wallet;

describe("WalletDetails", () => {
	beforeAll(() => {
		nock.disableNetConnect();

		nock(/.+/)
			.get("/api/node/configuration")
			.reply(200, require("../../../../tests/fixtures/coins/ark/configuration.json"))
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

		wallet = await profile.wallets().import(identity.mnemonic, "ARK", "devnet");
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
		let rendered: RenderResult;
		const route = `/profiles/bob/wallets/${wallet.id()}`;

		await act(async () => {
			rendered = renderWithRouter(
				<EnvironmentProvider env={env}>
					<Route path="/profiles/:profileId/wallets/:walletId">
						<WalletDetails wallets={wallets[0]} wallet={walletData} />
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

			const deleteWalletOption = getByTestId("dropdown__option--3");
			expect(deleteWalletOption).toBeTruthy();

			await fireEvent.click(deleteWalletOption);
			expect(getByTestId("modal__inner")).toBeTruthy();

			await fireEvent.click(getByTestId("DeleteResource__submit-button"));

			await waitFor(() => expect(profile.wallets().count()).toEqual(0));
		});
	});
});
