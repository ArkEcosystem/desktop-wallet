/* eslint-disable @typescript-eslint/require-await */
import React from "react";
import { act, fireEvent, render } from "testing-library";

import { Registration } from "./Registration";

let defaultFormValues = {};

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
});

describe("Registration", () => {
	it("should render 1st step", () => {
		const { asFragment, getByTestId } = render(<Registration {...defaultFormValues} />);

		expect(getByTestId("Registration__first-step")).toBeTruthy();
		expect(defaultFormValues.onDownload).toHaveBeenCalledTimes(0);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should should go back", async () => {
		const { asFragment, getByTestId } = render(<Registration {...defaultFormValues} />);

		await act(async () => {
			fireEvent.click(getByTestId("Registration__continue-button"));
		});
		await act(async () => {
			fireEvent.click(getByTestId("Registration__back-button"));
		});

		expect(getByTestId("Registration__first-step")).toBeTruthy();
		expect(defaultFormValues.onDownload).toHaveBeenCalledTimes(0);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render 2nd step", async () => {
		const { asFragment, getByTestId } = render(<Registration {...defaultFormValues} />);

		await act(async () => {
			fireEvent.click(getByTestId("Registration__continue-button"));
		});

		expect(getByTestId("Registration__second-step")).toBeTruthy();
		expect(defaultFormValues.onDownload).toHaveBeenCalledTimes(0);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render 3rd step", async () => {
		const { asFragment, getByTestId } = render(<Registration {...defaultFormValues} />);

		await act(async () => {
			fireEvent.click(getByTestId("Registration__continue-button"));
		});
		await act(async () => {
			fireEvent.click(getByTestId("Registration__continue-button"));
		});

		expect(getByTestId("Registration__third-step")).toBeTruthy();
		expect(defaultFormValues.onDownload).toHaveBeenCalledTimes(0);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render 4th step", async () => {
		const { asFragment, getByTestId } = render(<Registration {...defaultFormValues} />);

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
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render 5th step", async () => {
		const { asFragment, getByTestId } = render(<Registration {...defaultFormValues} />);

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
		expect(asFragment()).toMatchSnapshot();
	});

	it("should submit", async () => {
		const { asFragment, getByTestId } = render(<Registration {...defaultFormValues} />);

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
		expect(asFragment()).toMatchSnapshot();
	});

	it("should select registration type", async () => {
		const { asFragment, getByTestId } = render(<Registration {...defaultFormValues} />);

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
		expect(asFragment()).toMatchSnapshot();
	});
});
