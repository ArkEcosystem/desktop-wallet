import { ARK } from "@arkecosystem/platform-sdk-ark";
import { Environment, Wallet, WalletSetting } from "@arkecosystem/platform-sdk-profiles";
import { httpClient } from "app/services";
import React from "react";
import { fireEvent, render } from "testing-library";
import { StubStorage } from "tests/mocks";

// i18n
import { translations } from "../../i18n";
import { SearchWallet } from "./SearchWallet";

let wallets: Wallet[];

describe("SearchWallet", () => {
	beforeEach(async () => {
		const env = new Environment({ coins: { ARK }, httpClient, storage: new StubStorage() });
		const profile = env.profiles().create("John Doe");

		wallets = [await profile.wallets().importByAddress("ASuusXSW9kfWnicScSgUTjttP6T9GQ3kqT", "ARK", "mainnet")];
		wallets[0].settings().set(WalletSetting.Alias, "Sample Wallet");
	});

	it("should render", () => {
		const { asFragment, getByTestId } = render(<SearchWallet isOpen={true} wallets={wallets} />);

		expect(getByTestId("modal__inner")).toHaveTextContent(translations.MODAL_SELECT_ACCOUNT.TITLE);
		expect(getByTestId("modal__inner")).toHaveTextContent(translations.MODAL_SELECT_ACCOUNT.DESCRIPTION);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should handle close", () => {
		const onClose = jest.fn();

		const { getByTestId } = render(<SearchWallet isOpen={true} onClose={onClose} />);

		fireEvent.click(getByTestId("modal__close-btn"));
		expect(onClose).toHaveBeenCalled();
	});
});
