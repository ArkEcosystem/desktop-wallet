import { act } from "@testing-library/react-hooks";
import React from "react";
import { fireEvent, render } from "testing-library";

import { FilterWallets } from "./FilterWallets";

const networks = [
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

describe("FilterWallets", () => {
	it("should render", () => {
		const { container } = render(<FilterWallets />);

		expect(container).toMatchSnapshot();
	});

	it("should render with networks selection", () => {
		const { container } = render(<FilterWallets networks={networks} />);

		expect(container).toMatchSnapshot();
	});

	it("should emit onChange for network selection", () => {
		const onChange = jest.fn();

		const { getByTestId } = render(<FilterWallets networks={networks} onChange={onChange} />);

		act(() => {
			fireEvent.click(getByTestId("NetworkOption__ARK"));
		});

		expect(onChange).toBeCalled();
	});

	it("should emit onChange for wallets display type change", () => {
		const onChange = jest.fn();

		const { getByTestId } = render(<FilterWallets networks={networks} onChange={onChange} />);

		act(() => {
			fireEvent.click(getByTestId("filter-wallets__wallets"));
		});

		act(() => {
			fireEvent.click(getByTestId("dropdown__option--0"));
		});

		expect(onChange).toBeCalled();
	});

	it("should not emit onChange for wallet display type change", () => {
		const onChange = jest.fn();

		const { getByTestId } = render(<FilterWallets networks={networks} />);

		act(() => {
			fireEvent.click(getByTestId("filter-wallets__wallets"));
		});

		act(() => {
			fireEvent.click(getByTestId("dropdown__option--0"));
		});

		expect(onChange).not.toBeCalled();
	});
});
