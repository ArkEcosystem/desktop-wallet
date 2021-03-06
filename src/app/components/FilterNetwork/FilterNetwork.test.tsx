import { act } from "@testing-library/react-hooks";
import React from "react";
import { fireEvent, render, waitFor, within } from "utils/testing-library";

import { FilterNetwork, FilterNetworks, NetworkOptions, ToggleAllOption } from ".";

const networks = () => [
	{
		coin: "ARK",
		id: "ark.mainnet",
		isLive: true,
		isSelected: false,
		name: "ARK Devnet",
	},
	{
		coin: "LSK",
		id: "lsk.testnet",
		isLive: false,
		isSelected: true,
		name: "LSK Testnet",
	},
	{
		coin: "BIND",
		id: "compedia.mainnet",
		isLive: false,
		isSelected: false,
		name: "Compedia",
	},
	{
		coin: "ETH",
		id: "eth.mainnet",
		isLive: true,
		isSelected: true,
		name: "Ethereum",
	},
	{
		coin: "BTC",
		id: "btc.mainnet",
		isLive: true,
		isSelected: false,
		name: "Bitcoin",
	},
];

describe("NetworkOptions", () => {
	it("should render empty", () => {
		const { container } = render(<NetworkOptions />);

		expect(container).toMatchSnapshot();
	});

	it("should render available networks options", () => {
		const { container } = render(<NetworkOptions networks={networks()} />);

		expect(container).toMatchSnapshot();
	});

	it("should trigger onClick", () => {
		const onClick = jest.fn();
		const { getByTestId } = render(<NetworkOptions networks={networks()} onClick={onClick} />);
		act(() => {
			fireEvent.click(getByTestId("NetworkOption__ARK"));
		});

		expect(onClick).toHaveBeenCalledWith(
			{
				coin: "ARK",
				id: "ark.mainnet",
				isLive: true,
				isSelected: false,
				name: "ARK Devnet",
			},
			expect.anything(),
		);
	});

	it("should render networks that have coin and id defined", () => {
		const onClick = jest.fn();
		const unknownNetwork = {
			coin: "UNKNOWN",
			isLive: false,
			isSelected: false,
			name: "Unknown",
		};

		const allNetworks = [...networks(), unknownNetwork];
		const { container } = render(<NetworkOptions networks={allNetworks} onClick={onClick} />);

		expect(container).toMatchSnapshot();
	});

	it("should not render unknown networks", () => {
		const onClick = jest.fn();
		const unknownNetwork = {
			coin: "UNKNOWN",
			id: "unknown.unknown",
			isLive: false,
			isSelected: false,
			name: "Unknown",
		};

		const allNetworks = [...networks(), unknownNetwork];
		const { container } = render(<NetworkOptions networks={allNetworks} onClick={onClick} />);

		expect(container).toMatchSnapshot();
	});
});

describe("ToggleAllOption", () => {
	it("should render", () => {
		const { container } = render(<ToggleAllOption />);

		expect(container).toMatchSnapshot();
	});

	it("should render hidden", () => {
		const { container } = render(<ToggleAllOption isHidden />);

		expect(container).toMatchSnapshot();
	});

	it("should render selected", () => {
		const { container } = render(<ToggleAllOption isSelected />);

		expect(container).toMatchSnapshot();
	});

	it("should handle onClick", () => {
		const onClick = jest.fn();
		const { getByTestId } = render(<ToggleAllOption isSelected onClick={onClick} />);
		act(() => {
			fireEvent.click(getByTestId("network__viewall"));
		});

		expect(onClick).toHaveBeenCalled();
	});
});

describe("FilterNetwork", () => {
	it("should render empty", () => {
		const { container } = render(<FilterNetwork />);

		expect(container).toMatchSnapshot();
	});

	it("should render public networks", () => {
		const { container, getAllByTestId } = render(<FilterNetwork networks={networks()} />);

		expect(getAllByTestId("FilterNetwork")).toHaveLength(1);
		expect(container).toMatchSnapshot();
	});

	it("should toggle a network option", () => {
		const onChange = jest.fn();
		const { getAllByTestId, getByTestId } = render(<FilterNetwork networks={networks()} onChange={onChange} />);

		expect(getAllByTestId("FilterNetwork")).toHaveLength(1);

		act(() => {
			fireEvent.click(getByTestId("NetworkOption__ARK"));
		});

		expect(onChange).toHaveBeenCalledWith(
			{
				coin: "ARK",
				id: "ark.mainnet",
				isLive: true,
				isSelected: true,
				name: "ARK Devnet",
			},
			expect.anything(),
		);
	});
});

