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

	it("should render with hidden options", () => {
		const { container, getByTestId } = render(<SelectNetwork networks={availableNetworksMock} hideOptions />);
		expect(getByTestId("SelectNetwork__options")).toHaveClass("hidden");
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

	it("should show suggestion when typing has found at least one match", () => {
		const { getByTestId } = render(<SelectNetwork networks={availableNetworksMock} />);
		const input = getByTestId("SelectNetworkInput__input");

		act(() => {
			fireEvent.change(input, { target: { value: "ar" } });
		});

		expect(getByTestId("Input__suggestion")).toHaveTextContent("arK");
	});

	it("should show call onInputChange callback when input value changed", () => {
		const onInputChange = jest.fn();

		const { getByTestId } = render(
			<SelectNetwork networks={availableNetworksMock} onInputChange={onInputChange} />,
		);
		const input = getByTestId("SelectNetworkInput__input");

		act(() => {
			fireEvent.change(input, { target: { value: "ark" } });
		});

		expect(onInputChange).toHaveBeenCalledWith("ark", "ark");

		act(() => {
			fireEvent.change(input, { target: { value: "no-match" } });
		});

		expect(onInputChange).toHaveBeenCalledWith("no-match", "");

		act(() => {
			fireEvent.change(input, { target: { value: "" } });
		});

		expect(onInputChange).toHaveBeenCalledWith();
	});

	it("should select first matching asset with enter", () => {
		const { getByTestId } = render(<SelectNetwork networks={availableNetworksMock} />);
		const input = getByTestId("SelectNetworkInput__input");
		act(() => {
			fireEvent.change(input, { target: { value: "ark" } });
		});

		act(() => {
			fireEvent.keyDown(input, { code: 13, key: "Enter" });
		});

		expect(getByTestId("SelectNetworkInput__network")).toHaveAttribute("aria-label", "ARK");
	});

	it("should select first matching asset with tab", () => {
		const { getByTestId } = render(<SelectNetwork networks={availableNetworksMock} />);
		const input = getByTestId("SelectNetworkInput__input");
		act(() => {
			fireEvent.change(input, { target: { value: "ark" } });
		});

		act(() => {
			fireEvent.keyDown(input, { code: 9, key: "Tab" });
		});

		expect(getByTestId("SelectNetworkInput__network")).toHaveAttribute("aria-label", "ARK");
	});

	it("should not select non-matching asset after key input and tab", () => {
		const { getByTestId } = render(<SelectNetwork networks={availableNetworksMock} />);
		const input = getByTestId("SelectNetworkInput__input");
		act(() => {
			fireEvent.change(input, { target: { value: "Bot" } });
		});

		act(() => {
			fireEvent.keyDown(input, { code: 9, key: "Tab" });
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
			fireEvent.keyDown(input, { code: 65, key: "A" });
		});

		expect(within(getByTestId("SelectNetworkInput__network")).queryByTestId("CoinIcon")).toBeNull();
	});

	it("should clear selection when changing input", () => {
		const { getByTestId } = render(<SelectNetwork networks={availableNetworksMock} />);
		const input = getByTestId("SelectNetworkInput__input");

		act(() => {
			fireEvent.change(input, { target: { value: "ark" } });
		});

		act(() => {
			fireEvent.keyDown(input, { code: 13, key: "Enter" });
		});

		expect(getByTestId("SelectNetworkInput__network")).toHaveAttribute("aria-label", "ARK");

		act(() => {
			fireEvent.change(input, { target: { value: "test" } });
		});

		act(() => {
			fireEvent.keyDown(input, { code: 65, key: "A" });
		});
		act(() => {
			fireEvent.keyDown(input, { code: 65, key: "B" });
		});

		expect(within(getByTestId("SelectNetworkInput__network")).queryByTestId("CoinIcon")).toBeNull();
	});

	it("should select an item by clicking on it", async () => {
		const { getByTestId, queryByTestId } = render(<SelectNetwork networks={availableNetworksMock} />);

		act(() => {
			fireEvent.focus(getByTestId("SelectNetworkInput__input"));
		});

		act(() => {
			fireEvent.change(getByTestId("SelectNetworkInput__input"), { target: { value: "ARK" } });
		});

		await waitFor(() => expect(getByTestId("Input__suggestion")).toBeTruthy());

		expect(getByTestId("NetworkIcon-ARK-ark.mainnet")).toBeTruthy();

		act(() => {
			fireEvent.click(getByTestId("NetworkIcon-ARK-ark.mainnet"));
		});

		await waitFor(() => expect(queryByTestId("Input__suggestion")).not.toBeInTheDocument());

		expect(getByTestId("SelectNetworkInput__network")).toHaveAttribute("aria-label", "ARK");

		expect(getByTestId("NetworkIcon-ARK-ark.devnet")).toBeTruthy();

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
