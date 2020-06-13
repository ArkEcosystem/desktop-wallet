import React from "react";
import { render } from "@testing-library/react";

import { Header } from "../";

describe("Header", () => {
	it("should render an header", () => {
		const { container, asFragment, getByTestId } = render(<Header title="Header test" />);

		expect(container).toBeTruthy();
		expect(getByTestId("header__title")).toHaveTextContent("Header test");
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render an header with a subtitle", () => {
		const { container, asFragment, getByTestId } = render(<Header title="Header test" subtitle="Subtitle test" />);

		expect(container).toBeTruthy();
		expect(getByTestId("header__title")).toHaveTextContent("Header test");
		expect(getByTestId("header__subtitle")).toHaveTextContent("Subtitle test");
		expect(asFragment()).toMatchSnapshot();
	});
});
