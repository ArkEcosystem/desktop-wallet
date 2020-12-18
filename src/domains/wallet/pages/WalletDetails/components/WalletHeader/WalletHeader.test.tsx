import { Profile, ReadWriteWallet } from "@arkecosystem/platform-sdk-profiles";
import { translations as walletTranslations } from "domains/wallet/i18n";
import { createMemoryHistory } from "history";
import React from "react";
import { Route } from "react-router-dom";
import { act, env, fireEvent, getDefaultProfileId, render, renderWithRouter, within } from "testing-library";

import { WalletHeader } from "./WalletHeader";

const history = createMemoryHistory();

let profile: Profile;
let wallet: ReadWriteWallet;

let walletUrl: string;

describe("WalletHeader", () => {
	beforeEach(() => {
		profile = env.profiles().findById(getDefaultProfileId());
		wallet = profile.wallets().first();

		walletUrl = `/profiles/${profile.id()}/wallets/${wallet.id()}`;

		history.push(walletUrl);
	});

	it("should render", () => {
		const { getByTestId, asFragment } = render(<WalletHeader profile={profile} wallet={wallet} />);

		expect(asFragment()).toMatchSnapshot();
	});

	it("should trigger onSend callback if provided", () => {
		const onSend = jest.fn();

		const { getByTestId } = render(<WalletHeader profile={profile} wallet={wallet} onSend={onSend} />);

		fireEvent.click(getByTestId("WalletHeader__send-button"));

		expect(onSend).toHaveBeenCalled();
	});

	it("should show modifiers", () => {
		const ledgerSpy = jest.spyOn(wallet, "isLedger").mockReturnValue(true);
		const multisigSpy = jest.spyOn(wallet, "isMultiSignature").mockReturnValue(true);

		const { getByTestId, asFragment } = render(<WalletHeader profile={profile} wallet={wallet} />);
		expect(getByTestId("WalletHeader__ledger")).toBeTruthy();
		expect(getByTestId("WalletHeader__multisig")).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();

		ledgerSpy.mockRestore();
		multisigSpy.mockRestore();
	});

	it.each([-5, 5])("should show currency delta (%s%)", (delta) => {
		const { getByTestId, getByText, asFragment } = render(
			<WalletHeader profile={profile} wallet={wallet} currencyDelta={delta} />,
		);

		expect(getByText("chevron-up.svg")).toBeTruthy();
		expect(getByText(`${delta}%`)).toBeTruthy();

		expect(asFragment()).toMatchSnapshot();
	});

	it("should open & close sign message modal", () => {
		const { getByTestId } = render(<WalletHeader profile={profile} wallet={wallet} />);

		expect(() => getByTestId("modal__inner")).toThrow(/Unable to find an element by/);

		act(() => {
			fireEvent.click(getByTestId("dropdown__toggle"));
		});

		act(() => {
			fireEvent.click(getByTestId("dropdown__option--additional-0"));
		});

		expect(getByTestId("modal__inner")).toHaveTextContent(walletTranslations.MODAL_SIGN_MESSAGE.TITLE);

		act(() => {
			fireEvent.click(getByTestId("modal__close-btn"));
		});
		expect(() => getByTestId("modal__inner")).toThrow(/Unable to find an element by/);
	});

	it("should open & close verify message modal", () => {
		const { getByTestId } = render(<WalletHeader profile={profile} wallet={wallet} />);

		act(() => {
			fireEvent.click(getByTestId("dropdown__toggle"));
		});

		act(() => {
			fireEvent.click(getByTestId("dropdown__option--additional-1"));
		});

		expect(getByTestId("modal__inner")).toHaveTextContent(walletTranslations.MODAL_VERIFY_MESSAGE.TITLE);

		act(() => {
			fireEvent.click(getByTestId("modal__close-btn"));
		});
		expect(() => getByTestId("modal__inner")).toThrow(/Unable to find an element by/);
	});

	it("should open & close delete wallet modal", () => {
		const { getByTestId } = render(<WalletHeader profile={profile} wallet={wallet} />);

		act(() => {
			fireEvent.click(getByTestId("dropdown__toggle"));
		});

		act(() => {
			fireEvent.click(getByTestId("dropdown__option--secondary-0"));
		});

		expect(getByTestId("modal__inner")).toHaveTextContent(walletTranslations.MODAL_DELETE_WALLET.TITLE);

		act(() => {
			fireEvent.click(getByTestId("modal__close-btn"));
		});
		expect(() => getByTestId("modal__inner")).toThrow(/Unable to find an element by/);
	});

	it("should open & close wallet name modal", () => {
		const { getByTestId } = render(<WalletHeader profile={profile} wallet={wallet} />);

		act(() => {
			fireEvent.click(getByTestId("dropdown__toggle"));
		});

		act(() => {
			fireEvent.click(getByTestId("dropdown__option--primary-0"));
		});

		expect(getByTestId("modal__inner")).toHaveTextContent(walletTranslations.MODAL_NAME_WALLET.TITLE);

		act(() => {
			fireEvent.click(getByTestId("modal__close-btn"));
		});
		expect(() => getByTestId("modal__inner")).toThrow(/Unable to find an element by/);
	});

	it("should open & close receive funds modal", () => {
		const { getByTestId } = render(<WalletHeader profile={profile} wallet={wallet} />);

		act(() => {
			fireEvent.click(getByTestId("dropdown__toggle"));
		});

		act(() => {
			fireEvent.click(getByTestId("dropdown__option--primary-1"));
		});

		expect(getByTestId("modal__inner")).toHaveTextContent(walletTranslations.MODAL_RECEIVE_FUNDS.TITLE);

		act(() => {
			fireEvent.click(getByTestId("modal__close-btn"));
		});
		expect(() => getByTestId("modal__inner")).toThrow(/Unable to find an element by/);
	});

	it("should handle multisignature registration", () => {
		const historySpy = jest.spyOn(history, "push");

		const { getByTestId } = renderWithRouter(
			<Route path="/profiles/:profileId/wallets/:walletId">
				<WalletHeader profile={profile} wallet={wallet} />
			</Route>,
			{
				routes: [walletUrl],
				history,
			},
		);

		act(() => {
			fireEvent.click(getByTestId("dropdown__toggle"));
		});

		act(() => {
			fireEvent.click(within(getByTestId("dropdown__content")).getByText("Multisignature"));
		});

		expect(historySpy).toHaveBeenCalledWith(
			`/profiles/${profile.id()}/wallets/${wallet.id()}/send-registration/multiSignature`,
		);

		historySpy.mockRestore();
	});

	it("should handle second signature registration", () => {
		const historySpy = jest.spyOn(history, "push");

		const { getByTestId } = renderWithRouter(
			<Route path="/profiles/:profileId/wallets/:walletId">
				<WalletHeader profile={profile} wallet={wallet} />
			</Route>,
			{
				routes: [walletUrl],
				history,
			},
		);

		act(() => {
			fireEvent.click(getByTestId("dropdown__toggle"));
		});

		act(() => {
			fireEvent.click(within(getByTestId("dropdown__content")).getByText("Second Signature"));
		});

		expect(historySpy).toHaveBeenCalledWith(
			`/profiles/${profile.id()}/wallets/${wallet.id()}/send-registration/secondSignature`,
		);

		historySpy.mockRestore();
	});

	it("should handle store hash option", () => {
		const historySpy = jest.spyOn(history, "push");

		const { getByTestId } = renderWithRouter(
			<Route path="/profiles/:profileId/wallets/:walletId">
				<WalletHeader profile={profile} wallet={wallet} />
			</Route>,
			{
				routes: [walletUrl],
				history,
			},
		);

		act(() => {
			fireEvent.click(getByTestId("dropdown__toggle"));
		});

		act(() => {
			fireEvent.click(within(getByTestId("dropdown__content")).getByText("Store Hash"));
		});

		expect(historySpy).toHaveBeenCalledWith(`/profiles/${profile.id()}/wallets/${wallet.id()}/send-ipfs`);

		historySpy.mockRestore();
	});

	// it("should handle star", () => {
	// 	const { getByTestId } = render(
	// 		<WalletHeader
	// 			address="abc"
	// 			balance={BigNumber.make(0)}
	// 			coin="ARK"
	// 			currencyBalance={BigNumber.make(10)}
	// 			exchangeCurrency="USD"
	// 			network="mainnet"
	// 			publicKey="publicKey"
	// 			ticker="ARK"
	// 			onDeleteWallet={onDeleteWallet}
	// 			onMultiSignature={onMultiSignature}
	// 			onReceiveFunds={onReceiveFunds}
	// 			onSecondSignature={onSecondSignature}
	// 			onSignMessage={onSignMessage}
	// 			onStar={onStar}
	// 			onStoreHash={onStoreHash}
	// 			onUpdateWalletName={onUpdateWalletName}
	// 			onVerifyMessage={onVerifyMessage}
	// 		/>,
	// 	);

	// 	const button = getByTestId("WalletHeader__star-button");
	// 	expect(button).toBeTruthy();

	// 	act(() => {
	// 		fireEvent.click(button);
	// 	});

	// 	expect(onStar).toHaveBeenCalled();
	// });
});
