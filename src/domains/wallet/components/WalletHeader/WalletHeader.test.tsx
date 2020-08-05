import { BigNumber } from "@arkecosystem/platform-sdk-support";
import React from "react";
import { act, fireEvent, render, within } from "testing-library";

import { WalletHeader } from "./WalletHeader";

describe("WalletHeader", () => {
	const onSignMessage = jest.fn();
	const onVerifyMessage = jest.fn();
	const onDeleteWallet = jest.fn();
	const onUpdateWalletName = jest.fn();

	it("should render", () => {
		const { getByTestId, asFragment } = render(
			<WalletHeader
				address="abc"
				balance={BigNumber.make(0)}
				coin="Ark"
				network="mainnet"
				ticker="ARK"
				onUpdateWalletName={onUpdateWalletName}
				onSignMessage={onSignMessage}
				onVerifyMessage={onVerifyMessage}
				onDeleteWallet={onDeleteWallet}
			/>,
		);
		expect(() => getByTestId("WalletHeader__currency-balance")).toThrowError();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should emit actions", () => {
		const onSend = jest.fn();
		const onStar = jest.fn();

		const { getByTestId } = render(
			<WalletHeader
				address="abc"
				balance={BigNumber.make(0)}
				coin="Ark"
				network="mainnet"
				ticker="ARK"
				onStar={onStar}
				onSend={onSend}
				onUpdateWalletName={onUpdateWalletName}
				onSignMessage={onSignMessage}
				onVerifyMessage={onVerifyMessage}
				onDeleteWallet={onDeleteWallet}
			/>,
		);

		fireEvent.click(within(getByTestId("WalletHeader__more-button")).getByTestId("dropdown__toggle"));
		fireEvent.click(getByTestId("WalletHeader__star-button"));
		fireEvent.click(getByTestId("WalletHeader__send-button"));

		expect(onSend).toHaveBeenCalled();
		expect(within(getByTestId("WalletHeader__more-button")).getByTestId("dropdown__content")).toBeTruthy();
		expect(onStar).toHaveBeenCalled();
	});

	it("should show modifiers", () => {
		const { getByTestId, asFragment } = render(
			<WalletHeader
				hasStarred
				isLedger
				isMultisig
				address="abc"
				balance={BigNumber.make(0)}
				coin="Ark"
				network="mainnet"
				ticker="ARK"
				onUpdateWalletName={onUpdateWalletName}
				onSignMessage={onSignMessage}
				onVerifyMessage={onVerifyMessage}
				onDeleteWallet={onDeleteWallet}
			/>,
		);
		expect(getByTestId("WalletHeader__ledger")).toBeTruthy();
		expect(getByTestId("WalletHeader__multisig")).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should show publicKey", () => {
		const address = "abc";
		const publicKey = "123";
		const { getByTestId, asFragment } = render(
			<WalletHeader
				currencyBalance={BigNumber.make(10)}
				exchangeCurrency="USD"
				publicKey={publicKey}
				address={address}
				balance={BigNumber.make(0)}
				coin="Ark"
				network="mainnet"
				ticker="ARK"
				onUpdateWalletName={onUpdateWalletName}
				onSignMessage={onSignMessage}
				onVerifyMessage={onVerifyMessage}
				onDeleteWallet={onDeleteWallet}
			/>,
		);

		expect(getByTestId("WalletHeader__balance")).toBeTruthy();
		expect(getByTestId("WalletHeader__currency-balance")).toBeTruthy();
		expect(getByTestId("WalletHeader__address-publickey")).toHaveTextContent(address);

		act(() => {
			fireEvent.click(getByTestId("WalletHeader__toggle"));
		});

		expect(getByTestId("WalletHeader__address-publickey")).toHaveTextContent(publicKey);
		expect(() => getByTestId("WalletHeader__balance")).toThrowError();
		expect(() => getByTestId("WalletHeader__currency-balance")).toThrowError();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should handle sign message", () => {
		const { getByTestId } = render(
			<WalletHeader
				currencyBalance={BigNumber.make(10)}
				exchangeCurrency="USD"
				publicKey="publicKey"
				address="abc"
				balance={BigNumber.make(0)}
				coin="Ark"
				network="mainnet"
				ticker="ARK"
				onUpdateWalletName={onUpdateWalletName}
				onSignMessage={onSignMessage}
				onVerifyMessage={onVerifyMessage}
				onDeleteWallet={onDeleteWallet}
			/>,
		);

		const dropdown = getByTestId("dropdown__toggle");
		expect(dropdown).toBeTruthy();

		act(() => {
			fireEvent.click(dropdown);
		});

		const signOption = getByTestId("dropdown__option--1");
		expect(signOption).toBeTruthy();

		act(() => {
			fireEvent.click(signOption);
		});

		expect(onSignMessage).toHaveBeenCalled();
	});

	it("should handle verify message", () => {
		const { getByTestId } = render(
			<WalletHeader
				currencyBalance={BigNumber.make(10)}
				exchangeCurrency="USD"
				publicKey="publicKey"
				address="abc"
				balance={BigNumber.make(0)}
				coin="Ark"
				network="mainnet"
				ticker="ARK"
				onUpdateWalletName={onUpdateWalletName}
				onSignMessage={onSignMessage}
				onVerifyMessage={onVerifyMessage}
				onDeleteWallet={onDeleteWallet}
			/>,
		);

		const dropdown = getByTestId("dropdown__toggle");
		expect(dropdown).toBeTruthy();

		act(() => {
			fireEvent.click(dropdown);
		});

		const verifyMessageOption = getByTestId("dropdown__option--2");
		expect(verifyMessageOption).toBeTruthy();

		act(() => {
			fireEvent.click(verifyMessageOption);
		});

		expect(onVerifyMessage).toHaveBeenCalled();
	});

	it("should handle delete wallet", () => {
		const { getByTestId } = render(
			<WalletHeader
				currencyBalance={BigNumber.make(10)}
				exchangeCurrency="USD"
				publicKey="publicKey"
				address="abc"
				balance={BigNumber.make(0)}
				coin="Ark"
				network="mainnet"
				ticker="ARK"
				onUpdateWalletName={onUpdateWalletName}
				onSignMessage={onSignMessage}
				onVerifyMessage={onVerifyMessage}
				onDeleteWallet={onDeleteWallet}
			/>,
		);

		const dropdown = getByTestId("dropdown__toggle");
		expect(dropdown).toBeTruthy();

		act(() => {
			fireEvent.click(dropdown);
		});

		const deleteWalletOption = getByTestId("dropdown__option--4");
		expect(deleteWalletOption).toBeTruthy();

		act(() => {
			fireEvent.click(deleteWalletOption);
		});

		expect(onDeleteWallet).toHaveBeenCalled();
	});

	it("should handle update wallet name", () => {
		const { getByTestId } = render(
			<WalletHeader
				currencyBalance={BigNumber.make(10)}
				exchangeCurrency="USD"
				publicKey="publicKey"
				address="abc"
				balance={BigNumber.make(0)}
				coin="Ark"
				network="mainnet"
				ticker="ARK"
				onUpdateWalletName={onUpdateWalletName}
				onSignMessage={onSignMessage}
				onVerifyMessage={onVerifyMessage}
				onDeleteWallet={onDeleteWallet}
			/>,
		);

		const dropdown = getByTestId("dropdown__toggle");
		expect(dropdown).toBeTruthy();

		act(() => {
			fireEvent.click(dropdown);
		});

		const updateWalletNameOption = getByTestId("dropdown__option--0");
		expect(updateWalletNameOption).toBeTruthy();

		act(() => {
			fireEvent.click(updateWalletNameOption);
		});

		expect(onUpdateWalletName).toHaveBeenCalled();
	});
});
