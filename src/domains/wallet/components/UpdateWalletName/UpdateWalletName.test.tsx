import { Wallet, WalletSetting } from "@arkecosystem/platform-sdk-profiles";
import React from "react";
import { act, env, fireEvent, getDefaultProfileId, render, waitFor } from "testing-library";

// i18n
import { translations } from "../../i18n";
import { UpdateWalletName } from "./UpdateWalletName";

let wallet: Wallet;

describe("UpdateWalletName", () => {
	beforeAll(() => {
		const profile = env.profiles().findById(getDefaultProfileId());
		wallet = profile.wallets().findById("ac38fe6d-4b67-4ef1-85be-17c5f6841129");
	});

	it("should not render if not open", () => {
		const { asFragment, getByTestId } = render(<UpdateWalletName isOpen={false} onSave={() => void 0} />);

		expect(() => getByTestId("modal__inner")).toThrow(/Unable to find an element by/);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render a modal", () => {
		const { asFragment, getByTestId } = render(<UpdateWalletName isOpen={true} onSave={() => void 0} />);

		expect(getByTestId("modal__inner")).toHaveTextContent(translations.MODAL_NAME_WALLET.TITLE);
		expect(getByTestId("modal__inner")).toHaveTextContent(translations.MODAL_NAME_WALLET.DESCRIPTION);
		expect(getByTestId("modal__inner")).toHaveTextContent(translations.MODAL_NAME_WALLET.FIELD_NAME);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should rename wallet with max 120 characters", () => {
		const fn = jest.fn();
		const { getByTestId } = render(<UpdateWalletName isOpen={true} onSave={fn} />);

		const longName =
			"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";
		const correctName =
			"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliq";

		const input = getByTestId("UpdateWalletName__input");
		const submitBtn = getByTestId("UpdateWalletName__submit");

		act(() => {
			fireEvent.change(input, { target: { value: longName } });
			fireEvent.click(submitBtn);
		});

		waitFor(() => {
			expect(fn).toHaveBeenCalledWith({ name: correctName }, expect.anything());
			wallet.settings().set(WalletSetting.Alias, name);
			expect(wallet.settings().get(WalletSetting.Alias)).toEqual(name);
		});
	});
});
