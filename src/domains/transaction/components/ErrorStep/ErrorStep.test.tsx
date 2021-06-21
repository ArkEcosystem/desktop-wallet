import React from "react";
import { act, fireEvent, render, waitFor } from "utils/testing-library";

import { ErrorStep } from ".";

describe("ErrorStep", () => {
	it("should render with default texts", () => {
		const { asFragment } = render(<ErrorStep />);

		expect(asFragment()).toMatchSnapshot();
	});

	it("should render with custom title", () => {
		const { asFragment } = render(<ErrorStep title="Custom error title" />);

		expect(asFragment()).toMatchSnapshot();
	});

	it("should display error details", () => {
		const { asFragment } = render(<ErrorStep errorMessage="Display error details" />);

		expect(asFragment()).toMatchSnapshot();
	});

	it("should emit onBack", async () => {
		const onBack = jest.fn();
		const { asFragment, getByTestId } = render(<ErrorStep title="Custom error title" onBack={onBack} />);

		expect(asFragment()).toMatchSnapshot();

		act(() => {
			fireEvent.click(getByTestId("ErrorStep__wallet-button"));
		});

		await waitFor(() => expect(onBack).toHaveBeenCalled());
	});

	it("should emit onRepeat", async () => {
		const onRepeat = jest.fn();
		const { asFragment, getByTestId } = render(<ErrorStep title="Custom error title" onRepeat={onRepeat} />);

		expect(asFragment()).toMatchSnapshot();

		act(() => {
			fireEvent.click(getByTestId("ErrorStep__repeat-button"));
		});

		await waitFor(() => expect(onRepeat).toHaveBeenCalled());
	});
});
