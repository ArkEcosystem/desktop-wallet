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

	it("should emit onChange for transactions view toggle", () => {
		const fn = jest.fn();
		const { getByTestId } = render(<FilterWallets networks={networks} onChange={fn} />);
		const toggle = getByTestId("filter-wallets_toggle--transactions");

		act(() => {
			fireEvent.click(toggle);
		});

		expect(fn).toBeCalled();
	});

	it("should not emit onChange for transactions view toggle", () => {
		const fn = jest.fn();
		const { getByTestId } = render(<FilterWallets networks={networks} />);
		const toggle = getByTestId("filter-wallets_toggle--transactions");

		act(() => {
			fireEvent.click(toggle);
		});

		expect(fn).not.toBeCalled();
	});

	it("should emit onChange for network selection", () => {
		const onPortfolioView = jest.fn();
		const { getByTestId } = render(<FilterWallets networks={networks} onChange={onPortfolioView} />);
		const toggle = getByTestId("NetworkOption__ARK");

		act(() => {
			fireEvent.click(toggle);
		});

		expect(onPortfolioView).toBeCalled();
	});

	it("should emit onChange for portfolio view toggle", () => {
		const onPortfolioView = jest.fn();
		const { getByTestId } = render(<FilterWallets networks={networks} onChange={onPortfolioView} />);
		const toggle = getByTestId("filter-wallets_toggle--portfolio");

		act(() => {
			fireEvent.click(toggle);
		});

		expect(onPortfolioView).toBeCalled();
	});

	it("should not emit onChange for portfolio view toggle", () => {
		const fn = jest.fn();
		const { getByTestId } = render(<FilterWallets networks={networks} />);
		const toggle = getByTestId("filter-wallets_toggle--portfolio");

		act(() => {
			fireEvent.click(toggle);
		});

		expect(fn).not.toBeCalled();
	});

	it("should emit onChange for wallets display type change", () => {
		const fn = jest.fn();
		const { getByTestId } = render(<FilterWallets networks={networks} onChange={fn} />);

		act(() => {
			fireEvent.click(getByTestId("filter-wallets__wallets"));
		});

		act(() => {
			fireEvent.click(getByTestId("dropdown__option--0"));
		});

		expect(fn).toBeCalled();
	});

	it("should not emit onChange for wallet display type change", () => {
		const fn = jest.fn();
		const { getByTestId } = render(<FilterWallets networks={networks} />);

		act(() => {
			fireEvent.click(getByTestId("filter-wallets__wallets"));
		});

		act(() => {
			fireEvent.click(getByTestId("dropdown__option--0"));
		});

		expect(fn).not.toBeCalled();
	});
});
