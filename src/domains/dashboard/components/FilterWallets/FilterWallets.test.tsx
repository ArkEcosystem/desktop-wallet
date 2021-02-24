import { act } from "@testing-library/react-hooks";
import React from "react";
import { fireEvent, render } from "testing-library";

import { FilterWallets } from "./FilterWallets";

const networks = [
	{
		coin: "ARK",
		name: "ARK Devnet",
		id: "ark.mainnet",
		isSelected: false,
		isLive: true,
	},
	{
		name: "LSK Testnet",
		coin: "LSK",
		id: "lsk.testnet",
		isSelected: true,
		isLive: false,
	},
	{
		name: "Compedia",
		coin: "BIND",
		id: "compedia.mainnet",
		isSelected: false,
		isLive: false,
	},
	{
		name: "Ethereum",
		coin: "ETH",
		id: "eth.mainnet",
		isSelected: true,
		isLive: true,
	},
	{
		name: "Bitcoin",
		coin: "BTC",
		id: "btc.mainnet",
		isSelected: false,
		isLive: true,
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
