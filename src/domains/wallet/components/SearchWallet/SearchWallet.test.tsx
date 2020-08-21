import { Wallet, WalletSetting } from "@arkecosystem/platform-sdk-profiles";
import { createMemoryHistory } from "history";
import React from "react";
import { Route } from "react-router-dom";
import { env, fireEvent, getDefaultProfileId, renderWithRouter, waitFor } from "testing-library";

import { translations } from "../../i18n";
import { SearchWallet } from "./SearchWallet";

const history = createMemoryHistory();
const dashboardURL = `/profiles/${getDefaultProfileId()}/dashboard`;
let wallets: Wallet[];

describe("SearchWallet", () => {
	beforeAll(() => {
		history.push(dashboardURL);
	});

	beforeEach(() => {
		const profile = env.profiles().findById(getDefaultProfileId());

		wallets = [profile.wallets().findById("ac38fe6d-4b67-4ef1-85be-17c5f6841129")];
		wallets[0].settings().set(WalletSetting.Alias, "Sample Wallet");
	});

	it("should render", async () => {
		const { asFragment, getByTestId } = renderWithRouter(
			<Route path="/profiles/:profileId/dashboard">
				<SearchWallet isOpen={true} wallets={wallets} />
			</Route>,
			{
				routes: [dashboardURL],
				history,
			},
		);

		await waitFor(() =>
			expect(getByTestId("modal__inner")).toHaveTextContent(translations.MODAL_SELECT_ACCOUNT.TITLE),
		);
		await waitFor(() =>
			expect(getByTestId("modal__inner")).toHaveTextContent(translations.MODAL_SELECT_ACCOUNT.DESCRIPTION),
		);
		await waitFor(() => expect(asFragment()).toMatchSnapshot());
	});

	it("should handle close", () => {
		const onClose = jest.fn();

		const { getByTestId } = renderWithRouter(
			<Route path="/profiles/:profileId/dashboard">
				<SearchWallet isOpen={true} onClose={onClose} />
			</Route>,
			{
				routes: [dashboardURL],
				history,
			},
		);

		fireEvent.click(getByTestId("modal__close-btn"));
		expect(onClose).toHaveBeenCalled();
	});
});
