/* eslint-disable @typescript-eslint/require-await */

import { Profile, ReadWriteWallet } from "@arkecosystem/platform-sdk-profiles";
import { BigNumber } from "@arkecosystem/platform-sdk-support";
import { createMemoryHistory } from "history";
import React from "react";
import { Route } from "react-router-dom";
import transactionFixture from "tests/fixtures/coins/ark/transactions/transfer.json";
import entityFixture from "tests/fixtures/registrations/businesses.json";
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

import { SendEntityResignation } from "../SendEntityResignation";
import { SendEntityResignationProps } from "./SendEntityResignation.models";

let wallet: ReadWriteWallet;
let profile: Profile;

let resignRegistrationURL: string;
const dashboardUrl = `/profiles/${getDefaultProfileId()}/dashboard`;
const defaultProps: any = {
	onDownload: jest.fn(),
};

const history = createMemoryHistory();

const renderDelegatePage = (props: SendEntityResignationProps = defaultProps) => {
	const allProps = { ...defaultProps, ...props };

	const rendered: RenderResult = renderWithRouter(
		<Route path="/profiles/:profileId/wallets/:walletId/send-entity-resignation">
			<SendEntityResignation {...allProps} />
		</Route>,
		{
			routes: [resignRegistrationURL],
			history,
		},
	);
	return rendered;
};

