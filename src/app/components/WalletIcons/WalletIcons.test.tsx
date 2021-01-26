import { ReadWriteWallet } from "@arkecosystem/platform-sdk-profiles";
import React from "react";
import { env, getDefaultProfileId, render } from "utils/testing-library";

import { WalletIcons } from "./WalletIcons";

let wallet: ReadWriteWallet;

describe("WalletIcons", () => {
	beforeEach(() => {
		wallet = env.profiles().findById(getDefaultProfileId()).wallets().first();
	});

	it("should render the verified icon", () => {
		const walletSpy = jest.spyOn(wallet, "isKnown").mockReturnValue(true);

		const { getByTestId } = render(<WalletIcons wallet={wallet} />);

		expect(getByTestId("WalletIcon__Verified")).toBeTruthy();
		expect(getByTestId("WalletIcon__Verified")).toHaveTextContent("verified.svg");

		walletSpy.mockRestore();
	});

	it("should render the ledger icon", () => {
		const walletSpy = jest.spyOn(wallet, "isLedger").mockReturnValue(true);

		const { getByTestId } = render(<WalletIcons wallet={wallet} />);

		expect(getByTestId("WalletIcon__Ledger")).toBeTruthy();
		expect(getByTestId("WalletIcon__Ledger")).toHaveTextContent("ledger.svg");

		walletSpy.mockRestore();
	});

	it("should render the star icon", () => {
		const walletSpy = jest.spyOn(wallet, "isStarred").mockReturnValue(true);

		const { getByTestId } = render(<WalletIcons wallet={wallet} />);

		expect(getByTestId("WalletIcon__Star")).toBeTruthy();
		expect(getByTestId("WalletIcon__Star")).toHaveTextContent("star.svg");

		walletSpy.mockRestore();
	});

	it("should render the multisignature icon", () => {
		const hasSyncedWithNetworkSpy = jest.spyOn(wallet, "hasSyncedWithNetwork").mockReturnValue(true);
		const isMultiSignatureSpy = jest.spyOn(wallet, "isMultiSignature").mockReturnValue(true);

		const { getByTestId } = render(<WalletIcons wallet={wallet} />);

		expect(getByTestId("WalletIcon__Multisig")).toBeTruthy();
		expect(getByTestId("WalletIcon__Multisig")).toHaveTextContent("multisig.svg");

		hasSyncedWithNetworkSpy.mockRestore();
		isMultiSignatureSpy.mockRestore();
	});
});
