/* eslint-disable @typescript-eslint/require-await */
import { Profile, ReadWriteWallet } from "@arkecosystem/platform-sdk-profiles";
import { BigNumber } from "@arkecosystem/platform-sdk-support";
import { createMemoryHistory } from "history";
import React from "react";
import { Route } from "react-router-dom";
import transactionFixture from "tests/fixtures/coins/ark/transactions/transfer.json";
import {
	act,
	env,
	fireEvent,
	getDefaultProfileId,
	RenderResult,
	renderWithRouter,
	waitFor,
} from "utils/testing-library";

import { ResignRegistration } from "../ResignRegistration";
import { ResignRegistrationProps } from "./ResignRegistration.models";

let wallet: ReadWriteWallet;
let profile: Profile;

let resignRegistrationURL: string;
const dashboardUrl = `/profiles/${getDefaultProfileId()}/dashboard`;
const defaultProps: any = {
	onDownload: jest.fn(),
};

const history = createMemoryHistory();

const renderPage = (props: ResignRegistrationProps = defaultProps) => {
	const allProps = { ...defaultProps, ...props };

	const rendered: RenderResult = renderWithRouter(
		<Route path="/profiles/:profileId/transactions/:walletId/resignation">
			<ResignRegistration {...allProps} />
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
const createTransactionMock = (wallet: ReadWriteWallet) =>
	// @ts-ignore
	jest.spyOn(wallet.transaction(), "transaction").mockReturnValue(transactionResponse);

describe("ResignRegistration", () => {
	beforeAll(async () => {
		await env.coins().syncDelegates("ARK", "devnet");

		profile = env.profiles().findById(getDefaultProfileId());
		wallet = profile.wallets().findById("d044a552-7a49-411c-ae16-8ff407acc430");
	});

	beforeEach(() => {
		resignRegistrationURL = `/profiles/${getDefaultProfileId()}/transactions/${wallet.id()}/resignation`;
		history.push(resignRegistrationURL);
	});

	it("should render 1st step", async () => {
		const { asFragment, getByTestId } = renderPage();

		await waitFor(() => expect(getByTestId("ResignRegistration__first-step")).toBeTruthy());
		expect(defaultProps.onDownload).toHaveBeenCalledTimes(0);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render 2nd step", async () => {
		const { asFragment, getByTestId } = renderPage();

		await waitFor(() => expect(getByTestId("ResignRegistration__first-step")).toBeTruthy());

		await act(async () => {
			fireEvent.click(getByTestId("ResignRegistration__continue-button"));
		});

		expect(getByTestId("ResignRegistration__second-step")).toBeTruthy();
		expect(defaultProps.onDownload).toHaveBeenCalledTimes(0);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should navigate  between 1st and 2nd steps", async () => {
		const { getByTestId } = renderPage();

		await waitFor(() => expect(getByTestId("ResignRegistration__first-step")).toBeTruthy());

		act(() => {
			fireEvent.click(getByTestId("ResignRegistration__continue-button"));
		});

		await waitFor(() => expect(getByTestId("ResignRegistration__second-step")).toBeTruthy());

		act(() => {
			fireEvent.click(getByTestId("ResignRegistration__back-button"));
		});

		await waitFor(() => expect(getByTestId("ResignRegistration__first-step")).toBeTruthy());
	});

	it("should render 3rd step", async () => {
		const { asFragment, getByTestId } = renderPage();

		await waitFor(() => expect(getByTestId("ResignRegistration__first-step")).toBeTruthy());

		await act(async () => {
			fireEvent.click(getByTestId("ResignRegistration__continue-button"));
		});
		await act(async () => {
			fireEvent.click(getByTestId("ResignRegistration__continue-button"));
		});

		expect(getByTestId("ResignRegistration__third-step")).toBeTruthy();
		expect(defaultProps.onDownload).toHaveBeenCalledTimes(0);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render 3rd step with password", async () => {
		const { asFragment, getByTestId } = renderPage({ passwordType: "password" });

		await waitFor(() => expect(getByTestId("ResignRegistration__first-step")).toBeTruthy());

		await act(async () => {
			fireEvent.click(getByTestId("ResignRegistration__continue-button"));
		});
		await act(async () => {
			fireEvent.click(getByTestId("ResignRegistration__continue-button"));
		});

		expect(getByTestId("ResignRegistration__third-step")).toBeTruthy();
		expect(defaultProps.onDownload).toHaveBeenCalledTimes(0);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render 3rd step with ledger", async () => {
		const { asFragment, getByTestId } = renderPage({ passwordType: "ledger" });

		await waitFor(() => expect(getByTestId("ResignRegistration__first-step")).toBeTruthy());

		await act(async () => {
			fireEvent.click(getByTestId("ResignRegistration__continue-button"));
		});
		await act(async () => {
			fireEvent.click(getByTestId("ResignRegistration__continue-button"));
		});

		expect(getByTestId("ResignRegistration__third-step")).toBeTruthy();
		expect(defaultProps.onDownload).toHaveBeenCalledTimes(0);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should show authentication error", async () => {
		const signMock = jest.spyOn(wallet.transaction(), "signDelegateResignation").mockImplementation(() => {
			throw new Error();
		});

		const { asFragment, getByTestId } = renderPage();

		await waitFor(() => expect(getByTestId("ResignRegistration__first-step")).toBeTruthy());

		await act(async () => {
			fireEvent.click(getByTestId("ResignRegistration__continue-button"));
		});
		await act(async () => {
			fireEvent.click(getByTestId("ResignRegistration__continue-button"));
		});

		act(() => {
			fireEvent.change(getByTestId("ResignRegistration__mnemonic"), {
				target: {
					value: "test",
				},
			});
		});

		act(() => {
			fireEvent.click(getByTestId("ResignRegistration__send-button"));
		});

		await waitFor(() => expect(getByTestId("ResignRegistration__mnemonic")).toHaveAttribute("aria-invalid"));
		await waitFor(() => expect(getByTestId("ResignRegistration__send-button")).toBeDisabled());

		expect(getByTestId("ResignRegistration__third-step")).toBeTruthy();
		expect(defaultProps.onDownload).toHaveBeenCalledTimes(0);
		expect(asFragment()).toMatchSnapshot();

		signMock.mockRestore();
	});

	it("should succesfully sign and submit resignation transaction", async () => {
		const signMock = jest
			.spyOn(wallet.transaction(), "signDelegateResignation")
			.mockReturnValue(Promise.resolve(transactionFixture.data.id));
		const broadcastMock = jest.spyOn(wallet.transaction(), "broadcast").mockImplementation();
		const transactionMock = createTransactionMock(wallet);

		const { asFragment, getByTestId } = renderPage();

		await waitFor(() => expect(getByTestId("ResignRegistration__first-step")).toBeTruthy());

		await act(async () => {
			fireEvent.click(getByTestId("ResignRegistration__continue-button"));
		});
		await act(async () => {
			fireEvent.click(getByTestId("ResignRegistration__continue-button"));
		});

		act(() => {
			fireEvent.change(getByTestId("ResignRegistration__mnemonic"), {
				target: {
					value: "test",
				},
			});
		});

		act(() => {
			fireEvent.click(getByTestId("ResignRegistration__send-button"));
		});

		await waitFor(() => expect(getByTestId("ResignRegistration__fourth-step")).toBeTruthy());
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

		const { getByTestId } = renderPage();

		await waitFor(() => expect(getByTestId("ResignRegistration__first-step")).toBeTruthy());

		await act(async () => {
			fireEvent.click(getByTestId("ResignRegistration__continue-button"));
		});
		await act(async () => {
			fireEvent.click(getByTestId("ResignRegistration__continue-button"));
		});

		act(() => {
			fireEvent.change(getByTestId("ResignRegistration__mnemonic"), {
				target: {
					value: "test",
				},
			});
		});

		act(() => {
			fireEvent.click(getByTestId("ResignRegistration__send-button"));
		});

		await waitFor(() => expect(getByTestId("ResignRegistration__fourth-step")).toBeTruthy());

		act(() => {
			fireEvent.click(getByTestId("ResignRegistration__download-button"));
		});

		expect(defaultProps.onDownload).toHaveBeenCalledWith(transactionResponse);

		signMock.mockRestore();
		broadcastMock.mockRestore();
		transactionMock.mockRestore();
	});

	it("should back button after succesful submittion", async () => {
		const signMock = jest
			.spyOn(wallet.transaction(), "signDelegateResignation")
			.mockReturnValue(Promise.resolve(transactionFixture.data.id));
		const broadcastMock = jest.spyOn(wallet.transaction(), "broadcast").mockImplementation();
		const transactionMock = createTransactionMock(wallet);

		const { getByTestId } = renderPage();

		await waitFor(() => expect(getByTestId("ResignRegistration__first-step")).toBeTruthy());

		await act(async () => {
			fireEvent.click(getByTestId("ResignRegistration__continue-button"));
		});
		await act(async () => {
			fireEvent.click(getByTestId("ResignRegistration__continue-button"));
		});

		act(() => {
			fireEvent.change(getByTestId("ResignRegistration__mnemonic"), {
				target: {
					value: "test",
				},
			});
		});

		act(() => {
			fireEvent.click(getByTestId("ResignRegistration__send-button"));
		});

		await waitFor(() => expect(getByTestId("ResignRegistration__fourth-step")).toBeTruthy());

		act(() => {
			fireEvent.click(getByTestId("ResignRegistration__wallet-button"));
		});

		expect(history.location.pathname).toMatch(dashboardUrl);

		signMock.mockRestore();
		broadcastMock.mockRestore();
		transactionMock.mockRestore();
	});
});
