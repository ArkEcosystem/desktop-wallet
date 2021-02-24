/* eslint-disable @typescript-eslint/require-await */
import { Profile, ReadWriteWallet } from "@arkecosystem/platform-sdk-profiles";
import { BigNumber } from "@arkecosystem/platform-sdk-support";
import { createMemoryHistory } from "history";
import React from "react";
import { Route } from "react-router-dom";
import transactionFixture from "tests/fixtures/coins/ark/devnet/transactions/transfer.json";
import {
	act,
	env,
	fireEvent,
	getDefaultProfileId,
	RenderResult,
	renderWithRouter,
	syncDelegates,
	syncFees,
	waitFor,
} from "utils/testing-library";

import { SendDelegateResignation } from "../SendDelegateResignation";

let wallet: ReadWriteWallet;
let profile: Profile;

let resignationUrl: string;
const dashboardUrl = `/profiles/${getDefaultProfileId()}/dashboard`;

const passphrase = "v3wallet2";
const history = createMemoryHistory();

const renderPage = () => {
	const path = "/profiles/:profileId/wallets/:walletId/send-delegate-resignation";

	const rendered: RenderResult = renderWithRouter(
		<Route path={path}>
			<SendDelegateResignation />
		</Route>,
		{
			routes: [resignationUrl],
			history,
		},
	);

	return rendered;
};

const transactionResponse = {
	id: () => transactionFixture.data.id,
	sender: () => transactionFixture.data.sender,
	recipient: () => transactionFixture.data.recipient,
	amount: () => BigNumber.make(transactionFixture.data.amount),
	fee: () => BigNumber.make(transactionFixture.data.fee),
	data: () => transactionFixture.data,
};

const createTransactionMock = (wallet: ReadWriteWallet) =>
	// @ts-ignore
	jest.spyOn(wallet.transaction(), "transaction").mockReturnValue(transactionResponse);

