/* eslint-disable @typescript-eslint/require-await */
import { Profile, Wallet, WalletSetting } from "@arkecosystem/platform-sdk-profiles";
import React from "react";
import { Route } from "react-router-dom";
import { act, env, fireEvent, getDefaultProfileId, RenderResult, renderWithRouter, waitFor } from "testing-library";

import { wallet as walletData, wallets } from "../../data";
import { WalletDetails } from "./WalletDetails";

let profile: Profile;
let wallet: Wallet;
let route: string;

describe("WalletDetails", () => {
	beforeAll(() => {
		profile = env.profiles().findById(getDefaultProfileId());
		wallet = profile.wallets().findById("ac38fe6d-4b67-4ef1-85be-17c5f6841129");
		route = `/profiles/${profile.id()}/wallets/${wallet.id()}`;
	});

	it("should render", () => {
		const { asFragment, getByTestId } = renderWithRouter(
			<Route path="/profiles/:profileId/wallets/:walletId">
				<WalletDetails wallets={wallets} wallet={walletData} />
			</Route>,
			{
				routes: [route],
			},
		);

		expect(getByTestId("WalletBottomSheetMenu")).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should not render the bottom sheet menu when there is only one wallet", () => {
		const { asFragment, queryByTestId } = renderWithRouter(
			<Route path="/profiles/:profileId/wallets/:walletId">
				<WalletDetails wallets={wallets[0]} wallet={walletData} />
			</Route>,
			{
				routes: [route],
			},
		);

		expect(queryByTestId("WalletBottomSheetMenu")).toBeNull();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should update wallet name", async () => {
		let rendered: RenderResult;
		const route = `/profiles/${profile.id()}/wallets/${wallet.id()}`;

		await act(async () => {
			rendered = renderWithRouter(
				<Route path="/profiles/:profileId/wallets/:walletId">
					<WalletDetails wallets={[wallets[0]]} wallet={walletData} />
				</Route>,
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

	it("should delete wallet", async () => {
		let rendered: RenderResult;
		const route = `/profiles/${profile.id()}/wallets/${wallet.id()}`;

		await act(async () => {
			rendered = renderWithRouter(
				<Route path="/profiles/:profileId/wallets/:walletId">
					<WalletDetails wallets={[wallets[0]]} wallet={walletData} />
				</Route>,
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

			const deleteWalletOption = getByTestId("dropdown__option--4");
			expect(deleteWalletOption).toBeTruthy();

			await fireEvent.click(deleteWalletOption);
			expect(getByTestId("modal__inner")).toBeTruthy();

			await fireEvent.click(getByTestId("DeleteResource__submit-button"));

			await waitFor(() => expect(profile.wallets().count()).toEqual(0));
		});
	});
});
