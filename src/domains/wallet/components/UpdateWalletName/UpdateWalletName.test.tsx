/* eslint-disable @typescript-eslint/require-await */
import { ReadWriteWallet, WalletSetting } from "@arkecosystem/platform-sdk-profiles";
import React from "react";
import { act, env, fireEvent, getDefaultProfileId, render, waitFor } from "testing-library";

// i18n
import { translations } from "../../i18n";
import { UpdateWalletName } from "./UpdateWalletName";

let wallet: ReadWriteWallet;

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

	it("should rename wallet", () => {
		const fn = jest.fn();
		const { getByTestId } = render(<UpdateWalletName isOpen={true} onSave={fn} />);

		expect(getByTestId("modal__inner")).toHaveTextContent(translations.MODAL_NAME_WALLET.TITLE);
		expect(getByTestId("modal__inner")).toHaveTextContent(translations.MODAL_NAME_WALLET.DESCRIPTION);
		expect(getByTestId("modal__inner")).toHaveTextContent(translations.MODAL_NAME_WALLET.FIELD_NAME);

		const input = getByTestId("UpdateWalletName__input");
		const name = "Sample label";

		act(() => {
			fireEvent.change(input, { target: { value: name } });
		});

		expect(input).toHaveValue(name);

		const submitBtn = getByTestId("UpdateWalletName__submit");

		act(() => {
			fireEvent.click(submitBtn);
		});

		waitFor(() => {
			expect(fn).toHaveBeenCalledWith({ name }, expect.anything());
			wallet.settings().set(WalletSetting.Alias, name);
			expect(wallet.settings().get(WalletSetting.Alias)).toEqual(name);
		});
	});

	it("should show error message when name exceeds 42 characters", async () => {
		const fn = jest.fn();
		const { asFragment, getByTestId } = render(<UpdateWalletName isOpen={true} onSave={fn} />);

		const input = getByTestId("UpdateWalletName__input");
		const name = "Lorem ipsum dolor sit amet consectetur adipisicing elit. Eveniet fugit distinctio";

		act(() => {
			fireEvent.change(input, { target: { value: name } });
		});

		expect(input).toHaveValue(name);
		expect(getByTestId("UpdateWalletName__submit")).toBeDisabled();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render form input with existing name", async () => {
		const fn = jest.fn();
		const { asFragment, getByTestId } = render(<UpdateWalletName isOpen={true} onSave={fn} name="test" />);

		const input = getByTestId("UpdateWalletName__input");
		expect(input).toHaveValue("test");

		expect(asFragment()).toMatchSnapshot();
	});
});