const renderEntityPage = (props: SendEntityResignationProps = defaultProps) => {
	const allProps = { ...defaultProps, ...props };

	const rendered: RenderResult = renderWithRouter(
		<Route path="/profiles/:profileId/wallets/:walletId/transactions/:transactionId/send-entity-resignation">
			<SendEntityResignation {...allProps} />
		</Route>,
		{
			routes: [resignRegistrationURL],
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
		asset: () => entityFixture.data[0].asset,
		id: () => "test-id",
	}),
	sender: () => entityFixture.data[0].sender,
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

	describe("entity", () => {
		beforeEach(() => {
			resignRegistrationURL = `/profiles/${getDefaultProfileId()}/wallets/${wallet.id()}/transactions/${entity
				.data()
				.id()}/send-entity-resignation`;
			history.push(resignRegistrationURL);
		});

		it.only("should render 1st step as entity", async () => {
			const { asFragment, getByTestId } = renderEntityPage();

			await waitFor(() => expect(getByTestId("SendEntityResignation__form-step")).toBeTruthy());
			expect(defaultProps.onDownload).toHaveBeenCalledTimes(0);
			expect(asFragment()).toMatchSnapshot();
		});

		it("should render 2nd step as entity", async () => {
			history.push(resignRegistrationURL, { type: "entity", entity });
			const { asFragment, getByTestId } = renderEntityPage();

			await waitFor(() => expect(getByTestId("SendEntityResignation__form-step")).toBeTruthy());

			await act(async () => {
				fireEvent.click(getByTestId("SendEntityResignation__continue-button"));
			});

			expect(getByTestId("SendEntityResignation__second-step")).toBeTruthy();
			expect(defaultProps.onDownload).toHaveBeenCalledTimes(0);
			expect(asFragment()).toMatchSnapshot();
		});

		it("should succesfully sign and submit an entity resignation transaction", async () => {
			history.push(resignRegistrationURL, { type: "entity", entity });

			const signMock = jest
				.spyOn(wallet.transaction(), "signEntityResignation")
				.mockReturnValue(Promise.resolve(transactionFixture.data.id));
			const broadcastMock = jest.spyOn(wallet.transaction(), "broadcast").mockImplementation();
			const transactionMock = createTransactionMock(wallet);

			const { asFragment, getByTestId } = renderEntityPage();

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
						value: "test",
					},
				});
			});

			await waitFor(() => expect(getByTestId("AuthenticationStep__mnemonic")).toHaveValue("test"));

			act(() => {
				fireEvent.input(getByTestId("AuthenticationStep__second-mnemonic"), {
					target: {
						value: "test",
					},
				});
			});

			await waitFor(() => expect(getByTestId("AuthenticationStep__second-mnemonic")).toHaveValue("test"));

			act(() => {
				fireEvent.click(getByTestId("SendEntityResignation__send-button"));
			});

			await waitFor(() => expect(getByTestId("SendEntityResignation__summary-step")).toBeTruthy());
			expect(defaultProps.onDownload).toHaveBeenCalledTimes(0);
			expect(asFragment()).toMatchSnapshot();

			signMock.mockRestore();
			broadcastMock.mockRestore();
			transactionMock.mockRestore();
		});
	});

	describe("delegate", () => {
		beforeEach(() => {
			resignRegistrationURL = `/profiles/${getDefaultProfileId()}/wallets/${wallet.id()}/send-entity-resignation`;
			history.push(resignRegistrationURL);
		});

		it("should render 1st step", async () => {
			const { asFragment, getByTestId } = renderDelegatePage();

			await waitFor(() => expect(getByTestId("SendDelegateResignation__form-step")).toBeTruthy());
			expect(defaultProps.onDownload).toHaveBeenCalledTimes(0);
			expect(asFragment()).toMatchSnapshot();
		});

		it("should render 2nd step", async () => {
			const { asFragment, getByTestId } = renderDelegatePage();

			await waitFor(() => expect(getByTestId("SendDelegateResignation__form-step")).toBeTruthy());

			await act(async () => {
				fireEvent.click(getByTestId("SendEntityResignation__continue-button"));
			});

			expect(getByTestId("SendDelegateResignation__review-step")).toBeTruthy();
			expect(defaultProps.onDownload).toHaveBeenCalledTimes(0);
			expect(asFragment()).toMatchSnapshot();
		});

		it("should navigate between 1st and 2nd step", async () => {
			const { getByTestId } = renderDelegatePage();

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
			const { asFragment, getByTestId } = renderDelegatePage();

			await waitFor(() => expect(getByTestId("SendDelegateResignation__form-step")).toBeTruthy());

			await act(async () => {
				fireEvent.click(getByTestId("SendEntityResignation__continue-button"));
			});
			await act(async () => {
				fireEvent.click(getByTestId("SendEntityResignation__continue-button"));
			});

			expect(getByTestId("AuthenticationStep")).toBeTruthy();
			expect(defaultProps.onDownload).toHaveBeenCalledTimes(0);
			expect(asFragment()).toMatchSnapshot();
		});

		it("should show authentication error", async () => {
			const signMock = jest.spyOn(wallet.transaction(), "signDelegateResignation").mockImplementation(() => {
				throw new Error();
			});
			const consoleMock = jest.spyOn(console, "log").mockImplementation();

			const { asFragment, getByTestId } = renderDelegatePage();

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
						value: "test",
					},
				});
			});

			await waitFor(() => expect(getByTestId("AuthenticationStep__mnemonic")).toHaveValue("test"));

			act(() => {
				fireEvent.input(getByTestId("AuthenticationStep__second-mnemonic"), {
					target: {
						value: "test",
					},
				});
			});

			await waitFor(() => expect(getByTestId("AuthenticationStep__second-mnemonic")).toHaveValue("test"));

			act(() => {
				fireEvent.click(getByTestId("SendEntityResignation__send-button"));
			});

			await waitFor(() => expect(getByTestId("AuthenticationStep__mnemonic")).toHaveAttribute("aria-invalid"));
			await waitFor(() => expect(getByTestId("SendEntityResignation__send-button")).toBeDisabled());

			expect(getByTestId("AuthenticationStep")).toBeTruthy();
			expect(defaultProps.onDownload).toHaveBeenCalledTimes(0);
			expect(asFragment()).toMatchSnapshot();

			signMock.mockRestore();
			consoleMock.mockRestore();
		});

		it("should succesfully sign and submit resignation transaction", async () => {
			const signMock = jest
				.spyOn(wallet.transaction(), "signDelegateResignation")
				.mockReturnValue(Promise.resolve(transactionFixture.data.id));
			const broadcastMock = jest.spyOn(wallet.transaction(), "broadcast").mockImplementation();
			const transactionMock = createTransactionMock(wallet);

			const { asFragment, getByTestId } = renderDelegatePage();

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
						value: "test",
					},
				});
			});

			await waitFor(() => expect(getByTestId("AuthenticationStep__mnemonic")).toHaveValue("test"));

			act(() => {
				fireEvent.input(getByTestId("AuthenticationStep__second-mnemonic"), {
					target: {
						value: "test",
					},
				});
			});

			await waitFor(() => expect(getByTestId("AuthenticationStep__second-mnemonic")).toHaveValue("test"));

			act(() => {
				fireEvent.click(getByTestId("SendEntityResignation__send-button"));
			});

			await waitFor(() => expect(getByTestId("SendDelegateResignation__summary-step")).toBeTruthy());
			expect(defaultProps.onDownload).toHaveBeenCalledTimes(0);
			expect(asFragment()).toMatchSnapshot();

			signMock.mockRestore();
			broadcastMock.mockRestore();
			transactionMock.mockRestore();
		});

		it("should handle download button after succesful submittion", async () => {
			const signMock = jest
				.spyOn(wallet.transaction(), "signDelegateResignation")
				.mockReturnValue(Promise.resolve(transactionFixture.data.id));
			const broadcastMock = jest.spyOn(wallet.transaction(), "broadcast").mockImplementation();
			const transactionMock = createTransactionMock(wallet);

			const { getByTestId } = renderDelegatePage();

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
						value: "test",
					},
				});
			});

			await waitFor(() => expect(getByTestId("AuthenticationStep__mnemonic")).toHaveValue("test"));

			act(() => {
				fireEvent.input(getByTestId("AuthenticationStep__second-mnemonic"), {
					target: {
						value: "test",
					},
				});
			});

			await waitFor(() => expect(getByTestId("AuthenticationStep__second-mnemonic")).toHaveValue("test"));

			act(() => {
				fireEvent.click(getByTestId("SendEntityResignation__send-button"));
			});

			await waitFor(() => expect(getByTestId("SendDelegateResignation__summary-step")).toBeTruthy());

			act(() => {
				fireEvent.click(getByTestId("SendEntityResignation__download-button"));
			});

			expect(defaultProps.onDownload).toHaveBeenCalledWith(transactionResponse);

			signMock.mockRestore();
			broadcastMock.mockRestore();
			transactionMock.mockRestore();
		});

		it("should back button after successful submittion", async () => {
			const signMock = jest
				.spyOn(wallet.transaction(), "signDelegateResignation")
				.mockReturnValue(Promise.resolve(transactionFixture.data.id));
			const broadcastMock = jest.spyOn(wallet.transaction(), "broadcast").mockImplementation();
			const transactionMock = createTransactionMock(wallet);

			const { getByTestId } = renderDelegatePage();

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
						value: "test",
					},
				});
			});

			await waitFor(() => expect(getByTestId("AuthenticationStep__mnemonic")).toHaveValue("test"));

			act(() => {
				fireEvent.input(getByTestId("AuthenticationStep__second-mnemonic"), {
					target: {
						value: "test",
					},
				});
			});

			await waitFor(() => expect(getByTestId("AuthenticationStep__second-mnemonic")).toHaveValue("test"));

			act(() => {
				fireEvent.click(getByTestId("SendEntityResignation__send-button"));
			});

			await waitFor(() => expect(getByTestId("SendDelegateResignation__summary-step")).toBeTruthy());

			act(() => {
				fireEvent.click(getByTestId("SendEntityResignation__wallet-button"));
			});

			expect(history.location.pathname).toMatch(dashboardUrl);

			signMock.mockRestore();
			broadcastMock.mockRestore();
			transactionMock.mockRestore();
		});
	});
});