describe("SendDelegateResignation", () => {
	beforeAll(async () => {
		profile = env.profiles().findById(getDefaultProfileId());
		wallet = profile.wallets().findById("d044a552-7a49-411c-ae16-8ff407acc430");

		await syncDelegates();
		await syncFees();
	});

	describe("Delegate Resignation", () => {
		beforeEach(() => {
			resignationUrl = `/profiles/${getDefaultProfileId()}/wallets/${wallet.id()}/send-delegate-resignation`;
			history.push(resignationUrl);
		});

		it("should render 1st step", async () => {
			const { asFragment, getByTestId } = renderPage();

			await waitFor(() => expect(getByTestId("SendDelegateResignation__form-step")).toBeTruthy());
			expect(asFragment()).toMatchSnapshot();
		});

		it("should change fee", async () => {
			const { asFragment, getByTestId } = renderPage();

			await waitFor(() => expect(getByTestId("SendDelegateResignation__form-step")).toBeTruthy());

			// Fee
			act(() => {
				fireEvent.input(getByTestId("InputCurrency"), { target: { value: "1" } });
			});
			await waitFor(() => expect(getByTestId("InputCurrency")).toHaveValue("1"));

			expect(asFragment()).toMatchSnapshot();
		});

		it("should render 2nd step", async () => {
			const { asFragment, getByTestId } = renderPage();

			await waitFor(() => expect(getByTestId("SendDelegateResignation__form-step")).toBeTruthy());

			await act(async () => {
				fireEvent.click(getByTestId("SendDelegateResignation__continue-button"));
			});

			expect(getByTestId("SendDelegateResignation__review-step")).toBeTruthy();
			expect(asFragment()).toMatchSnapshot();
		});

		it("should go back to wallet details", async () => {
			const historySpy = jest.spyOn(history, "push").mockImplementation();

			const { getByTestId } = renderPage();

			await waitFor(() => expect(getByTestId("SendDelegateResignation__form-step")).toBeTruthy());

			act(() => {
				fireEvent.click(getByTestId("SendDelegateResignation__back-button"));
			});

			expect(historySpy).toHaveBeenCalledWith(`/profiles/${profile.id()}/wallets/${wallet.id()}`);

			historySpy.mockRestore();
		});

		it("should navigate between 1st and 2nd step", async () => {
			const { getByTestId } = renderPage();

			await waitFor(() => expect(getByTestId("SendDelegateResignation__form-step")).toBeTruthy());

			act(() => {
				fireEvent.click(getByTestId("SendDelegateResignation__continue-button"));
			});

			await waitFor(() => expect(getByTestId("SendDelegateResignation__review-step")).toBeTruthy());

			act(() => {
				fireEvent.click(getByTestId("SendDelegateResignation__back-button"));
			});

			await waitFor(() => expect(getByTestId("SendDelegateResignation__form-step")).toBeTruthy());
		});

		it("should render 3rd step", async () => {
			const { asFragment, getByTestId } = renderPage();

			await waitFor(() => expect(getByTestId("SendDelegateResignation__form-step")).toBeTruthy());

			await act(async () => {
				fireEvent.click(getByTestId("SendDelegateResignation__continue-button"));
			});
			await act(async () => {
				fireEvent.click(getByTestId("SendDelegateResignation__continue-button"));
			});

			expect(getByTestId("AuthenticationStep")).toBeTruthy();
			expect(asFragment()).toMatchSnapshot();
		});

		it("should return to form step by cancelling fee warning", async () => {
			const { asFragment, getByTestId } = renderPage();

			await waitFor(() => expect(getByTestId("SendDelegateResignation__form-step")).toBeTruthy());

			// Fee
			fireEvent.change(getByTestId("InputCurrency"), { target: { value: "30" } });
			expect(getByTestId("InputCurrency")).toHaveValue("30");

			await waitFor(() => expect(getByTestId("SendDelegateResignation__continue-button")).not.toBeDisabled());
			fireEvent.click(getByTestId("SendDelegateResignation__continue-button"));

			// Review Step
			expect(getByTestId("SendDelegateResignation__review-step")).toBeTruthy();
			fireEvent.click(getByTestId("SendDelegateResignation__continue-button"));

			// Fee warning
			expect(getByTestId("FeeWarning__cancel-button")).toBeTruthy();
			fireEvent.click(getByTestId("FeeWarning__cancel-button"));

			await waitFor(() => expect(getByTestId("SendDelegateResignation__form-step")).toBeTruthy());
		});

		it("should proceed to authentication step by confirming fee warning", async () => {
			const { asFragment, getByTestId } = renderPage();

			await waitFor(() => expect(getByTestId("SendDelegateResignation__form-step")).toBeTruthy());

			// Fee
			fireEvent.change(getByTestId("InputCurrency"), { target: { value: "30" } });
			expect(getByTestId("InputCurrency")).toHaveValue("30");

			await waitFor(() => expect(getByTestId("SendDelegateResignation__continue-button")).not.toBeDisabled());
			fireEvent.click(getByTestId("SendDelegateResignation__continue-button"));

			// Review Step
			expect(getByTestId("SendDelegateResignation__review-step")).toBeTruthy();
			fireEvent.click(getByTestId("SendDelegateResignation__continue-button"));

			// Fee warning
			expect(getByTestId("FeeWarning__continue-button")).toBeTruthy();
			fireEvent.click(getByTestId("FeeWarning__continue-button"));

			await waitFor(() => expect(getByTestId("AuthenticationStep")).toBeTruthy());
		});

		it("should show mnemonic authentication error", async () => {
			const signMock = jest.spyOn(wallet.transaction(), "signDelegateResignation").mockImplementation(() => {
				throw new Error("Signatory should be");
			});
			const consoleMock = jest.spyOn(console, "log").mockImplementation();
			const secondPublicKeyMock = jest
				.spyOn(wallet, "secondPublicKey")
				.mockReturnValue(await wallet.coin().identity().publicKey().fromMnemonic("second mnemonic"));

			const { asFragment, getByTestId } = renderPage();

			await waitFor(() => expect(getByTestId("SendDelegateResignation__form-step")).toBeTruthy());

			await act(async () => {
				fireEvent.click(getByTestId("SendDelegateResignation__continue-button"));
			});
			await act(async () => {
				fireEvent.click(getByTestId("SendDelegateResignation__continue-button"));
			});

			act(() => {
				fireEvent.input(getByTestId("AuthenticationStep__mnemonic"), {
					target: {
						value: passphrase,
					},
				});
			});

			await waitFor(() => expect(getByTestId("AuthenticationStep__mnemonic")).toHaveValue(passphrase));

			act(() => {
				fireEvent.input(getByTestId("AuthenticationStep__second-mnemonic"), {
					target: {
						value: "second mnemonic",
					},
				});
			});

			await waitFor(() =>
				expect(getByTestId("AuthenticationStep__second-mnemonic")).toHaveValue("second mnemonic"),
			);

			act(() => {
				fireEvent.click(getByTestId("SendDelegateResignation__send-button"));
			});

			await waitFor(() => expect(getByTestId("AuthenticationStep__mnemonic")).toHaveAttribute("aria-invalid"));
			await waitFor(() => expect(getByTestId("SendDelegateResignation__send-button")).toBeDisabled());

			expect(getByTestId("AuthenticationStep")).toBeTruthy();
			expect(asFragment()).toMatchSnapshot();

			secondPublicKeyMock.mockRestore();
			signMock.mockRestore();
			consoleMock.mockRestore();
		});

		it("should show error step", async () => {
			const signMock = jest.spyOn(wallet.transaction(), "signDelegateResignation").mockImplementation(() => {
				throw new Error();
			});
			const consoleMock = jest.spyOn(console, "log").mockImplementation();
			const secondPublicKeyMock = jest
				.spyOn(wallet, "secondPublicKey")
				.mockReturnValue(await wallet.coin().identity().publicKey().fromMnemonic("second mnemonic"));

			const { asFragment, getByTestId } = renderPage();

			await waitFor(() => expect(getByTestId("SendDelegateResignation__form-step")).toBeTruthy());

			await act(async () => {
				fireEvent.click(getByTestId("SendDelegateResignation__continue-button"));
			});
			await act(async () => {
				fireEvent.click(getByTestId("SendDelegateResignation__continue-button"));
			});

			act(() => {
				fireEvent.input(getByTestId("AuthenticationStep__mnemonic"), {
					target: {
						value: passphrase,
					},
				});
			});

			await waitFor(() => expect(getByTestId("AuthenticationStep__mnemonic")).toHaveValue(passphrase));

			act(() => {
				fireEvent.input(getByTestId("AuthenticationStep__second-mnemonic"), {
					target: {
						value: "second mnemonic",
					},
				});
			});

			await waitFor(() =>
				expect(getByTestId("AuthenticationStep__second-mnemonic")).toHaveValue("second mnemonic"),
			);

			act(() => {
				fireEvent.click(getByTestId("SendDelegateResignation__send-button"));
			});

			await waitFor(() => expect(getByTestId("ErrorStep")).toBeTruthy());
			expect(asFragment()).toMatchSnapshot();

			secondPublicKeyMock.mockRestore();
			signMock.mockRestore();
			consoleMock.mockRestore();
		});

		it("should show error step and go back", async () => {
			const signMock = jest.spyOn(wallet.transaction(), "signDelegateResignation").mockImplementation(() => {
				throw new Error();
			});
			const consoleMock = jest.spyOn(console, "log").mockImplementation();
			const secondPublicKeyMock = jest
				.spyOn(wallet, "secondPublicKey")
				.mockReturnValue(await wallet.coin().identity().publicKey().fromMnemonic("second mnemonic"));

			const { asFragment, getByTestId } = renderPage();

			await waitFor(() => expect(getByTestId("SendDelegateResignation__form-step")).toBeTruthy());

			await act(async () => {
				fireEvent.click(getByTestId("SendDelegateResignation__continue-button"));
			});
			await act(async () => {
				fireEvent.click(getByTestId("SendDelegateResignation__continue-button"));
			});

			act(() => {
				fireEvent.input(getByTestId("AuthenticationStep__mnemonic"), {
					target: {
						value: passphrase,
					},
				});
			});

			await waitFor(() => expect(getByTestId("AuthenticationStep__mnemonic")).toHaveValue(passphrase));

			act(() => {
				fireEvent.input(getByTestId("AuthenticationStep__second-mnemonic"), {
					target: {
						value: "second mnemonic",
					},
				});
			});

			await waitFor(() =>
				expect(getByTestId("AuthenticationStep__second-mnemonic")).toHaveValue("second mnemonic"),
			);

			act(() => {
				fireEvent.click(getByTestId("SendDelegateResignation__send-button"));
			});

			await waitFor(() => expect(getByTestId("ErrorStep")).toBeTruthy());
			expect(asFragment()).toMatchSnapshot();

			act(() => {
				fireEvent.click(getByTestId("ErrorStep__wallet-button"));
			});

			const walletDetailPage = `/profiles/${getDefaultProfileId()}/wallets/${wallet.id()}`;
			await waitFor(() => expect(history.location.pathname).toEqual(walletDetailPage));

			secondPublicKeyMock.mockRestore();
			signMock.mockRestore();
			consoleMock.mockRestore();
		});

		it("should successfully sign and submit resignation transaction", async () => {
			const secondPublicKeyMock = jest
				.spyOn(wallet, "secondPublicKey")
				.mockReturnValue(await wallet.coin().identity().publicKey().fromMnemonic("second mnemonic"));
			const signMock = jest
				.spyOn(wallet.transaction(), "signDelegateResignation")
				.mockReturnValue(Promise.resolve(transactionFixture.data.id));
			const broadcastMock = jest.spyOn(wallet.transaction(), "broadcast").mockImplementation();
			const transactionMock = createTransactionMock(wallet);

			const { asFragment, getByTestId } = renderPage();

			await waitFor(() => expect(getByTestId("SendDelegateResignation__form-step")).toBeTruthy());

			await act(async () => {
				fireEvent.click(getByTestId("SendDelegateResignation__continue-button"));
			});
			await act(async () => {
				fireEvent.click(getByTestId("SendDelegateResignation__continue-button"));
			});

			act(() => {
				fireEvent.input(getByTestId("AuthenticationStep__mnemonic"), {
					target: {
						value: passphrase,
					},
				});
			});

			await waitFor(() => expect(getByTestId("AuthenticationStep__mnemonic")).toHaveValue(passphrase));

			act(() => {
				fireEvent.input(getByTestId("AuthenticationStep__second-mnemonic"), {
					target: {
						value: "second mnemonic",
					},
				});
			});

			await waitFor(() =>
				expect(getByTestId("AuthenticationStep__second-mnemonic")).toHaveValue("second mnemonic"),
			);

			act(() => {
				fireEvent.click(getByTestId("SendDelegateResignation__send-button"));
			});

			await waitFor(() => expect(getByTestId("SendDelegateResignation__summary-step")).toBeTruthy());
			expect(asFragment()).toMatchSnapshot();

			secondPublicKeyMock.mockRestore();
			signMock.mockRestore();
			broadcastMock.mockRestore();
			transactionMock.mockRestore();
		});

		it("should back button after successful submission", async () => {
			const secondPublicKeyMock = jest
				.spyOn(wallet, "secondPublicKey")
				.mockReturnValue(await wallet.coin().identity().publicKey().fromMnemonic("second mnemonic"));
			const signMock = jest
				.spyOn(wallet.transaction(), "signDelegateResignation")
				.mockReturnValue(Promise.resolve(transactionFixture.data.id));
			const broadcastMock = jest.spyOn(wallet.transaction(), "broadcast").mockImplementation();
			const transactionMock = createTransactionMock(wallet);

			const { getByTestId } = renderPage();

			await waitFor(() => expect(getByTestId("SendDelegateResignation__form-step")).toBeTruthy());

			await act(async () => {
				fireEvent.click(getByTestId("SendDelegateResignation__continue-button"));
			});
			await act(async () => {
				fireEvent.click(getByTestId("SendDelegateResignation__continue-button"));
			});

			act(() => {
				fireEvent.input(getByTestId("AuthenticationStep__mnemonic"), {
					target: {
						value: passphrase,
					},
				});
			});

			await waitFor(() => expect(getByTestId("AuthenticationStep__mnemonic")).toHaveValue(passphrase));

			act(() => {
				fireEvent.input(getByTestId("AuthenticationStep__second-mnemonic"), {
					target: {
						value: "second mnemonic",
					},
				});
			});

			await waitFor(() =>
				expect(getByTestId("AuthenticationStep__second-mnemonic")).toHaveValue("second mnemonic"),
			);

			act(() => {
				fireEvent.click(getByTestId("SendDelegateResignation__send-button"));
			});

			await waitFor(() => expect(getByTestId("SendDelegateResignation__summary-step")).toBeTruthy());

			act(() => {
				fireEvent.click(getByTestId("SendDelegateResignation__wallet-button"));
			});

			expect(history.location.pathname).toMatch(`/profiles/${getDefaultProfileId()}/wallets/${wallet.id()}`);

			secondPublicKeyMock.mockRestore();
			signMock.mockRestore();
			broadcastMock.mockRestore();
			transactionMock.mockRestore();
		});
	});
});
