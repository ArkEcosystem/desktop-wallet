/* eslint-disable @typescript-eslint/require-await */
import { ARK } from "@arkecosystem/platform-sdk-ark";
import { Environment } from "@arkecosystem/platform-sdk-profiles";
import { EnvironmentContext } from "app/contexts";
import { httpClient } from "app/services";
import { createMemoryHistory } from "history";
import React from "react";
import { Route } from "react-router-dom";
import { act, fireEvent, renderWithRouter, waitFor } from "testing-library";
import { StubStorage } from "tests/mocks";

import { Registration } from "./Registration";

describe("Registration", () => {
	let rendered: RenderResult;
	let defaultFormValues = {};

	const env = new Environment({ coins: { ARK }, httpClient, storage: new StubStorage() });

	const history = createMemoryHistory();
	const registrationURL = "/profiles/qwe123/transactions/registration";

	history.push(registrationURL);

	beforeEach(() => {
		defaultFormValues = {
			networks: [
				{
					icon: "Ark",
					name: "Ark Ecosystem",
					className: "text-theme-danger-400 border-theme-danger-light",
				},
				{
					icon: "Bitcoin",
					name: "Bitcoin",
					className: "text-theme-warning-400 border-theme-warning-200",
				},
				{
					icon: "Ethereum",
					name: "Ethereum",
					className: "text-theme-neutral-800 border-theme-neutral-600",
				},
			],
			registrationTypes: [
				{
					value: "business",
					label: "Business",
				},
			],
			formDefaultData: {
				network: null,
				address: null,
			},
			addresses: [
				{
					address: "FJKDSALJFKASLJFKSDAJFKFKDSAJFKSAJFKLASJKDFJ",
					walletName: "My Wallet",
					avatarId: "FJKDSALJFKASLJFKSDAJFKFKDSAJFKSAJFKLASJKDFJ",
					formatted: "My Wallet FJKDSALJFKASL...SAJFKLASJKDFJ",
				},
			],
			onDownload: jest.fn(),
		};

		rendered = renderWithRouter(
			<EnvironmentContext.Provider value={env}>
				<Route path="/profiles/:profileId/transactions/registration">
					<Registration {...defaultFormValues} />
				</Route>
			</EnvironmentContext.Provider>,
			{
				routes: [registrationURL],
				history,
			},
		);
	});

	it("should render 1st step", () => {
		const { asFragment, getByTestId } = rendered;

		expect(getByTestId("Registration__first-step")).toBeTruthy();
		expect(defaultFormValues.onDownload).toHaveBeenCalledTimes(0);
		await waitFor(() => expect(asFragment()).toMatchSnapshot());
	});

	it("should should go back", async () => {
		const { asFragment, getByTestId } = rendered;

		await act(async () => {
			fireEvent.click(getByTestId("Registration__continue-button"));
		});
		await act(async () => {
			fireEvent.click(getByTestId("Registration__back-button"));
		});

		expect(getByTestId("Registration__first-step")).toBeTruthy();
		expect(defaultFormValues.onDownload).toHaveBeenCalledTimes(0);
		await waitFor(() => expect(asFragment()).toMatchSnapshot());
	});

	it("should render 2nd step", async () => {
		const { asFragment, getByTestId } = rendered;

		await act(async () => {
			fireEvent.click(getByTestId("Registration__continue-button"));
		});

		expect(getByTestId("Registration__second-step")).toBeTruthy();
		expect(defaultFormValues.onDownload).toHaveBeenCalledTimes(0);
		await waitFor(() => expect(asFragment()).toMatchSnapshot());
	});

	it("should render 3rd step", async () => {
		const { asFragment, getByTestId } = rendered;

		await act(async () => {
			fireEvent.click(getByTestId("Registration__continue-button"));
		});
		await act(async () => {
			fireEvent.click(getByTestId("Registration__continue-button"));
		});

		expect(getByTestId("Registration__third-step")).toBeTruthy();
		expect(defaultFormValues.onDownload).toHaveBeenCalledTimes(0);
		await waitFor(() => expect(asFragment()).toMatchSnapshot());
	});

	it("should render 4th step", async () => {
		const { asFragment, getByTestId } = rendered;

		await act(async () => {
			fireEvent.click(getByTestId("Registration__continue-button"));
		});
		await act(async () => {
			fireEvent.click(getByTestId("Registration__continue-button"));
		});
		await act(async () => {
			fireEvent.click(getByTestId("Registration__continue-button"));
		});

		expect(getByTestId("Registration__fourth-step")).toBeTruthy();
		expect(defaultFormValues.onDownload).toHaveBeenCalledTimes(0);
		await waitFor(() => expect(asFragment()).toMatchSnapshot());
	});

	it("should render 5th step", async () => {
		const { asFragment, getByTestId } = rendered;

		await act(async () => {
			fireEvent.click(getByTestId("Registration__continue-button"));
		});
		await act(async () => {
			fireEvent.click(getByTestId("Registration__continue-button"));
		});
		await act(async () => {
			fireEvent.click(getByTestId("Registration__continue-button"));
		});
		await act(async () => {
			fireEvent.click(getByTestId("Registration__send-button"));
		});
		await act(async () => {
			fireEvent.click(getByTestId("Registration__send-button"));
		});
		await act(async () => {
			fireEvent.click(getByTestId("Registration__send-button"));
		});

		expect(getByTestId("TransactionSuccessful")).toBeTruthy();
		expect(defaultFormValues.onDownload).toHaveBeenCalledTimes(0);
		await waitFor(() => expect(asFragment()).toMatchSnapshot());
	});

	it("should submit", async () => {
		const { asFragment, getByTestId } = rendered;

		await act(async () => {
			fireEvent.click(getByTestId("Registration__continue-button"));
		});
		await act(async () => {
			fireEvent.click(getByTestId("Registration__continue-button"));
		});
		await act(async () => {
			fireEvent.click(getByTestId("Registration__continue-button"));
		});
		await act(async () => {
			fireEvent.click(getByTestId("Registration__send-button"));
		});
		await act(async () => {
			fireEvent.click(getByTestId("Registration__send-button"));
		});
		await act(async () => {
			fireEvent.click(getByTestId("Registration__send-button"));
		});
		await act(async () => {
			fireEvent.click(getByTestId("Registration__download-button"));
		});

		expect(defaultFormValues.onDownload).toHaveBeenCalledTimes(1);
		await waitFor(() => expect(asFragment()).toMatchSnapshot());
	});

	it("should select registration type", async () => {
		const { asFragment, getByTestId } = rendered;

		const toggle = getByTestId("select-list__toggle-button");

		act(() => {
			fireEvent.click(toggle);
		});

		const firstOption = getByTestId("select-list__toggle-option-0");
		expect(firstOption).toBeTruthy();

		act(() => {
			fireEvent.click(firstOption);
		});

		expect(getByTestId("select-list__input")).toHaveValue("business");
		await waitFor(() => expect(asFragment()).toMatchSnapshot());
	});
});
