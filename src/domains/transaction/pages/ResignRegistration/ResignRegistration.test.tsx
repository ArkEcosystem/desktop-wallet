/* eslint-disable @typescript-eslint/require-await */
import { act, fireEvent, render } from "@testing-library/react";
import { i18n } from "app/i18n";
import React from "react";
import { I18nextProvider } from "react-i18next";

import { ResignRegistration } from "../ResignRegistration";

let defaultFormValues = {};

beforeEach(() => {
	defaultFormValues = {
		onDownload: jest.fn(),
	};
});

describe("ResignRegistration", () => {
	it("should render 1st step", () => {
		const { asFragment, getByTestId } = render(
			<I18nextProvider i18n={i18n}>
				<ResignRegistration {...defaultFormValues} />
			</I18nextProvider>,
		);

		expect(getByTestId("ResignRegistration__first-step")).toBeTruthy();
		expect(defaultFormValues.onDownload).toHaveBeenCalledTimes(0);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should should go back", async () => {
		const { asFragment, getByTestId } = render(
			<I18nextProvider i18n={i18n}>
				<ResignRegistration {...defaultFormValues} />
			</I18nextProvider>,
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
			<I18nextProvider i18n={i18n}>
				<ResignRegistration {...defaultFormValues} />
			</I18nextProvider>,
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
			<I18nextProvider i18n={i18n}>
				<ResignRegistration {...defaultFormValues} />
			</I18nextProvider>,
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
			<I18nextProvider i18n={i18n}>
				<ResignRegistration {...defaultFormValues} />
			</I18nextProvider>,
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
			<I18nextProvider i18n={i18n}>
				<ResignRegistration {...defaultFormValues} />
			</I18nextProvider>,
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
