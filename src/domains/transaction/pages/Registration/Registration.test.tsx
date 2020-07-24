/* eslint-disable @typescript-eslint/require-await */

import { availableNetworksMock } from "domains/network/data";
import { createMemoryHistory } from "history";
import React from "react";
import { Route } from "react-router-dom";
import { act, fireEvent, renderWithRouter, waitFor } from "testing-library";
import { identity } from "tests/fixtures/identity";

import { Registration } from "./Registration";

let rendered: RenderResult;
let defaultFormValues = {};

describe("Registration", () => {
	beforeEach(() => {
		const history = createMemoryHistory();
		const registrationURL = `/profiles/${identity.profiles.bob.id}/transactions/registration`;

		history.push(registrationURL);

		defaultFormValues = {
			networks: availableNetworksMock,
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
			<Route path="/profiles/:profileId/transactions/registration">
				<Registration {...defaultFormValues} />
			</Route>,
			{
				routes: [registrationURL],
				history,
			},
		);
	});

	it("should render 1st step", async () => {
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
