import { availableNetworksMock } from "domains/network/data";
import React from "react";
import { act, fireEvent, render, waitFor, within } from "utils/testing-library";

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

	it("should filter the network icons based on the input value", () => {
		const { getAllByTestId, getByTestId } = render(<SelectNetwork networks={availableNetworksMock} />);
		const input = getByTestId("SelectNetworkInput__input");

		act(() => {
			fireEvent.focus(input);
		});

		const availableNetworksLength = availableNetworksMock.filter((network) => network.extra).length;

		expect(getAllByTestId("SelectNetwork__NetworkIcon--container")).toHaveLength(availableNetworksLength);

		const value = "Ar";

		act(() => {
			fireEvent.change(input, { target: { value } });
		});

		expect(getByTestId("NetworkIcon-ARK-ark.devnet")).toBeInTheDocument();
		expect(getByTestId("NetworkIcon-ARK-ark.mainnet")).toBeInTheDocument();

		act(() => {
			fireEvent.change(input, { target: { value: "" } });
		});

		expect(getAllByTestId("SelectNetwork__NetworkIcon--container")).toHaveLength(availableNetworksLength);
	});

	it("should show typeahead when typing has found at least one match", () => {
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

	it("should select an item by clicking on it", async () => {
		const { getByTestId } = render(<SelectNetwork networks={availableNetworksMock} />);

		act(() => {
			fireEvent.focus(getByTestId("SelectNetworkInput__input"));
		});

		await waitFor(() => expect(getByTestId("NetworkIcon-ARK-ark.mainnet")).toBeTruthy());

		act(() => {
			fireEvent.click(getByTestId("NetworkIcon-ARK-ark.mainnet"));
		});

		await waitFor(() => expect(getByTestId("SelectNetworkInput__network")).toHaveAttribute("aria-label", "ARK"));

		await waitFor(() => expect(getByTestId("NetworkIcon-ARK-ark.devnet")).toBeTruthy());

		act(() => {
			fireEvent.click(getByTestId("NetworkIcon-ARK-ark.devnet"));
		});
		await waitFor(() =>
			expect(getByTestId("SelectNetworkInput__network")).toHaveAttribute("aria-label", "ARK Devnet"),
		);
	});

	it("should toggle selection by clicking on network icon", async () => {
		const { getByTestId } = render(<SelectNetwork networks={availableNetworksMock} />);

		act(() => {
			fireEvent.focus(getByTestId("SelectNetworkInput__input"));
		});

		await waitFor(() => expect(getByTestId("NetworkIcon-ARK-ark.mainnet")).toBeTruthy());

		act(() => {
			fireEvent.click(getByTestId("NetworkIcon-ARK-ark.mainnet"));
		});

		await waitFor(() => expect(getByTestId("SelectNetworkInput__network")).toHaveAttribute("aria-label", "ARK"));

		act(() => {
			fireEvent.focus(getByTestId("SelectNetworkInput__input"));
		});

		await waitFor(() => expect(getByTestId("NetworkIcon-ARK-ark.mainnet")).toBeTruthy());

		act(() => {
			fireEvent.click(getByTestId("NetworkIcon-ARK-ark.mainnet"));
		});

		await waitFor(() => expect(getByTestId("SelectNetworkInput__network")).not.toHaveAttribute("aria-label"));
	});

	it("should return empty if the item has not defined", () => {
		expect(itemToString(null)).toBe("");
	});
});
