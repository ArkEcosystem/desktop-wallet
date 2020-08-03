
import {  Wallet, WalletSetting } from "@arkecosystem/platform-sdk-profiles";
import React from "react";
import { env, fireEvent, getDefaultProfileId, render, waitFor } from "testing-library";

import { translations } from "../../i18n";
import { SearchWallet } from "./SearchWallet";

let wallets: Wallet[];

describe("SearchWallet", () => {
	beforeAll(() => {
		const profile = env.profiles().findById(getDefaultProfileId());

		wallets = [profile.wallets().findById("ac38fe6d-4b67-4ef1-85be-17c5f6841129")];
		wallets[0].settings().set(WalletSetting.Alias, "Sample Wallet");
	});

	it("should render", async () => {
		const { asFragment, getByTestId } = render(<SearchWallet isOpen={true} wallets={wallets} />);

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

		const { getByTestId } = render(<SearchWallet isOpen={true} onClose={onClose} />);

		fireEvent.click(getByTestId("modal__close-btn"));
		expect(onClose).toHaveBeenCalled();
	});
});
