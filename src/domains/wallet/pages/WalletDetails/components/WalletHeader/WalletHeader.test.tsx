import { Profile, ReadWriteWallet } from "@arkecosystem/platform-sdk-profiles";
import { BigNumber } from "@arkecosystem/platform-sdk-support";
import { createTransportReplayer, RecordStore } from "@ledgerhq/hw-transport-mocker";
import { LedgerProvider } from "app/contexts/Ledger/Ledger";
import { translations as commonTranslations } from "app/i18n/common/i18n";
import * as useQRCodeHook from "domains/wallet/components/ReceiveFunds/hooks";
import { translations as walletTranslations } from "domains/wallet/i18n";
import { createMemoryHistory } from "history";
import React from "react";
import { Route } from "react-router-dom";
import { act, env, fireEvent, getDefaultProfileId, render, renderWithRouter, waitFor, within } from "testing-library";

import { WalletHeader } from "./WalletHeader";

const history = createMemoryHistory();

let profile: Profile;
let wallet: ReadWriteWallet;

let walletUrl: string;

describe("WalletHeader", () => {
	beforeAll(async () => {
		profile = env.profiles().findById(getDefaultProfileId());
		wallet = profile.wallets().first();

		await wallet.syncVotes();

		walletUrl = `/profiles/${profile.id()}/wallets/${wallet.id()}`;

		jest.spyOn(useQRCodeHook, "useQRCode").mockImplementation(() => ({}));
	});

	afterAll(() => {
		useQRCodeHook.useQRCode.mockRestore();
	});

	it("should render", () => {
		const { asFragment, getByTestId, getByText } = render(<WalletHeader profile={profile} wallet={wallet} />);

		waitFor(() => expect(getByText(wallet.address())).toBeTruthy());

		expect(asFragment()).toMatchSnapshot();
	});

	it("should trigger onSend callback if provided", () => {
		const onSend = jest.fn();

		const { getByTestId } = render(<WalletHeader profile={profile} wallet={wallet} onSend={onSend} />);

		expect(getByTestId("WalletHeader__send-button")).toBeEnabled();

		fireEvent.click(getByTestId("WalletHeader__send-button"));

		expect(onSend).toHaveBeenCalled();
	});

	it("send button should be disabled if wallet has no balance", () => {
		const balanceSpy = jest.spyOn(wallet, "balance").mockReturnValue(BigNumber.ZERO);

		const { getByTestId } = render(<WalletHeader profile={profile} wallet={wallet} />);

		expect(getByTestId("WalletHeader__send-button")).toBeDisabled();

		balanceSpy.mockRestore();
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

	it.each(["cancel", "close"])("should open & %s sign message modal", (action) => {
		const transport: typeof Transport = createTransportReplayer(RecordStore.fromString(""));

		history.push(walletUrl);

		const { getByTestId, getByText } = renderWithRouter(
			<Route path="/profiles/:profileId/wallets/:walletId">
				<LedgerProvider transport={transport}>
					<WalletHeader profile={profile} wallet={wallet} />
				</LedgerProvider>
			</Route>,
			{
				routes: [walletUrl],
				history,
			},
		);

		expect(() => getByTestId("modal__inner")).toThrow(/Unable to find an element by/);

		act(() => {
			fireEvent.click(getByTestId("dropdown__toggle"));
		});

		act(() => {
			fireEvent.click(
				within(getByTestId("dropdown__content")).getByText(
					walletTranslations.PAGE_WALLET_DETAILS.OPTIONS.SIGN_MESSAGE,
				),
			);
		});

		expect(getByTestId("modal__inner")).toHaveTextContent(walletTranslations.MODAL_SIGN_MESSAGE.FORM_STEP.TITLE);

		act(() => {
			if (action === "close") {
				fireEvent.click(getByTestId("modal__close-btn"));
			} else {
				fireEvent.click(getByText(commonTranslations.CANCEL));
			}
		});

		expect(() => getByTestId("modal__inner")).toThrow(/Unable to find an element by/);
	});

	it.each(["cancel", "close"])("should open & %s verify message modal", (action) => {
		const { getByTestId, getByText } = render(<WalletHeader profile={profile} wallet={wallet} />);

		act(() => {
			fireEvent.click(getByTestId("dropdown__toggle"));
		});

		act(() => {
			fireEvent.click(
				within(getByTestId("dropdown__content")).getByText(
					walletTranslations.PAGE_WALLET_DETAILS.OPTIONS.VERIFY_MESSAGE,
				),
			);
		});

		expect(getByTestId("modal__inner")).toHaveTextContent(walletTranslations.MODAL_VERIFY_MESSAGE.TITLE);

		act(() => {
			if (action === "close") {
				fireEvent.click(getByTestId("modal__close-btn"));
			} else {
				fireEvent.click(getByText(commonTranslations.CANCEL));
			}
		});

		expect(() => getByTestId("modal__inner")).toThrow(/Unable to find an element by/);
	});

	it.each(["cancel", "close"])("should open & %s delete wallet modal", (action) => {
		const { getByTestId, getByText } = render(<WalletHeader profile={profile} wallet={wallet} />);

		act(() => {
			fireEvent.click(getByTestId("dropdown__toggle"));
		});

		act(() => {
			fireEvent.click(
				within(getByTestId("dropdown__content")).getByText(
					walletTranslations.PAGE_WALLET_DETAILS.OPTIONS.DELETE,
				),
			);
		});

		expect(getByTestId("modal__inner")).toHaveTextContent(walletTranslations.MODAL_DELETE_WALLET.TITLE);

		act(() => {
			if (action === "close") {
				fireEvent.click(getByTestId("modal__close-btn"));
			} else {
				fireEvent.click(getByText(commonTranslations.CANCEL));
			}
		});

		expect(() => getByTestId("modal__inner")).toThrow(/Unable to find an element by/);
	});

	it.each(["cancel", "close"])("should open & %s wallet name modal", (action) => {
		const { getByTestId, getByText } = render(<WalletHeader profile={profile} wallet={wallet} />);

		act(() => {
			fireEvent.click(getByTestId("dropdown__toggle"));
		});

		act(() => {
			fireEvent.click(
				within(getByTestId("dropdown__content")).getByText(
					walletTranslations.PAGE_WALLET_DETAILS.OPTIONS.WALLET_NAME,
				),
			);
		});

		waitFor(() =>
			expect(getByTestId("modal__inner")).toHaveTextContent(walletTranslations.MODAL_NAME_WALLET.TITLE),
		);

		act(() => {
			if (action === "close") {
				fireEvent.click(getByTestId("modal__close-btn"));
			} else {
				fireEvent.click(getByText(commonTranslations.CANCEL));
			}
		});

		expect(() => getByTestId("modal__inner")).toThrow(/Unable to find an element by/);
	});

	it("should open & close receive funds modal", () => {
		const { getByTestId } = render(<WalletHeader profile={profile} wallet={wallet} />);

		act(() => {
			fireEvent.click(getByTestId("dropdown__toggle"));
		});

		act(() => {
			fireEvent.click(
				within(getByTestId("dropdown__content")).getByText(
					walletTranslations.PAGE_WALLET_DETAILS.OPTIONS.RECEIVE_FUNDS,
				),
			);
		});

		expect(getByTestId("modal__inner")).toHaveTextContent(walletTranslations.MODAL_RECEIVE_FUNDS.TITLE);

		act(() => {
			fireEvent.click(getByTestId("modal__close-btn"));
		});
		expect(() => getByTestId("modal__inner")).toThrow(/Unable to find an element by/);
	});

	it("should handle multisignature registration", () => {
		history.push(walletUrl);

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
			fireEvent.click(
				within(getByTestId("dropdown__content")).getByText(
					walletTranslations.PAGE_WALLET_DETAILS.OPTIONS.MULTISIGNATURE,
				),
			);
		});

		expect(historySpy).toHaveBeenCalledWith(
			`/profiles/${profile.id()}/wallets/${wallet.id()}/send-registration/multiSignature`,
		);

		historySpy.mockRestore();
	});

	it("should handle second signature registration", () => {
		history.push(walletUrl);

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
			fireEvent.click(
				within(getByTestId("dropdown__content")).getByText(
					walletTranslations.PAGE_WALLET_DETAILS.OPTIONS.SECOND_SIGNATURE,
				),
			);
		});

		expect(historySpy).toHaveBeenCalledWith(
			`/profiles/${profile.id()}/wallets/${wallet.id()}/send-registration/secondSignature`,
		);

		historySpy.mockRestore();
	});

	it("should handle delegate registration", () => {
		history.push(walletUrl);

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
			fireEvent.click(
				within(getByTestId("dropdown__content")).getByText(
					walletTranslations.PAGE_WALLET_DETAILS.OPTIONS.REGISTER_DELEGATE,
				),
			);
		});

		expect(historySpy).toHaveBeenCalledWith(
			`/profiles/${profile.id()}/wallets/${wallet.id()}/send-registration/delegateRegistration`,
		);

		historySpy.mockRestore();
	});

	it("should handle delegate resignation", () => {
		history.push(walletUrl);

		const walletSpy = jest.spyOn(wallet, "isDelegate").mockReturnValue(true);
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
			fireEvent.click(
				within(getByTestId("dropdown__content")).getByText(
					walletTranslations.PAGE_WALLET_DETAILS.OPTIONS.RESIGN_DELEGATE,
				),
			);
		});

		expect(historySpy).toHaveBeenCalledWith(
			`/profiles/${profile.id()}/wallets/${wallet.id()}/send-delegate-resignation`,
		);

		historySpy.mockRestore();
		walletSpy.mockRestore();
	});

	it("should handle store hash option", () => {
		history.push(walletUrl);

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
			fireEvent.click(
				within(getByTestId("dropdown__content")).getByText(
					walletTranslations.PAGE_WALLET_DETAILS.OPTIONS.STORE_HASH,
				),
			);
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
