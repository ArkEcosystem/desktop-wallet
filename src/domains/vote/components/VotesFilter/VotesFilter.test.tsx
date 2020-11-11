import React from "react";
import { act, fireEvent, render, waitFor } from "utils/testing-library";

import { VotesFilter } from "./";

describe("VotesFilter", () => {
	it("should render", () => {
		const { asFragment } = render(<VotesFilter totalCurrentVotes={1} />);

		expect(asFragment()).toMatchSnapshot();
	});

	it("should render default", async () => {
		const { asFragment, getByTestId } = render(<VotesFilter totalCurrentVotes={1} />);

		act(() => {
			fireEvent.click(getByTestId("dropdown__toggle"));
		});

		await waitFor(() => expect(getByTestId("dropdown__content")).toBeTruthy());

		expect(asFragment()).toMatchSnapshot();
	});

	it("should render with current option selected", async () => {
		const { asFragment, getByTestId } = render(<VotesFilter totalCurrentVotes={1} selectedOption="current" />);

		act(() => {
			fireEvent.click(getByTestId("dropdown__toggle"));
		});

		await waitFor(() => expect(getByTestId("dropdown__content")).toBeTruthy());

		expect(asFragment()).toMatchSnapshot();
	});

	it("should render with disabled current option", async () => {
		const { asFragment, getByTestId } = render(<VotesFilter totalCurrentVotes={0} />);

		act(() => {
			fireEvent.click(getByTestId("dropdown__toggle"));
		});

		await waitFor(() => expect(getByTestId("dropdown__content")).toBeTruthy());

		expect(asFragment()).toMatchSnapshot();
	});

	it("should emit onChange", async () => {
		const onChange = jest.fn();
		const { getByTestId } = render(<VotesFilter totalCurrentVotes={2} onChange={onChange} />);

		act(() => {
			fireEvent.click(getByTestId("dropdown__toggle"));
		});

		await waitFor(() => expect(getByTestId("dropdown__content")).toBeTruthy());

		act(() => {
			fireEvent.click(getByTestId("VotesFilter__option--current"));
		});

		await waitFor(() => expect(onChange).toHaveBeenCalledWith("current"));

		act(() => {
			fireEvent.click(getByTestId("VotesFilter__option--all"));
		});

		await waitFor(() => expect(onChange).toHaveBeenCalledWith("all"));
	});
});
