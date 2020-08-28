/* eslint-disable @typescript-eslint/require-await */
import { Profile, ReadWriteWallet } from "@arkecosystem/platform-sdk-profiles";
import { createMemoryHistory } from "history";
import React from "react";
import { Route } from "react-router-dom";
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

let wallet: ReadWriteWallet;
let profile: Profile;

let defaultFormValues: any = {};
let resignRegistrationURL: string;

const history = createMemoryHistory();

const renderPage = () => {
	defaultFormValues = {
		onDownload: jest.fn(),
	};

	const rendered: RenderResult = renderWithRouter(
		<Route path="/profiles/:profileId/transactions/:walletId/resignation">
			<ResignRegistration {...defaultFormValues} />
		</Route>,
		{
			routes: [resignRegistrationURL],
			history,
		},
	);
	return rendered;
};

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
		expect(defaultFormValues.onDownload).toHaveBeenCalledTimes(0);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should should go back", async () => {
		const { asFragment, getByTestId } = renderPage();

		await act(async () => {
			fireEvent.click(getByTestId("ResignRegistration__continue-button"));
		});
		await act(async () => {
			fireEvent.click(getByTestId("ResignRegistration__back-button"));
		});

		await waitFor(() => expect(getByTestId("ResignRegistration__first-step")).toBeTruthy());
		expect(defaultFormValues.onDownload).toHaveBeenCalledTimes(0);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render 2nd step", async () => {
		const { asFragment, getByTestId } = renderPage();

		await waitFor(() => expect(getByTestId("ResignRegistration__first-step")).toBeTruthy());

		await act(async () => {
			fireEvent.click(getByTestId("ResignRegistration__continue-button"));
		});

		expect(getByTestId("ResignRegistration__second-step")).toBeTruthy();
		expect(defaultFormValues.onDownload).toHaveBeenCalledTimes(0);
		expect(asFragment()).toMatchSnapshot();
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
		expect(defaultFormValues.onDownload).toHaveBeenCalledTimes(0);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should show authentication error", async () => {
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
		expect(defaultFormValues.onDownload).toHaveBeenCalledTimes(0);
		expect(asFragment()).toMatchSnapshot();
	});

	// it("should render 4th step", async () => {
	// 	const { asFragment, getByTestId } = renderPage();
	//
	// 	await waitFor(() => expect(getByTestId("ResignRegistration__first-step")).toBeTruthy());
	//
	// 	await act(async () => {
	// 		fireEvent.click(getByTestId("ResignRegistration__continue-button"));
	// 	});
	// 	await act(async () => {
	// 		fireEvent.click(getByTestId("ResignRegistration__continue-button"));
	// 	});
	// 	await act(async () => {
	// 		fireEvent.click(getByTestId("ResignRegistration__send-button"));
	// 	});
	//
	// 	expect(getByTestId("TransactionSuccessful")).toBeTruthy();
	// 	expect(defaultFormValues.onDownload).toHaveBeenCalledTimes(0);
	// 	expect(asFragment()).toMatchSnapshot();
	// });

	// it("should submit", async () => {
	// 	const { asFragment, getByTestId } = renderPage();
	//
	// 	await waitFor(() => expect(getByTestId("ResignRegistration__first-step")).toBeTruthy());
	//
	// 	await act(async () => {
	// 		fireEvent.click(getByTestId("ResignRegistration__continue-button"));
	// 	});
	// 	await act(async () => {
	// 		fireEvent.click(getByTestId("ResignRegistration__continue-button"));
	// 	});
	// 	await act(async () => {
	// 		fireEvent.click(getByTestId("ResignRegistration__send-button"));
	// 	});
	// 	await act(async () => {
	// 		fireEvent.click(getByTestId("ResignRegistration__send-button"));
	// 	});
	// 	await act(async () => {
	// 		fireEvent.click(getByTestId("ResignRegistration__send-button"));
	// 	});
	// 	await act(async () => {
	// 		fireEvent.click(getByTestId("ResignRegistration__download-button"));
	// 	});
	//
	// 	expect(defaultFormValues.onDownload).toHaveBeenCalledTimes(1);
	// 	expect(asFragment()).toMatchSnapshot();
	// });
});
