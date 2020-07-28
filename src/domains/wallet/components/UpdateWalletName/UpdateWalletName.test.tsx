import { ARK } from "@arkecosystem/platform-sdk-ark";
import { Environment, Wallet, WalletSetting } from "@arkecosystem/platform-sdk-profiles";
import { httpClient } from "app/services";
import nock from "nock";
import React from "react";
import { act, fireEvent, render, waitFor } from "testing-library";
import { StubStorage } from "tests/mocks";

// i18n
import { translations } from "../../i18n";
import { UpdateWalletName } from "./UpdateWalletName";

let env: Environment;
let wallet: Wallet;

describe("UpdateWalletName", () => {
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

		const profile = env.profiles().create("John Doe");
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
