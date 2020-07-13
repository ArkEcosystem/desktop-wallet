/* eslint-disable @typescript-eslint/require-await */
import React from "react";
import { act, fireEvent, render, waitFor } from "testing-library";

import { UpdateRegistration } from "../UpdateRegistration";

let defaultFormValues: any = {};

beforeEach(() => {
	defaultFormValues = {
		onDownload: jest.fn(),
	};
});

describe("UpdateRegistration", () => {
	it("should render 1st step", async () => {
		const { asFragment, getByTestId } = render(<UpdateRegistration {...defaultFormValues} />);

		expect(getByTestId("UpdateRegistration__first-step")).toBeTruthy();
		expect(defaultFormValues.onDownload).toHaveBeenCalledTimes(0);
		await waitFor(() => expect(asFragment()).toMatchSnapshot());
	});

	it("should should go back", async () => {
		const { asFragment, getByTestId } = render(<UpdateRegistration {...defaultFormValues} />);

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
		const { asFragment, getByTestId } = render(<UpdateRegistration {...defaultFormValues} />);

		await act(async () => {
			fireEvent.click(getByTestId("UpdateRegistration__continue-button"));
		});

		expect(getByTestId("UpdateRegistration__second-step")).toBeTruthy();
		expect(defaultFormValues.onDownload).toHaveBeenCalledTimes(0);
		await waitFor(() => expect(asFragment()).toMatchSnapshot());
	});

	it("should render 3rd step", async () => {
		const { asFragment, getByTestId } = render(<UpdateRegistration {...defaultFormValues} />);

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
		const { asFragment, getByTestId } = render(<UpdateRegistration {...defaultFormValues} />);

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
		const { asFragment, getByTestId } = render(<UpdateRegistration {...defaultFormValues} />);

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
