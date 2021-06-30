import { Contracts } from "@arkecosystem/platform-sdk-profiles";
import React from "react";
import { env, getDefaultProfileId, render, screen } from "utils/testing-library";

import { WalletIcons } from "./WalletIcons";

let wallet: Contracts.IReadWriteWallet;

describe("WalletIcons", () => {
	beforeEach(async () => {
		wallet = env.profiles().findById(getDefaultProfileId()).wallets().first();
		await wallet.synchroniser().identity();
	});

	it("should render the verified icon", () => {
		const walletSpy = jest.spyOn(wallet, "isKnown").mockReturnValue(true);

		render(<WalletIcons wallet={wallet} />);

		expect(screen.getByTestId("WalletIcon__Verified")).toBeTruthy();
		expect(screen.getByTestId("WalletIcon__Verified")).toHaveTextContent("verified.svg");

		walletSpy.mockRestore();
	});

	it("should render the ledger icon", () => {
		const walletSpy = jest.spyOn(wallet, "isLedger").mockReturnValue(true);

		render(<WalletIcons wallet={wallet} />);

		expect(screen.getByTestId("WalletIcon__Ledger")).toBeTruthy();
		expect(screen.getByTestId("WalletIcon__Ledger")).toHaveTextContent("ledger.svg");

		walletSpy.mockRestore();
	});

	it("should render the second signature icon", () => {
		const hasSyncedWithNetworkSpy = jest.spyOn(wallet, "hasSyncedWithNetwork").mockReturnValue(true);
		const walletSpy = jest.spyOn(wallet, "isSecondSignature").mockReturnValue(true);

		render(<WalletIcons wallet={wallet} />);

		expect(screen.getByTestId("WalletIcon__Key")).toBeTruthy();

		walletSpy.mockRestore();
		hasSyncedWithNetworkSpy.mockRestore();
	});

	it("should render the star icon", () => {
		const walletSpy = jest.spyOn(wallet, "isStarred").mockReturnValue(true);

		render(<WalletIcons wallet={wallet} />);

		expect(screen.getByTestId("WalletIcon__Star")).toBeTruthy();
		expect(screen.getByTestId("WalletIcon__Star")).toHaveTextContent("star.svg");

		walletSpy.mockRestore();
	});

	it("should render the multisignature icon", () => {
		const hasSyncedWithNetworkSpy = jest.spyOn(wallet, "hasSyncedWithNetwork").mockReturnValue(true);
		const isMultiSignatureSpy = jest.spyOn(wallet, "isMultiSignature").mockReturnValue(true);

		render(<WalletIcons wallet={wallet} />);

		expect(screen.getByTestId("WalletIcon__Multisig")).toBeTruthy();
		expect(screen.getByTestId("WalletIcon__Multisig")).toHaveTextContent("multisignature.svg");

		hasSyncedWithNetworkSpy.mockRestore();
		isMultiSignatureSpy.mockRestore();
	});

	it("should not render excluded icons", () => {
		const walletSpy = jest.spyOn(wallet, "isStarred").mockReturnValue(true);

		const { container } = render(<WalletIcons wallet={wallet} exclude={["isStarred"]} />);

		expect(screen.queryByTestId("WalletIcon__Star")).not.toBeInTheDocument();
		expect(container).not.toHaveTextContent("star.svg");

		walletSpy.mockRestore();
	});
});
