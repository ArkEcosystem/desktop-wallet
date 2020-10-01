import React from "react";
import { renderWithRouter } from "testing-library";

import { Breadcrumbs } from "./Breadcrumbs";

describe("Breadcrumbs", () => {
	it("should not render without crumbs", () => {
		const { asFragment, getByTestId } = renderWithRouter(<Breadcrumbs crumbs={[]} />);

		expect(() => getByTestId("breadcrumbs__wrapper")).toThrow(/Unable to find an element by/);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render", () => {
		const { asFragment, getByTestId } = renderWithRouter(
			<Breadcrumbs crumbs={[{ route: "dashboard", label: "Dashboard" }]} />,
		);

		expect(getByTestId("breadcrumbs__wrapper")).toHaveTextContent("arrow-left.svg");
		expect(getByTestId("breadcrumbs__wrapper")).toHaveTextContent("Dashboard");
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render with custom classes", () => {
		const { asFragment, getByTestId } = renderWithRouter(
			<Breadcrumbs
				crumbs={[
					{ route: "wallets", label: "Wallets" },
					{ route: "wallets/my_wallet", label: "My Wallet" },
				]}
				className="class-name"
			/>,
		);

		expect(getByTestId("breadcrumbs__wrapper")).toHaveClass("class-name");
		expect(asFragment()).toMatchSnapshot();
	});
});
