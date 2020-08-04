/* eslint-disable @typescript-eslint/require-await */
import { createMemoryHistory } from "history";
import React from "react";
import { Route } from "react-router-dom";
import { act, fireEvent, getDefaultProfileId, RenderResult, renderWithRouter } from "utils/testing-library";

import { ResignRegistration } from "../ResignRegistration";

let rendered: RenderResult;
let defaultFormValues: any = {};

const history = createMemoryHistory();
const resignRegistrationURL = `/profiles/${getDefaultProfileId()}/transactions/resignation`;

describe("ResignRegistration", () => {
	beforeAll(() => {
		history.push(resignRegistrationURL);
	});

	beforeEach(() => {
		defaultFormValues = {
			onDownload: jest.fn(),
		};

		rendered = renderWithRouter(
			<Route path="/profiles/:profileId/transactions/resignation">
				<ResignRegistration {...defaultFormValues} />
			</Route>,
			{
				routes: [resignRegistrationURL],
				history,
			},
		);
	});

	it("should render 1st step", () => {
		const { asFragment, getByTestId } = rendered;

		expect(getByTestId("ResignRegistration__first-step")).toBeTruthy();
		expect(defaultFormValues.onDownload).toHaveBeenCalledTimes(0);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should should go back", async () => {
		const { asFragment, getByTestId } = rendered;

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
		const { asFragment, getByTestId } = rendered;

		await act(async () => {
			fireEvent.click(getByTestId("ResignRegistration__continue-button"));
		});

		expect(getByTestId("ResignRegistration__second-step")).toBeTruthy();
		expect(defaultFormValues.onDownload).toHaveBeenCalledTimes(0);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render 3rd step", async () => {
		const { asFragment, getByTestId } = rendered;

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
		const { asFragment, getByTestId } = rendered;

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
		const { asFragment, getByTestId } = rendered;

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
