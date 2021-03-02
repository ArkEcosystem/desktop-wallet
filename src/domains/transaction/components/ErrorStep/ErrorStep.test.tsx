import React from "react";
import { act, fireEvent, render, waitFor } from "utils/testing-library";

import { ErrorStep } from "./";

describe("ErrorStep", () => {
	it("should render with default texts", () => {
		const { asFragment } = render(<ErrorStep />);

		expect(asFragment()).toMatchSnapshot();
	});

	it("should render with custom title and description", () => {
		const { asFragment } = render(<ErrorStep title="Custom error title" description="Custom error description" />);

		expect(asFragment()).toMatchSnapshot();
	});

	it("should emit onBack", async () => {
		const onBack = jest.fn();
		const { asFragment, getByTestId } = render(
			<ErrorStep title="Custom error title" description="Custom error description" onBack={onBack} />,
		);

		expect(asFragment()).toMatchSnapshot();

		act(() => {
			fireEvent.click(getByTestId("ErrorStep__wallet-button"));
		});

		await waitFor(() => expect(onBack).toHaveBeenCalled());
	});

	it("should emit onRepeat", async () => {
		const onRepeat = jest.fn();
		const { asFragment, getByTestId } = render(
			<ErrorStep title="Custom error title" description="Custom error description" onRepeat={onRepeat} />,
		);

		expect(asFragment()).toMatchSnapshot();

		act(() => {
			fireEvent.click(getByTestId("ErrorStep__repeat-button"));
		});

		await waitFor(() => expect(onRepeat).toHaveBeenCalled());
	});
});