describe("FilterNetworks", () => {
	it("should render empty", () => {
		const { container } = render(<FilterNetworks />);

		expect(container).toMatchSnapshot();
	});

	it("should render public networks", () => {
		const { container, getAllByTestId } = render(<FilterNetworks networks={networks()} />);

		expect(getAllByTestId("FilterNetwork")).toHaveLength(1);
		expect(container).toMatchSnapshot();
	});

	it("should render public and testnet networks", () => {
		const { container, getAllByTestId } = render(<FilterNetworks useTestNetworks={true} networks={networks()} />);

		expect(getAllByTestId("FilterNetwork")).toHaveLength(2);
		expect(container).toMatchSnapshot();
	});

	it("should toggle view all", async () => {
		const { container, getAllByTestId, getByTestId } = render(
			<FilterNetworks useTestNetworks={true} networks={networks()} hideViewAll={false} />,
		);

		expect(getAllByTestId("FilterNetwork")).toHaveLength(2);

		act(() => {
			fireEvent.click(within(getAllByTestId("FilterNetwork")[0]).getByTestId("network__viewall"));
		});

		await waitFor(() => expect(getByTestId("FilterNetwork__select-all-checkbox")).toBeTruthy());

		expect(container).toMatchSnapshot();

		act(() => {
			fireEvent.click(within(getAllByTestId("FilterNetwork")[0]).getByTestId("network__viewall"));
		});

		await waitFor(() => expect(() => getByTestId("FilterNetwork__select-all-checkbox")).toThrow());

		expect(container).toMatchSnapshot();
	});

	it("should select all public networks", async () => {
		const onChange = jest.fn();
		const { getAllByTestId, getByTestId } = render(
			<FilterNetworks useTestNetworks={true} networks={networks()} onChange={onChange} hideViewAll={false} />,
		);

		expect(getAllByTestId("FilterNetwork")).toHaveLength(2);

		act(() => {
			fireEvent.click(within(getAllByTestId("FilterNetwork")[0]).getByTestId("network__viewall"));
		});

		await waitFor(() => expect(getByTestId("FilterNetwork__select-all-checkbox")).toBeTruthy());

		act(() => {
			fireEvent.click(getByTestId("FilterNetwork__select-all-checkbox"));
		});

		const selectedOptions = [
			{ coin: "ARK", id: "ark.mainnet", isLive: true, isSelected: true, name: "ARK Devnet" },
			{ coin: "ETH", id: "eth.mainnet", isLive: true, isSelected: true, name: "Ethereum" },
			{ coin: "BTC", id: "btc.mainnet", isLive: true, isSelected: true, name: "Bitcoin" },
			{ coin: "LSK", id: "lsk.testnet", isLive: false, isSelected: true, name: "LSK Testnet" },
			{ coin: "BIND", id: "compedia.mainnet", isLive: false, isSelected: false, name: "Compedia" },
		];

		expect(onChange).toHaveBeenCalledWith(expect.anything(), selectedOptions);
	});

	it("should toggle a public network option", () => {
		const onChange = jest.fn();
		const { getAllByTestId, getByTestId } = render(<FilterNetworks networks={networks()} onChange={onChange} />);

		expect(getAllByTestId("FilterNetwork")).toHaveLength(1);

		act(() => {
			fireEvent.click(getByTestId("NetworkOption__ARK"));
		});

		expect(onChange).toHaveBeenCalledWith(
			{
				coin: "ARK",
				id: "ark.mainnet",
				isLive: true,
				isSelected: true,
				name: "ARK Devnet",
			},
			expect.anything(),
		);
	});

	it("should toggle a testnet network option", () => {
		const onChange = jest.fn();
		const { container, getAllByTestId, getByTestId } = render(
			<FilterNetworks networks={networks()} onChange={onChange} useTestNetworks={true} />,
		);

		expect(container).toMatchSnapshot();
		expect(getAllByTestId("FilterNetwork")).toHaveLength(2);

		act(() => {
			fireEvent.click(getByTestId("NetworkOption__LSK"));
		});

		expect(onChange).toHaveBeenCalledWith(
			{
				coin: "LSK",
				id: "lsk.testnet",
				isLive: false,
				isSelected: false,
				name: "LSK Testnet",
			},
			expect.anything(),
		);
	});
});
