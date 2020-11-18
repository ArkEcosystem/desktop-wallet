/* eslint-disable @typescript-eslint/require-await */
import { Profile, ReadWriteWallet } from "@arkecosystem/platform-sdk-profiles";
import { BigNumber } from "@arkecosystem/platform-sdk-support";
import { createMemoryHistory } from "history";
import nock from "nock";
import React from "react";
import { Route } from "react-router-dom";
import entityRegistrationFixture from "tests/fixtures/coins/ark/devnet/transactions/entity-update.json";
import transactionFixture from "tests/fixtures/coins/ark/devnet/transactions/transfer.json";
import {
	act,
	defaultNetMocks,
	env,
	fireEvent,
	getDefaultProfileId,
	RenderResult,
	renderWithRouter,
	syncDelegates,
	syncFees,
	waitFor,
} from "utils/testing-library";

import { SendEntityResignation } from "../SendEntityResignation";

let wallet: ReadWriteWallet;
let profile: Profile;

let resignationUrl: string;
const dashboardUrl = `/profiles/${getDefaultProfileId()}/dashboard`;

const passphrase = "v3wallet2";
const history = createMemoryHistory();

const renderPage = (type?: "entity") => {
	const path =
		type === "entity"
			? "/profiles/:profileId/wallets/:walletId/transactions/:transactionId/send-entity-resignation"
			: "/profiles/:profileId/wallets/:walletId/send-entity-resignation";

	const rendered: RenderResult = renderWithRouter(
		<Route path={path}>
			<SendEntityResignation />
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

const entity = {
	data: () => ({
		asset: () => entityRegistrationFixture.data.asset,
		id: () => entityRegistrationFixture.data.id,
	}),
	sender: () => entityRegistrationFixture.data.sender,
};

const createTransactionMock = (wallet: ReadWriteWallet) =>
	// @ts-ignore
	jest.spyOn(wallet.transaction(), "transaction").mockReturnValue(transactionResponse);

describe("SendEntityResignation", () => {
	beforeAll(async () => {
		profile = env.profiles().findById(getDefaultProfileId());
		wallet = profile.wallets().findById("d044a552-7a49-411c-ae16-8ff407acc430");

		await syncDelegates();
		await syncFees();

		entity.wallet = () => wallet;
	});

	describe("Entity Resignation", () => {
		beforeEach(() => {
			nock.cleanAll();
			defaultNetMocks();

			nock("https://dwallets.ark.io")
				.get(`/api/transactions/${entityRegistrationFixture.data.id}`)
				.reply(200, entityRegistrationFixture);

			resignationUrl = `/profiles/${getDefaultProfileId()}/wallets/${wallet.id()}/transactions/${entity
				.data()
				.id()}/send-entity-resignation`;
			history.push(resignationUrl);
		});

		it("should render 1st step as entity", async () => {
			const { asFragment, getByTestId } = renderPage("entity");

			await waitFor(() => expect(getByTestId("SendEntityResignation__form-step")).toBeTruthy());
			expect(asFragment()).toMatchSnapshot();
		});

		it("should change fee", async () => {
			const { asFragment, getByTestId } = renderPage("entity");

			await waitFor(() => expect(getByTestId("SendEntityResignation__form-step")).toBeTruthy());

			// Fee
			act(() => {
				fireEvent.input(getByTestId("InputCurrency"), { target: { value: "1" } });
			});
			await waitFor(() => expect(getByTestId("InputCurrency")).toHaveValue("1"));

			expect(asFragment()).toMatchSnapshot();
		});

		it("should render 2nd step as entity", async () => {
			history.push(resignationUrl, { type: "entity", entity });
			const { asFragment, getByTestId } = renderPage("entity");

			await waitFor(() => expect(getByTestId("SendEntityResignation__form-step")).toBeTruthy());

			await act(async () => {
				fireEvent.click(getByTestId("SendEntityResignation__continue-button"));
			});

			expect(getByTestId("SendEntityResignation__review-step")).toBeTruthy();
			expect(asFragment()).toMatchSnapshot();
		});

		it("should successfully sign and submit an entity resignation transaction", async () => {
			history.push(resignationUrl, { type: "entity", entity });

			const secondPublicKeyMock = jest
				.spyOn(wallet, "secondPublicKey")
				.mockReturnValue(await wallet.coin().identity().publicKey().fromMnemonic("second mnemonic"));

			const signMock = jest
				.spyOn(wallet.transaction(), "signEntityResignation")
				.mockReturnValue(Promise.resolve(transactionFixture.data.id));
			const broadcastMock = jest.spyOn(wallet.transaction(), "broadcast").mockImplementation();
			const transactionMock = createTransactionMock(wallet);

			const { asFragment, getByTestId } = renderPage("entity");

			await waitFor(() => expect(getByTestId("SendEntityResignation__form-step")).toBeTruthy());

			await act(async () => {
				fireEvent.click(getByTestId("SendEntityResignation__continue-button"));
			});
			await act(async () => {
				fireEvent.click(getByTestId("SendEntityResignation__continue-button"));
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
				fireEvent.click(getByTestId("SendEntityResignation__send-button"));
			});

			await waitFor(() => expect(getByTestId("SendEntityResignation__summary-step")).toBeTruthy());
			expect(asFragment()).toMatchSnapshot();

			secondPublicKeyMock.mockRestore();
			signMock.mockRestore();
			broadcastMock.mockRestore();
			transactionMock.mockRestore();
		});
	});

	describe("Delegate Resignation", () => {
		beforeEach(() => {
			resignationUrl = `/profiles/${getDefaultProfileId()}/wallets/${wallet.id()}/send-entity-resignation`;
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
				fireEvent.click(getByTestId("SendEntityResignation__continue-button"));
			});

			expect(getByTestId("SendDelegateResignation__review-step")).toBeTruthy();
			expect(asFragment()).toMatchSnapshot();
		});

		it("should navigate between 1st and 2nd step", async () => {
			const { getByTestId } = renderPage();

			await waitFor(() => expect(getByTestId("SendDelegateResignation__form-step")).toBeTruthy());

			act(() => {
				fireEvent.click(getByTestId("SendEntityResignation__continue-button"));
			});

			await waitFor(() => expect(getByTestId("SendDelegateResignation__review-step")).toBeTruthy());

			act(() => {
				fireEvent.click(getByTestId("SendEntityResignation__back-button"));
			});

			await waitFor(() => expect(getByTestId("SendDelegateResignation__form-step")).toBeTruthy());
		});

		it("should render 3rd step", async () => {
			const { asFragment, getByTestId } = renderPage();

			await waitFor(() => expect(getByTestId("SendDelegateResignation__form-step")).toBeTruthy());

			await act(async () => {
				fireEvent.click(getByTestId("SendEntityResignation__continue-button"));
			});
			await act(async () => {
				fireEvent.click(getByTestId("SendEntityResignation__continue-button"));
			});

			expect(getByTestId("AuthenticationStep")).toBeTruthy();
			expect(asFragment()).toMatchSnapshot();
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
				fireEvent.click(getByTestId("SendEntityResignation__continue-button"));
			});
			await act(async () => {
				fireEvent.click(getByTestId("SendEntityResignation__continue-button"));
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
				fireEvent.click(getByTestId("SendEntityResignation__send-button"));
			});

			await waitFor(() => expect(getByTestId("AuthenticationStep__mnemonic")).toHaveAttribute("aria-invalid"));
			await waitFor(() => expect(getByTestId("SendEntityResignation__send-button")).toBeDisabled());

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
				fireEvent.click(getByTestId("SendEntityResignation__continue-button"));
			});
			await act(async () => {
				fireEvent.click(getByTestId("SendEntityResignation__continue-button"));
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
				fireEvent.click(getByTestId("SendEntityResignation__send-button"));
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
				fireEvent.click(getByTestId("SendEntityResignation__continue-button"));
			});
			await act(async () => {
				fireEvent.click(getByTestId("SendEntityResignation__continue-button"));
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
				fireEvent.click(getByTestId("SendEntityResignation__send-button"));
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
				fireEvent.click(getByTestId("SendEntityResignation__continue-button"));
			});
			await act(async () => {
				fireEvent.click(getByTestId("SendEntityResignation__continue-button"));
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
				fireEvent.click(getByTestId("SendEntityResignation__send-button"));
			});

			await waitFor(() => expect(getByTestId("SendDelegateResignation__summary-step")).toBeTruthy());
			expect(asFragment()).toMatchSnapshot();

			secondPublicKeyMock.mockRestore();
			signMock.mockRestore();
			broadcastMock.mockRestore();
			transactionMock.mockRestore();
		});

		// it("should handle download button after succesful submission", async () => {
		// 	const signMock = jest
		// 		.spyOn(wallet.transaction(), "signDelegateResignation")
		// 		.mockReturnValue(Promise.resolve(transactionFixture.data.id));
		// 	const broadcastMock = jest.spyOn(wallet.transaction(), "broadcast").mockImplementation();
		// 	const transactionMock = createTransactionMock(wallet);

		// 	const { getByTestId } = renderPage();

		// 	await waitFor(() => expect(getByTestId("SendDelegateResignation__form-step")).toBeTruthy());

		// 	await act(async () => {
		// 		fireEvent.click(getByTestId("SendEntityResignation__continue-button"));
		// 	});
		// 	await act(async () => {
		// 		fireEvent.click(getByTestId("SendEntityResignation__continue-button"));
		// 	});

		// 	act(() => {
		// 		fireEvent.input(getByTestId("AuthenticationStep__mnemonic"), {
		// 			target: {
		// 				value: "test",
		// 			},
		// 		});
		// 	});

		// 	await waitFor(() => expect(getByTestId("AuthenticationStep__mnemonic")).toHaveValue("test"));

		// 	act(() => {
		// 		fireEvent.input(getByTestId("AuthenticationStep__second-mnemonic"), {
		// 			target: {
		// 				value: "test",
		// 			},
		// 		});
		// 	});

		// 	await waitFor(() => expect(getByTestId("AuthenticationStep__second-mnemonic")).toHaveValue("test"));

		// 	act(() => {
		// 		fireEvent.click(getByTestId("SendEntityResignation__send-button"));
		// 	});

		// 	await waitFor(() => expect(getByTestId("SendDelegateResignation__summary-step")).toBeTruthy());

		// 	act(() => {
		// 		fireEvent.click(getByTestId("SendEntityResignation__download-button"));
		// 	});

		// 	expect(defaultProps.onDownload).toHaveBeenCalledWith(transactionResponse);

		// 	signMock.mockRestore();
		// 	broadcastMock.mockRestore();
		// 	transactionMock.mockRestore();
		// });

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
				fireEvent.click(getByTestId("SendEntityResignation__continue-button"));
			});
			await act(async () => {
				fireEvent.click(getByTestId("SendEntityResignation__continue-button"));
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
				fireEvent.click(getByTestId("SendEntityResignation__send-button"));
			});

			await waitFor(() => expect(getByTestId("SendDelegateResignation__summary-step")).toBeTruthy());

			act(() => {
				fireEvent.click(getByTestId("SendEntityResignation__wallet-button"));
			});

			expect(history.location.pathname).toMatch(dashboardUrl);

			secondPublicKeyMock.mockRestore();
			signMock.mockRestore();
			broadcastMock.mockRestore();
			transactionMock.mockRestore();
		});
	});
});
