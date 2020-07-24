import { availableNetworksMock } from "domains/network/data";
import React from "react";
import { act, fireEvent, render, within } from "utils/testing-library";

import { itemToString, SelectNetwork } from "./SelectNetwork";

describe("SelectNetwork", () => {
	it("should render", () => {
		const { container } = render(<SelectNetwork />);
		expect(container).toMatchSnapshot();
	});

	it("should render with networks", () => {
		const { container } = render(<SelectNetwork networks={availableNetworksMock} />);
		expect(container).toMatchSnapshot();
	});

	it("should show typeahead when typing has found one exact match", () => {
		const { getByTestId } = render(<SelectNetwork networks={availableNetworksMock} />);
		const input = getByTestId("SelectNetworkInput__input");
		act(() => {
			fireEvent.change(input, { target: { value: "Bitco" } });
		});

		expect(getByTestId("SelectNetworkInput__typeahead")).toHaveTextContent("Bitcoin");
	});

	it("should select first matching asset with enter", () => {
		const { getByTestId } = render(<SelectNetwork networks={availableNetworksMock} />);
		const input = getByTestId("SelectNetworkInput__input");
		act(() => {
			fireEvent.change(input, { target: { value: "Bitco" } });
		});

		act(() => {
			fireEvent.keyDown(input, { key: "Enter", code: 13 });
		});

		expect(getByTestId("SelectNetworkInput__network")).toHaveAttribute("aria-label", "Bitcoin");
	});

	it("should select first matching asset with tab", () => {
		const { getByTestId } = render(<SelectNetwork networks={availableNetworksMock} />);
		const input = getByTestId("SelectNetworkInput__input");
		act(() => {
			fireEvent.change(input, { target: { value: "Bitcoi" } });
		});

		act(() => {
			fireEvent.keyDown(input, { key: "Tab", code: 9 });
		});

		expect(getByTestId("SelectNetworkInput__network")).toHaveAttribute("aria-label", "Bitcoin");
	});

	it("should not select non-matching asset after key input and tab", () => {
		const { getByTestId } = render(<SelectNetwork networks={availableNetworksMock} />);
		const input = getByTestId("SelectNetworkInput__input");
		act(() => {
			fireEvent.change(input, { target: { value: "Bot" } });
		});

		act(() => {
			fireEvent.keyDown(input, { key: "Tab", code: 9 });
		});

		expect(within(getByTestId("SelectNetworkInput__network")).queryByTestId("CoinIcon")).toBeNull();
	});

	it("should not select first matched asset after random key enter", () => {
		const { getByTestId } = render(<SelectNetwork networks={availableNetworksMock} />);
		const input = getByTestId("SelectNetworkInput__input");

		act(() => {
			fireEvent.change(input, { target: { value: "Bitco" } });
		});

		act(() => {
			fireEvent.keyDown(input, { key: "A", code: 65 });
		});

		expect(within(getByTestId("SelectNetworkInput__network")).queryByTestId("CoinIcon")).toBeNull();
	});

	it("should clear selection when changing input", () => {
		const { getByTestId } = render(<SelectNetwork networks={availableNetworksMock} />);
		const input = getByTestId("SelectNetworkInput__input");

		act(() => {
			fireEvent.change(input, { target: { value: "Bitcoin" } });
		});

		act(() => {
			fireEvent.keyDown(input, { key: "Enter", code: 13 });
		});

		expect(getByTestId("SelectNetworkInput__network")).toHaveAttribute("aria-label", "Bitcoin");

		act(() => {
			fireEvent.change(input, { target: { value: "test" } });
		});

		act(() => {
			fireEvent.keyDown(input, { key: "A", code: 65 });
		});
		act(() => {
			fireEvent.keyDown(input, { key: "B", code: 65 });
		});

		expect(within(getByTestId("SelectNetworkInput__network")).queryByTestId("CoinIcon")).toBeNull();
	});

	it("should clear input on blur if not selected", () => {
		const { getByTestId } = render(<SelectNetwork networks={availableNetworksMock} />);
		const input = getByTestId("SelectNetworkInput__input");
		act(() => {
			fireEvent.change(input, { target: { value: "Bitcoi" } });
		});
		expect(input).toHaveValue("Bitcoi");
		act(() => {
			fireEvent.blur(input);
		});
		expect(input).toHaveValue("");
	});

	it("should not clear input on blur if selected", () => {
		const { getByTestId } = render(<SelectNetwork networks={availableNetworksMock} />);
		const input = getByTestId("SelectNetworkInput__input");
		act(() => {
			fireEvent.change(input, { target: { value: "Bitco" } });
		});
		act(() => {
			fireEvent.keyDown(input, { key: "Enter", code: 13 });
		});
		expect(input).toHaveValue("Bitcoin");
		act(() => {
			fireEvent.blur(input);
		});
		expect(input).toHaveValue("Bitcoin");
	});

	it("should return empty if the item has not defined", () => {
		expect(itemToString(null)).toBe("");
	});
});
