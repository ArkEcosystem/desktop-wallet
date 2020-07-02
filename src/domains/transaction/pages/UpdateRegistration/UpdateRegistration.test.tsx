/* eslint-disable @typescript-eslint/require-await */
import React from "react";
import { act, fireEvent, render } from "testing-library";

import { UpdateRegistration } from "../UpdateRegistration";

let defaultFormValues = {};

beforeEach(() => {
	defaultFormValues = {
		onDownload: jest.fn(),
	};
});

describe("UpdateRegistration", () => {
	it("should render 1st step", () => {
		const { asFragment, getByTestId } = render(<UpdateRegistration {...defaultFormValues} />);

		expect(getByTestId("UpdateRegistration__first-step")).toBeTruthy();
		expect(defaultFormValues.onDownload).toHaveBeenCalledTimes(0);
		expect(asFragment()).toMatchSnapshot();
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
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render 2nd step", async () => {
		const { asFragment, getByTestId } = render(<UpdateRegistration {...defaultFormValues} />);

		await act(async () => {
			fireEvent.click(getByTestId("UpdateRegistration__continue-button"));
		});

		expect(getByTestId("UpdateRegistration__second-step")).toBeTruthy();
		expect(defaultFormValues.onDownload).toHaveBeenCalledTimes(0);
		expect(asFragment()).toMatchSnapshot();
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
		expect(asFragment()).toMatchSnapshot();
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
		expect(asFragment()).toMatchSnapshot();
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
		expect(asFragment()).toMatchSnapshot();
	});
});
