/* eslint-disable @typescript-eslint/require-await */
import { createMemoryHistory } from "history";
import React from "react";
import { Router } from "react-router-dom";
import { act, fireEvent, render } from "testing-library";

import { ResignRegistration } from "../ResignRegistration";

let defaultFormValues = {};

beforeEach(() => {
	defaultFormValues = {
		onDownload: jest.fn(),
	};
});

describe("ResignRegistration", () => {
	const history = createMemoryHistory();

	it("should render 1st step", () => {
		const { asFragment, getByTestId } = render(
			<Router history={history}>
				<ResignRegistration {...defaultFormValues} />
			</Router>,
		);

		expect(getByTestId("ResignRegistration__first-step")).toBeTruthy();
		expect(defaultFormValues.onDownload).toHaveBeenCalledTimes(0);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should should go back", async () => {
		const { asFragment, getByTestId } = render(
			<Router history={history}>
				<ResignRegistration {...defaultFormValues} />
			</Router>,
		);

		await act(async () => {
			fireEvent.click(getByTestId("ResignRegistration__continue-button"));
		});
		await act(async () => {
			fireEvent.click(getByTestId("ResignRegistration__back-button"));
		});

		expect(getByTestId("ResignRegistration__first-step")).toBeTruthy();
		expect(defaultFormValues.onDownload).toHaveBeenCalledTimes(0);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render 2nd step", async () => {
		const { asFragment, getByTestId } = render(
			<Router history={history}>
				<ResignRegistration {...defaultFormValues} />
			</Router>,
		);

		await act(async () => {
			fireEvent.click(getByTestId("ResignRegistration__continue-button"));
		});

		expect(getByTestId("ResignRegistration__second-step")).toBeTruthy();
		expect(defaultFormValues.onDownload).toHaveBeenCalledTimes(0);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render 3rd step", async () => {
		const { asFragment, getByTestId } = render(
			<Router history={history}>
				<ResignRegistration {...defaultFormValues} />
			</Router>,
		);

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

	it("should render 4th step", async () => {
		const { asFragment, getByTestId } = render(
			<Router history={history}>
				<ResignRegistration {...defaultFormValues} />
			</Router>,
		);

		await act(async () => {
			fireEvent.click(getByTestId("ResignRegistration__continue-button"));
		});
		await act(async () => {
			fireEvent.click(getByTestId("ResignRegistration__continue-button"));
		});
		await act(async () => {
			fireEvent.click(getByTestId("ResignRegistration__send-button"));
		});
		await act(async () => {
			fireEvent.click(getByTestId("ResignRegistration__send-button"));
		});
		await act(async () => {
			fireEvent.click(getByTestId("ResignRegistration__send-button"));
		});

		expect(getByTestId("TransactionSuccessful")).toBeTruthy();
		expect(defaultFormValues.onDownload).toHaveBeenCalledTimes(0);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should submit", async () => {
		const { asFragment, getByTestId } = render(
			<Router history={history}>
				<ResignRegistration {...defaultFormValues} />
			</Router>,
		);

		await act(async () => {
			fireEvent.click(getByTestId("ResignRegistration__continue-button"));
		});
		await act(async () => {
			fireEvent.click(getByTestId("ResignRegistration__continue-button"));
		});
		await act(async () => {
			fireEvent.click(getByTestId("ResignRegistration__send-button"));
		});
		await act(async () => {
			fireEvent.click(getByTestId("ResignRegistration__send-button"));
		});
		await act(async () => {
			fireEvent.click(getByTestId("ResignRegistration__send-button"));
		});
		await act(async () => {
			fireEvent.click(getByTestId("ResignRegistration__download-button"));
		});

		expect(defaultFormValues.onDownload).toHaveBeenCalledTimes(1);
		expect(asFragment()).toMatchSnapshot();
	});
});
