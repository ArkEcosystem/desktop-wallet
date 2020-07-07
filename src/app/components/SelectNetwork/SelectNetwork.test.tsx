import React from "react";
import { act } from "react-dom/test-utils";
import { fireEvent, render } from "testing-library";

import { SelectNetwork } from "./SelectNetwork";

describe("SelectNetwork", () => {
	const networks = [
		{
			icon: "Ark",
			name: "Ark Ecosystem",
			className: "text-theme-danger-400 border-theme-danger-200",
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
	];

	it("should render", () => {
		const { container } = render(<SelectNetwork />);
		expect(container).toMatchSnapshot();
	});

	it("should render with networks", () => {
		const { container } = render(<SelectNetwork networks={networks} />);
		expect(container).toMatchSnapshot();
	});

	it("should show typeahead when typing has found one exact match", () => {
		const { getByTestId } = render(<SelectNetwork networks={networks} />);
		const input = getByTestId("select-asset__input");
		act(() => {
			fireEvent.change(input, { target: { value: "Bitco" } });
		});

		expect(getByTestId("select-network__typeahead-Bitcoin")).toBeTruthy();
	});

	it("should select first matching asset with enter", () => {
		const { getByTestId } = render(<SelectNetwork networks={networks} />);
		const input = getByTestId("select-asset__input");
		act(() => {
			fireEvent.change(input, { target: { value: "Bitco" } });
		});

		act(() => {
			fireEvent.keyDown(input, { key: "Enter", code: 13 });
		});

		expect(getByTestId("select-asset__selected-Bitcoin")).toBeTruthy();
	});

	it("should select first matching asset with tab", () => {
		const { getByTestId } = render(<SelectNetwork networks={networks} />);
		const input = getByTestId("select-asset__input");
		act(() => {
			fireEvent.change(input, { target: { value: "Bitcoi" } });
		});

		act(() => {
			fireEvent.keyDown(input, { key: "Tab", code: 9 });
		});

		expect(getByTestId("select-asset__selected-Bitcoin")).toBeTruthy();
	});

	it("should not select non-matching asset after key input and tab", () => {
		const { getByTestId, queryByTestId } = render(<SelectNetwork networks={networks} />);
		const input = getByTestId("select-asset__input");
		act(() => {
			fireEvent.change(input, { target: { value: "Bot" } });
		});

		act(() => {
			fireEvent.keyDown(input, { key: "Tab", code: 9 });
		});

		expect(queryByTestId("select-asset__selected-Bitcoin")).not.toBeTruthy();
	});

	it("should not select first matched asset after random key enter", () => {
		const { getByTestId, queryByTestId } = render(<SelectNetwork networks={networks} />);
		const input = getByTestId("select-asset__input");

		act(() => {
			fireEvent.change(input, { target: { value: "Bitco" } });
		});

		act(() => {
			fireEvent.keyDown(input, { key: "A", code: 65 });
		});

		expect(queryByTestId("select-asset__selected-Bitcoin")).not.toBeTruthy();
	});

	it("should clear selection when changing input", () => {
		const { getByTestId, queryByTestId } = render(<SelectNetwork networks={networks} />);
		const input = getByTestId("select-asset__input");

		act(() => {
			fireEvent.change(input, { target: { value: "Bitcoin" } });
		});

		act(() => {
			fireEvent.keyDown(input, { key: "Enter", code: 13 });
		});

		expect(getByTestId("select-asset__selected-Bitcoin")).toBeTruthy();

		act(() => {
			fireEvent.change(input, { target: { value: "test" } });
		});

		act(() => {
			fireEvent.keyDown(input, { key: "A", code: 65 });
		});
		act(() => {
			fireEvent.keyDown(input, { key: "B", code: 65 });
		});

		expect(queryByTestId("select-asset__selected-Bitcoin")).not.toBeTruthy();
	});
});
