import { fireEvent, render } from "@testing-library/react";
import { act } from "@testing-library/react-hooks";
import React from "react";

import { FilterWallets } from "./FilterWallets";

describe("FilterWallets", () => {
	const networks = [
		{
			name: "Ark",
			isSelected: true,
		},
		{
			name: "Ethereum",
			isSelected: true,
		},
		{
			name: "Bitcoin",
			isSelected: false,
		},
	];

	it("should render", () => {
		const { container } = render(<FilterWallets />);
		expect(container).toMatchSnapshot();
	});

	it("should render with networks selection", () => {
		const { container } = render(<FilterWallets networks={networks} />);
		expect(container).toMatchSnapshot();
	});

	it("should emit event for transactions view toggle", () => {
		const fn = jest.fn();
		const { getByTestId } = render(<FilterWallets networks={networks} toggleTransactionsView={fn} />);
		const toggle = getByTestId("filter-wallets_toggle--transactions");

		act(() => {
			fireEvent.click(toggle);
		});
		expect(fn).toBeCalled();
	});

	it("should ignore emit event for transactions view if callback not provided", () => {
		const fn = jest.fn();
		const { getByTestId } = render(<FilterWallets networks={networks} />);
		const toggle = getByTestId("filter-wallets_toggle--transactions");

		act(() => {
			fireEvent.click(toggle);
		});
		expect(fn).not.toBeCalled();
	});

	it("should emit event for portfolio view toggle", () => {
		const onPortfolioView = jest.fn();
		const { getByTestId } = render(<FilterWallets networks={networks} togglePortfolioView={onPortfolioView} />);
		const toggle = getByTestId("filter-wallets_toggle--portfolio");

		act(() => {
			fireEvent.click(toggle);
		});
		expect(onPortfolioView).toBeCalled();
	});

	it("should ignore emit event for portfolio view if callback not provided", () => {
		const fn = jest.fn();
		const { getByTestId } = render(<FilterWallets networks={networks} />);
		const toggle = getByTestId("filter-wallets_toggle--portfolio");

		act(() => {
			fireEvent.click(toggle);
		});
		expect(fn).not.toBeCalled();
	});

	it("should emit event for wallets display", () => {
		const fn = jest.fn();
		const { getByTestId } = render(<FilterWallets networks={networks} onWalletsDisplay={fn} />);
		const toggle = getByTestId("filter-wallets__wallets");

		act(() => {
			fireEvent.click(toggle);
		});
		expect(fn).toBeCalled();
	});

	it("should ignore emit event for wallet display if callback not provided", () => {
		const fn = jest.fn();
		const { getByTestId } = render(<FilterWallets networks={networks} />);
		const toggle = getByTestId("filter-wallets__wallets");

		act(() => {
			fireEvent.click(toggle);
		});
		expect(fn).not.toBeCalled();
	});
});
