import React from "react";
import { act, fireEvent, render } from "@testing-library/react";

import { Wallets } from "./Wallets";
import { networks, wallets } from "../../data";

describe("Wallets", () => {
	// Wallet filter properties
	const filterProperties = {
		visibleTransactionsView: true,
		visiblePortfolioView: true,
		networks,
		onNetworkChange: (changedNetwork: any, newNetworksList: any) => {
			console.log("changed network", changedNetwork);
			console.log("changed network new list", newNetworksList);
		},
		togglePortfolioView: (isChecked: boolean) => {
			console.log("show portfolio view", isChecked);
		},
		toggleTransactionsView: (isChecked: boolean) => {
			console.log("show transactions view", isChecked);
		},
		onWalletsDisplay: () => {
			alert("on Wallet display");
		},
		onViewAllNetworks: () => {
			alert("on view all networks");
		},
	};

	it("should render", () => {
		const { container } = render(<Wallets wallets={wallets} filterProperties={filterProperties} />);
		expect(container).toMatchSnapshot();
	});

	it("should render with empty wallets list", () => {
		const { container } = render(<Wallets wallets={[]} filterProperties={filterProperties} />);
		expect(container).toMatchSnapshot();
	});

	it("should render with list view enabled as default", () => {
		const { container } = render(<Wallets viewType="list" wallets={wallets} filterProperties={filterProperties} />);
		expect(container).toMatchSnapshot();
	});

	it("should render with list view enabled as default and empty wallet list", () => {
		const { container } = render(<Wallets viewType="list" wallets={[]} filterProperties={filterProperties} />);
		expect(container).toMatchSnapshot();
	});

	it("should render with list view enabled as default and empty wallet list", () => {
		const { container } = render(<Wallets viewType="list" wallets={[]} filterProperties={filterProperties} />);
		expect(container).toMatchSnapshot();
	});

	it("should change wallet view type from list to grid", () => {
		const { getByTestId } = render(<Wallets viewType="list" wallets={[]} filterProperties={filterProperties} />);
		const toggle = getByTestId("controls__grid");

		act(() => {
			fireEvent.click(toggle);
		});

		expect(toggle).toHaveClass("text-theme-danger-400");
	});

	it("should change wallet view type from grid to list", () => {
		const { getByTestId } = render(<Wallets viewType="grid" wallets={[]} filterProperties={filterProperties} />);
		const toggle = getByTestId("controls__list");

		act(() => {
			fireEvent.click(toggle);
		});

		expect(toggle).toHaveClass("text-theme-danger-400");
	});
});
