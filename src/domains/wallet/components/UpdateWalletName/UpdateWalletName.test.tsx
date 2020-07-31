import { Wallet, WalletSetting } from "@arkecosystem/platform-sdk-profiles";
import React from "react";
import { act, env, fireEvent, getDefaultProfileId, render, useDefaultNetMocks, waitFor } from "testing-library";
import fixtureData from "tests/fixtures/env/storage.json";

// i18n
import { translations } from "../../i18n";
import { UpdateWalletName } from "./UpdateWalletName";

let wallet: Wallet;

describe("UpdateWalletName", () => {
	beforeAll(async () => {
		useDefaultNetMocks();

		await env.bootFromObject(fixtureData);
		await env.persist();

		const profile = env.profiles().findById(getDefaultProfileId());
		wallet = await profile.wallets().importByMnemonic("this is a top secret passphrase", "ARK", "devnet");
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
});
