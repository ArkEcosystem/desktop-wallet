/* eslint-disable @typescript-eslint/require-await */

import { act } from "@testing-library/react-hooks";
import * as updaterHook from "app/hooks/use-updater";
import React from "react";
import { fireEvent, render, waitFor } from "testing-library";

import { FirstStep } from "./Step1";
import { SecondStep } from "./Step2";
import { ThirdStep } from "./Step3";
import { WalletUpdate } from "./WalletUpdate";

describe("WalletUpdate", () => {
	it("should not render if not open", () => {
		const { asFragment, getByTestId } = render(<WalletUpdate isOpen={false} />);

		expect(() => getByTestId("modal__inner")).toThrow(/Unable to find an element by/);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render 1st step", () => {
		const { asFragment, getByTestId } = render(<FirstStep />);

		expect(getByTestId("WalletUpdate__first-step")).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render 2st step", () => {
		const { asFragment, getByTestId } = render(<SecondStep />);

		expect(getByTestId("WalletUpdate__second-step")).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render 2st step with progress status", () => {
		const { asFragment, getByTestId } = render(<SecondStep percent={20} />);

		expect(getByTestId("WalletUpdate__second-step")).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render 3st step", () => {
		const { asFragment, getByTestId } = render(<ThirdStep />);

		expect(getByTestId("WalletUpdate__third-step")).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render", async () => {
		const { asFragment, getByTestId } = render(<WalletUpdate isOpen={true} />);
		await waitFor(() => expect(getByTestId("WalletUpdate__first-step")).toBeTruthy());

		expect(asFragment()).toMatchSnapshot();
	});

	it("should handle close", async () => {
		const onClose = jest.fn();
		const { getByTestId } = render(<WalletUpdate isOpen={true} onClose={onClose} />);
		await waitFor(() => expect(getByTestId("WalletUpdate__first-step")).toBeTruthy());
		act(() => {
			fireEvent.click(getByTestId("modal__close-btn"));
		});
		await waitFor(() => expect(onClose).toHaveBeenCalled());
	});

	it("should handle cancel", async () => {
		const onCancel = jest.fn();
		const { getByTestId } = render(<WalletUpdate isOpen={true} onCancel={onCancel} />);
		await waitFor(() => expect(getByTestId("WalletUpdate__first-step")).toBeTruthy());
		act(() => {
			fireEvent.click(getByTestId("WalletUpdate__cancel-button"));
		});
		await waitFor(() => expect(onCancel).toHaveBeenCalled());
	});

	it("should handle cancel", async () => {
		const onCancel = jest.fn();
		const { getByTestId } = render(<WalletUpdate isOpen={true} onCancel={onCancel} />);
		await waitFor(() => expect(getByTestId("WalletUpdate__first-step")).toBeTruthy());
		act(() => {
			fireEvent.click(getByTestId("WalletUpdate__cancel-button"));
		});
		await waitFor(() => expect(onCancel).toHaveBeenCalled());
	});

	it("should handle update", async () => {
		const { getByTestId } = render(<WalletUpdate isOpen={true} />);
		await waitFor(() => expect(getByTestId("WalletUpdate__first-step")).toBeTruthy());
		act(() => {
			fireEvent.click(getByTestId("WalletUpdate__update-button"));
		});
		await waitFor(() => expect(getByTestId("WalletUpdate__second-step")).toBeTruthy());
	});

	it("should handle install", async () => {
		const quitInstall = jest.fn();
		// @ts-ignore
		jest.spyOn(updaterHook, "useUpdater").mockReturnValue({
			downloadStatus: "completed",
			quitInstall,
		});

		const { getByTestId } = render(<WalletUpdate isOpen={true} />);
		act(() => {
			fireEvent.click(getByTestId("WalletUpdate__install-button"));
		});
		await waitFor(() => expect(quitInstall).toHaveBeenCalled());
	});
});
