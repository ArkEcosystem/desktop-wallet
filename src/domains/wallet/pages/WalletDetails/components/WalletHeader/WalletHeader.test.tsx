import { BigNumber } from "@arkecosystem/platform-sdk-support";
import React from "react";
import { act, fireEvent, render, within } from "testing-library";

import { WalletHeader } from "./WalletHeader";

describe("WalletHeader", () => {
	const onDeleteWallet = jest.fn();
	const onMultiSignature = jest.fn();
	const onReceiveFunds = jest.fn();
	const onSecondSignature = jest.fn();
	const onSignMessage = jest.fn();
	const onStar = jest.fn();
	const onStoreHash = jest.fn();
	const onUpdateWalletName = jest.fn();
	const onVerifyMessage = jest.fn();

	afterEach(() => {
		onDeleteWallet.mockReset();
		onMultiSignature.mockReset();
		onReceiveFunds.mockReset();
		onSecondSignature.mockReset();
		onSignMessage.mockReset();
		onStar.mockReset();
		onStoreHash.mockReset();
		onUpdateWalletName.mockReset();
		onVerifyMessage.mockReset();
	});

	it("should render", () => {
		const { getByTestId, asFragment } = render(
			<WalletHeader
				address="abc"
				balance={BigNumber.make(0)}
				coin="ARK"
				network="mainnet"
				ticker="ARK"
				onDeleteWallet={onDeleteWallet}
				onMultiSignature={onMultiSignature}
				onReceiveFunds={onReceiveFunds}
				onSecondSignature={onSecondSignature}
				onSignMessage={onSignMessage}
				onStar={onStar}
				onStoreHash={onStoreHash}
				onUpdateWalletName={onUpdateWalletName}
				onVerifyMessage={onVerifyMessage}
			/>,
		);
		expect(() => getByTestId("WalletHeader__currency-balance")).toThrowError();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should emit actions", () => {
		const onSend = jest.fn();

		const { getByTestId } = render(
			<WalletHeader
				address="abc"
				balance={BigNumber.make(0)}
				coin="ARK"
				network="mainnet"
				ticker="ARK"
				onDeleteWallet={onDeleteWallet}
				onMultiSignature={onMultiSignature}
				onReceiveFunds={onReceiveFunds}
				onSecondSignature={onSecondSignature}
				onSignMessage={onSignMessage}
				onStar={onStar}
				onStoreHash={onStoreHash}
				onUpdateWalletName={onUpdateWalletName}
				onVerifyMessage={onVerifyMessage}
			/>,
		);

		fireEvent.click(within(getByTestId("WalletHeader__more-button")).getByTestId("dropdown__toggle"));
		fireEvent.click(getByTestId("WalletHeader__send-button"));

		expect(onSend).toHaveBeenCalled();
		expect(within(getByTestId("WalletHeader__more-button")).getByTestId("dropdown__content")).toBeTruthy();
	});

	it("should show modifiers", () => {
		const { getByTestId, asFragment } = render(
			<WalletHeader
				address="abc"
				balance={BigNumber.make(0)}
				coin="ARK"
				isLedger
				isMultisig
				isStarred
				network="mainnet"
				ticker="ARK"
				onDeleteWallet={onDeleteWallet}
				onMultiSignature={onMultiSignature}
				onReceiveFunds={onReceiveFunds}
				onSecondSignature={onSecondSignature}
				onSignMessage={onSignMessage}
				onStar={onStar}
				onStoreHash={onStoreHash}
				onUpdateWalletName={onUpdateWalletName}
				onVerifyMessage={onVerifyMessage}
			/>,
		);
		expect(getByTestId("WalletHeader__ledger")).toBeTruthy();
		expect(getByTestId("WalletHeader__multisig")).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});

	it.each([-5, 5])("should show currency delta (%s%)", (delta) => {
		const { getByTestId, getByText, asFragment } = render(
			<WalletHeader
				address="abc"
				balance={BigNumber.make(0)}
				coin="ARK"
				currencyDelta={delta}
				isLedger
				isMultisig
				isStarred
				network="mainnet"
				ticker="ARK"
				onDeleteWallet={onDeleteWallet}
				onMultiSignature={onMultiSignature}
				onReceiveFunds={onReceiveFunds}
				onSecondSignature={onSecondSignature}
				onSignMessage={onSignMessage}
				onStar={onStar}
				onStoreHash={onStoreHash}
				onUpdateWalletName={onUpdateWalletName}
				onVerifyMessage={onVerifyMessage}
			/>,
		);

		expect(getByText("chevron-up.svg")).toBeTruthy();
		expect(getByText(`${delta}%`)).toBeTruthy();

		expect(asFragment()).toMatchSnapshot();
	});

	it("should handle sign message", () => {
		const { getByTestId } = render(
			<WalletHeader
				address="abc"
				balance={BigNumber.make(0)}
				coin="ARK"
				currencyBalance={BigNumber.make(10)}
				exchangeCurrency="USD"
				network="mainnet"
				publicKey="publicKey"
				ticker="ARK"
				showSignMessageOption={true}
				showStoreHashOption={true}
				showVerifyMessageOption={true}
				onDeleteWallet={onDeleteWallet}
				onMultiSignature={onMultiSignature}
				onReceiveFunds={onReceiveFunds}
				onSecondSignature={onSecondSignature}
				onSignMessage={onSignMessage}
				onStar={onStar}
				onStoreHash={onStoreHash}
				onUpdateWalletName={onUpdateWalletName}
				onVerifyMessage={onVerifyMessage}
			/>,
		);

		const dropdown = getByTestId("dropdown__toggle");
		expect(dropdown).toBeTruthy();

		act(() => {
			fireEvent.click(dropdown);
		});

		const signOption = getByTestId("dropdown__option--additional-0");
		expect(signOption).toBeTruthy();

		act(() => {
			fireEvent.click(signOption);
		});

		expect(onSignMessage).toHaveBeenCalled();
	});

	it("should handle verify message", () => {
		const { getByTestId } = render(
			<WalletHeader
				address="abc"
				balance={BigNumber.make(0)}
				coin="ARK"
				currencyBalance={BigNumber.make(10)}
				exchangeCurrency="USD"
				network="mainnet"
				publicKey="publicKey"
				ticker="ARK"
				showSignMessageOption={true}
				showStoreHashOption={true}
				showVerifyMessageOption={true}
				onDeleteWallet={onDeleteWallet}
				onMultiSignature={onMultiSignature}
				onReceiveFunds={onReceiveFunds}
				onSecondSignature={onSecondSignature}
				onSignMessage={onSignMessage}
				onStar={onStar}
				onStoreHash={onStoreHash}
				onUpdateWalletName={onUpdateWalletName}
				onVerifyMessage={onVerifyMessage}
			/>,
		);

		const dropdown = getByTestId("dropdown__toggle");
		expect(dropdown).toBeTruthy();

		act(() => {
			fireEvent.click(dropdown);
		});

		const verifyMessageOption = getByTestId("dropdown__option--additional-1");
		expect(verifyMessageOption).toBeTruthy();

		act(() => {
			fireEvent.click(verifyMessageOption);
		});

		expect(onVerifyMessage).toHaveBeenCalled();
	});

	it("should handle delete wallet", () => {
		const { getByTestId } = render(
			<WalletHeader
				address="abc"
				balance={BigNumber.make(0)}
				coin="ARK"
				currencyBalance={BigNumber.make(10)}
				exchangeCurrency="USD"
				network="mainnet"
				publicKey="publicKey"
				ticker="ARK"
				showSignMessageOption={true}
				showStoreHashOption={true}
				showVerifyMessageOption={true}
				onDeleteWallet={onDeleteWallet}
				onMultiSignature={onMultiSignature}
				onReceiveFunds={onReceiveFunds}
				onSecondSignature={onSecondSignature}
				onSignMessage={onSignMessage}
				onStar={onStar}
				onStoreHash={onStoreHash}
				onUpdateWalletName={onUpdateWalletName}
				onVerifyMessage={onVerifyMessage}
			/>,
		);

		const dropdown = getByTestId("dropdown__toggle");
		expect(dropdown).toBeTruthy();

		act(() => {
			fireEvent.click(dropdown);
		});

		const deleteWalletOption = getByTestId("dropdown__option--secondary-0");
		expect(deleteWalletOption).toBeTruthy();

		act(() => {
			fireEvent.click(deleteWalletOption);
		});

		expect(onDeleteWallet).toHaveBeenCalled();
	});

	it("should handle update wallet name", () => {
		const { getByTestId } = render(
			<WalletHeader
				address="abc"
				balance={BigNumber.make(0)}
				coin="ARK"
				currencyBalance={BigNumber.make(10)}
				exchangeCurrency="USD"
				network="mainnet"
				publicKey="publicKey"
				ticker="ARK"
				showSignMessageOption={true}
				showStoreHashOption={true}
				showVerifyMessageOption={true}
				onDeleteWallet={onDeleteWallet}
				onMultiSignature={onMultiSignature}
				onReceiveFunds={onReceiveFunds}
				onSecondSignature={onSecondSignature}
				onSignMessage={onSignMessage}
				onStar={onStar}
				onStoreHash={onStoreHash}
				onUpdateWalletName={onUpdateWalletName}
				onVerifyMessage={onVerifyMessage}
			/>,
		);

		const dropdown = getByTestId("dropdown__toggle");
		expect(dropdown).toBeTruthy();

		act(() => {
			fireEvent.click(dropdown);
		});

		const updateWalletNameOption = getByTestId("dropdown__option--primary-0");
		expect(updateWalletNameOption).toBeTruthy();

		act(() => {
			fireEvent.click(updateWalletNameOption);
		});

		expect(onUpdateWalletName).toHaveBeenCalled();
	});

	it("should handle receive funds", () => {
		const { getByTestId } = render(
			<WalletHeader
				address="abc"
				balance={BigNumber.make(0)}
				coin="ARK"
				currencyBalance={BigNumber.make(10)}
				exchangeCurrency="USD"
				network="mainnet"
				publicKey="publicKey"
				ticker="ARK"
				onDeleteWallet={onDeleteWallet}
				onMultiSignature={onMultiSignature}
				onReceiveFunds={onReceiveFunds}
				onSecondSignature={onSecondSignature}
				onSignMessage={onSignMessage}
				onStar={onStar}
				onStoreHash={onStoreHash}
				onUpdateWalletName={onUpdateWalletName}
				onVerifyMessage={onVerifyMessage}
			/>,
		);

		const dropdown = getByTestId("dropdown__toggle");
		expect(dropdown).toBeTruthy();

		act(() => {
			fireEvent.click(dropdown);
		});

		const receiveFundsOptions = getByTestId("dropdown__option--primary-1");
		expect(receiveFundsOptions).toBeTruthy();

		act(() => {
			fireEvent.click(receiveFundsOptions);
		});

		expect(onReceiveFunds).toHaveBeenCalled();
	});

	it("should handle multisignature registration", () => {
		const { getByTestId } = render(
			<WalletHeader
				address="abc"
				balance={BigNumber.make(0)}
				coin="ARK"
				currencyBalance={BigNumber.make(10)}
				exchangeCurrency="USD"
				network="mainnet"
				publicKey="publicKey"
				ticker="ARK"
				showMultiSignatureOption={true}
				onDeleteWallet={onDeleteWallet}
				onMultiSignature={onMultiSignature}
				onReceiveFunds={onReceiveFunds}
				onSecondSignature={onSecondSignature}
				onSignMessage={onSignMessage}
				onStar={onStar}
				onStoreHash={onStoreHash}
				onUpdateWalletName={onUpdateWalletName}
				onVerifyMessage={onVerifyMessage}
			/>,
		);

		const dropdown = getByTestId("dropdown__toggle");
		expect(dropdown).toBeTruthy();

		act(() => {
			fireEvent.click(dropdown);
		});

		const multiSignatureOption = getByTestId("dropdown__option--primary-1");
		expect(multiSignatureOption).toBeTruthy();

		act(() => {
			fireEvent.click(multiSignatureOption);
		});

		expect(onMultiSignature).toHaveBeenCalled();
	});

	it("should handle second signature registration", () => {
		const { getByTestId } = render(
			<WalletHeader
				address="abc"
				balance={BigNumber.make(0)}
				coin="ARK"
				currencyBalance={BigNumber.make(10)}
				exchangeCurrency="USD"
				network="mainnet"
				publicKey="publicKey"
				ticker="ARK"
				showSecondSignatureOption={true}
				onDeleteWallet={onDeleteWallet}
				onMultiSignature={onMultiSignature}
				onReceiveFunds={onReceiveFunds}
				onSecondSignature={onSecondSignature}
				onSignMessage={onSignMessage}
				onStar={onStar}
				onStoreHash={onStoreHash}
				onUpdateWalletName={onUpdateWalletName}
				onVerifyMessage={onVerifyMessage}
			/>,
		);

		const dropdown = getByTestId("dropdown__toggle");
		expect(dropdown).toBeTruthy();

		act(() => {
			fireEvent.click(dropdown);
		});

		const secondSignatureOption = getByTestId("dropdown__option--primary-1");
		expect(secondSignatureOption).toBeTruthy();

		act(() => {
			fireEvent.click(secondSignatureOption);
		});

		expect(onSecondSignature).toHaveBeenCalled();
	});

	it("should handle star", () => {
		const { getByTestId } = render(
			<WalletHeader
				address="abc"
				balance={BigNumber.make(0)}
				coin="ARK"
				currencyBalance={BigNumber.make(10)}
				exchangeCurrency="USD"
				network="mainnet"
				publicKey="publicKey"
				ticker="ARK"
				onDeleteWallet={onDeleteWallet}
				onMultiSignature={onMultiSignature}
				onReceiveFunds={onReceiveFunds}
				onSecondSignature={onSecondSignature}
				onSignMessage={onSignMessage}
				onStar={onStar}
				onStoreHash={onStoreHash}
				onUpdateWalletName={onUpdateWalletName}
				onVerifyMessage={onVerifyMessage}
			/>,
		);

		const button = getByTestId("WalletHeader__star-button");
		expect(button).toBeTruthy();

		act(() => {
			fireEvent.click(button);
		});

		expect(onStar).toHaveBeenCalled();
	});

	it("should handle store hash option", () => {
		const { getByTestId } = render(
			<WalletHeader
				address="abc"
				balance={BigNumber.make(0)}
				coin="ARK"
				currencyBalance={BigNumber.make(10)}
				exchangeCurrency="USD"
				network="mainnet"
				publicKey="publicKey"
				ticker="ARK"
				showSignMessageOption={true}
				showStoreHashOption={true}
				showVerifyMessageOption={true}
				onDeleteWallet={onDeleteWallet}
				onMultiSignature={onMultiSignature}
				onReceiveFunds={onReceiveFunds}
				onSecondSignature={onSecondSignature}
				onSignMessage={onSignMessage}
				onStar={onStar}
				onStoreHash={onStoreHash}
				onUpdateWalletName={onUpdateWalletName}
				onVerifyMessage={onVerifyMessage}
			/>,
		);

		const dropdown = getByTestId("dropdown__toggle");
		expect(dropdown).toBeTruthy();

		act(() => {
			fireEvent.click(dropdown);
		});

		const storeHashOption = getByTestId("dropdown__option--additional-2");
		expect(storeHashOption).toBeTruthy();

		act(() => {
			fireEvent.click(storeHashOption);
		});

		expect(onStoreHash).toHaveBeenCalled();
	});
});
