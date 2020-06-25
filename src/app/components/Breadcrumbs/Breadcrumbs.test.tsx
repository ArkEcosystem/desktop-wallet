import { render } from "@testing-library/react";
import React from "react";

import { Breadcrumbs } from "./Breadcrumbs";

describe("Breadcrumbs", () => {
	it("should not render without crumbs", () => {
		const { asFragment, getByTestId } = render(<Breadcrumbs crumbs={[]} />);

		expect(() => getByTestId("breadcrumbs__wrapper")).toThrow(/Unable to find an element by/);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render", () => {
		const { asFragment, getByTestId } = render(
			<Breadcrumbs crumbs={[{ route: "dashboard", label: "Dashboard" }]} />
		);

		expect(getByTestId("breadcrumbs__wrapper")).toHaveTextContent("<-");
		expect(getByTestId("breadcrumbs__wrapper")).toHaveTextContent("Dashboard");
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render with custom classes", () => {
		const { asFragment, getByTestId } = render(
			<Breadcrumbs
				crumbs={[
					{ route: "wallets", label: "Wallets" },
					{ route: "wallets/my_wallet", label: "My Wallet" },
				]}
				className="class-name"
			/>
		);

		expect(getByTestId("breadcrumbs__wrapper")).toHaveClass("class-name");
		expect(asFragment()).toMatchSnapshot();
	});
});
