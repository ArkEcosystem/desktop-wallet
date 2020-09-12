import { BigNumber } from "@arkecosystem/platform-sdk-support";
import React from "react";
import { act, fireEvent, render, within } from "testing-library";

import { WalletHeader } from "./WalletHeader";

describe("WalletHeader", () => {
	const onSignMessage = jest.fn();
	const onVerifyMessage = jest.fn();
	const onDeleteWallet = jest.fn();
	const onUpdateWalletName = jest.fn();
	const onStar = jest.fn();
	const onStoreHash = jest.fn();

	afterEach(() => {
		onSignMessage.mockReset();
		onVerifyMessage.mockReset();
		onDeleteWallet.mockReset();
		onUpdateWalletName.mockReset();
		onStar.mockReset();
		onStoreHash.mockReset();
	});

	it("should render", () => {
		const { getByTestId, asFragment } = render(
			<WalletHeader
				address="abc"
				balance={BigNumber.make(0)}
				coin="Ark"
				network="mainnet"
				ticker="ARK"
				onDeleteWallet={onDeleteWallet}
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
				coin="Ark"
				network="mainnet"
				ticker="ARK"
				onDeleteWallet={onDeleteWallet}
				onSend={onSend}
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
				coin="Ark"
				isLedger
				isMultisig
				isStarred
				network="mainnet"
				ticker="ARK"
				onDeleteWallet={onDeleteWallet}
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
				coin="Ark"
				currencyDelta={delta}
				isLedger
				isMultisig
				isStarred
				network="mainnet"
				ticker="ARK"
				onDeleteWallet={onDeleteWallet}
				onSignMessage={onSignMessage}
				onStar={onStar}
				onStoreHash={onStoreHash}
				onUpdateWalletName={onUpdateWalletName}
				onVerifyMessage={onVerifyMessage}
			/>,
		);

		expect(getByText("arrowup.svg")).toBeTruthy();
		expect(getByText(`${delta}%`)).toBeTruthy();

		expect(asFragment()).toMatchSnapshot();
	});

	it("should handle sign message", () => {
		const { getByTestId } = render(
			<WalletHeader
				address="abc"
				balance={BigNumber.make(0)}
				coin="Ark"
				currencyBalance={BigNumber.make(10)}
				exchangeCurrency="USD"
				network="mainnet"
				publicKey="publicKey"
				ticker="ARK"
				onDeleteWallet={onDeleteWallet}
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
				address="abc"
				balance={BigNumber.make(0)}
				coin="Ark"
				currencyBalance={BigNumber.make(10)}
				exchangeCurrency="USD"
				network="mainnet"
				publicKey="publicKey"
				ticker="ARK"
				onDeleteWallet={onDeleteWallet}
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
				address="abc"
				balance={BigNumber.make(0)}
				coin="Ark"
				currencyBalance={BigNumber.make(10)}
				exchangeCurrency="USD"
				network="mainnet"
				publicKey="publicKey"
				ticker="ARK"
				onDeleteWallet={onDeleteWallet}
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
				address="abc"
				balance={BigNumber.make(0)}
				coin="Ark"
				currencyBalance={BigNumber.make(10)}
				exchangeCurrency="USD"
				network="mainnet"
				publicKey="publicKey"
				ticker="ARK"
				onDeleteWallet={onDeleteWallet}
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

		const updateWalletNameOption = getByTestId("dropdown__option--0");
		expect(updateWalletNameOption).toBeTruthy();

		act(() => {
			fireEvent.click(updateWalletNameOption);
		});

		expect(onUpdateWalletName).toHaveBeenCalled();
	});

	it("should handle star", () => {
		const { getByTestId } = render(
			<WalletHeader
				address="abc"
				balance={BigNumber.make(0)}
				coin="Ark"
				currencyBalance={BigNumber.make(10)}
				exchangeCurrency="USD"
				network="mainnet"
				publicKey="publicKey"
				ticker="ARK"
				onDeleteWallet={onDeleteWallet}
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
				coin="Ark"
				currencyBalance={BigNumber.make(10)}
				exchangeCurrency="USD"
				network="mainnet"
				publicKey="publicKey"
				ticker="ARK"
				onDeleteWallet={onDeleteWallet}
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

		const storeHashOption = getByTestId("dropdown__option--3");
		expect(storeHashOption).toBeTruthy();

		act(() => {
			fireEvent.click(storeHashOption);
		});

		expect(onStoreHash).toHaveBeenCalled();
	});
});
