/* eslint-disable @typescript-eslint/require-await */
import { createMemoryHistory } from "history";
import React from "react";
import { Route } from "react-router-dom";
import { act, fireEvent, getDefaultProfileId, RenderResult, renderWithRouter, waitFor } from "testing-library";

import { UpdateRegistration } from "../UpdateRegistration";

let rendered: RenderResult;
const defaultFormValues = {
	onDownload: jest.fn(),
};

describe("UpdateRegistration", () => {
	beforeEach(() => {
		const history = createMemoryHistory();
		const updateRegistrationURL = `/profiles/${getDefaultProfileId()}/transactions/update`;

		history.push(updateRegistrationURL);

		rendered = renderWithRouter(
			<Route path="/profiles/:profileId/transactions/update">
				<UpdateRegistration {...defaultFormValues} />
			</Route>,
			{
				routes: [updateRegistrationURL],
				history,
			},
		);
	});

	it("should render 1st step", async () => {
		const { asFragment, getByTestId } = rendered;

		expect(getByTestId("UpdateRegistration__first-step")).toBeTruthy();
		expect(defaultFormValues.onDownload).toHaveBeenCalledTimes(0);
		await waitFor(() => expect(asFragment()).toMatchSnapshot());
	});

	it("should should go back", async () => {
		const { asFragment, getByTestId } = rendered;

		await act(async () => {
			fireEvent.click(getByTestId("UpdateRegistration__continue-button"));
		});
		await act(async () => {
			fireEvent.click(getByTestId("UpdateRegistration__back-button"));
		});

		expect(getByTestId("UpdateRegistration__first-step")).toBeTruthy();
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
			fireEvent.click(getByTestId("UpdateRegistration__continue-button"));
		});

		expect(getByTestId("UpdateRegistration__second-step")).toBeTruthy();
		expect(defaultFormValues.onDownload).toHaveBeenCalledTimes(0);
		await waitFor(() => expect(asFragment()).toMatchSnapshot());
	});

	it("should render 3rd step", async () => {
		const { asFragment, getByTestId } = rendered;

		await act(async () => {
			fireEvent.click(getByTestId("UpdateRegistration__continue-button"));
		});
		await act(async () => {
			fireEvent.click(getByTestId("UpdateRegistration__continue-button"));
		});

		expect(getByTestId("UpdateRegistration__third-step")).toBeTruthy();
		expect(defaultFormValues.onDownload).toHaveBeenCalledTimes(0);
		await waitFor(() => expect(asFragment()).toMatchSnapshot());
	});

	it("should render 4th step", async () => {
		const { asFragment, getByTestId } = rendered;

		await act(async () => {
			fireEvent.click(getByTestId("UpdateRegistration__continue-button"));
		});
		await act(async () => {
			fireEvent.click(getByTestId("UpdateRegistration__continue-button"));
		});
		await act(async () => {
			fireEvent.click(getByTestId("UpdateRegistration__send-button"));
		});
		await act(async () => {
			fireEvent.click(getByTestId("UpdateRegistration__send-button"));
		});
		await act(async () => {
			fireEvent.click(getByTestId("UpdateRegistration__send-button"));
		});

		expect(getByTestId("TransactionSuccessful")).toBeTruthy();
		expect(defaultFormValues.onDownload).toHaveBeenCalledTimes(0);
		await waitFor(() => expect(asFragment()).toMatchSnapshot());
	});

	it("should submit", async () => {
		const { asFragment, getByTestId } = rendered;

		await act(async () => {
			fireEvent.click(getByTestId("UpdateRegistration__continue-button"));
		});
		await act(async () => {
			fireEvent.click(getByTestId("UpdateRegistration__continue-button"));
		});
		await act(async () => {
			fireEvent.click(getByTestId("UpdateRegistration__send-button"));
		});
		await act(async () => {
			fireEvent.click(getByTestId("UpdateRegistration__send-button"));
		});
		await act(async () => {
			fireEvent.click(getByTestId("UpdateRegistration__send-button"));
		});
		await act(async () => {
			fireEvent.click(getByTestId("UpdateRegistration__download-button"));
		});

		expect(defaultFormValues.onDownload).toHaveBeenCalledTimes(1);
		await waitFor(() => expect(asFragment()).toMatchSnapshot());
	});
});
