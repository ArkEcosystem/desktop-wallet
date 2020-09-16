/* eslint-disable @typescript-eslint/require-await */
import { createMemoryHistory } from "history";
import React from "react";
import { Route } from "react-router-dom";
import {
	act,
	fireEvent,
	getDefaultProfileId,
	getDefaultWalletId,
	RenderResult,
	renderWithRouter,
	syncFees,
	waitFor,
} from "testing-library";

import { SendEntityUpdate } from "../SendEntityUpdate";

let rendered: RenderResult;
const defaultFormValues = {
	onDownload: jest.fn(),
};

describe("SendEntityUpdate", () => {
	beforeAll(async () => {
		await syncFees();
	});

	beforeEach(() => {
		const history = createMemoryHistory();
		const updateRegistrationURL = `/profiles/${getDefaultProfileId()}/wallets/${getDefaultWalletId()}/send-entity-update`;

		history.push(updateRegistrationURL);

		rendered = renderWithRouter(
			<Route path="/profiles/:profileId/wallets/:walletId/send-entity-update">
				<SendEntityUpdate {...defaultFormValues} />
			</Route>,
			{
				routes: [updateRegistrationURL],
				history,
			},
		);
	});

	it("should render 1st step", async () => {
		const { asFragment, getByTestId } = rendered;

		expect(getByTestId("SendEntityUpdate__first-step")).toBeTruthy();
		expect(defaultFormValues.onDownload).toHaveBeenCalledTimes(0);
		await waitFor(() => expect(asFragment()).toMatchSnapshot());
	});

	it("should should go back", async () => {
		const { asFragment, getByTestId } = rendered;

		await act(async () => {
			fireEvent.click(getByTestId("SendEntityUpdate__continue-button"));
		});
		await act(async () => {
			fireEvent.click(getByTestId("SendEntityUpdate__back-button"));
		});

		expect(getByTestId("SendEntityUpdate__first-step")).toBeTruthy();
		expect(defaultFormValues.onDownload).toHaveBeenCalledTimes(0);
		await waitFor(() => expect(asFragment()).toMatchSnapshot());
	});

	it("should render 2nd step", async () => {
		let context;

		await act(async () => {
			context = rendered;
		});

		const { asFragment, getByTestId } = context;

		await act(async () => {
			fireEvent.click(getByTestId("SendEntityUpdate__continue-button"));
		});

		expect(getByTestId("SendEntityUpdate__second-step")).toBeTruthy();
		expect(defaultFormValues.onDownload).toHaveBeenCalledTimes(0);
		await waitFor(() => expect(asFragment()).toMatchSnapshot());
	});

	it("should render 3rd step", async () => {
		const { asFragment, getByTestId } = rendered;

		await act(async () => {
			fireEvent.click(getByTestId("SendEntityUpdate__continue-button"));
		});
		await act(async () => {
			fireEvent.click(getByTestId("SendEntityUpdate__continue-button"));
		});

		expect(getByTestId("SendEntityUpdate__third-step")).toBeTruthy();
		expect(defaultFormValues.onDownload).toHaveBeenCalledTimes(0);
		await waitFor(() => expect(asFragment()).toMatchSnapshot());
	});

	it("should render 4th step", async () => {
		const { asFragment, getByTestId } = rendered;

		await act(async () => {
			fireEvent.click(getByTestId("SendEntityUpdate__continue-button"));
		});
		await act(async () => {
			fireEvent.click(getByTestId("SendEntityUpdate__continue-button"));
		});
		await act(async () => {
			fireEvent.click(getByTestId("SendEntityUpdate__send-button"));
		});
		await act(async () => {
			fireEvent.click(getByTestId("SendEntityUpdate__send-button"));
		});
		await act(async () => {
			fireEvent.click(getByTestId("SendEntityUpdate__send-button"));
		});

		expect(getByTestId("TransactionSuccessful")).toBeTruthy();
		expect(defaultFormValues.onDownload).toHaveBeenCalledTimes(0);
		await waitFor(() => expect(asFragment()).toMatchSnapshot());
	});

	it("should submit", async () => {
		const { asFragment, getByTestId } = rendered;

		await act(async () => {
			fireEvent.click(getByTestId("SendEntityUpdate__continue-button"));
		});
		await act(async () => {
			fireEvent.click(getByTestId("SendEntityUpdate__continue-button"));
		});
		await act(async () => {
			fireEvent.click(getByTestId("SendEntityUpdate__send-button"));
		});
		await act(async () => {
			fireEvent.click(getByTestId("SendEntityUpdate__send-button"));
		});
		await act(async () => {
			fireEvent.click(getByTestId("SendEntityUpdate__send-button"));
		});
		await act(async () => {
			fireEvent.click(getByTestId("SendEntityUpdate__download-button"));
		});

		expect(defaultFormValues.onDownload).toHaveBeenCalledTimes(1);
		await waitFor(() => expect(asFragment()).toMatchSnapshot());
	});
});
