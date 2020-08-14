/* eslint-disable @typescript-eslint/require-await */
import { act } from "@testing-library/react-hooks";
import React from "react";
import { fireEvent, render, RenderResult, waitFor } from "testing-library";

import { FirstStep, SecondStep, ThirdStep, WalletUpdate } from "./WalletUpdate";

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

	it("should render 3st step", () => {
		const { asFragment, getByTestId } = render(<ThirdStep />);

		expect(getByTestId("WalletUpdate__third-step")).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render", async () => {
		let rendered: RenderResult;

		await act(async () => {
			rendered = render(<WalletUpdate isOpen={true} />);
			await waitFor(() => expect(rendered.getByTestId("WalletUpdate__first-step")).toBeTruthy());
		});

		const { asFragment, getByTestId } = rendered!;

		expect(asFragment()).toMatchSnapshot();

		await act(async () => {
			// Navigation between steps
			await fireEvent.click(getByTestId("WalletUpdate__update-button"));
			expect(getByTestId("WalletUpdate__second-step")).toBeTruthy();

			// Back
			await fireEvent.click(getByTestId("WalletUpdate__back-button"));
			expect(getByTestId("WalletUpdate__first-step")).toBeTruthy();

			// Navigation between steps
			await fireEvent.click(getByTestId("WalletUpdate__update-button"));
			expect(getByTestId("WalletUpdate__second-step")).toBeTruthy();

			await fireEvent.click(getByTestId("WalletUpdate__continue-button"));
			expect(getByTestId("WalletUpdate__third-step")).toBeTruthy();
		});
	});
});
